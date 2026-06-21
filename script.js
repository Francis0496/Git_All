const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

const navToggle = document.getElementById('navToggle');
const navMenuWrap = document.getElementById('navMenuWrap');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('main section[id], section[id]'));
const revealEls = Array.from(document.querySelectorAll('.reveal'));

const THEME_KEY = 'theme';

function applyTheme(theme) {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  html.setAttribute('data-theme', safeTheme);

  if (themeIcon) themeIcon.textContent = safeTheme === 'light' ? '☀️' : '🌙';
  if (themeLabel) themeLabel.textContent = safeTheme === 'light' ? 'Light' : 'Dark';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (preferredDark ? 'dark' : 'light');
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
  navToggle.setAttribute('aria-label', 'Close menu');
}

function closeMenu() {
  if (!navMenuWrap || !navToggle) return;
  navMenuWrap.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
}

function isMenuOpen() {
  return navMenuWrap ? navMenuWrap.classList.contains('open') : false;
}

function handleMenuToggle() {
  if (isMenuOpen()) closeMenu();
  else openMenu();
}

function setActiveNav() {
  const offset = 140;
  let currentId = '';

  sections.forEach((section) => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < bottom) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute('href')?.replace('#', '') || '';
    link.classList.toggle('active', target === currentId);
  });
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function handleDocumentClick(event) {
  if (!isMenuOpen()) return;

  const target = event.target;
  const clickedInsideMenu = navMenuWrap?.contains(target);
  const clickedToggle = navToggle?.contains(target);

  if (!clickedInsideMenu && !clickedToggle) closeMenu();
}

function handleEscape(event) {
  if (event.key === 'Escape' && isMenuOpen()) closeMenu();
}

function initSmoothNav() {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

function init() {
  initTheme();
  initReveal();
  initSmoothNav();
  setActiveNav();

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (navToggle) navToggle.addEventListener('click', handleMenuToggle);

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleEscape);
  window.addEventListener('scroll', setActiveNav);
  window.addEventListener('resize', setActiveNav);
}

init();
