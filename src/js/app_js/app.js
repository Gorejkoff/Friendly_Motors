"use strict"

// window.addEventListener('load', (event) => {});

// desktop or mobile (mouse or touchscreen)
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

// media queries
const MIN1024 = window.matchMedia('(min-width: 1024px)');
const MIN768 = window.matchMedia('(min-width: 768px)');

// variables
const HEADER = document.getElementById('header');



function throttle(callee, timeout) {
   let timer = null;
   return function perform(...args) {
      if (timer) return;
      timer = setTimeout(() => {
         callee(...args);
         clearTimeout(timer);
         timer = null;
      }, timeout)
   }
}

/* запись переменных высоты элементов */
function addHeightVariable() {
   if (typeof HEADER !== "undefined") {
      document.body.style.setProperty('--height-header', `${HEADER.offsetHeight}px`)
   }
}
addHeightVariable();


// ** ======================= RESIZE ======================  ** //
window.addEventListener('resize', () => {
   addHeightVariable();
   closeMobileMenu();
})


// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('.open-mobile-menu')) { openMobileMenu() }
   if (event.target.closest('.close-mobile-menu')) { closeMobileMenu() }
   if (event.target.closest('.switching-tabs')) { setUnderlineSwitchibgTabs(event.target.closest('.switching-tabs')) }
   // в "оставить заявку" показать "Заявка успешно отправлена!"
   if (event.target.closest('.form__button-sent')) {
      const sentItem = document.querySelector('.form__sent');
      if (sentItem) { sentItem.classList.add('visible') }
   }
   // в "оставить заявку" скрыть "Заявка успешно отправлена!"
   if (event.target.closest('.form__sent-close')) {
      const sentItem = document.querySelector('.form__sent');
      if (sentItem) { sentItem.classList.remove('visible') }
   }
   // переключение блоков banner-offer
   if (event.target.closest('.banner-offer__button-action')) {
      const action = document.querySelector('.banner-offer__action');
      const form = document.querySelector('.banner-offer__form');
      const close = document.querySelector('.banner-offer__close');
      if (action && form && close) {
         action.classList.add('hide');
         form.classList.remove('hide');
         close.classList.add('hide');
      }
   }
   if (event.target.closest('.banner-offer__button-sent')) {
      const action = document.querySelector('.banner-offer__action');
      const form = document.querySelector('.banner-offer__form');
      const close = document.querySelector('.banner-offer__close');
      if (action && form && close) {
         action.classList.add('hide');
         form.classList.add('hide');
         close.classList.remove('hide');
      }
   }
   if (event.target.closest('.banner-offer__button-close')) {
      const action = document.querySelector('.banner-offer__action');
      const form = document.querySelector('.banner-offer__form');
      const close = document.querySelector('.banner-offer__close');
      if (action && form && close) {
         action.classList.remove('hide');
         form.classList.add('hide');
         close.classList.add('hide');
      }
   }

   // включает событие pointer-events, смена цвета шрифта #filter-model, #filter-brand
   if (event.target.closest('#filter-brand .js-data-get')) {
      const filter_model = document.querySelector('#filter-model');
      const filter_brand = document.querySelector('#filter-brand');
      if (filter_brand) filter_brand.classList.remove('choice-not-made');
      if (filter_model) filter_model.classList.remove('disabled');
   }
   if (event.target.closest('#filter-model .js-data-get')) {
      const filter_model = document.querySelector('#filter-model');
      if (filter_model) filter_model.classList.remove('choice-not-made');
   }
   if (event.target.closest('.filter__open')) {
      const filter = document.getElementById('filter');
      console.log(filter);
      if (filter) {
         filter.classList.add('filter-visible');
      }
   }
})

function openMobileMenu() {
   document.body.classList.toggle('mobile-menu-is-open')
}
function closeMobileMenu() {
   document.body.classList.remove('mobile-menu-is-open')
}

// метка активной страницы в меню мобильного
if (!MIN1024.matches) {
   const MOBILE_MENU_LINKS = document.querySelectorAll('.mobile-menu__link');
   if (MOBILE_MENU_LINKS.length > 0) {
      const path = window.location.href;
      MOBILE_MENU_LINKS.forEach(e => {
         e.classList.toggle('link-active', path == e.href)
      })
   }
}

function setUnderlineSwitchibgTabs(target) {
   const activeButton = target.querySelector('.active');
   const offset = activeButton.offsetLeft;
   const width = activeButton.offsetWidth;
   target.style.setProperty('--offset-left', offset + 'px')
   target.style.setProperty('--width-line', width + 'px')
}
if (document.querySelector('.switching-tabs')) {
   setUnderlineSwitchibgTabs(document.querySelector('.switching-tabs'))
}

let lastWidth = window.innerWidth;
function setVH() {
   const h = document.body.offsetHeight;
   document.body.style.setProperty('--vh', h + 'px');
}
if (!MIN1024.matches) {
   setVH();
}
window.addEventListener('resize', () => {
   const currentWidth = window.innerWidth;
   if (!MIN1024.matches && currentWidth !== lastWidth) {
      setVH()
   }
   lastWidth = window.innerWidth;
})
