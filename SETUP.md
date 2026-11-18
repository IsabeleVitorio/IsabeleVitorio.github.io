# Portfolio setup

Preview: run `python3 -m http.server 8765` in this folder, then open http://localhost:8765.

Upload the HTML files, main.css, site.js, stars.js, image.jpg, and favicon.png to the root of the existing GitHub Pages publishing branch. There is no build step.

The homepage uses a dark starfield. Subpages use white with black stars. Navigation and email are managed in site.js; stars.js handles motion and reduced-motion preferences.

Teaching has a course list and a nine-photo slideshow in teaching.html. Outreach has a description list and a five-photo slideshow. Both have keyboard-accessible previous/next buttons and no autoplay. Outreach images and the About Me portrait use files in Photos; preserve folder names and capitalization when publishing.

papers.js refreshes public works from ORCID on each Papers page visit. The saved HTML list remains available if the API is unavailable or JavaScript is disabled. Only public ORCID works appear. Full ORCID work records supply authors when available. The current paper’s complete author list, volume, publication date, and journal links are supplemented with publisher-verified metadata in papers.js and the saved HTML citation. The saved list was retrieved November 17, 2026.

English is active; Portuguese and Spanish are marked Coming soon.

GoatCounter is installed on all seven pages using https://isa.goatcounter.com/count. Localhost/private-network previews are ignored by default. After publishing, visit the public website, then sign in at https://isa.goatcounter.com/ and check today's pageviews after about 10 seconds. If no visit appears, check your browser's content blocker and GoatCounter's ignored IP settings. Keep dashboard access private in the account settings. Country estimates are approximate; this does not identify individual visitors. No passwords or API keys are stored in the website.
