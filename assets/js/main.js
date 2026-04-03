/*=============== SHOW/HIDE MOBILE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

// Show menu
if (navToggle) {
   navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
   });
}

// Hide menu
if (navClose) {
   navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
   });
}

// Remove menu mobile on link click
const navLinks = document.querySelectorAll('.nav__link');

const linkAction = () => {
   navMenu.classList.remove('show-menu');
};
navLinks.forEach(n => n.addEventListener('click', linkAction));

/*=============== HEADER SCROLL EFFECT ===============*/
const scrollHeader = () => {
   const header = document.getElementById('header');
   if (window.scrollY >= 50) {
      header.classList.add('scroll-header');
   } else {
      header.classList.remove('scroll-header');
   }
};
window.addEventListener('scroll', scrollHeader);

/*=============== SWIPER PROJECTS ===============*/
/* Sur téléphone : pas de glisser sur le carrousel (bouton suivant uniquement) → évite que Swiper « garde » le tactile */
const projectsAllowTouchMove = !window.matchMedia('(max-width: 767px)').matches;

const swiperProjects = new Swiper('.projects__swiper', {
   loop: true,
   spaceBetween: 20,
   grabCursor: true,
   allowTouchMove: projectsAllowTouchMove,
   /* Par défaut Swiper met touchStartPreventDefault: true → bloque le scroll vertical au doigt (iOS/Android) */
   touchStartPreventDefault: false,
   nested: true,
   touchAngle: 30,
   touchReleaseOnEdges: true,

   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
   },

   breakpoints: {
      340: {
         slidesPerView: 1,
         spaceBetween: 16,
      },
      768: {
         slidesPerView: 2,
         spaceBetween: 20,
      },
      1150: {
         slidesPerView: 3,
         spaceBetween: 24,
      },
   },
});

/* Trackpad / molette : écouteur wheel explicite { passive: false } (le module mousewheel Swiper échoue souvent sur pavé tactile Windows / certains navigateurs) */
(function bindProjectsTrackpadWheel() {
   const el = document.querySelector('.projects__swiper');
   if (!el || !swiperProjects) return;

   let acc = 0;
   let flushTimer = null;
   const WHEEL_THRESHOLD = 18;
   const FLUSH_MS = 45;

   const flush = () => {
      flushTimer = null;
      if (Math.abs(acc) < WHEEL_THRESHOLD) {
         acc = 0;
         return;
      }
      if (acc > 0) {
         swiperProjects.slideNext();
      } else {
         swiperProjects.slidePrev();
      }
      acc = 0;
   };

   el.addEventListener(
      'wheel',
      (e) => {
         let dy = e.deltaY;
         let dx = e.deltaX;
         if (e.deltaMode === 1) {
            dy *= 16;
            dx *= 16;
         } else if (e.deltaMode === 2) {
            dy *= window.innerHeight || 800;
            dx *= window.innerWidth || 800;
         }
         if (e.shiftKey && Math.abs(dx) <= Math.abs(dy)) {
            dx = dy;
            dy = 0;
         }
         const dominant = Math.abs(dx) > Math.abs(dy) ? dx : dy;
         if (!dominant) return;

         e.preventDefault();
         acc += dominant;
         if (flushTimer) clearTimeout(flushTimer);
         flushTimer = setTimeout(flush, FLUSH_MS);
      },
      { passive: false, capture: true }
   );
})();

/*=============== MODALE DÉTAIL PROJET ===============*/
const projectModal = document.getElementById('project-modal');
const projectModalBody = document.getElementById('project-modal-body');
const projectModalCategory = document.getElementById('project-modal-category');
const projectModalHeading = document.getElementById('project-modal-heading');
const projectModalTech = document.getElementById('project-modal-tech');

let projectModalLastFocus = null;

const closeProjectModal = () => {
   if (!projectModal || !projectModal.classList.contains('is-open')) return;
   projectModal.classList.remove('is-open');
   projectModal.setAttribute('aria-hidden', 'true');
   document.body.classList.remove('modal-open');
   if (projectModalBody) projectModalBody.innerHTML = '';

   if (projectModalLastFocus && typeof projectModalLastFocus.focus === 'function') {
      projectModalLastFocus.focus();
   }
   projectModalLastFocus = null;
};

const openProjectModal = (card) => {
   if (!projectModal || !card) return;
   const detail = card.querySelector('.projects__detail');
   const title = card.querySelector('.projects__title');
   const subtitle = card.querySelector('.projects__subtitle');
   const desc = card.querySelector('.projects__description');

   projectModalLastFocus = document.activeElement;
   if (projectModalCategory) projectModalCategory.textContent = title ? title.textContent.trim() : '';
   if (projectModalHeading) projectModalHeading.innerHTML = subtitle ? subtitle.innerHTML : '';
   if (projectModalTech) projectModalTech.textContent = desc ? desc.textContent.trim() : '';
   if (projectModalBody) projectModalBody.innerHTML = detail ? detail.innerHTML : '';

   projectModal.classList.add('is-open');
   projectModal.setAttribute('aria-hidden', 'false');
   document.body.classList.add('modal-open');

   const closeBtn = projectModal.querySelector('.project-modal__close');
   if (closeBtn) closeBtn.focus();
};

if (projectModal) {
   projectModal.querySelectorAll('[data-project-modal-close]').forEach((el) => {
      el.addEventListener('click', () => closeProjectModal());
   });

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
         e.preventDefault();
         closeProjectModal();
      }
   });

   document.querySelectorAll('.projects__card').forEach((card) => {
      const state = { active: false, x: 0, y: 0, moved: false };

      const finishOpenGesture = (cancelled) => {
         if (!state.active) return;
         state.active = false;
         if (!cancelled && !state.moved) {
            openProjectModal(card);
         }
      };

      card.addEventListener('pointerdown', (e) => {
         if (e.pointerType === 'mouse' && e.button !== 0) return;
         state.active = true;
         state.x = e.clientX;
         state.y = e.clientY;
         state.moved = false;

         const onUp = () => {
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onCancel);
            finishOpenGesture(false);
         };
         const onCancel = () => {
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onCancel);
            finishOpenGesture(true);
         };
         document.addEventListener('pointerup', onUp);
         document.addEventListener('pointercancel', onCancel);
      });

      card.addEventListener('pointermove', (e) => {
         if (!state.active) return;
         if (Math.abs(e.clientX - state.x) > 12 || Math.abs(e.clientY - state.y) > 12) {
            state.moved = true;
         }
      });

      card.addEventListener('keydown', (e) => {
         if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProjectModal(card);
         }
      });
   });
}

/*=============== SERVICES ACCORDION (un seul panneau ouvert) ===============*/
const skillsSection = document.getElementById('skills');

if (skillsSection) {
   skillsSection.addEventListener('click', (e) => {
      const header = e.target.closest('.services__header');
      if (!header || !skillsSection.contains(header)) return;

      const card = header.closest('.services__card');
      if (!card || !skillsSection.contains(card)) return;

      const cards = skillsSection.querySelectorAll('.services__card');
      const wasOpen = card.classList.contains('open');

      cards.forEach((c) => c.classList.remove('open'));
      if (!wasOpen) {
         card.classList.add('open');
      }
   });
}

/*=============== CURRENT YEAR OF THE FOOTER ===============*/
const yearElement = document.getElementById('year');
if (yearElement) {
   yearElement.textContent = new Date().getFullYear();
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
   const scrollDown = window.scrollY;

   sections.forEach(current => {
      const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 200,
            sectionId = current.getAttribute('id');

      const navLink = document.querySelector('.nav__link[href*="' + sectionId + '"]');

      if (navLink) {
         if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            navLink.classList.add('active-link');
         } else {
            navLink.classList.remove('active-link');
         }
      }
   });
};
window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
   origin: 'top',
   distance: '60px',
   duration: 2000,
   delay: 300,
   reset: false,
   /* Désactive les animations ScrollReveal sur mobile : moins de transforms = scroll tactile fiable */
   mobile: false,
});

/* ScrollReveal pose body.style.height = "100%" en inline : sur mobile Safari ça peut figer le scroll malgré le CSS */
document.body.style.removeProperty('height');

// Home
sr.reveal('.home__greeting', { origin: 'left' });
sr.reveal('.home__name', { origin: 'left', delay: 400 });
sr.reveal('.home__image', { delay: 600 });
sr.reveal('.home__split-text', { origin: 'right' });
sr.reveal('.home__profession', { origin: 'right', delay: 400 });
sr.reveal('.home__social', { origin: 'bottom', delay: 800 });
sr.reveal('.home__cv', { origin: 'bottom', delay: 800 });

// About
sr.reveal('.about__image', { origin: 'left' });
sr.reveal('.about__info', { origin: 'right' });

// Projects
sr.reveal('.projects__container', { origin: 'bottom' });

// Work: no ScrollReveal on this block (avoids body/layout side effects on sections below).

const workButtons = document.querySelectorAll('.work__button');
const workContents = document.querySelectorAll('.work__content');

const setWorkTab = (targetId) => {
   const targetEl = document.getElementById(targetId);
   if (!targetEl) return;

   workContents.forEach((content) => content.classList.add('work__content-hidden'));
   targetEl.classList.remove('work__content-hidden');
};

workButtons.forEach((button) => {
   button.addEventListener('click', () => {
      const target = button.dataset.target;
      if (!target) return;

      workButtons.forEach((btn) => btn.classList.remove('work__button-active'));
      button.classList.add('work__button-active');

      setWorkTab(target);
   });
});

// Services / Compétences — pas de reveal par carte (évite conflits avec l’accordéon)
sr.reveal('#skills .services__container', { origin: 'bottom', delay: 150 });
sr.reveal('.soft-skills', { origin: 'bottom' });

// Veille
sr.reveal('.veille__card', { interval: 200 });

// Contact
sr.reveal('.contact__description', { origin: 'top' });
sr.reveal('.contact__box', { interval: 200, origin: 'bottom' });
