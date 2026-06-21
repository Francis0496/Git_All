const html = document.documentElement;

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

const navToggle = document.getElementById('navToggle');
const navMenuWrap = document.getElementById('navMenuWrap');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

const sections = Array.from(document.querySelectorAll('main section[id], section[id]'));
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const floatingEls = Array.from(document.querySelectorAll('.floating'));

const THEME_KEY = 'theme';

function applyTheme(theme) {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  html.setAttribute('data-theme', safeTheme);

  if (themeIcon) themeIcon.textContent = safeTheme === 'light' ? '☀️' : '🌙';
  if (themeLabel) themeLabel.textContent = safeTheme === 'light' ? 'Light' : 'Dark';
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);
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
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
  if (!navMenuWrap || !navToggle) return;
  navMenuWrap.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
}

function isMenuOpen() {
  return !!navMenuWrap && navMenuWrap.classList.contains('open');
}

function handleMenuToggle() {
  if (isMenuOpen()) closeMenu();
  else openMenu();
}

function setActiveNavLink() {
  const offset = 150;
  let currentSectionId = '';

  sections.forEach((section) => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < bottom) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href')?.replace('#', '') || '';
    link.classList.toggle('active', targetId === currentSectionId);
  });
}

function initRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function bindNavLinks() {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

function handleOutsideClick(event) {
  if (!isMenuOpen()) return;

  const target = event.target;
  const clickedToggle = navToggle?.contains(target);
  const clickedMenu = navMenuWrap?.contains(target);

  if (!clickedToggle && !clickedMenu) closeMenu();
}

function handleEscape(event) {
  if (event.key === 'Escape' && isMenuOpen()) closeMenu();
}

function initFloatingParallax() {
  if (!floatingEls.length) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('mousemove', (event) => {
    const xRatio = (event.clientX / window.innerWidth - 0.5) * 8;
    const yRatio = (event.clientY / window.innerHeight - 0.5) * 8;

    floatingEls.forEach((el, index) => {
      const factor = (index + 1) * 0.6;
      el.style.transform = `translate3d(${xRatio * factor}px, ${yRatio * factor}px, 0)`;
    });
  });
}

function init() {
  initTheme();
  initRevealObserver();
  initFloatingParallax();
  bindNavLinks();
  setActiveNavLink();

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (navToggle) navToggle.addEventListener('click', handleMenuToggle);

  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscape);

  window.addEventListener('scroll', setActiveNavLink);
  window.addEventListener('resize', setActiveNavLink);
}

init();
