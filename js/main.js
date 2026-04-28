/* ==========================================================================
   DXEL Network — Main JavaScript
   Version: 4.0
   Vanilla JS — No dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* ============================
     1. Preloader
     ============================ */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 400);
      }, 200); // Reduced delay for faster feel
    });

    // Fallback if load event takes too long
    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 400);
      }
    }, 3000);
  }

  /* ============================
     2. Navbar Scroll Effect
     ============================ */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const scrollThreshold = 50;

    function handleScroll() {
      if (window.scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load
  }

  /* ============================
     3. Mobile Menu Toggle
     ============================ */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close Button
    const closeBtn = document.querySelector('.mobile-nav-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

  }

  /* ============================
     4. Active Nav Link
     ============================ */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.navbar-links a, .mobile-nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop().split('#')[0] || 'index.html';

      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* ============================
     5. Smooth Scroll
     ============================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80; // Navbar height
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = target.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ============================
     6. Scroll Reveal Animations
     ============================ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px' // Using percentage for better responsiveness
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* ============================
     7. Animated Counter
     ============================ */
  function initCounter() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animateCount(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(start + (target - start) * eased);
        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ============================
     8. Rotating Text
     ============================ */
  function initRotatingText() {
    const el = document.querySelector('.rotating-text');
    if (!el) return;

    const words = (el.getAttribute('data-words') || '').split(',').map(w => w.trim()).filter(Boolean);
    if (!words.length) return;

    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
      const word = words[index];

      if (isDeleting) {
        currentText = word.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = word.substring(0, charIndex + 1);
        charIndex++;
      }

      el.textContent = currentText;

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === word.length) {
        speed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        index = (index + 1) % words.length;
        speed = 300;
      }

      setTimeout(type, speed);
    }

    type();
  }

  /* ============================
     9. Portfolio Filter
     ============================ */
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  /* ============================
     10. Project Modal / Lightbox
     ============================ */
  function initProjectModal() {
    const triggers = document.querySelectorAll('[data-modal]');
    const overlay = document.querySelector('.modal-overlay');
    if (!triggers.length || !overlay) return;

    const closeBtn = overlay.querySelector('.modal-close');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        const modalContent = document.querySelector(modalId);

        if (modalContent) {
          // Clone content into modal
          const body = overlay.querySelector('.modal-body');
          const image = overlay.querySelector('.modal-image img');

          if (body) body.innerHTML = modalContent.innerHTML;
          if (image && trigger.querySelector('img')) {
            image.src = trigger.querySelector('img').src;
          }

          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeModal() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /* ============================
     11. Accordion
     ============================ */
  function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    if (!items.length) return;

    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      if (!header || !body) return;

      // Set first item open
      if (item.classList.contains('active')) {
        body.style.maxHeight = body.scrollHeight + 'px';
      }

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        items.forEach(i => {
          i.classList.remove('active');
          const b = i.querySelector('.accordion-body');
          if (b) b.style.maxHeight = '0';
        });

        // Open clicked if it was closed
        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================
     12. Tabs
     ============================ */
  function initTabs() {
    const tabNavs = document.querySelectorAll('.tabs-nav');
    if (!tabNavs.length) return;

    tabNavs.forEach(nav => {
      const btns = nav.querySelectorAll('.tab-btn');
      const container = nav.closest('.tabs-container') || nav.parentElement;
      const panels = container.querySelectorAll('.tab-panel');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const target = container.querySelector(btn.getAttribute('data-tab'));
          if (target) target.classList.add('active');
        });
      });
    });
  }

  /* ============================
     13. Contact Form (AJAX + Validation)
     ============================ */
  function initContactForm() {
    const forms = document.querySelectorAll('[data-ajax-form]');
    if (!forms.length) return;

    const SHEET_URLS = {
      contactForm: 'https://script.google.com/macros/s/AKfycbydkMVw35Pq6lQLW03cZFCoYX9e91kt-Uj9pR_RbhH0PFNh8Tz8KlIsCIY1ofXy4B4/exec', // TODO: Add Contact Form Web App URL here
      callMeForm: 'https://script.google.com/macros/s/AKfycbzO-WeUYUdN5jVl1iK4ud4cjSaf6DdaM438zBwGbR2TSM7Bzol0AoT-564omGxTYOya/exec'   // TODO: Add Call Me Form Web App URL here
    };

    forms.forEach(form => {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Honeypot check
        const honeypot = form.querySelector('[name="website_url"]');
        if (honeypot && honeypot.value) return; // Bot detected

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        const actionUrl = form.getAttribute('action');

        // Basic validation
        const required = form.querySelectorAll('[required]');
        let isValid = true;

        required.forEach(field => {
          const errorEl = field.parentElement.querySelector('.form-error');
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--dxel-danger)';
            if (errorEl) errorEl.textContent = 'This field is required';
          } else {
            field.style.borderColor = '';
            if (errorEl) errorEl.textContent = '';
          }

          // Email validation
          if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
              isValid = false;
              field.style.borderColor = 'var(--dxel-danger)';
              if (errorEl) errorEl.textContent = 'Enter a valid email';
            }
          }
        });

        // Check checkbox
        const checkbox = form.querySelector('input[type="checkbox"][required]');
        if (checkbox && !checkbox.checked) {
          isValid = false;
          showToast('Please agree to the terms', 'error');
        }

        if (!isValid) return;

        // Submit
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'SENDING...';
        }

        try {
          const formData = new FormData(form);
          const response = await fetch(actionUrl, {
            method: 'POST',
            body: formData
          });

          const result = await response.text();
          const isSuccess = result.trim().toLowerCase() === 'success';

          // Simultaneous submission to Google Sheet
          const formId = form.id;
          if (formId && SHEET_URLS[formId]) {
            const sheetUrl = SHEET_URLS[formId];
            if (!sheetUrl.includes('YOUR_')) {
              try {
                // Send POST request without blocking the UI
                fetch(sheetUrl, { method: 'POST', body: formData }).catch(err => console.error('Sheet sync error:', err));
              } catch (sheetErr) {
                console.error('Google Sheet Submission failed', sheetErr);
              }
            }
          }

          if (isSuccess) {
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
          } else {
            showToast(result || 'Something went wrong. Please try again.', 'error');
          }
        } catch (error) {
          showToast('Network error. Please check your connection.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      });
    });
  }

  /* ============================
     14. Toast Notifications
     ============================ */
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  // Make globally accessible
  window.showToast = showToast;

  /* ============================
     15. Back to Top
     ============================ */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================
     16. Progress Bars Animation
     ============================ */
  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-width');
          entry.target.style.width = target + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  }

  /* ============================
     17. Testimonial Auto-Scroll
     ============================ */
  function initTestimonialScroll() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    let scrollInterval;
    let isPaused = false;

    function autoScroll() {
      scrollInterval = setInterval(() => {
        if (isPaused) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }, 4000);
    }

    track.addEventListener('mouseenter', () => { isPaused = true; });
    track.addEventListener('mouseleave', () => { isPaused = false; });
    track.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
    track.addEventListener('touchend', () => {
      setTimeout(() => { isPaused = false; }, 3000);
    });

    autoScroll();
  }

  /* ============================
     18. Year Auto-Update
     ============================ */
  function initYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ============================
     19. Testimonial Carousel Dots
     ============================ */
  function initCarouselDots() {
    const track = document.querySelector('.testimonials-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!track || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        const card = cards[i];
        track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    // Observe scroll to update dots
    track.addEventListener('scroll', () => {
      const scrollLeft = track.scrollLeft;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');

      cards.forEach((card, i) => {
        if (Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft) < card.offsetWidth / 2) {
          dots.forEach(d => d.classList.remove('active'));
          dots[i]?.classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* ============================
     INIT ALL
     ============================ */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavbar();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
    initScrollReveal();
    initCounter();
    initRotatingText();
    initPortfolioFilter();
    initProjectModal();
    initAccordion();
    initTabs();
    initContactForm();
    initBackToTop();
    initProgressBars();
    initTestimonialScroll();
    initYear();
    initCarouselDots();
  });

})();
