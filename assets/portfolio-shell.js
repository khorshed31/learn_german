(() => {
  const siteLinkGroups = [
    {
      title: 'German foundations',
      links: [
        ['Beginner learning hub', 'german/index.html'],
        ['Alphabet & pronunciation', 'german/alphabet.html'],
        ['Alphabet quiz', 'german/alphabet_quiz.html'],
        ['Numbers', 'german/number.html'],
        ['Number quiz', 'german/number_quiz.html'],
        ['Telling the time', 'german/time.html'],
        ['German articles', 'german/articles.html'],
        ['Articles glossary', 'german/articles_glossar.html'],
        ['Prepositions', 'german/preposition.html'],
        ['Basic grammar guide', 'german/german-basic-grammar.html'],
        ['Grammar exercises', 'german/german-basic-grammar-exercises.html'],
        ['German verb helper', 'german/german_verbs_helper.html'],
        ['Everyday phrases', 'german/german-phrases.html'],
        ['Sentence builder', 'german/sentence-builder.html'],
        ['Exercises & quizzes', 'german/exercise.html']
      ]
    },
    {
      title: 'Speaking practice',
      links: [
        ['A1 speaking practice', 'German_a1_speaking/index.html'],
        ['Speaking card generator', 'German_a1_speaking/card_generator.html'],
        ['Duo exam practice', 'German_a1_speaking/duo_exam.html']
      ]
    },
    {
      title: 'A1 vocabulary',
      links: [
        ['A1 glossary', 'german_glossar/index.html'],
        ['Mobile app edition', 'german_glossar/index_a1_glossar_MOBILE_APP.html'],
        ['Mobile app edition v3', 'german_glossar/index_a1_glossar_MOBILE_APP_v3_fixed.html'],
        ['Pro glossary', 'german_glossar/index_a1_glossar_PRO.html'],
        ['Pro quiz tabs', 'german_glossar/index_a1_glossar_PRO_QUIZ_TABS.html']
      ]
    },
    {
      title: 'Reading',
      links: [['German story reader', 'german_stories/index.html']]
    }
  ];

  const currentPath = window.location.pathname;
  const inAppFolder = /\/(german|German_a1_speaking|german_glossar|german_stories)\/[^/]+$/.test(currentPath);
  const rootPrefix = inAppFolder ? '../' : './';
  const urlFor = path => `${rootPrefix}${path}`;
  const isCurrent = path => {
    try { return new URL(urlFor(path), window.location.href).pathname.replace(/\/$/, '') === currentPath.replace(/\/$/, ''); }
    catch { return false; }
  };

  // Keep every mini-app in the same dark appearance, including pages that had a light default.
  document.documentElement.setAttribute('data-bs-theme', 'dark');
  document.body.classList.add('dark');

  const makeGroup = group => `
    <section class="dp-link-group">
      <h3>${group.title}</h3>
      ${group.links.map(([label, path]) => `<a href="${urlFor(path)}"${isCurrent(path) ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </section>`;

  const header = document.createElement('header');
  header.className = 'dp-global-header';
  header.innerHTML = `
    <div class="dp-header-inner">
      <a class="dp-brand" href="${urlFor('index.html')}" aria-label="DeutschPath home">
        <span class="dp-brand-mark">D</span>
        <span class="dp-brand-word">deutsch<span>path</span></span>
      </a>
      <button class="dp-mobile-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="dpMainNav">
        <span></span><span></span><span></span>
      </button>
      <nav class="dp-main-nav" id="dpMainNav" aria-label="Main navigation">
        <a href="${urlFor('index.html')}"${isCurrent('index.html') ? ' aria-current="page"' : ''}>Home</a>
        <a href="${urlFor('german/index.html')}"${isCurrent('german/index.html') ? ' aria-current="page"' : ''}>Foundations</a>
        <a href="${urlFor('German_a1_speaking/index.html')}"${isCurrent('German_a1_speaking/index.html') ? ' aria-current="page"' : ''}>Speaking</a>
        <a href="${urlFor('german_glossar/index.html')}"${isCurrent('german_glossar/index.html') ? ' aria-current="page"' : ''}>Vocabulary</a>
        <a href="${urlFor('german_stories/index.html')}"${isCurrent('german_stories/index.html') ? ' aria-current="page"' : ''}>Stories</a>
        <a href="https://khorshed31.github.io/about-me/" target="_blank" rel="noopener noreferrer">About</a>
        <details class="dp-explore">
          <summary>Explore all pages</summary>
          <div class="dp-mega-menu">${siteLinkGroups.map(makeGroup).join('')}</div>
        </details>
        <a class="dp-nav-cta" href="${urlFor('german/index.html')}">Start learning <span aria-hidden="true">↗</span></a>
      </nav>
    </div>`;

  const footer = document.createElement('footer');
  footer.className = 'dp-global-footer';
  footer.innerHTML = `
    <div class="dp-footer-inner">
      <a class="dp-footer-brand" href="${urlFor('index.html')}">
        <span class="dp-brand-mark">D</span><span>DeutschPath</span>
      </a>
      <p class="dp-footer-tagline">Learn a little. Practise often. Keep going.</p>
      <nav class="dp-footer-links" aria-label="Footer navigation">
        <a href="${urlFor('german/index.html')}">Lessons</a>
        <a href="${urlFor('German_a1_speaking/index.html')}">Speaking</a>
        <a href="${urlFor('german_glossar/index.html')}">Vocabulary</a>
        <a href="${urlFor('german_stories/index.html')}">Stories</a>
        <a href="https://khorshed31.github.io/about-me/" target="_blank" rel="noopener noreferrer">About the creator ↗</a>
      </nav>
      <div class="dp-footer-credit">
        © <span id="dpYear"></span> DeutschPath · Designed & developed by
        <a href="https://khorshed31.github.io/about-me/" target="_blank" rel="noopener noreferrer">Md Khorshed Alom</a>
      </div>
    </div>`;

  // Replace the old landing-page header/footer with the common version and avoid duplicate shells.
  document.querySelectorAll('.site-header, .site-footer').forEach(el => {
    if (!el.classList.contains('dp-global-header') && !el.classList.contains('dp-global-footer')) el.remove();
  });
  document.body.insertBefore(header, document.body.firstChild);
  document.body.appendChild(footer);
  const year = document.getElementById('dpYear');
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = header.querySelector('.dp-mobile-toggle');
  const nav = header.querySelector('.dp-main-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  // Close mobile navigation after a page link is selected.
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // Close the page directory when tapping outside it or navigating with Escape.
  document.addEventListener('click', event => {
    const explore = header.querySelector('.dp-explore');
    if (explore?.open && !explore.contains(event.target)) explore.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      header.querySelector('.dp-explore')?.removeAttribute('open');
      nav?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
})();
