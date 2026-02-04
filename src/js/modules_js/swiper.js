if (document.querySelector('.slider__body')) {
   const list = document.querySelectorAll('.slider__shell');
   list.length > 0 && list.forEach(e => {
      const swiper = new Swiper(e.querySelector('.swiper'), {
         allowTouchMove: true,
         spaceBetween: 20,
         speed: 300,
         slidesPerView: 1.1,
         grabCursor: true,
         breakpoints: {
            1024: {
               spaceBetween: 10,
               slidesPerView: 3
            },
            768: {
               spaceBetween: 20,
               slidesPerView: 2
            }
         },
         navigation: {
            nextEl: e.querySelector('.next'),
            prevEl: e.querySelector('.prev'),
         },
      });
      const card_slider = e.querySelector('.card__slider');
      swiper.on('resize', function () { e.style.setProperty('--offset', card_slider.offsetHeight / 2 + 'px') })
   })
}



const introSwiperMain = document.querySelector('.intro__swiper-main');
const introSwiperText = document.querySelector('.intro__swiper-text');
const introSwiperSubtext = document.querySelector('.intro__swiper-subtext');
const navButtons = document.querySelectorAll('.intro__nav button');

if (introSwiperMain &&
   introSwiperText &&
   introSwiperSubtext &&
   navButtons) {

   const swiperText = new Swiper(introSwiperText, {
      allowTouchMove: false,
      loop: true,
      spaceBetween: 0,
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
         crossFade: true
      },
   });
   const swiperSubext = new Swiper(introSwiperSubtext, {
      allowTouchMove: false,
      loop: true,
      spaceBetween: 0,
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
         crossFade: true
      },
   });

   const swiperMain = new Swiper(introSwiperMain, {
      allowTouchMove: true,
      loop: true,
      spaceBetween: 0,
      speed: 700,
      slidesPerView: 1,
      autoplay: {
         delay: 4000,
      },
      controller: {
         control: [swiperText, swiperSubext]
      },
      on: {
         init: function () {
            initCustomPagination();
         },
         slideChange: function () {
            // updateActiveNav();
         }
      }
   });

   function initCustomPagination() {
      navButtons.forEach(button => {
         button.addEventListener('click', function (e) {
            e.preventDefault();
            const slideIndex = parseInt(this.getAttribute('data-index'));
            swiperMain.slideTo(slideIndex);
         });
      });
   }

   swiperMain.on('slideChange', () => {
      navButtons.forEach(e => {
         e.classList.toggle('active', e.dataset.index == swiperMain.realIndex)
      })
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


if (document.querySelector('.staps')) {
   const staps = document.querySelector('.staps .swiper');
   const pagination = document.querySelector('.staps__pagination');
   let swiperState;
   let swiper;
   changeStateSlider();
   window.addEventListener('resize', () => {
      changeStateSlider();
   })
   function initswiper() {
      swiper = new Swiper(staps, {
         allowTouchMove: true,
         loop: false,
         speed: 300,
         slidesPerView: 1,
         spaceBetween: 20,
         pagination: {
            el: pagination,
            type: 'bullets',
            clickable: true,
         },
      });
   }
   function changeStateSlider() {
      if (!MIN768.matches) {
         if (!swiperState) {
            swiperState = true;
            initswiper();
         }
      } else {
         if (swiperState) {
            swiperState = false;
            swiper.destroy(true, true);
         }
      }
   }
}

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
