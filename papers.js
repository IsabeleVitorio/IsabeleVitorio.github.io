/* Fetch public works only. The saved HTML remains available without JavaScript. */
(async () => {
  const list = document.getElementById('papers-list');
  const status = document.getElementById('papers-status');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const safeURL = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  // Publisher-verified metadata fills gaps in the ORCID record.
  const verified = {
    '10.33232/001c.141464': {
      authors: ['Isabele Lais de Souza Vitório', 'Michael Buehlmann', 'Eve Kovacs', 'Patricia Larsen', 'Nicholas Frontiere', 'Katrin Heitmann'],
      volume: '8', date: 'June 27, 2025', journalURL: 'https://astro.theoj.org/',
      articleURL: 'https://astro.theoj.org/article/141464-exploring-the-core-galaxy-connection'
    }
  };
  try {
    const response = await fetch('https://pub.orcid.org/v3.0/0009-0009-0430-219X/works', {
      headers: { Accept: 'application/json' }, signal: controller.signal
    });
    if (!response.ok) throw new Error('ORCID unavailable');
    const data = await response.json();
    if (!Array.isArray(data.group)) throw new Error('Unexpected ORCID response');
    const works = data.group.map(group => {
      const summaries = [...(group['work-summary'] || [])];
      return summaries.sort((a,b) => Number(b['display-index'] || 0) - Number(a['display-index'] || 0))[0];
    }).filter(Boolean).sort((a,b) => Number(b['publication-date']?.year?.value || 0) - Number(a['publication-date']?.year?.value || 0));
    const fragment = document.createDocumentFragment();
    for (const work of works) {
      const ids = work['external-ids']?.['external-id'] || [];
      const doi = ids.find(id => id['external-id-type'] === 'doi' && id['external-id-relationship'] === 'self');
      const arxiv = ids.find(id => id['external-id-type'] === 'arxiv');
      const url = doi ? `https://doi.org/${encodeURI(doi['external-id-value'])}` : safeURL(work.url?.value);
      const extra = verified[doi?.['external-id-value'].toLowerCase()] || {};
      let authors = extra.authors || [];
      if (!authors.length && work['put-code']) {
        try {
          const detailResponse = await fetch(`https://pub.orcid.org/v3.0/0009-0009-0430-219X/work/${work['put-code']}`, { headers: { Accept: 'application/json' }, signal: controller.signal });
          if (detailResponse.ok) {
            const detail = await detailResponse.json();
            authors = (detail.contributors?.contributor || []).filter(c => !c['contributor-attributes']?.['contributor-role'] || c['contributor-attributes']['contributor-role'] === 'author').map(c => c['credit-name']?.value).filter(Boolean);
          }
        } catch { /* Retain the summary when optional details cannot load. */ }
      }
      const item = document.createElement('li');
      const heading = document.createElement('h2');
      const title = document.createElement(url ? 'a' : 'span');
      title.textContent = work.title?.title?.value || 'Untitled work';
      if (url) title.href = url;
      heading.append(title); item.append(heading);
      if (authors.length) {
        const byline = document.createElement('p');
        byline.className = 'paper-authors';
        byline.textContent = authors.join(', ');
        item.append(byline);
      }
      const meta = document.createElement('p');
      meta.textContent = [work['journal-title']?.value, extra.volume ? `Volume ${extra.volume}` : null, extra.date || work['publication-date']?.year?.value].filter(Boolean).join(' · ');
      item.append(meta);
      const links = document.createElement('div');
      links.className = 'paper-links';
      for (const [label, href] of [['Journal article ↗', extra.articleURL || url], ['Journal website ↗', extra.journalURL]]) {
        if (!href) continue;
        const link = document.createElement('a'); link.href = href; link.textContent = label; links.append(link);
      }
      if (arxiv) {
        const link = document.createElement('a');
        link.href = `https://arxiv.org/abs/${encodeURIComponent(arxiv['external-id-value'].replace(/^arxiv:/i, ''))}`;
        link.textContent = 'arXiv ↗'; links.append(link);
      }
      item.append(links);
      fragment.append(item);
    }
    list.replaceChildren(fragment);
    status.textContent = works.length ? 'Updated from ORCID' : 'No public works are currently listed on ORCID.';
  } catch {
    status.textContent = 'Showing the saved ORCID list from November 17, 2026. The live list is temporarily unavailable.';
  } finally { clearTimeout(timeout); }
})();
