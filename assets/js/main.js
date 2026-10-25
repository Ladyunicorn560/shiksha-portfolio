/* ═══════════════════════════════════════════════════════
   SHIKSHA SHRIVASTAVA — PORTFOLIO JAVASCRIPT
   Particles, Typewriter, Scroll Animations, Counter, etc.
   ═══════════════════════════════════════════════════════ */

// ── PARTICLE SYSTEM ──────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = [
    'rgba(0,245,255,',
    'rgba(176,110,255,',
    'rgba(255,77,216,',
    'rgba(0,245,255,',
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 100;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }
    draw() {
      const fade = this.life < 30 ? this.life / 30 : this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (this.alpha * fade) + ')';
      ctx.fill();
    }
  }

  // Connection lines
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(176,110,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  resize();
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  loop();
  window.addEventListener('resize', resize);
})();

// ── NAVBAR SCROLL ─────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    menu.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      menu?.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
})();

// ── TYPEWRITER ROLES ──────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('role-typewriter');
  if (!el) return;

  const roles = [
    'AI Security Researcher',
    'Machine Learning Engineer',
    'Computer Vision Developer',
    'Deep Learning Enthusiast',
    'Adversarial ML Researcher',
    'Full-Stack Developer',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 60);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 1000);
})();

// ── SCROLL REVEAL ─────────────────────────────────────────
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0) * 1);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Stagger children inside grids
  document.querySelectorAll('.projects-grid, .skills-grid, .achievements-grid, .publications-list').forEach(grid => {
    Array.from(grid.querySelectorAll('.reveal')).forEach((el, i) => {
      el.dataset.delay = i * 100;
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  revealEls.forEach(el => observer.observe(el));
})();

// ── COUNTER ANIMATION ─────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
})();

// ── CONTACT FORM (Formspree) ───────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', () => {
    const btn = document.getElementById('contact-submit-btn');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';
      btn.disabled = true;
    }
  });
})();

// ── SKILL BARS — ANIMATE + TAB FILTER ────────────────────────
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-w]');
  if (!fills.length) return;

  // Animate width on scroll-into-view
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => { el.style.width = el.dataset.w + '%'; }, 200);
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(el => barObserver.observe(el));

  // Tab filter
  const tabs = document.querySelectorAll('.skill-tab');
  const groups = document.querySelectorAll('.skill-bar-group');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.tab;
      groups.forEach(g => {
        g.classList.toggle('hidden-tab', filter !== 'all' && g.dataset.category !== filter);
      });
    });
  });
})();

// ── SMOOTH PARALLAX HERO ──────────────────────────────────
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }
  }, { passive: true });
})();

// ── CURSOR GLOW EFFECT ────────────────────────────────────
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(176,110,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ── TILT EFFECT ON PROJECT CARDS ──────────────────────────
(function initTilt() {
  document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

// ── GRID LINE BACKGROUND FOR HERO ─────────────────────────
(function initGridBg() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(176,110,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
  </svg>`;
  const div = document.createElement('div');
  div.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  div.innerHTML = svg;
  hero.insertBefore(div, hero.firstChild);
})();

// ── GLOWING SECTION DIVIDERS ──────────────────────────────
(function initDividers() {
  document.querySelectorAll('.section').forEach(section => {
    const div = document.createElement('div');
    div.style.cssText = `
      position:absolute;top:0;left:50%;transform:translateX(-50%);
      width:200px;height:1px;
      background:linear-gradient(90deg,transparent,rgba(0,245,255,0.3),transparent);
      pointer-events:none;z-index:0;
    `;
    section.style.position = 'relative';
    section.insertBefore(div, section.firstChild);
  });
})();

console.log('%c Shiksha Shrivastava — Portfolio ', 'background:#050508;color:#00f5ff;font-size:14px;font-weight:bold;padding:8px 16px;border:1px solid rgba(0,245,255,0.3);border-radius:4px;');
console.log('%c AI Security Researcher | ML Engineer | CS @ University of Delhi ', 'color:#b06eff;font-size:11px;');
