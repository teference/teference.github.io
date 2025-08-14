// Small enhancements: mobile nav toggle, smooth scrolling on older browsers, and dynamic year
(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu after clicking a link on mobile
    navMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Back-to-top smooth scroll polyfill
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', '#' + id);
      }
    });
  });

  // Set current year
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Theme toggle: respects saved preference or system setting
  const THEME_KEY = 'teference-theme'; // 'light' | 'dark'
  const $body = document.body;
  const $toggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    const isLight = theme === 'light';
    $body.classList.toggle('theme-light', isLight);
    if ($toggle) {
      $toggle.setAttribute('aria-pressed', String(isLight));
      $toggle.textContent = isLight ? '☀️' : '🌙';
      $toggle.title = isLight ? 'Switch to dark' : 'Switch to light';
    }
  }

  // Initialize
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
  let initialTheme = saved;
  if (!initialTheme) {
    // Default to light theme unless user has explicitly chosen otherwise
    initialTheme = 'light';
  }
  applyTheme(initialTheme);

  // Persist changes
  if ($toggle) {
    $toggle.addEventListener('click', () => {
      const current = $body.classList.contains('theme-light') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch {}
    });
  }

  // Render expertise tags from JSON
  const tagsRoot = document.getElementById('tags-root');
  if (tagsRoot) {
    const fallback = {
      categories: [
        { title: 'Frontend', accent: true, tags: ['React','Next.js','Angular','Vue','TypeScript','JavaScript','HTML','CSS','Telerik'] },
        { title: 'Backend & APIs', accent: false, tags: ['.NET','ASP.NET','REST','SOAP','WCF'] },
        { title: 'Mobile', accent: false, tags: ['React Native','Xamarin','Android (Kotlin)','iOS (Swift/SwiftUI)'] },
        { title: 'Cloud & DevOps', accent: false, tags: ['Azure','AWS','GCP','DigitalOcean','Kubernetes','Terraform','Helm','GitHub','Bitbucket'] },
        { title: 'Realtime & Comms', accent: true, tags: ['WebRTC','VoIP','Twilio','Vonage','3CX','SIP/SBC'] },
        { title: 'Messaging', accent: false, tags: ['WhatsApp','SMS/MMS','Email','RCS','Facebook Messenger','Instagram'] },
        { title: 'Data & AI', accent: true, tags: ['Machine Learning','AI solutions'] }
      ]
    };

    function render(data) {
      tagsRoot.innerHTML = '';
      data.categories.forEach(cat => {
        const wrap = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.textContent = cat.title;
        const ul = document.createElement('ul');
        ul.className = 'taglist';
        (cat.tags || []).forEach(t => {
          const li = document.createElement('li');
          if (cat.accent) li.classList.add('brand');
          li.textContent = t;
          ul.appendChild(li);
        });
        wrap.appendChild(h4);
        wrap.appendChild(ul);
        tagsRoot.appendChild(wrap);
      });
    }

    fetch('data/tags.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('http '+r.status)))
      .then(json => render(json))
      .catch(() => render(fallback));
  }
})();
