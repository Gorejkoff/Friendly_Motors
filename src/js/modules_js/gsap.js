var smoother;

function addTextAnimate(element, fast) {
   wrapLetters(element)
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: element,
         start: "0% 90%",
         end: `0% 5%`,
         // scrub: true,
         toggleActions: "play none none reverse"
      }
   })
   const text = element.querySelectorAll(`.letter`);
   text && text.forEach((element, index) => {
      tl.to(element, { y: 0, rotate: 0, duration: 0.1 }, index === 0 ? 0 : `-=${fast ? 0.09 : 0}`)
   })
}

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

function bottomToTop(element) {
   gsap.fromTo(element,
      {
         y: 200,
         opacity: 0
      },
      {
         y: 0,
         opacity: 1,
         duration: 0.5,
         scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
         }
      }
   );
}
function opacity(element) {
   gsap.fromTo(element,
      {
         opacity: 0
      },
      {
         opacity: 1,
         duration: 0.5,
         scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "top 15%",
            toggleActions: "play none none reverse"
         }
      }
   );
}

function servicesAnimate() {
   const services_grid = document.querySelector('.services__grid')
   if (!services_grid) return;
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: services_grid,
         start: "0% 90%",
         end: `0% 5%`,
         // scrub: true,
         toggleActions: "play none none reverse"
      }
   })
   const list = services_grid.querySelectorAll(`.services__card`);
   if (list.length <= 0) return;
   list && list.forEach((item, index) => {
      tl.fromTo(item, { x: '-300%', opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, `-=0.2`)
   })

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

   servicesAnimate()

   const ANIMATE_FREE = document.querySelectorAll('.js-text-animate');
   if (ANIMATE_FREE.length > 0) { ANIMATE_FREE.forEach(element => addTextAnimate(element, true)) }

   const counterList = document.querySelectorAll('.js-counter-animate');
   if (counterList.length > 0) { counterList.forEach(e => animateSmallCounter(e, e.dataset.value)) }

   const toTop = this.document.querySelectorAll('.js-animate-to-top');
   if (toTop.length > 0) toTop.forEach((e) => bottomToTop(e));

   const opacityList = this.document.querySelectorAll('.js-animate-opacity');
   if (opacityList.length > 0) opacityList.forEach((e) => opacity(e));


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