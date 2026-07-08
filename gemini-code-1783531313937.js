// ===== DYNAMIC COPYRIGHT YEAR =====
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1200);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMobileNav() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileNav);
navOverlay.addEventListener('click', toggleMobileNav);

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      toggleMobileNav();
    }
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealElements.forEach((el) => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const stats = document.querySelectorAll('.stat-item h3');
  stats.forEach((stat) => {
    const text = stat.textContent;
    const match = text.match(/^([\d.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const duration = 2000;
    const start = performance.now();
    const isDecimal = text.includes('.');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? (target * eased).toFixed(1)
        : Math.floor(target * eased);
      stat.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.unobserve(heroStats);
      }
    },
    { threshold: 0.5 }
  );
  counterObserver.observe(heroStats);
}

// ===== CONTACT FORM SUBMISSION (WEB3FORMS API) =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(contactForm);
  
  // Anti-Spam Honeypot Verification
  const honey = formData.get('_honey');
  if (honey) {
    // Silently drop bot submission
    showFormMessage('✅ Thank you! Your message has been sent successfully.', 'success');
    contactForm.reset();
    return;
  }

  // Basic Validation utilizing FormData
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();
  const service = formData.get('service');

  if (!name || !email || !message) {
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }

  if (!service) {
    showFormMessage('Please select a service you are interested in.', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }

  // UI State Loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span>Sending...</span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: rotate-border 1s linear infinite;"><circle cx="12" cy="12" r="10"/></svg>
  `;

  // Format Payload for Web3Forms Integration
  const payload = Object.fromEntries(formData);
  payload.subject = 'New Inquiry from Royal Havard Website';
  payload.from_name = name;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.status === 200) {
      showFormMessage(
        '✅ Thank you, ' + name + '! Your message has been sent successfully.',
        'success'
      );
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Form submission failed. Please check your Access Key.');
    }
  } catch (err) {
    console.error('Submission Error:', err);
    showFormMessage('❌ ' + err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      Send Message
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
    `;
  }
});

function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = 'form-message ' + type;
  setTimeout(() => {
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  }, 8000);
}

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--color-accent)';
      } else {
        link.style.color = '';
      }
    }
  });
});

// ===== PARALLAX SUBTLE EFFECT ON HERO =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg img');
  if (hero) {
    const scroll = window.scrollY;
    hero.style.transform = `translateY(${scroll * 0.3}px) scale(1.05)`;
  }
});