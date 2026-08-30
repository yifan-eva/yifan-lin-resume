document.getElementById('year').textContent = new Date().getFullYear();

// theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function currentTheme(){
  const stored = root.getAttribute('data-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// image lightbox (avatar photo + all case screenshots)
const photoLightbox = document.getElementById('photoLightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(src, alt){
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  photoLightbox.classList.add('open');
  photoLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  photoLightbox.classList.remove('open');
  photoLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

const avatarTrigger = document.getElementById('avatarTrigger');
avatarTrigger.addEventListener('click', () => {
  const img = avatarTrigger.querySelector('img');
  openLightbox(img.src, img.alt);
});

document.querySelectorAll('.case-screenshot img').forEach(img => {
  img.classList.add('zoomable');
  img.setAttribute('role', 'button');
  img.setAttribute('tabindex', '0');
  img.setAttribute('aria-label', '放大檢視圖片');
  img.addEventListener('click', () => openLightbox(img.src, img.alt));
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img.src, img.alt);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
photoLightbox.addEventListener('click', (e) => {
  if (e.target === photoLightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// scroll progress bar
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

// back to top button
const backToTop = document.getElementById('backToTop');
function updateBackToTop(){
  if (window.scrollY > 480) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', () => {
  updateProgress();
  updateBackToTop();
}, { passive: true });

updateProgress();
updateBackToTop();

// active nav link highlighting
const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => section && navObserver.observe(section));

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// contact form -> Gmail compose (opens in browser instead of a mail app)
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name') || '';
  const email = formData.get('email') || '';
  const company = formData.get('company') || '';
  const message = formData.get('message') || '';

  const subject = `[履歷網站聯絡] ${name}`;
  const body =
    `姓名：${name}\n` +
    `Email：${email}\n` +
    `公司名稱：${company}\n\n` +
    `訊息內容：\n${message}`;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=eva4122525@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, '_blank');
});
