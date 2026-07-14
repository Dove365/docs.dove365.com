// Google Analytics with Consent Mode: detectable immediately, storage denied until Cookiebot statistics consent.
(function () {
  const GA_ID = 'G-4Z29XEN5FL';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  function hasStatisticsConsent() {
    return Boolean(window.Cookiebot && window.Cookiebot.consent && window.Cookiebot.consent.statistics);
  }

  function loadGoogleTag() {
    if (window.__dove365GoogleAnalyticsLoaded) return;
    window.__dove365GoogleAnalyticsLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
  }

  function updateGoogleConsent() {
    window.gtag('consent', 'update', {
      analytics_storage: hasStatisticsConsent() ? 'granted' : 'denied'
    });
  }

  window.addEventListener('CookiebotOnAccept', updateGoogleConsent);
  window.addEventListener('CookiebotOnDecline', updateGoogleConsent);
  window.addEventListener('CookiebotOnConsentReady', updateGoogleConsent);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadGoogleTag();
      updateGoogleConsent();
    });
  } else {
    loadGoogleTag();
    updateGoogleConsent();
  }
})();

// Highlight active nav link based on current page
document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const normalizedCurrentPage = currentPage.endsWith('.html') ? currentPage : `${currentPage}.html`;
  const navLinks = document.querySelectorAll('.nav-links a');
  const nav = document.querySelector('nav');
  const navToggle = document.querySelector('.nav-toggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disableScrollAnimations = document.body.classList.contains('no-scroll-animations');
  const isMobileViewport = window.matchMedia('(max-width: 900px)').matches;
  const isCompactViewport = window.matchMedia('(max-width: 1100px), (pointer: coarse)').matches;
  const canHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || href === normalizedCurrentPage) {
      link.style.color = 'var(--white)';
      link.style.background = 'rgba(255,255,255,0.06)';
    }
  });

  if (nav) {
    let scrollProgress = null;
    if (!disableScrollAnimations) {
      scrollProgress = document.createElement('div');
      scrollProgress.className = 'scroll-progress';
      scrollProgress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(scrollProgress);
    }

    function updateNavState() {
      const scrollY = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0;
      nav.classList.toggle('nav-scrolled', scrollY > 12);
      if (scrollProgress) scrollProgress.style.setProperty('--scroll-progress', progress);
    }

    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
  }

  if (!reduceMotion && !disableScrollAnimations) {
    const fadeSelectors = [
      '.page-offset > section',
      '.page-offset > .page-hero',
      '.section-tag',
      'h2.display',
      '.lead',
      '.pain-card',
      '.mini-offer-card',
      '.proof-stat',
      '.process-step',
      '.service-block',
      '.feature-item',
      '.scope-box',
      '.pricing-card',
      '.support-card',
      '.ai-flow-card',
      '.ai-service-card',
      '.ai-offer-card',
      '.case-card-full',
      '.about-photo-placeholder',
      '.about-content p',
      '.credential',
      '.value-card',
      '.ms-logo-card',
      '.contact-method',
      '.booking-embed',
      '.legal-content > *'
    ];
    const fadeItems = Array.from(document.querySelectorAll(fadeSelectors.join(',')))
      .filter(function (item, index, items) {
        return !item.closest('footer') && items.indexOf(item) === index;
      });

    fadeItems.forEach(function (item, index) {
      item.classList.add('scroll-fade');
      item.style.setProperty('--fade-delay', `${Math.min(index % 5, 4) * 24}ms`);
    });

    if (isCompactViewport) {
      fadeItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    } else if ('IntersectionObserver' in window) {
      const fadeObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 4% 0px' });

      fadeItems.forEach(function (item) {
        fadeObserver.observe(item);
      });
    } else {
      fadeItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    }

    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('pointermove', function (event) {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
        const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
        hero.style.setProperty('--pointer-x', x);
        hero.style.setProperty('--pointer-y', y);
      });

      hero.addEventListener('pointerleave', function () {
        hero.style.setProperty('--pointer-x', 0);
        hero.style.setProperty('--pointer-y', 0);
      });
    }

    if (canHoverFine && !isMobileViewport) {
      const mouseAura = document.createElement('div');
      mouseAura.className = 'mouse-aura';
      mouseAura.setAttribute('aria-hidden', 'true');
      document.body.appendChild(mouseAura);
      const auraTargets = document.querySelectorAll('.hero, .page-hero');

      let auraX = window.innerWidth / 2;
      let auraY = window.innerHeight / 2;
      let targetX = auraX;
      let targetY = auraY;

      function animateAura() {
        auraX += (targetX - auraX) * 0.16;
        auraY += (targetY - auraY) * 0.16;
        mouseAura.style.setProperty('--aura-x', `${auraX}px`);
        mouseAura.style.setProperty('--aura-y', `${auraY}px`);
        window.requestAnimationFrame(animateAura);
      }

      auraTargets.forEach(function (target) {
        target.addEventListener('pointermove', function (event) {
          targetX = event.clientX;
          targetY = event.clientY;
          mouseAura.classList.add('is-active');
        }, { passive: true });

        target.addEventListener('pointerleave', function () {
          mouseAura.classList.remove('is-active');
          mouseAura.classList.remove('is-over-target');
        });
      });

      document.querySelectorAll('.hero a, .hero button, .page-hero a, .page-hero button').forEach(function (item) {
        item.addEventListener('pointerenter', function () {
          mouseAura.classList.add('is-over-target');
        });

        item.addEventListener('pointerleave', function () {
          mouseAura.classList.remove('is-over-target');
        });
      });

      animateAura();
    }

    function createBurst(event, target) {
      const rect = target.getBoundingClientRect();
      const burst = document.createElement('span');
      burst.className = 'motion-burst';
      burst.setAttribute('aria-hidden', 'true');
      burst.style.left = `${event.clientX - rect.left}px`;
      burst.style.top = `${event.clientY - rect.top}px`;

      for (let i = 0; i < 10; i += 1) {
        const spark = document.createElement('span');
        const angle = (i / 10) * Math.PI * 2;
        const distance = 26 + ((i % 4) * 8);
        spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        spark.style.setProperty('--spark-delay', `${i * 16}ms`);
        burst.appendChild(spark);
      }

      target.appendChild(burst);
      window.setTimeout(function () {
        burst.remove();
      }, 760);
    }

    document.querySelectorAll('.case-card-full, .case-card-header h3, .hero h1, .page-hero h1, h2.display, .service-block h3, .pricing-card h3').forEach(function (item) {
      item.addEventListener('click', function (event) {
        createBurst(event, item);
      });
    });
  } else {
    document.body.classList.add('reduce-motion');
  }

  if (!nav || !navToggle) return;

  function closeMenu() {
    nav.classList.remove('nav-open');
    document.body.classList.remove('nav-lock');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  navToggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('nav-open');
    document.body.classList.toggle('nav-lock', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  // Mobile dropdown toggle — registered before closeMenu so stopImmediatePropagation
  // can prevent closeMenu from firing when a dropdown trigger is tapped.
  document.querySelectorAll('.nav-links .has-dropdown > a').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 980) {
        e.stopImmediatePropagation();
        e.preventDefault();
        const li = trigger.closest('.has-dropdown');
        const wasOpen = li.classList.contains('open');
        document.querySelectorAll('.nav-links .has-dropdown').forEach(function (el) {
          el.classList.remove('open');
        });
        if (!wasOpen) li.classList.add('open');
      }
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) closeMenu();
  });

  const lazyFrames = document.querySelectorAll('iframe[data-src]');

  function loadFrame(frame) {
    if (!frame || frame.src) return;
    frame.src = frame.dataset.src;
    frame.removeAttribute('data-src');
  }

  if (lazyFrames.length && 'IntersectionObserver' in window) {
    const frameObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        loadFrame(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '200px 0px' });

    lazyFrames.forEach(function (frame) {
      frameObserver.observe(frame);
    });
  } else {
    lazyFrames.forEach(loadFrame);
  }
});
