(() => {
  // Âncoras do site antigo continuam funcionando
  const legacy = { '#reforma': '#planejamento', '#especialidades': '#publicos', '#localizacao': '#contato' };
  if (legacy[location.hash]) history.replaceState(null, '', legacy[location.hash]);

  // Menu mobile
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav?.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  // Animações de entrada
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('visible'));
  }

  // Destaque do item de menu da seção visível
  const links = [...document.querySelectorAll('.main-nav a[href*="#"]')];
  const sections = links
    .map((a) => document.getElementById(a.hash.slice(1)))
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  // Mapa carregado sob demanda (mais leve e sem rastreamento até o clique)
  document.querySelectorAll('[data-map-load]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('[data-map]');
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=Av.%20Arterial%2C%2018%2C%20N%20-%20712%2C%20Sala%2009%20-%20VII%2C%20Ananindeua%20-%20PA%2C%2067140-490&output=embed';
      iframe.title = 'Mapa da GS Contábil em Ananindeua - PA';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      wrap.replaceChildren(iframe);
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
