const html = document.documentElement;
const body = document.body;

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

const navToggle = document.getElementById('navToggle');
const navMenuWrap = document.getElementById('navMenuWrap');
const navOverlay = document.getElementById('navOverlay');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

const sections = Array.from(document.querySelectorAll('section[id]'));
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const counters = Array.from(document.querySelectorAll('.counter'));
const magneticEls = Array.from(document.querySelectorAll('.magnetic'));
const tiltCards = Array.from(document.querySelectorAll('.tilt-card'));

const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');

const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');

const heroNetworkCanvas = document.getElementById('heroNetwork');

const THEME_KEY = 'theme';
let testimonialIndex = 0;
let testimonialTimer = null;
let countersStarted = false;

function applyTheme(theme) {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  html.setAttribute('data-theme', safeTheme);
  if (themeIcon) themeIcon.textContent = safeTheme === 'light' ? 'Sun' : 'Moon';
  if (themeLabel) themeLabel.textContent = safeTheme === 'light' ? 'Light' : 'Dark';
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
}

function toggleTheme() {
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
}

function openMenu() {
  if (!navMenuWrap || !navToggle) return;
  navMenuWrap.classList.add('open');
  body.classList.add('menu-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation menu');
  if (navOverlay) navOverlay.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  if (!navMenuWrap || !navToggle) return;
  navMenuWrap.classList.remove('open');
  body.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
  if (navOverlay) navOverlay.setAttribute('aria-hidden', 'true');
}

function isMenuOpen() {
  return !!navMenuWrap && navMenuWrap.classList.contains('open');
}

function toggleMenu() {
  if (isMenuOpen()) closeMenu();
  else openMenu();
}

function setActiveNavLink() {
  const offset = 140;
  let currentSection = '';

  sections.forEach((section) => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) currentSection = section.id;
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute('href')?.replace('#', '') || '';
    link.classList.toggle('active', target === currentSection);
  });
}

function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -70px 0px' });

  revealEls.forEach((el) => observer.observe(el));
}

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    if (!target) return;
    const suffix = counter.dataset.suffix || '+';

    if (reduceMotion) {
      counter.textContent = target.toLocaleString() + suffix;
      return;
    }

    let current = 0;
    const duration = 1500;
    const increment = Math.max(1, Math.ceil(target / (duration / 16)));

    const tick = () => {
      current += increment;
      if (current >= target) current = target;
      counter.textContent = current.toLocaleString() + suffix;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
  });
}

function initCounterObserver() {
  const impactSection = document.getElementById('impact');
  if (!impactSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(impactSection);
}

function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  scrollProgress.style.width = `${percent}%`;
}

function initCursorGlow() {
  if (!cursorGlow) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  let raf = null;
  let x = -9999;
  let y = -9999;

  const render = () => {
    cursorGlow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = null;
  };

  window.addEventListener('mousemove', (event) => {
    x = event.clientX;
    y = event.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  });

  window.addEventListener('mouseleave', () => {
    x = -9999;
    y = -9999;
    if (!raf) raf = requestAnimationFrame(render);
  });
}

function initMagneticButtons() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

function initTiltCards() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

function showTestimonial(index) {
  if (!testimonialCards.length) return;
  testimonialCards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  showTestimonial(testimonialIndex);
}

function prevSlide() {
  testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(testimonialIndex);
}

function initTestimonials() {
  if (!testimonialCards.length) return;
  showTestimonial(testimonialIndex);

  if (nextTestimonial) nextTestimonial.addEventListener('click', nextSlide);
  if (prevTestimonial) prevTestimonial.addEventListener('click', prevSlide);

  // Respect reduced-motion: don't auto-advance moving content.
  if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    testimonialTimer = setInterval(nextSlide, 5000);
  }
}

function handleOutsideClick(event) {
  if (!isMenuOpen()) return;
  const target = event.target;
  const clickedToggle = navToggle?.contains(target);
  const clickedMenu = navMenuWrap?.contains(target);
  if (!clickedToggle && !clickedMenu) closeMenu();
}

function handleEscape(event) {
  if (event.key === 'Escape' && isMenuOpen()) {
    closeMenu();
    navToggle?.focus();
  }
}

function bindNavLinkClose() {
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function initHeroNetwork() {
  if (!heroNetworkCanvas) return;
  const ctx = heroNetworkCanvas.getContext('2d');
  if (!ctx) return;

  const parent = heroNetworkCanvas.parentElement;
  if (!parent) return;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let rafId = null;

  const nodes = [];
  const nodeCount = 34;
  const maxDist = 110;
  let mouseX = -1000;
  let mouseY = -1000;

  const setSize = () => {
    width = parent.clientWidth;
    height = parent.clientHeight;
    heroNetworkCanvas.width = width;
    heroNetworkCanvas.height = height;
  };

  const createNodes = () => {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      for (let j = i + 1; j < nodes.length; j += 1) {
        const m = nodes[j];
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = 1 - dist / maxDist;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      const dMouse = Math.hypot(n.x - mouseX, n.y - mouseY);
      const glow = dMouse < 130 ? 0.7 : 0.4;
      ctx.fillStyle = `rgba(139, 92, 246, ${glow})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  };

  setSize();
  createNodes();

  if (!prefersReduced) draw();

  window.addEventListener('resize', () => {
    setSize();
    createNodes();
  });

  parent.addEventListener('mousemove', (event) => {
    const rect = parent.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

  parent.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
}

function handleResize() {
  if (window.innerWidth > 860) closeMenu();
  setActiveNavLink();
}

function init() {
  initTheme();
  initRevealObserver();
  initCounterObserver();
  initCursorGlow();
  initMagneticButtons();
  initTiltCards();
  initTestimonials();
  initHeroNetwork();
  bindNavLinkClose();
  setActiveNavLink();
  updateScrollProgress();

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (navToggle) navToggle.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscape);
  window.addEventListener('scroll', () => {
    setActiveNavLink();
    updateScrollProgress();
  }, { passive: true });
  window.addEventListener('resize', handleResize);
}

init();





function initPlaceholderLinks() {
  const placeholders = Array.from(document.querySelectorAll('.placeholder-link'));
  placeholders.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
    });
  });
}
function initGallery() {
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxArt = document.querySelector('.lightbox-art');

  if (!galleryItems.length) return;

  let lightboxTrigger = null;

  galleryItems.forEach((item) => {
    const imageSrc = item.dataset.image;
    if (!imageSrc) return;

    const image = new Image();
    image.onload = () => {
      item.classList.add('has-image');
      item.style.setProperty('--gallery-image', `url("${imageSrc}")`);
    };
    image.src = imageSrc;
  });

  const setFilter = (filter) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    galleryItems.forEach((item) => {
      const shouldShow = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !shouldShow);
    });
  };

  const openLightbox = (item) => {
    if (!lightbox) return;
    lightboxTrigger = item;
    const title = item.dataset.title || item.textContent.trim();
    const caption = item.dataset.caption || '';
    const category = item.dataset.category || 'Gallery';

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    if (lightboxCategory) lightboxCategory.textContent = category.replace('-', ' ');
    if (lightboxArt) {
      const imageSrc = item.classList.contains('has-image') ? item.dataset.image : '';
      lightboxArt.classList.toggle('has-image', Boolean(imageSrc));
      lightboxArt.style.backgroundImage = imageSrc ? 'linear-gradient(150deg, rgba(3, 7, 18, 0.08), rgba(3, 7, 18, 0.46)), url("' + imageSrc + '")' : '';
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('menu-open');
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (!isMenuOpen()) body.classList.remove('menu-open');
    // Return focus to the gallery item that opened the dialog.
    lightboxTrigger?.focus();
    lightboxTrigger = null;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter || 'all'));
  });

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'Tab') {
      // The close button is the only focusable control in the dialog; trap focus on it.
      event.preventDefault();
      lightboxClose?.focus();
    }
  });
}

initPlaceholderLinks();
initGallery();
