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
setUnderlineSwitchibgTabs(document.querySelector('.switching-tabs'))