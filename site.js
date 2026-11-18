(() => {
  const paths = {
    person: '<circle cx="12" cy="7" r="3.5"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    teaching: '<path d="m2 8 10-5 10 5-10 5L2 8Zm4 2v7c4 3 8 3 12 0v-7M22 8v8"/>',
    research: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-35 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(35 12 12)"/>',
    papers: '<path d="M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8M8 16h8"/>',
    outreach: '<circle cx="12" cy="6" r="3"/><circle cx="4" cy="11" r="2"/><circle cx="20" cy="11" r="2"/><path d="M6 22v-4a6 6 0 0 1 12 0v4M1 21v-4a3 3 0 0 1 4-3M23 21v-4a3 3 0 0 0-4-3"/>',
    projects: '<path d="M3 7V4h7l3 3h8v14H3V7Zm0 2h18"/>',
    linkedin: '<rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10v8M7 6v1M11 18v-8M11 13a4 4 0 0 1 7 0v5"/>',
    email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 8L22 6"/>'
  };
  const items = [
    ['About me','index_about.html','person'], ['Teaching','teaching.html','teaching'],
    ['Research','research.html','research'], ['Papers','papers.html','papers'],
    ['Outreach','outreach.html','outreach'], ['Other projects','projects.html','projects'],
    ['LinkedIn','https://www.linkedin.com/in/isabele-souza-vit%C3%B3rio-248815166/','linkedin'],
    ['Email me','mailto:ivitorio@umich.edu','email']
  ];
  const current = location.pathname.split('/').pop() || 'index.html';
  const nav = `<nav aria-label="Main navigation"><ul class="icon-menu">${items.map(([label,href,icon]) => `<li><a href="${href}"${current === href ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[icon]}</svg><span>${label}</span></a></li>`).join('')}</ul></nav>`;
  const language = '<details class="languages"><summary>English <span aria-hidden="true">⌄</span></summary><div class="language-options"><span lang="en">English <small>Current</small></span><span lang="pt" aria-disabled="true">Português <small>Coming soon</small></span><span lang="es" aria-disabled="true">Español <small>Coming soon</small></span></div></details>';
  const header = document.getElementById('site-header');
  if (header) header.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a><div class="topbar"><a class="wordmark" href="index.html">Isabele de Souza Vitorio<span>Home</span></a>${language}</div>${nav}`;
  const home = document.getElementById('home-navigation');
  if (home) {
    home.innerHTML = nav;
    document.getElementById('home-header').innerHTML = `<div class="topbar home-topbar">${language}</div>`;
  }
  document.querySelectorAll('.slideshow').forEach(carousel => {
    const slides = [...carousel.querySelectorAll('.slide')];
    if (!slides.length) return;
    let index = 0;
    function show(step) {
      index = (index + step + slides.length) % slides.length;
      slides.forEach((slide,i) => { slide.hidden = i !== index; });
      carousel.querySelector('.slide-status').textContent = `${String(index + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    }
    carousel.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.step))));
    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(event.key === 'ArrowLeft' ? -1 : 1); }
    });
  });
})();
