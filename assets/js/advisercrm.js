(function () {
  'use strict';

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function initReveal() {
    var items = document.querySelectorAll('[data-acr-reveal]');
    if (!items.length) return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, activeObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (item) { observer.observe(item); });
  }

  function initNavigation() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('#primary-navigation');
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeNav();
    });
  }


  function initBackToTop() {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'acr-back-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    button.innerHTML = '<span aria-hidden="true">↑</span>';
    document.body.appendChild(button);

    function updateVisibility() {
      button.classList.toggle('is-visible', window.scrollY > 500);
    }

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }


  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-acr-current-year]').forEach(function (item) {
      item.textContent = year;
    });
  }

  onReady(function () {
    initReveal();
    initNavigation();
    initYear();
    initBackToTop();
  });
})();

// Adviser CRM product screenshot lightbox
(function () {
  'use strict';
  function ready(fn){ if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{once:true});}else{fn();} }
  ready(function(){
    // Automatically make every Adviser CRM product/mobile screenshot zoomable.
    // Existing purpose-built screenshot buttons are left intact.
    document.querySelectorAll('img[src*="/assets/images/screenshots/"], img[src*="/assets/images/mobile/"]').forEach(function(img){
      if(img.closest('[data-lightbox-src]')) return;
      var trigger=img.closest('.screenshot-trigger');
      if(!trigger){
        trigger=img.parentElement;
        if(!trigger || trigger.tagName==='A' || trigger.tagName==='BUTTON') return;
        trigger.classList.add('screenshot-trigger');
      }
      if(!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex','0');
      if(!trigger.hasAttribute('role')) trigger.setAttribute('role','button');
      var label=img.alt || 'Adviser CRM screenshot';
      if(!trigger.hasAttribute('data-lightbox-title')) trigger.setAttribute('data-lightbox-title',label);
      if(!trigger.hasAttribute('aria-label')) trigger.setAttribute('aria-label','Open '+label+' at full size');
      trigger.setAttribute('title','Click to view full size');
    });

    var modal=document.getElementById('screenshot-lightbox');
    if(!modal){
      modal=document.createElement('div');
      modal.id='screenshot-lightbox';
      modal.className='screenshot-lightbox';
      modal.setAttribute('aria-hidden','true');
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      modal.setAttribute('aria-label','Product screenshot viewer');
      modal.innerHTML='<button aria-label="Close screenshot" class="screenshot-lightbox__close" type="button">&times;</button><div class="screenshot-lightbox__panel"><div class="screenshot-lightbox__header"><strong></strong><span>100% product view</span></div><div class="screenshot-lightbox__canvas"><img alt="" src=""/></div><p>Scroll to explore the full-size screenshot. Use your browser zoom controls for an even closer look.</p></div>';
      document.body.appendChild(modal);
    }
    var image=modal.querySelector('.screenshot-lightbox__canvas img');
    var title=modal.querySelector('.screenshot-lightbox__header strong');
    var closeButton=modal.querySelector('.screenshot-lightbox__close');
    var lastTrigger=null;
    function open(src,label,trigger){
      lastTrigger=trigger||null;
      image.src=src;
      image.alt=label+' full-size screenshot';
      title.textContent=label;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden','false');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    }
    function close(){
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('lightbox-open');
      image.src='';
      if(lastTrigger) lastTrigger.focus();
    }
    document.querySelectorAll('[data-lightbox-src]').forEach(function(trigger){
      trigger.addEventListener('click',function(){open(trigger.getAttribute('data-lightbox-src'),trigger.getAttribute('data-lightbox-title')||'Adviser CRM',trigger);});
    });
    document.querySelectorAll('.screenshot-trigger').forEach(function(trigger){
      function show(){var img=trigger.querySelector('img');if(img) open(img.getAttribute('src'),trigger.getAttribute('data-lightbox-title')||img.alt||'Adviser CRM',trigger);}
      trigger.addEventListener('click',show);
      trigger.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}});
    });
    closeButton.addEventListener('click',close);
    modal.addEventListener('click',function(e){if(e.target===modal) close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('is-open')) close();});
  });
})();
