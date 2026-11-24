/* Shared UI localization. Original tool data and scripts are not translated. */
(() => {
  'use strict';
  const base = new URL('./locales/', document.currentScript.src);
  const languages = ['en', 'nl', 'hi'];
  const storageKey = 'fiberklaar-diy.language';
  let language = 'en', messages = {}, fallback = {}, sourceKeys = {};
  let generation = 0;
  const entries = [];
  const cache = new Map();
  function readLanguage() {
    try { return localStorage.getItem(storageKey) || 'en'; } catch { return 'en'; }
  }
  function load(name) {
    if (!cache.has(name)) cache.set(name, fetch(new URL(name + '.json', base)).then(r => {
      if (!r.ok) throw new Error('Cannot load locale: ' + name);
      return r.json();
    }).catch(error => { cache.delete(name); throw error; }));
    return cache.get(name);
  }
  function t(key, params = {}) {
    return (messages[key] ?? fallback[key] ?? key).replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name]) : match);
  }
  function capture() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode, parent = node.parentElement;
      if (!parent || parent.closest('script,style,svg,textarea,code,pre,noscript,template,[data-no-i18n],.diy-language')) continue;
      if (parent.closest('option:not([value])')) continue;
      const key = sourceKeys[node.data.trim()];
      if (typeof key === 'string') entries.push({node, key, original:node.data, last:node.data});
    }
    for (const node of document.querySelectorAll('[title],[aria-label],[placeholder]')) {
      if (node.closest('[data-no-i18n],.diy-language')) continue;
      for (const attr of ['title','aria-label','placeholder']) {
        const original = node.getAttribute(attr);
        const key = original && sourceKeys[original.trim()];
        if (typeof key === 'string') entries.push({node, attr, key, original, last:original});
      }
    }
    const key = sourceKeys[document.title.trim()];
    if (typeof key === 'string') entries.push({node:document, attr:'title', key, original:document.title,last:document.title});
  }
  function render() {
    for (const e of entries) {
      const current = e.node === document ? document.title : e.attr ? e.node.getAttribute(e.attr) : e.node.data;
      // Never overwrite text that a tool has since updated itself.
      if (current !== e.last) continue;
      const next = e.original.replace(/\S(?:[\s\S]*\S)?/, () => t(e.key));
      if (e.node === document) document.title = next;
      else if (e.attr) e.node.setAttribute(e.attr,next);
      else e.node.data = next;
      e.last = next;
    }
  }
  let selector;
  async function setLanguage(next) {
    if (!languages.includes(next)) next = 'en';
    const request = ++generation;
    try {
      const data = await load(next);
      if (request !== generation) return;
      messages = data; language = next;
      render();
      document.documentElement.lang = next;
      if (selector) selector.value = next;
      try { localStorage.setItem(storageKey, next); } catch {}
      document.dispatchEvent(new CustomEvent('diy:languagechange', {detail:{language:next}}));
    } catch (error) {
      console.error('Language switch failed', error);
      if (selector) selector.value = language;
    }
  }
  async function init() {
    try {
      [sourceKeys, fallback] = await Promise.all([load('source-keys'),load('en')]);
      capture();
      const host = document.querySelector('.lb-meta') || document.querySelector('.lb-wrap') || document.body;
      selector = document.createElement('select');
      selector.className = 'diy-language';
      selector.setAttribute('aria-label','Language / Taal / भाषा');
      for (const [value,label] of [['en','English'],['nl','Nederlands'],['hi','हिन्दी']]) {
        const option = document.createElement('option'); option.value=value; option.textContent=label; selector.append(option);
      }
      host.prepend(selector);
      selector.addEventListener('change', () => setLanguage(selector.value));
      await setLanguage(readLanguage());
    } catch(error) { console.error('Localization initialization failed', error); }
  }
  window.DIYI18n = {t,setLanguage,get language(){return language;}};
  const style=document.createElement('style');
  style.textContent='.diy-language{font:inherit;font-size:13px;line-height:1.4;max-width:125px;padding:5px 7px;border:1px solid currentColor;border-radius:5px;background:transparent;color:inherit;cursor:pointer;color-scheme:light dark}.diy-language option{background:Canvas;color:CanvasText}.diy-language:focus-visible{outline:2px solid currentColor;outline-offset:2px}';
  document.head.append(style);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
