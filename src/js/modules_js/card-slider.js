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