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
   // closeHeaderMenu();
})


// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('.open-menu')) { openHeaderMenu() }
})

function openHeaderMenu() {
   document.body.classList.toggle('menu-is-open')
}
function closeHeaderMenu() {
   document.body.classList.remove('menu-is-open')
}


const CARD_SLIDERS = document.querySelectorAll('.card__slider');
if (CARD_SLIDERS.length > 0) {
   CARD_SLIDERS.forEach(element => {
      const images = element.querySelectorAll('img');
      const sections = element.querySelector('.card__sections');
      const pagination = element.querySelector('.card__pagination');
      if (images.length > 0) {
         images.forEach((e, index) => {
            if (index === 0) e.classList.add('active');
            e.dataset.ns = index;
            pagination.insertAdjacentHTML(
               'beforeend',
               `<span class="${index == 0 ? 'active' : ''}" data-ns="${index}"></span>`
            );
            sections.insertAdjacentHTML(
               'beforeend',
               `<div class="card__section" data-ns="${index}" ></div>`
            );
         })
      }
   })
   document.body.addEventListener('mouseover', (event) => {
      if (event.target.closest('.card__section')) {
         const section = event.target.closest('.card__section');
         const number = section.dataset.ns;
         if (!number) return;
         const slider = event.target.closest('.card__slider');
         if (!slider) return;
         const images = slider.querySelectorAll(`img`);
         if (images.length === 0) return;
         images.forEach(e => e.classList.toggle('active', e.dataset.ns === number));
         const pagination = slider.querySelectorAll('.card__pagination span');
         if (pagination.length === 0) return;
         pagination.forEach(e => e.classList.toggle('active', e.dataset.ns === number));
      }
   })

}
if (document.querySelector('.slider__body')) {
   const list = document.querySelectorAll('.slider__body');
   list.length > 0 && list.forEach(e => {
      const swiper = new Swiper(e, {
         allowTouchMove: true,
         spaceBetween: 10,
         speed: 300,
         slidesPerView: 3,
         grabCursor: true,
         // breakpoints: {
         //    1024: {
         //       spaceBetween: 20,
         //       slidesPerView: 3
         //    },
         //    768: {
         //       slidesPerView: 2
         //    }
         // },
         navigation: {
            nextEl: e.querySelector('.next'),
            prevEl: e.querySelector('.prev'),
         },
      });
   })
}



/* пример инициализации слайдера */
// if (document.querySelector('.swiper')) {
//    const swiper = new Swiper('.swiper', {
//       keyboard: {
//          enabled: true,
//          onlyInViewport: true,
//       },
//       allowTouchMove: false,
//       loop: true,
//       spaceBetween: 10,
//       speed: 300,
//       slidesPerView: 2.5,
//       slidesPerView: 'auto', // количаство слайдеров без авто ширины
//       grabCursor: true,
//       initialSlide: 2,
//       centeredSlides: true,
//       effect: "fade",
//       breakpoints: {
//          1024: {
//             spaceBetween: 20,
//             slidesPerView: 3
//          },
//          768: {
//             slidesPerView: 2
//          }
//       },
//       navigation: {
//          nextEl: ".next",
//          prevEl: ".prev",
//       },
//       pagination: {
//          el: '.pagination__body',
//          type: 'bullets',
//          type: 'fraction',
//          clickable: true,
//       },
//       scrollbar: {
//          el: ".projects__swiper-pagination",
//       },
//       autoplay: {
//          delay: 2000,
//       },
//       virtual: {
//          enabled: true,
//       },
//       freeMode: {
//          enabled: true,
//          momentum: false // Отключаем инерцию для точного позиционирования
//       },
//    });
// }




/* создание и ликвидация состояния слайдера в зависимости от ширины вьюпорта */
// if (document.querySelector('.swiper')) {
//    let swiperState;
//    let swiper;
//    changeStateSlider();
//    window.addEventListener('resize', () => {
//       changeStateSlider();
//    })
//    function initswiper() {
//       swiper = new Swiper('.swiper', {
//          keyboard: {
//             enabled: true,
//             onlyInViewport: true,
//          },
//          allowTouchMove: true,
//          loop: false,
//          speed: 300,
//          slidesPerView: 1.3,
//          spaceBetween: 24,
//       });
//    }
//    function changeStateSlider() {
//       if (!MIN768.matches) {
//          if (!swiperState) {
//             swiperState = true;
//             initswiper();
//          }
//       } else {
//          if (swiperState) {
//             swiperState = false;
//             swiper.destroy(true, true);
//          }
//       }
//    }
// }
