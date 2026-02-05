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

// перемещение блоков при адаптиве
// data-da=".class,3,768,min" 
// класс родителя куда перемещать
// порядковый номер в блоке куда перемещается начиная с 0 как индексы массива
// viewport
// min = min-width, max = max-width
// два перемещения: data-da=".class,3,768,min,.class2,1,1024,max"
const ARRAY_DATA_DA = document.querySelectorAll('[data-da]');
ARRAY_DATA_DA.forEach(function (e) {
   const dataArray = e.dataset.da.split(',');
   const addressMove = searchDestination(e, dataArray[0]);
   const addressMoveSecond = dataArray[4] && searchDestination(e, dataArray[4]);
   const addressParent = e.parentElement;
   const listChildren = addressParent.children;
   const direction = dataArray[3] || 'min';
   const directionSecond = dataArray[7] || 'min';
   const mediaQuery = window.matchMedia(`(${direction}-width: ${dataArray[2]}px)`);
   const mediaQuerySecond = dataArray[6] && window.matchMedia(`(${directionSecond}-width: ${dataArray[6]}px)`);
   for (let i = 0; i < listChildren.length; i++) { !listChildren[i].dataset.n && listChildren[i].setAttribute('data-n', `${i}`) };
   mediaQuery.matches && startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   if (mediaQuerySecond && mediaQuerySecond.matches) moving(e, dataArray[5], addressMoveSecond);
   mediaQuery.addEventListener('change', () => { startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) });
   if (mediaQuerySecond) mediaQuerySecond.addEventListener('change', () => {
      if (mediaQuerySecond.matches) { moving(e, dataArray[4], addressMoveSecond); return; };
      startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   });
});

function startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) {
   if (mediaQuery.matches) { moving(e, dataArray[1], addressMove); return; }
   if (listChildren.length > 0) {
      for (let z = 0; z < listChildren.length; z++) {
         if (listChildren[z].dataset.n > e.dataset.n) {
            listChildren[z].before(e);
            break;
         } else if (z == listChildren.length - 1) {
            addressParent.append(e);
         }
      }
      return;
   }
   addressParent.prepend(e);
};

function searchDestination(e, n) {
   if (!e) return;
   if (e.classList.contains(n.slice(1))) { return e }
   if (e.parentElement && e.parentElement.querySelector(n)) { return e.parentElement.querySelector(n) };
   return searchDestination(e.parentElement, n);
}

function moving(e, order, addressMove) {
   if (order == "first") { addressMove.prepend(e); return; };
   if (order == "last") { addressMove.append(e); return; };
   if (addressMove.children[order]) { addressMove.children[order].before(e); return; }
   addressMove.append(e);
}



const CARD_SLIDERS = document.querySelectorAll('.card__slider');
if (isPC && CARD_SLIDERS.length > 0) {
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
// подмена на выбранный контент
// js-data-scope - оболочка внутри которой работает логика
// js-data-target - область клика
// js-data-get - источник данных
// js-data-replace - сюда записывается выбранное
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-data-target')) {
      const dataTarget = event.target.closest('.js-data-target');
      const dataScope = dataTarget.closest('.js-data-scope');
      if (!dataScope) return;
      const dataGet = dataTarget.classList.contains('js-data-get') ?
         dataTarget :
         dataTarget.querySelector('.js-data-get');
      if (!dataGet) return;
      const dataReplace = dataScope.querySelector('.js-data-replace');
      if (!dataReplace) return;
      const dataContent = dataGet.innerHTML.trim();
      if (!dataContent) return;
      dataReplace.innerHTML = dataContent;
   }
})


var smoother;

// function textWpapSpan(element) {
//    const listSpan = element.querySelectorAll('span');
//    listSpan.forEach(element => {
//       const words = element.innerHTML.trim().split(' ');
//       const wordWrap = words.map(item => { return item.split('').map(e => { return `<span class="letter">${e}</span>` }).join('') })
//       element.innerHTML = `<span class="word">${wordWrap.join('</span>&#32;<span class="word">')}</span>`
//    })
// }

// function addTextAnimatePin(name) {
//    textWpapSpan(element)
//    let tl = gsap.timeline({
//       scrollTrigger: {
//          trigger: `${name}`,
//          start: "0% 0%",
//          end: `100% 0%`,
//          pin: true,
//          scrub: true,
//       }
//    })
//    const text = document.querySelectorAll(`${name} .letter`);
//    text && text.forEach((e) => {
//       tl.to(e, 1, { opacity: 1 })
//    })
// }





function addTextAnimate(element) {
   wrapLetters(element)
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: element,
         start: "0% 90%",
         end: `0% 5%`,
         // scrub: true,
      }
   })
   const text = element.querySelectorAll(`.letter`);
   text && text.forEach((element, index) => {
      tl.to(element, { y: 0, rotate: 0, duration: 0.1 }, index === 0 ? 0 : `-=${0.06}`)
   })
}

// обворачивает буквы так же если есть вложенные теги
function wrapLetters(element) {
   function wrapper(element) {
      const words = element.innerHTML.trim().split(' ');
      const wordWrap = words.map(item => { return item.split('').map(e => { return `<span class="letter">${e}</span>` }).join('') })
      element.innerHTML = `<span class="word">${wordWrap.join('</span>&#32;<span class="word"> ')}</span> `
      element.after(' ');
      return element;
   }
   const nodelist = Array.from(element.childNodes)
   let accumulator = document.createElement('div');
   nodelist.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
         let span = document.createElement('span')
         const text = node.textContent;
         span.append(text);
         accumulator.append(wrapper(span))
      } else {
         accumulator.append(wrapper(node))
      }
   })
   element.innerHTML = accumulator.innerHTML
}


function animateSmallCounter(element, target) {
   const VIRTUAL_MULTIPLIER = 10;
   const virtualTarget = target * VIRTUAL_MULTIPLIER;
   const obj = { value: 0 };

   const animation = gsap.to(obj, {
      value: virtualTarget,
      duration: 2,
      ease: "power2.out",
      paused: true,
      onUpdate: function () {
         const displayValue = Math.floor(obj.value / VIRTUAL_MULTIPLIER);
         element.textContent = displayValue.toString();
         if (target <= 20) {
            const progress = obj.value / virtualTarget;
            const scale = 1 + (Math.sin(progress * Math.PI) * 0.1);
            element.style.transform = `scale(${scale})`;
         }
      },
      onComplete: function () {
         element.textContent = target.toString();
         element.style.transform = 'scale(1)';
      }
   });

   ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      end: "top 20%",
      once: true,
      onEnter: () => animation.play(),
      onEnterBack: () => animation.play()
   });

   return animation;
}

window.addEventListener('load', function (event) {
   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);/* , ScrollToPlugin */

   // ScrollTrigger.config({ ignoreMobileResize: true });
   // ScrollTrigger.isTouch && ScrollTrigger.normalizeScroll({ allowNestedScroll: true });

   if (isPC) {
      smoother = ScrollSmoother.create({
         wrapper: "#scroll",
         content: "#content",
         smooth: 2,
         // normalizeScroll: true,
         // smoothTouch: true,
         // effects: true,
      })
   }


   // прокрутка по якорям
   // document.body.addEventListener('click', (event) => {
   //    if (event.target.closest('[href^="#"]')) {
   //       event.preventDefault();
   //       let getName = event.target.closest('[href^="#"]').getAttribute('href');
   //       closeHeaderMenu();
   //       gsap.to(window, { scrollTo: getName, ease: "power2" })
   //    }
   // })




   // инициализация анимации текста
   // const ANIMATE_PIN = document.querySelectorAll('.js-text-animate-pin');
   // ANIMATE_PIN.forEach(element => { addTextAnimate(element) });

   const ANIMATE_FREE = document.querySelectorAll('.js-text-animate');
   if (ANIMATE_FREE.length > 0) { ANIMATE_FREE.forEach(element => addTextAnimate(element)) }

   // анимация счетчика
   const counterList = document.querySelectorAll('.js-counter-animate');
   if (counterList.length > 0) { counterList.forEach(e => animateSmallCounter(e, e.dataset.value)) }


   const stapsList = this.document.querySelectorAll('.staps__card');
   if (stapsList.length > 0 && MIN768.matches) {
      const tl = gsap.timeline({
         scrollTrigger: {
            trigger: '.staps__body',
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none none',
            markers: false,
         }
      });

      stapsList.forEach((card, index) => {
         tl.to(card, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: index * 0.3 // задержка между карточками
         }, index * 0.1); // на timeline смещение
      });

   }



})
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

// js-tabs-body - тело вкладки, в открытом состоянии добавляется класс js-tabs-open.
// * !!! где js-tabs-body, добавить data-tabs-duration="500" скорость анимации в 'мс', 500мс по умолчанию.
// js-tabs-hover - работает hover на ПК (должен быть с js-tabs-body), отключает клик на ПК, для touchscreen надо раставить js-tabs-click или js-tabs-toggle
// js-tabs-closing - вместе с js-tabs-body закрыть вкладку при событии вне данной вкладки
// js-tabs-click - открыть при клике (зона клика)
// js-tabs-toggle - открыть или закрыть при клике (зона клика)
// js-tabs-group - обвернуть группу табов, что бы был открыт только один из группы,
// js-tabs-group-all - если внутри табов есть дочерние табы сгруппированные js-tabs-group, тогда можно группу родительских табов обвернуть в js-tabs-group-all, тогда при переключении родительского таба будут закрываться все дочерние табы
// js-tabs-shell - оболочка скрывающая js-tabs-inner, присвоить стили  transition: height var(--tabs-duration, 0.5s);
// js-tabs-inner - оболочка контента
//
//
// работает в связке с определением touchscreen  (isPC)


class Tabs {
   constructor() {
      this.listClosingTabs = document.querySelectorAll('.js-tabs-closing');
      this.listHover = document.querySelectorAll('.js-tabs-hover');
      this.listTabsBody = document.querySelectorAll('.js-tabs-body');
      this.pause = false;
   };
   init = () => {
      const listDuration = document.querySelectorAll('[data-tabs_duration]');
      listDuration.forEach((e) => e.style.setProperty('--tabs-duration', e.dataset.tabs_duration / 1000 + 's'))
      document.body.addEventListener('click', this.eventClick);
      if (isPC && this.listHover.length > 0) document.body.addEventListener('mouseover', this.eventMouseOver)
   };
   eventClick = (event) => {
      if (event.target.tagName.toLowerCase() == 'input') return;
      if (isPC && event.target.closest('.js-tabs-hover')) return;
      this.closeAll(event);
      if (event.target.closest('.js-tabs-click')) {
         this.eventClickGroup(event);
         this.openTab(event.target.closest('.js-tabs-click'))
         return;
      }
      if (event.target.closest('.js-tabs-toggle')) {
         this.eventClickGroup(event);
         this.toggleTabs(event.target.closest('.js-tabs-toggle'));
         return;
      };
   };
   eventClickGroup = (event) => {
      if (event.target.closest('.js-tabs-group')) { this.closeGroup(event) }
      if (event.target.closest('.js-tabs-group-all') && !event.target.closest('.js-tabs-group')) { this.closeGroupAll(event) }
   }
   querySelectExcluding = (groupItem) => {
      const allElements = groupItem.querySelectorAll('.js-tabs-body');
      const excludeElements = groupItem.querySelectorAll('.js-tabs-group');
      return Array.from(allElements).filter(element => {
         return !Array.from(excludeElements).some(excludeEl =>
            excludeEl !== element && excludeEl.contains(element)
         );
      });
   }
   eventMouseOver = (event) => {
      if (event.target.closest('.js-tabs-hover')) {
         if (event.target.closest('.js-tabs-hover').classList.contains('js-tabs-open')) return;
         this.openTab(event.target);
      };
      this.closeAllHover(event.target);
   };

   // не закрывает табы дочерних js-tabs-group
   closeGroup = (event) => {
      const groupFilter = this.querySelectExcluding(event.target.closest('.js-tabs-group'))
      groupFilter.forEach((e) => {
         if (event.target.closest('.js-tabs-toggle') && event.target.closest('.js-tabs-toggle') == (e.querySelector('.js-tabs-toggle') || e.closest('.js-tabs-toggle'))) return;
         if (event.target.closest('.js-tabs-click') && event.target.closest('.js-tabs-click') == (e.querySelector('.js-tabs-click') || e.closest('.js-tabs-click'))) return;
         this.closeTab(e)
      })
   }
   // закрывает все табы внутри js-tabs-group-all
   closeGroupAll = (event) => {
      const group = event.target.closest('.js-tabs-group-all').querySelectorAll('.js-tabs-body');
      group.forEach((e) => {
         if (event.target.closest('.js-tabs-toggle') && event.target.closest('.js-tabs-toggle') == (e.querySelector('.js-tabs-toggle') || e.closest('.js-tabs-toggle'))) return;
         if (event.target.closest('.js-tabs-click') && event.target.closest('.js-tabs-click') == (e.querySelector('.js-tabs-click') || e.closest('.js-tabs-click'))) return;
         this.closeTab(e)
      })
   }
   openTab = (element) => {
      const body = element.closest('.js-tabs-body');
      if (!body || body.classList.contains('js-tabs-open')) return;
      body.classList.add('js-tabs-open');
      if (!body.querySelector('.js-tabs-shell')) return;
      this.setHeight(body);
   };
   closeTab = (body) => {
      body.classList.remove('js-tabs-open');
      if (!body.querySelector('.js-tabs-shell')) return;
      this.clearHeight(body);
   };
   closeAll = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (this.listClosingTabs.length == 0 && body) return;
      this.listClosingTabs.forEach((e) => { if (e !== body) this.closeTab(e); })
   };
   closeAllHover = (target) => {
      const element = target.closest('.js-tabs-hover');
      this.listHover.forEach((e) => { if (element !== e) this.closeTab(e) })
   };
   setHeight = (body) => {
      const duration = body.dataset.tabs_duration;
      this.addHeight(body);
      setTimeout(() => {
         if (body.querySelector('.js-tabs-shell').style.height == '') return;
         body.querySelector('.js-tabs-shell').style.height = 'auto'
      }, duration || 500)
   };
   clearHeight = (body) => {
      this.addHeight(body);
      requestAnimationFrame(() => { body.querySelector('.js-tabs-shell').style.height = "" })
   }
   addHeight = (body) => {
      const inner = body.querySelector('.js-tabs-inner');
      if (!inner) return;
      body.querySelector('.js-tabs-shell').style.height = inner.offsetHeight + 1 + "px";
   }
   toggleTabs = (element) => {
      const body = element.closest('.js-tabs-body');
      if (body.classList.contains('js-tabs-open')) {
         this.closeTab(body);
         return;
      }
      this.openTab(element);
   };
}
const tabs = new Tabs().init();




