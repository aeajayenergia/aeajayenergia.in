/* ==========================================================================
   AeaJay Energia - site behaviour
   Mobile nav, sticky header, FAQ accordion, form handling, scroll reveal
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Current year in the footer
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Sticky header state
     ------------------------------------------------------------------ */
  var header = document.getElementById('site-header');

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function toggleNav() {
    if (!nav || !navToggle) return;
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', toggleNav);

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ------------------------------------------------------------------
     FAQ accordion
     ------------------------------------------------------------------ */
  var triggers = document.querySelectorAll('.acc-trigger');

  Array.prototype.forEach.call(triggers, function (trigger) {
    var panel = trigger.nextElementSibling;
    if (!panel) return;

    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      /* Close every panel first so only one is open at a time */
      Array.prototype.forEach.call(triggers, function (t) {
        t.setAttribute('aria-expanded', 'false');
        if (t.nextElementSibling) t.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* Recalculate open panel height if the window resizes and text reflows */
  window.addEventListener('resize', function () {
    Array.prototype.forEach.call(triggers, function (t) {
      if (t.getAttribute('aria-expanded') === 'true' && t.nextElementSibling) {
        t.nextElementSibling.style.maxHeight = t.nextElementSibling.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------ */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');

  function setError(field, message) {
    var span = document.querySelector('.error[data-for="' + field.id + '"]');
    if (span) span.textContent = message || '';
    if (message) {
      field.classList.add('invalid');
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('invalid');
      field.removeAttribute('aria-invalid');
    }
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function validPhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13;
  }

  function validateForm() {
    if (!form) return false;
    var ok = true;

    var name = form.querySelector('#f-name');
    var phone = form.querySelector('#f-phone');
    var email = form.querySelector('#f-email');
    var location = form.querySelector('#f-location');

    if (!name.value.trim()) {
      setError(name, 'Enter your name');
      ok = false;
    } else {
      setError(name, '');
    }

    if (!phone.value.trim()) {
      setError(phone, 'Enter a phone number we can reach you on');
      ok = false;
    } else if (!validPhone(phone.value)) {
      setError(phone, 'That does not look like a valid phone number');
      ok = false;
    } else {
      setError(phone, '');
    }

    if (email.value.trim() && !validEmail(email.value.trim())) {
      setError(email, 'That does not look like a valid email address');
      ok = false;
    } else {
      setError(email, '');
    }

    if (!location.value.trim()) {
      setError(location, 'Tell us the town or district');
      ok = false;
    } else {
      setError(location, '');
    }

    return ok;
  }

  if (form) {
    /* Clear an error as soon as the person starts fixing it */
    Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function (el) {
      el.addEventListener('input', function () {
        if (el.classList.contains('invalid')) setError(el, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (status) {
        status.textContent = '';
        status.className = 'form-status';
      }

      if (!validateForm()) {
        var firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var action = form.getAttribute('action') || '';

      /* Guard against submitting to the unconfigured placeholder endpoint */
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        if (status) {
          status.textContent = 'Form endpoint is not configured yet. Add your Formspree form ID to the form action in index.html.';
          status.className = 'form-status err';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending';
      }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) {
              status.textContent = 'Thanks. We have your details and will get back to you shortly.';
              status.className = 'form-status ok';
            }
          } else {
            return res.json().then(function (data) {
              throw new Error(data && data.error ? data.error : 'Submission failed');
            });
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = 'Something went wrong sending that. Call us on +91 88913 69913 or email aeajayenergysolutions@gmail.com.';
            status.className = 'form-status err';
          }
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request free consultation';
          }
        });
    });
  }

  /* ------------------------------------------------------------------
     Scroll reveal
     Applied only when the browser supports IntersectionObserver and the
     person has not asked for reduced motion.
     ------------------------------------------------------------------ */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReduced) {
    var targets = document.querySelectorAll(
      '.row-text, .row-media, .calc, .approach-text, .approach-media, .pillars li, .step, .voice, .acc-item, .contact-form-wrap'
    );

    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
  }

})();
