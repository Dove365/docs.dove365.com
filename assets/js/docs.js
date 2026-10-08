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
      '.stack-layer',
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

// Homepage persona explorer: tabs with arrow-key support. Without JS all panels stay readable
// because only the active one is hidden via the [hidden] attribute set in markup.
document.addEventListener('DOMContentLoaded', function () {
  const tabs = Array.from(document.querySelectorAll('.persona-tab'));
  if (!tabs.length) return;

  function activate(tab, focus) {
    tabs.forEach(function (t) {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activate(tab, false); });
    tab.addEventListener('keydown', function (e) {
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activate(next, true); }
    });
  });

  // Hero tiles jump straight to the matching persona tab.
  document.querySelectorAll('[data-persona]').forEach(function (link) {
    link.addEventListener('click', function () {
      const tab = document.getElementById('tab-' + link.dataset.persona);
      if (tab) activate(tab, false);
    });
  });
});

// Homepage: before/after ledger, flipped once automatically on first view, then by the visitor.
document.addEventListener('DOMContentLoaded', function () {
  const ledger = document.getElementById('ledger');
  if (ledger) {
    const buttons = Array.from(ledger.querySelectorAll('.ledger-btn'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let touched = false;

    function setState(state) {
      ledger.dataset.state = state;
      buttons.forEach(function (b) {
        const on = b.dataset.state === state;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    ledger.classList.add('is-interactive');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { touched = true; setState(b.dataset.state); });
    });

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        window.setTimeout(function () { if (!touched) setState('after'); }, 1400);
      }, { threshold: 0.6 });
      io.observe(ledger);
    }
  }

  // Mobile sticky CTA: appears once the hero is behind the visitor, hides while the closing CTA is on screen.
  const sticky = document.querySelector('.sticky-cta');
  const hero = document.querySelector('.hero');
  const book = document.getElementById('book');
  if (sticky && hero && 'IntersectionObserver' in window) {
    let heroGone = false;
    let bookVisible = false;
    function update() { sticky.classList.toggle('is-shown', heroGone && !bookVisible); }
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting; update(); }).observe(hero);
    if (book) new IntersectionObserver(function (e) { bookVisible = e[0].isIntersecting; update(); }).observe(book);
  }
});

// Carousels: scroll-snap tracks with auto-advance. Autoplay pauses on hover, focus and touch,
// stops when off-screen, and never starts for visitors who prefer reduced motion.
document.addEventListener('DOMContentLoaded', function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    const track = root.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const dotsHost = root.querySelector('[data-carousel-dots]');
    const interval = parseInt(root.dataset.interval, 10) || 6000;
    let timer = null;
    let userPaused = reduceMotion;
    let hovering = false;
    let visible = false;
    const dots = [];

    function step() {
      return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth;
    }
    function perView() { return Math.max(1, Math.round(track.clientWidth / step())); }
    function maxIndex() { return Math.max(0, items.length - perView()); }
    function index() { return Math.min(maxIndex(), Math.round(track.scrollLeft / step())); }
    function goTo(i) { track.scrollTo({ left: Math.max(0, Math.min(i, maxIndex())) * step(), behavior: reduceMotion ? 'auto' : 'smooth' }); }

    function buildDots() {
      dotsHost.innerHTML = '';
      dots.length = 0;
      for (let i = 0; i <= maxIndex(); i += 1) {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'carousel-dot';
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', function () { goTo(i); });
        dotsHost.appendChild(d);
        dots.push(d);
      }
      update();
    }
    function update() {
      const i = index();
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === i);
        if (n === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    function advance() { goTo(index() >= maxIndex() ? 0 : index() + 1); }

    function sync() {
      const shouldRun = !userPaused && !hovering && visible && !document.hidden;
      if (shouldRun && !timer) timer = window.setInterval(advance, interval);
      if (!shouldRun && timer) { window.clearInterval(timer); timer = null; }
    }


    root.addEventListener('mouseenter', function () { hovering = true; sync(); });
    root.addEventListener('mouseleave', function () { hovering = false; sync(); });
    root.addEventListener('focusin', function () { hovering = true; sync(); });
    root.addEventListener('focusout', function () { hovering = false; sync(); });
    root.addEventListener('touchstart', function () { hovering = true; sync(); }, { passive: true });
    root.addEventListener('touchend', function () { window.setTimeout(function () { hovering = false; sync(); }, 4000); }, { passive: true });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', buildDots);
    document.addEventListener('visibilitychange', sync);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; sync(); }, { threshold: 0.35 }).observe(root);
    } else {
      visible = true;
    }
    buildDots();
    sync();
  });
});

// Product screenshot viewer: tabs switch one large framed screenshot (arrow keys supported).
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-shots]').forEach(function (root) {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    function show(tab, focus) {
      tabs.forEach(function (t) {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { show(tab, false); });
      tab.addEventListener('keydown', function (e) {
        let next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); show(next, true); }
      });
    });
  });
});

// Click-to-play video poster: the iframe is only created when the visitor presses play.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-video]').forEach(function (box) {
    const btn = box.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const frame = document.createElement('iframe');
      frame.src = box.getAttribute('data-video');
      frame.title = btn.getAttribute('aria-label') || 'Video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.setAttribute('allowfullscreen', '');
      box.classList.add('is-playing');
      box.appendChild(frame);
      btn.remove();
    });
  });
});

// Step progress for multi-step forms: mirrors which step is active, without touching the form's own script.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-step-progress]').forEach(function (bar) {
    const form = document.querySelector(bar.getAttribute('data-step-progress'));
    if (!form) return;
    const steps = Array.from(form.querySelectorAll('.assessment-step'));
    const label = bar.querySelector('.as-progress-label');
    const count = bar.querySelector('.as-progress-count');
    const fill = bar.querySelector('.as-progress-fill');
    function update() {
      const index = Math.max(0, steps.findIndex(function (s) { return s.classList.contains('is-active'); }));
      const tag = steps[index] && steps[index].querySelector('.assessment-step-heading span');
      if (label && tag) label.textContent = tag.textContent;
      if (count) count.textContent = 'Step ' + (index + 1) + ' of ' + steps.length;
      if (fill) fill.style.width = (steps.length > 1 ? index / (steps.length - 1) * 100 : 0) + '%';
    }
    const observer = new MutationObserver(update);
    steps.forEach(function (step) { observer.observe(step, { attributes: true, attributeFilter: ['class'] }); });
    update();
  });
});

// "What are you trying to fix?": choose a problem to see the matching stories. Arrow keys move between problems.
document.addEventListener('DOMContentLoaded', function () {
  const root = document.querySelector('[data-case-chooser]');
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  function show(tab, focus) {
    tabs.forEach(function (t) {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    const heading = root.querySelector('[data-answers-title] strong');
    const label = tab.querySelector('.cs-need-text strong');
    if (heading && label) heading.textContent = '\u201c' + label.textContent + '\u201d';
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      show(tab, false);
      if (window.matchMedia('(max-width: 700px)').matches) {
        const target = root.querySelector('.cs-answers');
        if (target) window.setTimeout(function () { window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' }); }, 50);
      }
    });
    tab.addEventListener('keydown', function (e) {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); show(next, true); }
    });
  });
});
