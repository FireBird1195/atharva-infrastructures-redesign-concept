// Atharva Infrastructures — redesign concept. No dependencies, no network calls.
(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');

  // Company images are fetched locally and not committed. If one is absent, show a labelled placeholder.
  document.querySelectorAll('.media img, .brand__mark').forEach((img) => {
    const mark = () => (img.closest('.media') || img).classList.add('is-missing');
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener('error', mark, { once: true });
  });

  // Mobile navigation
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { close(); toggle.focus(); } });
  }

  // Accessible tabs (project register and floor plans)
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      if (list.dataset.scroll !== undefined && list.scrollWidth > list.clientWidth) list.scrollLeft = tab.parentElement.offsetLeft - list.clientWidth / 2 + tab.parentElement.offsetWidth / 2;
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const horizontal = list.getAttribute('aria-orientation') !== 'vertical';
        const next = horizontal ? 'ArrowRight' : 'ArrowDown';
        const prev = horizontal ? 'ArrowLeft' : 'ArrowUp';
        let j = null;
        if (e.key === next) j = (i + 1) % tabs.length;
        if (e.key === prev) j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
    // Deep link: #nagari-v selects that project tab
    const hashTab = tabs.find((t) => location.hash && t.dataset.hash === location.hash.slice(1));
    window.addEventListener('hashchange', () => { const t = tabs.find((x) => x.dataset.hash === location.hash.slice(1)); if (t) select(t); });
    select(hashTab || tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  });
  document.querySelectorAll('[data-select-tab]').forEach((a) => {
    a.addEventListener('click', () => {
      const tab = document.getElementById(a.dataset.selectTab);
      if (tab) tab.click();
    });
  });

  // Prefill enquiry from "Enquire about this layout" buttons
  document.querySelectorAll('[data-enquire]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [config, intent] = btn.dataset.enquire.split('|');
      const sel = document.getElementById('f-config');
      if (sel && config) sel.value = config;
      if (intent) { const r = document.querySelector(`input[name="intent"][value="${intent}"]`); if (r) r.checked = true; }
      setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), 450);
    });
  });

  // Lightbox (native <dialog>)
  const dialog = document.querySelector('.lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    const img = dialog.querySelector('img');
    const cap = dialog.querySelector('.lightbox__cap');
    const items = [...document.querySelectorAll('[data-lightbox]')];
    let index = 0;
    const show = (i) => {
      index = (i + items.length) % items.length;
      const src = items[index].querySelector('img');
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      cap.textContent = `${index + 1} / ${items.length} — ${items[index].dataset.lightbox}`;
    };
    items.forEach((b, i) => b.addEventListener('click', () => { show(i); dialog.showModal(); }));
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
    dialog.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
    dialog.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(index + 1); if (e.key === 'ArrowLeft') show(index - 1); });
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  }

  // Enquiry form: validation and a local confirmation. Nothing is sent or stored.
  const form = document.getElementById('enquiry-form');
  if (form) {
    const rules = {
      name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
      phone: (v) => (/^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim()) ? '' : 'Please enter a 10-digit Indian mobile number.'),
      email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please check the email address, or leave it blank.'),
      project: (v) => (v ? '' : 'Please choose a project.'),
    };
    const check = (field) => {
      const rule = rules[field.name];
      if (!rule) return true;
      const msg = rule(field.value);
      const err = document.getElementById(`${field.id}-error`);
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };
    form.querySelectorAll('input, select').forEach((f) => {
      f.addEventListener('blur', () => { if (f.value) check(f); });
      f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') check(f); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('[name]')].filter((f) => rules[f.name]);
      const bad = fields.filter((f) => !check(f));
      if (bad.length) { bad[0].focus(); return; }
      const name = form.elements.name.value.trim().split(/\s+/)[0];
      const intent = form.elements.intent.value;
      const project = form.elements.project.selectedOptions[0].text;
      form.reset();
      const box = document.getElementById('enquiry-confirm');
      box.querySelector('[data-confirm-title]').textContent = `Thank you, ${name}.`;
      box.querySelector('[data-confirm-body]').textContent =
        intent === 'visit'
          ? `On the live site, Atharva's sales team would now call to fix a site-visit time for ${project}.`
          : `On the live site, Atharva's sales team would now call with details of ${project}.`;
      form.hidden = true;
      box.hidden = false;
      box.focus();
    });
    document.querySelector('[data-confirm-reset]')?.addEventListener('click', () => {
      document.getElementById('enquiry-confirm').hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }

  // Quiet reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add('is-in'));
})();
