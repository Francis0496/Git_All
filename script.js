// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme
if (savedTheme === 'light') {
  html.setAttribute('data-theme', 'light');
  if (themeToggle) themeToggle.textContent = '☀️ Light Mode';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

// Scroll Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach((section) => {
  observer.observe(section);
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    // Simple validation
    if (!name || !email || !message) {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Please fill in all fields.';
      return;
    }

    if (!email.includes('@')) {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Please enter a valid email address.';
      return;
    }

    // Simulate form submission
    formMessage.className = 'form-message success';
    formMessage.textContent = "✓ Thank you! Your message has been received. I'll get back to you soon.";

    contactForm.reset();

    setTimeout(() => {
      formMessage.className = 'form-message';
      formMessage.textContent = '';
    }, 5000);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href') !== '#') {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
