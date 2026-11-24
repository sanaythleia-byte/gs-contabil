(() => {
  const WA = 'https://wa.me/5591992872476?text=';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Âncoras do site antigo continuam funcionando
  const legacy = { '#reforma': '#planejamento', '#especialidades': '#publicos', '#localizacao': '#contato' };
  if (legacy[location.hash]) history.replaceState(null, '', legacy[location.hash]);

  /* ---------- Aviso rápido (toast) ---------- */
  const toastEl = $('.toast');
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3500);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    }
  };

  /* ---------- Menu mobile ---------- */
  const header = $('.site-header');
  const toggle = $('.menu-toggle');
  const nav = $('.main-nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) header.classList.remove('is-hidden');
  };
  toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav?.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  /* ---------- Título do hero: palavras sobem em sequência ---------- */
  const splitTitle = $('h1[data-split]');
  if (splitTitle) {
    if (!reduceMotion) {
      splitTitle.setAttribute('aria-label', splitTitle.textContent.replace(/\s+/g, ' ').trim());
      let i = 0;
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.append(' '); return; }
              const w = document.createElement('span');
              w.className = 'w'; w.setAttribute('aria-hidden', 'true');
              const inner = document.createElement('span');
              inner.textContent = part; inner.style.setProperty('--i', i++);
              w.append(inner); frag.append(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) walk(n);
        });
      };
      walk(splitTitle);
    }
    splitTitle.classList.add('is-split');
  }

  /* ---------- Rolagem: progresso, cabeçalho, barra mobile, topo, parallax ---------- */
  const progress = $('.scroll-progress span');
  const toTop = $('.to-top');
  const mobileBar = $('.mobile-bar');
  const hero = $('.hero') || $('.article-hero');
  const parallaxImg = !reduceMotion && finePointer ? $('[data-parallax]') : null;
  const steps = $('[data-steps]');
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

    header?.classList.toggle('is-scrolled', y > 12);
    const menuOpen = nav?.classList.contains('open');
    const focusInHeader = !!header?.querySelector(':focus-visible');
    if (!menuOpen && !focusInHeader && y > 400 && y > lastY + 4) header?.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 400) header?.classList.remove('is-hidden');
    lastY = y;

    const heroEnd = hero ? hero.offsetTop + hero.offsetHeight * 0.7 : 600;
    mobileBar?.classList.toggle('is-visible', y > heroEnd);
    toTop?.classList.toggle('is-visible', y > window.innerHeight * 1.5);

    if (parallaxImg && y < window.innerHeight * 1.2) {
      parallaxImg.style.transform = `translateY(${y * 0.06}px) scale(1.08)`;
    }

    if (steps) {
      const r = steps.getBoundingClientRect();
      const start = window.innerHeight * 0.75;
      const p = reduceMotion ? 1 : Math.min(Math.max((start - r.top) / r.height, 0), 1);
      steps.style.setProperty('--progress', p.toFixed(3));
      $$('.step', steps).forEach((s) => {
        const sr = s.getBoundingClientRect();
        s.classList.toggle('is-active', reduceMotion || sr.top < start);
      });
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  header?.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    $('.brand')?.focus({ preventScroll: true });
  });

  /* ---------- Entradas ao rolar ---------- */
  const targets = $$('.reveal, .reveal-stagger, .why-grid');
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

  /* ---------- Menu indica a seção visível ---------- */
  const links = $$('.main-nav a[href*="#"]');
  const sections = links.some((a) => document.getElementById(a.hash.slice(1))) ? $$('main > section') : [];
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

  /* ---------- Faixa animada: pausar / pausar fora da tela ---------- */
  const ticker = $('[data-ticker]');
  if (ticker) {
    const btn = $('.ticker-toggle', ticker);
    btn?.addEventListener('click', () => {
      const paused = ticker.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Retomar a faixa animada' : 'Pausar a faixa animada');
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => ticker.classList.toggle('is-offscreen', !e.isIntersecting)).observe(ticker);
    }
  }

  /* ---------- Brilho que segue o cursor nos cartões ---------- */
  if (finePointer && !reduceMotion) {
    $$('.service-card, .audience-card').forEach((card) => {
      card.classList.add('spot');
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Perguntas frequentes: abrir/fechar com animação ---------- */
  const faqs = $$('.faq-item');
  if (!reduceMotion && faqs.length && 'animate' in Element.prototype) {
    const close = (d) => {
      const a = $('.answer', d);
      const anim = a.animate([{ height: `${a.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 200, easing: 'cubic-bezier(.4,0,1,1)' });
      anim.onfinish = () => { d.open = false; };
    };
    const open = (d) => {
      d.open = true;
      const a = $('.answer', d);
      a.animate([{ height: '0px', opacity: 0 }, { height: `${a.offsetHeight}px`, opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' });
    };
    faqs.forEach((d) => {
      d.removeAttribute('name');
      $('summary', d).addEventListener('click', (e) => {
        e.preventDefault();
        if (d.open) { close(d); return; }
        faqs.filter((o) => o !== d && o.open).forEach(close);
        open(d);
      });
    });
  }

  /* ---------- Assistente de atendimento ---------- */
  const form = $('#assistente');
  if (form) {
    const preview = $('#a-preview');
    const previewBox = $('.assistant-preview');
    const bar = $('.assistant-progress span');
    const nameInput = $('#a-nome');
    const msgInput = $('#a-msg');
    const perfis = {
      pf: 'Sou pessoa física.',
      mei: 'Sou MEI / empreendedor.',
      empresa: 'Tenho uma empresa (ME, EPP ou LTDA).',
      prestador: 'Sou prestador de serviços.',
      comercio: 'Tenho um comércio / pequeno negócio.',
      liberal: 'Sou profissional liberal.',
    };
    const joinList = (arr) => arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}`;

    const compose = () => {
      const nome = nameInput.value.trim();
      const perfil = $('input[name="perfil"]:checked', form)?.value;
      const assuntos = $$('input[name="assunto"]:checked', form).map((i) => i.value);
      const extra = msgInput.value.trim();
      const lines = [nome ? `Olá, GS Contábil! Meu nome é ${nome}.` : 'Olá, GS Contábil!'];
      if (perfil) lines.push(perfis[perfil]);
      if (assuntos.length) lines.push(`Gostaria de orientação sobre ${joinList(assuntos)}.`);
      else if (!perfil) lines.push('Gostaria de conversar sobre assessoria contábil.');
      if (extra) lines.push(extra);
      if (perfil || assuntos.length) lines.push('Podemos conversar?');
      const done = (perfil ? 1 : 0) + (assuntos.length ? 1 : 0) + (nome ? 1 : 0);
      return { text: lines.join('\n'), done };
    };

    const update = () => {
      const { text, done } = compose();
      preview.textContent = text;
      if (bar) bar.style.setProperty('--p', (done / 3).toFixed(2));
      previewBox.classList.remove('is-updated');
      void previewBox.offsetWidth;
      previewBox.classList.add('is-updated');
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.open(WA + encodeURIComponent(compose().text), '_blank', 'noopener');
    });
    $('[data-copy-message]', form)?.addEventListener('click', async () => {
      if (await copyText(compose().text)) toast('Mensagem copiada');
    });

    // Cartões "Para quem atendemos" pré-selecionam o perfil
    $$('[data-perfil]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const radio = $(`input[name="perfil"][value="${link.dataset.perfil}"]`, form);
        if (!radio) return;
        e.preventDefault();
        radio.checked = true;
        update();
        form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        form.classList.remove('is-highlight');
        void form.offsetWidth;
        form.classList.add('is-highlight');
        setTimeout(() => $('input[name="assunto"]', form)?.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
      });
    });
  }

  /* ---------- Copiar endereço / telefone ---------- */
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!(await copyText(btn.dataset.copy))) return;
      toast(btn.dataset.toast || 'Copiado');
      btn.classList.add('is-done');
      setTimeout(() => btn.classList.remove('is-done'), 1800);
    });
  });

  /* ---------- Mapa sob demanda (mais leve e sem rastreamento até o clique) ---------- */
  $$('[data-map-load]').forEach((btn) => {
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

  /* ---------- Páginas de artigo ---------- */
  const body = $('.article-body');
  if (body) {
    // Tempo de leitura
    const words = body.textContent.trim().split(/\s+/).length;
    const meta = $('.article-meta');
    if (meta) {
      const t = document.createElement('span');
      t.className = 'reading-time';
      t.textContent = `Leitura de ${Math.max(1, Math.round(words / 200))} min`;
      meta.prepend(t);
    }

    // Compartilhar
    const copy = $('.article-hero-copy');
    if (copy) {
      const actions = document.createElement('div');
      actions.className = 'article-actions';
      actions.innerHTML = '<button class="btn btn-ghost-dark" type="button"><svg class="icon" aria-hidden="true"><use href="#i-share"/></svg>Compartilhar artigo</button>';
      copy.append(actions);
      actions.querySelector('button').addEventListener('click', async () => {
        const data = { title: document.title, url: location.href };
        if (navigator.share) {
          try { await navigator.share(data); } catch { /* cancelado */ }
        } else if (await copyText(location.href)) {
          toast('Link do artigo copiado');
        }
      });
    }

    // Sumário com links e destaque da seção atual
    const heads = $$('h2', body).filter((h) => /^\d+\./.test(h.textContent.trim()));
    const items = $$('.article-aside-card ol li');
    const tocLinks = [];
    heads.forEach((h, i) => {
      h.id = h.id || `secao-${i + 1}`;
      const li = items[i];
      if (!li) return;
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = li.textContent;
      li.replaceChildren(a);
      tocLinks.push(a);
    });
    if (tocLinks.length && 'IntersectionObserver' in window) {
      const tocSpy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          tocLinks.forEach((a) => {
            if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      heads.forEach((h) => tocSpy.observe(h));
    }
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
