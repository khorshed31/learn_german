(() => {
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const search = document.getElementById('toolSearch');
  const cards = [...document.querySelectorAll('.tool-item')];
  const filters = [...document.querySelectorAll('.filter-chip')];
  const noResults = document.getElementById('noResults');
  const visibleCount = document.getElementById('visibleCount');
  let activeFilter = 'all';

  function filterTools() {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
      const haystack = `${card.dataset.search || ''} ${card.textContent || ''}`.toLowerCase();
      const searchMatches = !query || haystack.includes(query);
      const show = categoryMatches && searchMatches;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (visibleCount) visibleCount.textContent = String(visible);
    if (noResults) noResults.hidden = visible !== 0;
  }

  search?.addEventListener('input', filterTools);
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filters.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    filterTools();
  }));

  // Keyboard shortcut: press / to focus the tool search, unless typing in a field.
  document.addEventListener('keydown', event => {
    const target = event.target;
    const typing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (event.key === '/' && !typing && search) {
      event.preventDefault();
      search.focus();
      document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (event.key === 'Escape' && search === document.activeElement) search.blur();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  filterTools();
})();
