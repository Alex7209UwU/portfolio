(function() {
  'use strict';

  const DEFAULT_CONFIG = {
    hero: {
      name: 'Alexis AILHAS-GIROUD',
      title: 'Stage IT · Administration Réseaux',
      desc: 'Passionné par l\'informatique, la cybersécurité et les réseaux. Actuellement en Bac Pro CIEL au lycée Vaucanson, je développe des projets open source et je recherche un stage en administration IT.',
      avatarUrl: ''
    },
    cv: { url: '', pdf: '' },
    letter: { url: '', pdf: '' },
    projects: { gitlabIds: ['80307614', '80202006'], gitlabUrl: 'https://gitlab.com/alex7209' },
    social: {
      linkedin: 'https://www.linkedin.com/in/alexis-ailhas-giroud-991280354/',
      email: 'alexis.giroudpro@proton.me',
      emailLabel: 'Email',
      phone: '07 83 25 97 65',
      address: '102 Rue de la république, 38430 Moirans',
      extra: []
    },
    contact: { service: 'formspree', formspreeUrl: '', formsubmitEmail: '' },
    sections: { cv: true, letter: true, projects: true, blog: true },
    blog: [],
    design: { accentColor: '#3b82f6', defaultTheme: 'dark', fontHeading: "'Poppins','Inter',sans-serif", customCSS: '' },
    password: 'admin123'
  };

  let config = loadConfig();
  let isAdmin = false;

  function loadConfig() {
    try {
      const saved = localStorage.getItem('portfolio_config');
      if (saved) return deepMerge(clone(DEFAULT_CONFIG), JSON.parse(saved));
    } catch(e) { console.warn('Config load error:', e); }
    return clone(DEFAULT_CONFIG);
  }

  function saveConfig() { localStorage.setItem('portfolio_config', JSON.stringify(config)); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function deepMerge(t, s) {
    const r = clone(t);
    for (const k in s) {
      if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) r[k] = deepMerge(r[k] || {}, s[k]);
      else r[k] = s[k];
    }
    return r;
  }

  const $$ = s => document.querySelectorAll(s);

  const SOCIAL_ICONS = {
    instagram: 'fab fa-instagram', 'x-twitter': 'fab fa-x-twitter', github: 'fab fa-github',
    youtube: 'fab fa-youtube', tiktok: 'fab fa-tiktok', twitch: 'fab fa-twitch',
    discord: 'fab fa-discord', snapchat: 'fab fa-snapchat', telegram: 'fab fa-telegram',
    whatsapp: 'fab fa-whatsapp', reddit: 'fab fa-reddit', facebook: 'fab fa-facebook',
    threads: 'fab fa-threads', bluesky: 'fab fa-bluesky', mastodon: 'fab fa-mastodon'
  };

  function getKey(key) {
    const p = key.split('.');
    let o = config;
    for (const k of p) { if (o && o[k] !== undefined) o = o[k]; else return ''; }
    return o;
  }

  function el(id) { const e = document.getElementById(id); if (!e) console.warn('Element not found:', id); return e; }

  function renderEditables() {
    $$('[data-key]').forEach(el => {
      const v = getKey(el.dataset.key);
      if (v !== undefined && v !== null && v !== '') {
        if (el.classList.contains('textarea') || el.tagName === 'DIV') el.innerHTML = String(v).replace(/\n/g, '<br>');
        else el.textContent = v;
      }
    });
  }

  function toast(msg, type = 'info') {
    const c = el('toastContainer');
    if (!c) return;
    const e = document.createElement('div');
    e.className = `toast ${type}`;
    const icons = { success: 'check-circle', error: 'xmark-circle', info: 'info-circle' };
    e.innerHTML = `<i class="fas fa-${icons[type]||icons.info}"></i> ${msg}`;
    c.appendChild(e);
    e.onclick = () => e.remove();
    setTimeout(() => { if (e.parentNode) e.remove(); }, 4000);
  }

  // ========== THEME ==========
  function setTheme(t) {
    const theme = t === 'system'
      ? (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')
      : t;
    document.documentElement.setAttribute('data-theme', theme);
    const icon = el('themeToggle');
    if (icon) {
      const i = icon.querySelector('i');
      if (i) i.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    localStorage.setItem('portfolio_theme', theme);
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
  }

  const savedTheme = localStorage.getItem('portfolio_theme') || (config.design && config.design.defaultTheme) || 'dark';
  setTheme(savedTheme);

  const themeBtn = el('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  function applyAccent(color) {
    if (!color) return;
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-hover', color + 'dd');
    document.documentElement.style.setProperty('--accent-glow', color + '20');
  }

  function applyCustomCSS(css) {
    let style = el('customCSS');
    if (!style) { style = document.createElement('style'); style.id = 'customCSS'; document.head.appendChild(style); }
    style.textContent = css || '';
  }

  function applyFont(font) {
    if (font) document.documentElement.style.setProperty('--font-heading', font);
  }

  // ========== NAV ==========
  const menuBtn = el('menuToggle');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const nav = el('navLinks');
      if (!nav) return;
      nav.classList.toggle('open');
      menuBtn.innerHTML = nav.classList.contains('open') ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });
  }
  $$('.nav-link').forEach(l => l.addEventListener('click', () => {
    const nav = el('navLinks');
    if (nav) nav.classList.remove('open');
    const mb = el('menuToggle');
    if (mb) mb.innerHTML = '<i class="fas fa-bars"></i>';
  }));

  const navSections = $$('.section');
  const navLinkEls = $$('.nav-link');
  function updateNav() {
    let cur = '';
    navSections.forEach(s => { if (window.scrollY + 150 >= s.offsetTop) cur = s.id; });
    navLinkEls.forEach(l => {
      const active = l.getAttribute('href') === `#${cur}`;
      l.style.color = active ? 'var(--accent)' : '';
      l.style.fontWeight = active ? '600' : '';
    });
  }
  window.addEventListener('scroll', updateNav);

  // ========== AOS ==========
  const observedAOS = new WeakSet();
  function initAOS(container) {
    const els = (container || document).querySelectorAll('[data-aos]');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const d = parseInt(e.target.dataset.aosDelay) || 0;
          setTimeout(() => e.target.classList.add('aos-animate'), d);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => {
      if (!observedAOS.has(el)) {
        observedAOS.add(el);
        obs.observe(el);
      }
    });
  }

  // ========== GITLAB API ==========
  async function fetchGitLabProject(id) {
    try {
      if (!id) return null;
      const r = await fetch(`https://gitlab.com/api/v4/projects/${id}`, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw Error();
      return await r.json();
    } catch(e) { return null; }
  }

  async function loadProjects() {
    const grid = el('projectsGrid');
    if (!grid) return;
    const ids = config.projects.gitlabIds || [];
    const names = ['LibreHex', 'kiosk-mairie-display'];
    const descs = [
      'Suite collaborative open-source française intégrant 25+ services.',
      'Système d\'affichage dynamique pour mairies sur Raspberry Pi.'
    ];
    const results = await Promise.all(ids.map(id => fetchGitLabProject(id)));
    grid.innerHTML = '';
    results.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-aos', 'fade-up');
      if (i > 0) card.setAttribute('data-aos-delay', String(i * 100));
      const url = p ? p.web_url : (config.projects.gitlabUrl || '#');
      if (p) {
        card.innerHTML = `
          <h3>${escHtml(p.name || names[i])}</h3>
          <p class="project-desc">${escHtml(p.description || descs[i])}</p>
          <div class="project-meta">
            <span class="project-lang">${escHtml(p.language || 'Multi')}</span>
            <span><i class="fas fa-star"></i> ${p.star_count || 0}</span>
            <span><i class="fas fa-code-fork"></i> ${p.forks_count || 0}</span>
            <span><i class="fas fa-clock"></i> ${p.last_activity_at ? new Date(p.last_activity_at).toLocaleDateString('fr-FR') : '—'}</span>
          </div>
          <a href="${url}" target="_blank" class="project-link">Voir sur GitLab <i class="fas fa-arrow-right"></i></a>`;
      } else {
        card.innerHTML = `
          <h3>${escHtml(names[i])}</h3>
          <p class="project-desc">${escHtml(descs[i])}</p>
          <a href="${url}" target="_blank" class="project-link">Voir sur GitLab <i class="fas fa-arrow-right"></i></a>`;
      }
      grid.appendChild(card);
    });
    initAOS(grid);
    loadGitLabStats();
  }

  async function loadGitLabStats() {
    try {
      const ids = config.projects.gitlabIds || [];
      const proj = await Promise.all(ids.map(id => fetchGitLabProject(id)));
      const valid = proj.filter(p => p);
      const pEl = el('gitlabProjects');
      const sEl = el('gitlabStars');
      if (pEl) pEl.textContent = ids.length;
      if (sEl) sEl.textContent = valid.reduce((s, p) => s + (p.star_count || 0), 0);
    } catch(e) {
      const pEl = el('gitlabProjects');
      const sEl = el('gitlabStars');
      if (pEl) pEl.textContent = '—';
      if (sEl) sEl.textContent = '—';
    }
  }

  // ========== DOCUMENTS ==========
  function renderDocs() {
    renderDoc('cvEmbed', config.cv.url, config.cv.pdf, 'CV');
    renderDoc('lettreEmbed', config.letter.url, config.letter.pdf, 'Lettre');
    const dlBtn = el('downloadCVBtn');
    if (dlBtn) {
      dlBtn.onclick = (e) => {
        e.preventDefault();
        const u = config.cv.pdf || config.cv.url;
        if (u && u.trim()) window.open(u, '_blank');
        else toast('Configurez d\'abord un lien dans l\'admin', 'error');
      };
    }
  }

  function renderDoc(id, url, _pdf, label) {
    const c = el(id);
    if (!c) return;
    if (url && url.trim()) {
      let src = url;
      if (url.includes('canva.com/design/') && !url.includes('embed')) {
        src = url.replace(/\/?$/, '').replace(/\/view$/, '') + '/view?embed';
      }
      c.innerHTML = `<iframe src="${escHtml(src)}" allowfullscreen loading="lazy" title="${label}"></iframe>
<p style="text-align:center;margin:12px 0;font-size:0.85rem;color:var(--text-muted)"><a href="${escHtml(url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">Ouvrir dans un nouvel onglet <i class="fas fa-external-link-alt"></i></a></p>`;
    } else {
      c.innerHTML = `<div class="doc-placeholder"><i class="fas fa-file-${label === 'CV' ? 'pdf' : 'lines'}"></i><p>Configurez votre lien dans l'interface admin</p></div>`;
    }
    const btn = el(label === 'CV' ? 'updateCVBtn' : 'updateLetterBtn');
    if (btn) {
      btn.style.display = url && url.trim() ? 'inline-flex' : 'none';
      btn.onclick = () => { renderDoc(id, url, _pdf, label); toast(label + ' rafraîchi', 'success'); };
    }
  }

  // ========== BLOG ==========
  function renderBlog() {
    const grid = el('blogGrid');
    if (!grid) return;
    const posts = config.blog || [];
    if (!posts.length) {
      grid.innerHTML = '<div class="blog-empty"><i class="fas fa-newspaper"></i><p>Ajoutez vos premiers articles depuis l\'interface admin</p></div>';
      return;
    }
    grid.innerHTML = posts.map((p, i) => `
      <div class="blog-card" data-aos="fade-up" data-aos-delay="${i*50}">
        <h3>${escHtml(p.title)}</h3>
        <p>${escHtml(p.content)}</p>
        ${p.link ? '<a href="' + escHtml(p.link) + '" target="_blank" class="blog-link">Lire la suite <i class="fas fa-arrow-right"></i></a>' : ''}
        <div class="blog-date"><i class="fas fa-calendar"></i> ${p.date || 'Ajouté récemment'}</div>
        ${isAdmin ? '<div class="blog-actions"><button class="blog-del" data-i="' + i + '"><i class="fas fa-trash"></i></button></div>' : ''}
      </div>
    `).join('');
    initAOS(grid);
    grid.querySelectorAll('.blog-del').forEach(b => b.addEventListener('click', function() {
      if (!confirm('Supprimer cet article ?')) return;
      config.blog.splice(parseInt(this.dataset.i), 1);
      saveConfig(); renderBlog(); renderBlogAdmin();
      toast('Article supprimé', 'info');
    }));
  }

  function escHtml(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function renderBlogAdmin() {
    const list = el('adminBlogList');
    if (!list) return;
    const posts = config.blog || [];
    if (!posts.length) { list.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">Aucun article</p>'; return; }
    list.innerHTML = posts.map((p, i) =>
      '<div class="admin-blog-item"><span>' + escHtml(p.title) + '</span><button class="blog-admin-del" data-i="' + i + '"><i class="fas fa-trash"></i></button></div>'
    ).join('');
    list.querySelectorAll('.blog-admin-del').forEach(b => b.addEventListener('click', function() {
      if (!confirm('Supprimer cet article ?')) return;
      config.blog.splice(parseInt(this.dataset.i), 1);
      saveConfig(); renderBlog(); renderBlogAdmin();
      toast('Article supprimé', 'info');
    }));
  }

  // ========== SECTIONS TOGGLE ==========
  function applyToggles() {
    const map = { cv: '#cv', letter: '#lettre', projects: '#projets', blog: '#blog' };
    for (const [k, s] of Object.entries(map)) {
      const el = document.querySelector(s);
      if (el) el.style.display = config.sections[k] !== false ? '' : 'none';
    }
  }

  function setSubmitLoading() {
    const btn = el('formSubmitBtn');
    const txt = el('formSubmitText');
    const icon = el('formSubmitIcon');
    if (btn) btn.disabled = true;
    if (icon) icon.style.display = 'none';
    if (txt) txt.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    showFormStatus('Envoi en cours...', 'loading');
  }
  function setSubmitDone() {
    const btn = el('formSubmitBtn');
    const txt = el('formSubmitText');
    const icon = el('formSubmitIcon');
    if (btn) btn.disabled = false;
    if (icon) icon.style.display = '';
    if (txt) txt.textContent = 'Envoyer';
  }

  // ========== CONTACT FORM ==========
  function initContactForm() {
    const form = el('contactForm');
    if (!form) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      const btn = el('formSubmitBtn');
      const txt = el('formSubmitText');
      const status = el('formStatus');
      const name = el('formName');
      const email = el('formEmail');
      const subject = el('formSubject');
      const message = el('formMessage');
      if (!name || !email || !message) return;
      const n = name.value.trim(), em = email.value.trim(), sub = subject ? subject.value.trim() : '', msg = message.value.trim();
      if (!n || !em || !msg) { showFormStatus('Veuillez remplir tous les champs obligatoires', 'error'); return; }
      setSubmitLoading();
      const targetEmail = config.contact.formsubmitEmail || config.social.email;
      if (config.contact && config.contact.service === 'formspree' && config.contact.formspreeUrl) {
        fetch(config.contact.formspreeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: n, email: em, subject: sub || 'Message depuis portfolio', message: msg, _replyto: em })
        }).then(r => {
          if (r.ok) { showFormStatus('Merci ! Votre message a été envoyé.', 'success'); form.reset(); }
          else { showFormStatus('Erreur lors de l\'envoi. Réessayez ou utilisez le mail direct.', 'error'); }
        }).catch(() => {
          showFormStatus('Erreur réseau. Utilisez le lien email direct ci-dessous.', 'error');
        }).finally(() => setSubmitDone());
      } else if (config.contact && config.contact.service === 'formsubmit' && targetEmail) {
        fetch('https://formsubmit.co/ajax/' + encodeURIComponent(targetEmail), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: n, email: em, subject: sub || 'Message depuis portfolio', message: msg })
        }).then(r => {
          if (r.ok) { showFormStatus('Merci ! Votre message a été envoyé.', 'success'); form.reset(); }
          else { showFormStatus('Erreur lors de l\'envoi. Réessayez.', 'error'); }
        }).catch(() => {
          showFormStatus('Erreur réseau. Utilisez le lien email direct.', 'error');
        }).finally(() => setSubmitDone());
      } else {
        const mailto = 'mailto:' + config.social.email + '?subject=' + encodeURIComponent(sub || 'Message depuis portfolio') + '&body=' + encodeURIComponent('Nom: ' + n + '\nEmail: ' + em + '\n\n' + msg);
        window.open(mailto);
        showFormStatus('Redirection vers votre client email...', 'success');
        setSubmitDone();
      }
    };
  }

  function showFormStatus(msg, type) {
    const s = el('formStatus');
    if (!s) return;
    s.className = 'form-status ' + type;
    s.textContent = msg;
    if (type === 'success') setTimeout(() => { s.className = 'form-status'; }, 6000);
  }

  // ========== SOCIAL ==========
  function renderSocial() {
    const extra = el('socialExtra');
    if (!extra) return;
    let html = '';
    if (config.social.linkedin) {
      html += '<a href="' + escHtml(config.social.linkedin) + '" target="_blank" rel="noopener noreferrer" class="social-card"><div class="social-icon"><i class="fab fa-linkedin"></i></div><h3>LinkedIn</h3><div class="social-stats"><span><i class="fas fa-user"></i> ' + escHtml(config.hero.name || 'LinkedIn') + '</span></div></a>';
    }
    if (config.social.email) {
      html += '<a href="mailto:' + escHtml(config.social.email) + '" class="social-card"><div class="social-icon"><i class="fas fa-envelope"></i></div><h3>' + escHtml(config.social.emailLabel || 'Email') + '</h3><div class="social-stats"><span>' + escHtml(config.social.email) + '</span></div></a>';
    }
    (config.social.extra || []).forEach(s => {
      const iconClass = SOCIAL_ICONS[s.icon] || 'fas fa-link';
      html += '<a href="' + escHtml(s.url) + '" target="_blank" rel="noopener noreferrer" class="social-card"><div class="social-icon"><i class="' + iconClass + '"></i></div><h3>' + escHtml(s.label) + '</h3></a>';
    });
    extra.innerHTML = html;
  }

  // ========== DROP ZONES ==========
  function setupDropZones() {
    $$('.drop-zone').forEach(zone => {
      if (zone.dataset.ready) return;
      zone.dataset.ready = '1';
      const target = el(zone.dataset.target);
      if (!target) return;
      const accept = zone.dataset.accept || '';
      ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag-over'); }));
      ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag-over'); }));
      zone.addEventListener('dragover', e => e.dataTransfer.dropEffect = 'copy');
      zone.addEventListener('drop', e => {
        const file = e.dataTransfer.files[0];
        if (file && (!accept || file.type.match(accept.replace(',', '|').replace('image/*', 'image/.*')))) {
          readFileAsDataURL(file, target, zone);
        } else toast('Type de fichier non accepté', 'error');
      });
      zone.addEventListener('click', () => {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = accept; inp.style.display = 'none';
        inp.addEventListener('change', () => {
          const file = inp.files[0];
          if (file) readFileAsDataURL(file, target, zone);
        });
        inp.click();
      });
      const updateZone = () => { zone.classList.toggle('has-file', !!target.value); if (target.value && !zone.querySelector('i.fa-check-circle')) zone.innerHTML = '<i class="fas fa-check-circle"></i> Fichier chargé'; };
      target.addEventListener('input', updateZone);
      updateZone();
    });
  }
  function readFileAsDataURL(file, input, zone) {
    if (file.size > 5 * 1024 * 1024) { toast('Fichier trop volumineux (max 5 Mo)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      input.value = e.target.result;
      zone.classList.add('has-file');
      zone.innerHTML = '<i class="fas fa-check-circle"></i> ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' Ko)';
      toast('Fichier chargé — pensez à enregistrer', 'success');
    };
    reader.readAsDataURL(file);
  }

  // ========== AVATAR ==========
  function renderAvatar() {
    const container = document.querySelector('.avatar-placeholder');
    if (!container) return;
    const url = config.hero && config.hero.avatarUrl;
    if (url && url.trim()) {
      container.innerHTML = '<img src="' + escHtml(url.trim()) + '" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
    } else {
      container.innerHTML = '<i class="fas fa-user-astronaut"></i>';
    }
  }

  // ========== ADMIN ==========
  const adminLock = el('adminLock');
  const adminOverlay = el('adminOverlay');
  const adminPanel = el('adminPanel');
  const pwdModal = el('pwdModal');
  const pwdOverlay = el('pwdOverlay');

  function openPwdModal() {
    if (pwdModal) pwdModal.style.display = 'block';
    if (pwdOverlay) pwdOverlay.style.display = 'block';
    const err = el('pwdError');
    if (err) err.style.display = 'none';
    const inp = el('pwdInput');
    if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 100); }
  }

  function closePwdModal() {
    if (pwdModal) pwdModal.style.display = 'none';
    if (pwdOverlay) pwdOverlay.style.display = 'none';
  }

  function openAdmin() {
    isAdmin = true;
    if (adminPanel) adminPanel.classList.add('open');
    if (adminLock) adminLock.classList.add('unlocked');
    const icon = el('adminLockIcon');
    if (icon) icon.className = 'fas fa-unlock';
    document.body.style.overflow = 'hidden';
    populateAdmin();
    renderBlogAdmin();
    renderExtraSocialAdmin();
  }

  function closeAdmin() {
    isAdmin = false;
    if (adminPanel) adminPanel.classList.remove('open');
    if (adminLock) adminLock.classList.remove('unlocked');
    const icon = el('adminLockIcon');
    if (icon) icon.className = 'fas fa-lock';
    document.body.style.overflow = '';
  }

  function checkPwd() {
    const inp = el('pwdInput');
    if (inp && inp.value === config.password) { closePwdModal(); openAdmin(); }
    else {
      const err = el('pwdError');
      if (err) { err.style.display = 'block'; }
      if (inp) { inp.value = ''; inp.focus(); }
    }
  }

  if (adminLock) adminLock.addEventListener('click', () => { isAdmin ? closeAdmin() : openPwdModal(); });
  const pwdSubmit = el('pwdSubmit');
  if (pwdSubmit) pwdSubmit.addEventListener('click', checkPwd);
  const pwdInp = el('pwdInput');
  if (pwdInp) pwdInp.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPwd(); });
  const pwdCancel = el('pwdCancel');
  if (pwdCancel) pwdCancel.addEventListener('click', closePwdModal);
  if (pwdOverlay) pwdOverlay.addEventListener('click', closePwdModal);
  const adminClose = el('adminClose');
  if (adminClose) adminClose.addEventListener('click', closeAdmin);


  // ADMIN TABS
  $$('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const body = document.querySelector('.admin-body');
      if (body) body.scrollTop = 0;
      $$('.admin-tab').forEach(t => t.classList.remove('active'));
      $$('.admin-tab-content').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById('tab-' + this.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Admin section titles - click to scroll
  $$('.admin-section-title').forEach(title => {
    title.addEventListener('click', function() {
      if (this.offsetParent === null) return;
      const body = this.closest('.admin-body');
      if (body) body.scrollTo({ top: this.offsetTop - 16, behavior: 'smooth' });
    });
  });

  function populateAdmin() {
    const setVal = (id, val) => { const e = el(id); if (e) e.value = val !== null && val !== undefined ? val : ''; };
    const setCheck = (id, val) => { const e = el(id); if (e) e.checked = val !== false; };

    setVal('adminHeroName', config.hero.name);
    setVal('adminHeroTitle', config.hero.title);
    setVal('adminHeroDesc', config.hero.desc);
    setVal('adminAvatarUrl', config.hero.avatarUrl);
    setCheck('toggleCV', config.sections.cv);
    setCheck('toggleLetter', config.sections.letter);
    setCheck('toggleProjects', config.sections.projects);
    setCheck('toggleBlog', config.sections.blog);
    setVal('adminCVUrl', config.cv.url);
    setVal('adminCVPDF', config.cv.pdf);
    setVal('adminLetterUrl', config.letter.url);
    setVal('adminLetterPDF', config.letter.pdf);
    setVal('adminGitlab1', (config.projects.gitlabIds || [])[0]);
    setVal('adminGitlab2', (config.projects.gitlabIds || [])[1]);
    setVal('adminGitlabUrl', config.projects.gitlabUrl);
    setVal('adminLinkedin', config.social.linkedin);
    setVal('adminEmail', config.social.email);
    setVal('adminPhone', config.social.phone);
    setVal('adminAddress', config.social.address);
    setVal('adminFormService', config.contact.service);
    setVal('adminFormspreeUrl', config.contact.formspreeUrl);
    setVal('adminFormsubmitEmail', config.contact.formsubmitEmail);
    setVal('adminCurrentPwd', config.password);
    toggleFormFields();
    setVal('adminAccentColor', config.design.accentColor);
    setVal('adminAccentColorText', config.design.accentColor);
    setVal('adminDefaultTheme', config.design.defaultTheme);
    setVal('adminFontHeading', config.design.fontHeading);
    setVal('adminCustomCSS', config.design.customCSS);
    setupDropZones();
  }

  function toggleFormFields() {
    const svc = el('adminFormService');
    const spree = el('adminFormspreeField');
    const submit = el('adminFormsubmitField');
    if (!svc) return;
    const val = svc.value;
    if (spree) spree.style.display = val === 'formspree' ? '' : 'none';
    if (submit) submit.style.display = val === 'formsubmit' ? '' : 'none';
  }
  const formSvc = el('adminFormService');
  if (formSvc) formSvc.addEventListener('change', toggleFormFields);

  // Color picker
  const accColor = el('adminAccentColor');
  const accText = el('adminAccentColorText');
  if (accColor) accColor.addEventListener('input', function() {
    if (accText) accText.value = this.value;
    applyAccent(this.value);
  });
  if (accText) accText.addEventListener('input', function() {
    if (/^#[0-9a-f]{6}$/i.test(this.value) && accColor) {
      accColor.value = this.value;
      applyAccent(this.value);
    }
  });

  // Font
  const fontSelect = el('adminFontHeading');
  if (fontSelect) fontSelect.addEventListener('change', function() { applyFont(this.value); });

  // Custom CSS
  let cssTimer;
  const cssField = el('adminCustomCSS');
  if (cssField) cssField.addEventListener('input', function() {
    clearTimeout(cssTimer);
    cssTimer = setTimeout(() => applyCustomCSS(this.value), 500);
  });

  function readAdminForm() {
    const g = (id) => { const e = el(id); return e ? e.value.trim() : ''; };
    const ck = (id) => { const e = el(id); return e ? e.checked : true; };
    config.hero.name = g('adminHeroName');
    config.hero.title = g('adminHeroTitle');
    config.hero.desc = g('adminHeroDesc');
    config.hero.avatarUrl = g('adminAvatarUrl');
    config.sections.cv = ck('toggleCV');
    config.sections.letter = ck('toggleLetter');
    config.sections.projects = ck('toggleProjects');
    config.sections.blog = ck('toggleBlog');
    config.cv.url = g('adminCVUrl');
    config.cv.pdf = g('adminCVPDF');
    config.letter.url = g('adminLetterUrl');
    config.letter.pdf = g('adminLetterPDF');
    config.projects.gitlabIds = [g('adminGitlab1'), g('adminGitlab2')];
    config.projects.gitlabUrl = g('adminGitlabUrl');
    config.social.linkedin = g('adminLinkedin');
    config.social.email = g('adminEmail');
    config.social.phone = g('adminPhone');
    config.social.address = g('adminAddress');
    const svcEl = el('adminFormService');
    config.contact.service = svcEl ? svcEl.value : 'formspree';
    config.contact.formspreeUrl = g('adminFormspreeUrl');
    config.contact.formsubmitEmail = g('adminFormsubmitEmail');
    const acEl = el('adminAccentColor');
    config.design.accentColor = acEl ? acEl.value : '#3b82f6';
    const dtEl = el('adminDefaultTheme');
    config.design.defaultTheme = dtEl ? dtEl.value : 'dark';
    const fhEl = el('adminFontHeading');
    config.design.fontHeading = fhEl ? fhEl.value : "'Poppins','Inter',sans-serif";
    config.design.customCSS = g('adminCustomCSS');
  }

  // Save
  const adminSave = el('adminSave');
  if (adminSave) {
    adminSave.addEventListener('click', function() {
      readAdminForm();
      saveConfig();
      applyAll();
      const status = el('adminSaveStatus');
      if (status) { status.innerHTML = '<i class="fas fa-check-circle"></i> Enregistré'; }
      setTimeout(() => { const s2 = el('adminSaveStatus'); if (s2) s2.innerHTML = ''; }, 3000);
      toast('Configuration sauvegardée', 'success');
    });
  }

  // Preview
  const previewBtn = el('adminRefreshPreview');
  if (previewBtn) previewBtn.addEventListener('click', () => {
    readAdminForm();
    applyAll();
    if (config.design) setTheme(config.design.defaultTheme);
    toast('Aperçu mis à jour', 'success');
  });

  function applyAll() {
    renderEditables();
    renderDocs();
    applyToggles();
    renderAvatar();
    loadProjects();
    if (config.design) {
      applyAccent(config.design.accentColor);
      applyFont(config.design.fontHeading);
      applyCustomCSS(config.design.customCSS);
    }
    renderSocial();
    updateContactLinks();
    initContactForm();
  }

  // Change password
  const changePwd = el('changePwdBtn');
  if (changePwd) changePwd.addEventListener('click', () => {
    const np = el('adminNewPwd');
    if (!np) return;
    const pwd = np.value.trim();
    if (!pwd || pwd.length < 4) { toast('Minimum 4 caractères', 'error'); return; }
    config.password = pwd;
    const cp = el('adminCurrentPwd');
    if (cp) cp.value = pwd;
    saveConfig();
    toast('Mot de passe changé', 'success');
    np.value = '';
  });

  // Blog add
  const addBlog = el('addBlogBtn');
  if (addBlog) addBlog.addEventListener('click', () => {
    const title = el('blogTitle'), content = el('blogContent'), link = el('blogLink');
    if (!title || !content) return;
    const t = title.value.trim(), c = content.value.trim();
    if (!t || !c) { toast('Titre et contenu obligatoires', 'error'); return; }
    if (!config.blog) config.blog = [];
    config.blog.push({ title: t, content: c, link: link ? link.value.trim() : '', date: new Date().toLocaleDateString('fr-FR') });
    saveConfig();
    title.value = ''; if (content) content.value = ''; if (link) link.value = '';
    renderBlog(); renderBlogAdmin();
    toast('Article ajouté', 'success');
  });

  // Extra social admin
  function renderExtraSocialAdmin() {
    const list = el('extraSocialList');
    if (!list) return;
    const items = config.social.extra || [];
    if (!items.length) { list.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">Aucun réseau supplémentaire</p>'; return; }
    list.innerHTML = items.map((s, i) =>
      '<div class="admin-extra-social-item"><i class="' + (SOCIAL_ICONS[s.icon] || 'fas fa-link') + '"></i> ' + escHtml(s.label) + ' <button class="extra-social-del" data-i="' + i + '"><i class="fas fa-trash"></i></button></div>'
    ).join('');
    list.querySelectorAll('.extra-social-del').forEach(b => b.addEventListener('click', function() {
      config.social.extra.splice(parseInt(this.dataset.i), 1);
      saveConfig(); renderSocial(); renderExtraSocialAdmin();
      toast('Réseau supprimé', 'info');
    }));
  }
  const addExtraSocial = el('addExtraSocialBtn');
  if (addExtraSocial) addExtraSocial.addEventListener('click', () => {
    const iconEl = el('extraSocialIcon'), labelEl = el('extraSocialLabel'), urlEl = el('extraSocialUrl');
    if (!iconEl || !labelEl || !urlEl) return;
    const label = labelEl.value.trim(), url = urlEl.value.trim();
    if (!label || !url) { toast('Label et URL obligatoires', 'error'); return; }
    if (!config.social.extra) config.social.extra = [];
    config.social.extra.push({ icon: iconEl.value, label: label, url: url });
    saveConfig();
    labelEl.value = ''; urlEl.value = '';
    renderSocial(); renderExtraSocialAdmin();
    toast('Réseau ajouté', 'success');
  });

  // Export
  const exportBtn = el('exportConfigBtn');
  if (exportBtn) exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'portfolio-config-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    toast('Configuration exportée', 'success');
  });

  // Import
  const importBtn = el('importConfigBtn');
  const importInput = el('importConfigInput');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          config = deepMerge(clone(DEFAULT_CONFIG), data);
          saveConfig();
          applyAll();
          toast('Configuration importée', 'success');
          closeAdmin();
          setTimeout(() => openAdmin(), 300);
        } catch(e) { toast('Fichier invalide', 'error'); }
      };
      reader.readAsText(file);
    });
  }

  // Reset
  const resetBtn = el('resetConfigBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (confirm('Réinitialiser toute la configuration ? Les données seront définitivement perdues.')) {
      localStorage.removeItem('portfolio_config');
      localStorage.removeItem('portfolio_theme');
      location.reload();
    }
  });

  // ========== CONTACT LINKS ==========
  function updateContactLinks() {
    const footerEmail = el('footerEmail');
    if (footerEmail && config.social.email) footerEmail.href = 'mailto:' + config.social.email;
    const direct = el('formDirectEmail');
    if (direct && config.social.email) { direct.href = 'mailto:' + config.social.email; direct.textContent = config.social.email; }
  }

  // ========== KEYBOARD ==========
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      isAdmin ? closeAdmin() : openPwdModal();
    }
    if (e.key === 'Escape') { if (isAdmin) closeAdmin(); closePwdModal(); }
  });

  // ========== INIT ==========
  function init() {
    try {
      if (config.design) {
        applyAccent(config.design.accentColor);
        applyFont(config.design.fontHeading);
        applyCustomCSS(config.design.customCSS);
      }
      renderEditables();
      renderDocs();
      applyToggles();
      renderAvatar();
      renderSocial();
      loadProjects();
      updateContactLinks();
      renderBlog();
      initContactForm();
      initAOS();
      const theme = localStorage.getItem('portfolio_theme') || (config.design ? config.design.defaultTheme : 'dark') || 'dark';
      setTheme(theme);
    } catch(e) {
      console.error('Init error:', e);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
