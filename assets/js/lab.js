/* ════════════════════════════════════════════════════════════════
   Dove365 — lab.js
   Cutting-edge interaction layer. Dependency-free, performance-aware,
   accessibility-first. Loads alongside main.js; everything below is
   feature-detected by element presence, so a page only runs what it
   actually uses.

   Modules:
     1. NeuralField   — interactive neural-network canvas hero
     2. AIConsole     — live streaming "Dove365 Copilot" transcript
     3. scramble      — decrypt-style text reveal
     4. magnetic      — primary buttons drift toward the cursor
     5. spotlight     — cursor-tracking radial highlight on cards
     6. tilt          — subtle 3D parallax tilt on key panels
     7. countUp       — animate numbers when they enter view
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Brand palette (mirrors :root in style.css)
  const TEAL = [83, 177, 205];      // --teal-light
  const TEAL_DEEP = [7, 131, 150];  // --teal
  const GOLD = [232, 201, 122];     // --gold-light

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  const ready = (fn) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn, { once: true })
      : fn();

  /* ──────────────────────────────────────────────────────────────
     1. NEURAL FIELD
     A living constellation of neurons. Nodes drift, link to nearby
     neighbours (opacity by proximity), fire signal pulses along the
     synapses, and react to the cursor — which ignites a bright local
     cluster, the "thought" forming under your hand. Rendered with
     pre-baked glow sprites + additive blending for a premium look,
     and paused entirely when off-screen.
  ────────────────────────────────────────────────────────────────── */
  function makeGlowSprite(color, size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, rgba(color, 1));
    grad.addColorStop(0.25, rgba(color, 0.65));
    grad.addColorStop(0.55, rgba(color, 0.18));
    grad.addColorStop(1, rgba(color, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  }

  class NeuralField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });
      this.host = canvas.closest('[data-neural-host]') || canvas.parentElement;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.nodes = [];
      this.pulses = [];
      this.pointer = { x: -9999, y: -9999, active: false, gx: 0, gy: 0 };
      this.scrollFade = 1;
      this.running = false;
      this.last = 0;

      this.sprTeal = makeGlowSprite(TEAL, 64);
      this.sprGold = makeGlowSprite(GOLD, 64);

      this.resize();
      this.seed();

      window.addEventListener('resize', this._onResize = () => this.resize(), { passive: true });

      if (finePointer) {
        this.host.addEventListener('pointermove', (e) => {
          const r = this.canvas.getBoundingClientRect();
          this.pointer.x = e.clientX - r.left;
          this.pointer.y = e.clientY - r.top;
          this.pointer.active = true;
        }, { passive: true });
        this.host.addEventListener('pointerleave', () => { this.pointer.active = false; });
      }

      // Pause when scrolled away; keep cheap.
      if ('IntersectionObserver' in window) {
        this.io = new IntersectionObserver((entries) => {
          entries.forEach((en) => (en.isIntersecting ? this.start() : this.stop()));
        }, { threshold: 0 });
        this.io.observe(this.canvas);
      } else {
        this.start();
      }

      // Subtle parallax + fade as the hero scrolls out of view.
      window.addEventListener('scroll', this._onScroll = () => {
        const r = this.host.getBoundingClientRect();
        const p = clamp(-r.top / (r.height || 1), 0, 1);
        this.scrollFade = 1 - p * 0.85;
        this.parallax = p * 60;
      }, { passive: true });

      if (reduceMotion) { this.start(); this.stop(); this.renderStatic(); }
    }

    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.w = r.width; this.h = r.height;
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      // Density scales with area but is firmly capped for performance.
      const target = clamp(Math.round((this.w * this.h) / 17000), 18, this.w < 700 ? 30 : 64);
      this._target = target;
      if (this.nodes.length) {
        this.reseedCount();
        // reduced-motion has no loop, so repaint the single static frame
        if (reduceMotion) this.renderStatic();
      }
    }

    reseedCount() {
      while (this.nodes.length < this._target) this.nodes.push(this.makeNode());
      if (this.nodes.length > this._target) this.nodes.length = this._target;
    }

    makeNode() {
      return {
        x: rand(0, this.w), y: rand(0, this.h),
        vx: rand(-0.12, 0.12), vy: rand(-0.12, 0.12),
        r: rand(1.1, 2.6), energy: 0
      };
    }

    seed() {
      this.nodes = [];
      for (let i = 0; i < this._target; i++) this.nodes.push(this.makeNode());
    }

    start() {
      if (this.running || reduceMotion) return;
      this.running = true;
      this.last = performance.now();
      const loop = (t) => {
        if (!this.running) return;
        const dt = Math.min((t - this.last) / 16.67, 2.2);
        this.last = t;
        this.step(dt);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }

    stop() {
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
    }

    step(dt) {
      const { ctx, w, h, nodes } = this;
      const linkDist = this.w < 700 ? 118 : 168;
      const linkDist2 = linkDist * linkDist;

      // smooth the global pointer used for parallax-free cluster glow
      this.pointer.gx = lerp(this.pointer.gx, this.pointer.active ? this.pointer.x : w / 2, 0.08);
      this.pointer.gy = lerp(this.pointer.gy, this.pointer.active ? this.pointer.y : h / 2, 0.08);

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(0, -(this.parallax || 0));
      ctx.globalAlpha = this.scrollFade;

      // ── advance nodes ──
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;

        // cursor attraction + ignition
        if (this.pointer.active) {
          const dx = this.pointer.x - n.x, dy = this.pointer.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 44000) {
            const f = (1 - d2 / 44000);
            n.vx += (dx / Math.sqrt(d2 + 0.01)) * f * 0.06;
            n.vy += (dy / Math.sqrt(d2 + 0.01)) * f * 0.06;
            n.energy = Math.max(n.energy, f);
          }
        }
        // damping + decay
        n.vx *= 0.992; n.vy *= 0.992;
        n.vx = clamp(n.vx, -0.9, 0.9); n.vy = clamp(n.vy, -0.9, 0.9);
        n.energy *= 0.94;
      }

      // ── synapses ──
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist2) continue;
          const prox = 1 - Math.sqrt(d2) / linkDist;
          const heat = Math.max(a.energy, b.energy);
          const alpha = prox * (0.10 + heat * 0.5) * this.scrollFade;
          if (alpha < 0.012) continue;
          ctx.strokeStyle = heat > 0.15 ? rgba(GOLD, alpha) : rgba(TEAL, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // ── signal pulses travelling node→node ──
      if (this.pulses.length < (this.w < 700 ? 4 : 7) && Math.random() < 0.05 * dt) {
        const from = nodes[(Math.random() * nodes.length) | 0];
        // pick a near neighbour as the destination
        let to = null, best = linkDist2;
        for (let k = 0; k < nodes.length; k++) {
          const c = nodes[k];
          if (c === from) continue;
          const dx = c.x - from.x, dy = c.y - from.y, d2 = dx * dx + dy * dy;
          if (d2 < best && d2 > 200) { best = d2; to = c; }
        }
        if (to) this.pulses.push({ from, to, t: 0, sp: rand(0.012, 0.03), c: Math.random() < 0.4 ? GOLD : TEAL });
      }
      for (let i = this.pulses.length - 1; i >= 0; i--) {
        const p = this.pulses[i];
        p.t += p.sp * dt;
        if (p.t >= 1) { p.to.energy = Math.min(1, p.to.energy + 0.5); this.pulses.splice(i, 1); continue; }
        const px = lerp(p.from.x, p.to.x, p.t);
        const py = lerp(p.from.y, p.to.y, p.t);
        const spr = p.c === GOLD ? this.sprGold : this.sprTeal;
        const s = 16;
        ctx.globalAlpha = this.scrollFade * (0.6 + Math.sin(p.t * Math.PI) * 0.4);
        ctx.drawImage(spr, px - s / 2, py - s / 2, s, s);
        ctx.globalAlpha = this.scrollFade;
      }

      // ── nodes ──
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const glow = 10 + n.r * 4 + n.energy * 26;
        const spr = n.energy > 0.18 ? this.sprGold : this.sprTeal;
        ctx.globalAlpha = this.scrollFade * (0.5 + n.energy * 0.5);
        ctx.drawImage(spr, n.x - glow / 2, n.y - glow / 2, glow, glow);
      }
      ctx.globalAlpha = this.scrollFade;

      // crisp cores
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = rgba(n.energy > 0.18 ? GOLD : [210, 240, 248], 0.9 * this.scrollFade);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    renderStatic() {
      // single tasteful frame for reduced-motion users
      this.parallax = 0; this.scrollFade = 1;
      this.step(0);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     2. AI CONSOLE
     A looping, streaming "Dove365 Copilot" transcript. User prompts
     type in; the assistant fires governed tool-calls (Dataverse /
     SharePoint / Power Automate) that resolve from spinner → check,
     then streams a grounded answer token by token. Looks like a real
     product surface and reinforces the governance message.
  ────────────────────────────────────────────────────────────────── */
  const AI_SCRIPT = [
    {
      user: 'Summarise this week’s overdue cases and draft the follow-ups.',
      tools: ['Querying Dataverse · cases', 'Grounding on SharePoint SOPs'],
      reply: '7 cases are overdue across 3 owners. I’ve drafted follow-up emails grounded in your escalation SOP. Highest priority: Case #4821 — Dove365 Ltd, 4 days overdue. Want me to send them?'
    },
    {
      user: 'Which accounts look like churn risks this quarter?',
      tools: ['Analysing CRM engagement signals'],
      reply: '3 accounts show falling activity and slipping renewals. Aerose Property leads the list — no contact in 38 days against a 14-day cadence. I’ve queued a check-in task for the owner.'
    },
    {
      user: 'Explain our onboarding policy to a new starter.',
      tools: ['Searching knowledge base', 'Citing 2 documents'],
      reply: 'New starters complete identity setup, security training, and CRM access in their first 48 hours — steps 1–4 of the Onboarding SOP. I’ve linked the exact sections and the device checklist.'
    }
  ];

  class AIConsole {
    constructor(root) {
      this.root = root;
      this.feed = root.querySelector('[data-ai-feed]');
      this.caretHTML = '<span class="ai-caret"></span>';
      this.i = 0;
      if (reduceMotion) { this.renderStatic(); return; }
      // start once visible
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((es, ob) => {
          es.forEach((e) => { if (e.isIntersecting) { ob.disconnect(); this.run(); } });
        }, { threshold: 0.25 });
        io.observe(root);
      } else { this.run(); }
    }

    sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

    scrollEnd() { this.feed.scrollTop = this.feed.scrollHeight; }

    addRow(role) {
      const row = document.createElement('div');
      row.className = `ai-row ai-row-${role}`;
      const av = document.createElement('div');
      av.className = 'ai-avatar';
      av.textContent = role === 'user' ? 'You' : '✦';
      const bubble = document.createElement('div');
      bubble.className = 'ai-bubble';
      row.append(av, bubble);
      this.feed.appendChild(row);
      this.scrollEnd();
      return bubble;
    }

    async typeUser(bubble, text) {
      for (let k = 0; k <= text.length; k++) {
        bubble.innerHTML = text.slice(0, k) + this.caretHTML;
        this.scrollEnd();
        await this.sleep(18 + Math.random() * 26);
      }
      bubble.textContent = text;
    }

    async runTools(bubble, tools) {
      const wrap = document.createElement('div');
      wrap.className = 'ai-tools';
      bubble.appendChild(wrap);
      for (const label of tools) {
        const chip = document.createElement('span');
        chip.className = 'ai-tool';
        chip.innerHTML = `<span class="ai-tool-spin"></span><span>${label}</span>`;
        wrap.appendChild(chip);
        this.scrollEnd();
        await this.sleep(620 + Math.random() * 360);
        chip.classList.add('done');
        chip.querySelector('.ai-tool-spin').outerHTML = '<span class="ai-tool-check">✓</span>';
      }
      await this.sleep(260);
    }

    async streamReply(bubble, text) {
      const span = document.createElement('span');
      bubble.appendChild(span);
      const tokens = text.split(/(\s+)/); // keep whitespace tokens
      for (let k = 0; k < tokens.length; k++) {
        span.textContent += tokens[k];
        bubble.querySelector('.ai-caret')?.remove();
        span.insertAdjacentHTML('afterend', this.caretHTML);
        this.scrollEnd();
        await this.sleep(tokens[k].trim() ? 26 + Math.random() * 34 : 10);
      }
      bubble.querySelector('.ai-caret')?.remove();
    }

    async run() {
      while (true) {
        const turn = AI_SCRIPT[this.i % AI_SCRIPT.length];
        this.i++;

        const u = this.addRow('user');
        await this.typeUser(u, turn.user);
        await this.sleep(360);

        const a = this.addRow('assistant');
        await this.runTools(a, turn.tools);
        await this.streamReply(a, turn.reply);

        await this.sleep(3200);
        // fade the transcript out, then clear for the next exchange
        this.feed.classList.add('ai-feed-clear');
        await this.sleep(520);
        this.feed.innerHTML = '';
        this.feed.classList.remove('ai-feed-clear');
        await this.sleep(420);
      }
    }

    renderStatic() {
      const turn = AI_SCRIPT[0];
      const u = this.addRow('user'); u.textContent = turn.user;
      const a = this.addRow('assistant');
      const wrap = document.createElement('div');
      wrap.className = 'ai-tools';
      turn.tools.forEach((label) => {
        const chip = document.createElement('span');
        chip.className = 'ai-tool done';
        chip.innerHTML = `<span class="ai-tool-check">✓</span><span>${label}</span>`;
        wrap.appendChild(chip);
      });
      a.appendChild(wrap);
      a.insertAdjacentText('beforeend', turn.reply);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     2b. SHOWCASE
     A device-frame that auto-rotates through product screenshots and
     then reveals the live Copilot console — a "sleek switch" from the
     real apps to the AI on top of them. Tabs are clickable, an
     auto-advance progress bar tracks the dwell, it pauses on hover and
     when off-screen, and degrades to manual switching under
     reduced-motion. The AI slide hosts a regular AIConsole instance.
  ────────────────────────────────────────────────────────────────── */
  class Showcase {
    constructor(root) {
      this.root = root;
      this.slides = Array.from(root.querySelectorAll('[data-slide]'));
      this.tabs = Array.from(root.querySelectorAll('[data-slide-tab]'));
      this.fill = root.querySelector('[data-showcase-fill]');
      this.i = 0;
      this.visible = false;
      this.paused = false;
      this.timer = null;
      if (!this.slides.length) return;

      this.show(0);

      this.tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => this.go(idx));
      });

      if (reduceMotion) return; // manual switching only

      this.root.addEventListener('pointerenter', () => { this.paused = true; this.clear(); this.pauseFill(); });
      this.root.addEventListener('pointerleave', () => { this.paused = false; this.schedule(); this.resumeFill(); });

      if ('IntersectionObserver' in window) {
        this.io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            this.visible = en.isIntersecting;
            if (en.isIntersecting && !this.paused) this.schedule();
            else this.clear();
          });
        }, { threshold: 0.2 });
        this.io.observe(this.root);
      } else {
        this.visible = true;
        this.schedule();
      }
    }

    dwell(i) { return parseInt(this.slides[i].getAttribute('data-dwell'), 10) || 3600; }

    show(idx) {
      this.i = idx;
      this.slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      this.tabs.forEach((t, k) => {
        t.classList.toggle('is-active', k === idx);
        t.setAttribute('aria-selected', k === idx ? 'true' : 'false');
      });
      this.runFill(this.dwell(idx));
    }

    go(idx) {            // manual (tab click)
      this.clear();
      this.show(idx);
      if (!reduceMotion && this.visible && !this.paused) this.schedule();
    }

    next() { this.show((this.i + 1) % this.slides.length); this.schedule(); }

    schedule() {
      this.clear();
      if (reduceMotion || !this.visible || this.paused) return;
      this.timer = setTimeout(() => this.next(), this.dwell(this.i));
    }

    clear() { if (this.timer) { clearTimeout(this.timer); this.timer = null; } }

    runFill(ms) {
      if (!this.fill || reduceMotion) return;
      this.fill.style.animation = 'none';
      void this.fill.offsetWidth;            // force reflow to restart
      this.fill.style.animation = `showcaseFill ${ms}ms linear forwards`;
      this.fill.style.animationPlayState = this.paused ? 'paused' : 'running';
    }
    pauseFill() { if (this.fill) this.fill.style.animationPlayState = 'paused'; }
    resumeFill() { if (this.fill) this.fill.style.animationPlayState = 'running'; }
  }

  /* ──────────────────────────────────────────────────────────────
     3. SCRAMBLE — decrypt-style reveal for headline lines
  ────────────────────────────────────────────────────────────────── */
  function scramble(el) {
    const finalText = el.getAttribute('data-scramble') || el.textContent;
    if (reduceMotion) { el.textContent = finalText; return; }
    const glyphs = '01<>/{}[]#$%&*+=ABCDEFGHJKLMNPRSTUVWXYZ';
    let frame = 0;
    const total = finalText.length;
    const start = performance.now();
    const dur = 70 * total + 360;
    el.classList.add('is-scrambling');
    const tick = (now) => {
      const t = clamp((now - start) / dur, 0, 1);
      const revealed = Math.floor(t * total);
      let out = '';
      for (let i = 0; i < total; i++) {
        const ch = finalText[i];
        if (ch === ' ') { out += ' '; continue; }
        out += i < revealed ? ch : glyphs[(Math.random() * glyphs.length) | 0];
      }
      el.textContent = out;
      frame++;
      if (t < 1) requestAnimationFrame(tick);
      else { el.textContent = finalText; el.classList.remove('is-scrambling'); }
    };
    requestAnimationFrame(tick);
  }

  /* ──────────────────────────────────────────────────────────────
     4. MAGNETIC — opt-in elements lean toward the cursor
  ────────────────────────────────────────────────────────────────── */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = el.classList.contains('nav-cta') ? 0.18 : 0.32;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ──────────────────────────────────────────────────────────────
     5. SPOTLIGHT — a soft light tracks the cursor across cards
  ────────────────────────────────────────────────────────────────── */
  function initSpotlight() {
    if (!finePointer) return;
    const sel = '.ai-service-card, .ai-offer-card, .value-card, .pain-card, .docs-product-card, .docs-guide-card, [data-spotlight]';
    document.querySelectorAll(sel).forEach((card) => {
      card.classList.add('has-spotlight');
      // Dedicated out-of-flow overlay — avoids clashing with cards that
      // already use ::before/::after, and stays clear of grid/flex flow.
      const layer = document.createElement('span');
      layer.className = 'card-spotlight';
      layer.setAttribute('aria-hidden', 'true');
      card.appendChild(layer);
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ──────────────────────────────────────────────────────────────
     6. TILT — gentle 3D parallax on flagship panels
  ────────────────────────────────────────────────────────────────── */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.getAttribute('data-tilt')) || 6;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ──────────────────────────────────────────────────────────────
     7. COUNT-UP — numbers animate when scrolled into view
  ────────────────────────────────────────────────────────────────── */
  function initCountUp() {
    const items = document.querySelectorAll('[data-countup]');
    if (!items.length) return;
    const run = (el) => {
      const target = parseFloat(el.getAttribute('data-countup'));
      const dec = (el.getAttribute('data-countup').split('.')[1] || '').length;
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = prefix + target.toFixed(dec) + suffix; return; }
      const dur = 1400, start = performance.now();
      const tick = (now) => {
        const t = clamp((now - start) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + (target * eased).toFixed(dec) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es, ob) => {
        es.forEach((e) => { if (e.isIntersecting) { run(e.target); ob.unobserve(e.target); } });
      }, { threshold: 0.5 });
      items.forEach((el) => io.observe(el));
    } else {
      items.forEach(run);
    }
  }

  /* ── boot ── */
  ready(function () {
    const canvas = document.querySelector('[data-neural]');
    if (canvas) new NeuralField(canvas);

    document.querySelectorAll('[data-ai-console]').forEach((el) => new AIConsole(el));
    document.querySelectorAll('[data-showcase]').forEach((el) => new Showcase(el));

    const scrambleEls = document.querySelectorAll('[data-scramble]');
    scrambleEls.forEach((el, i) => setTimeout(() => scramble(el), 180 + i * 220));

    initMagnetic();
    initSpotlight();
    initTilt();
    initCountUp();
  });
})();
