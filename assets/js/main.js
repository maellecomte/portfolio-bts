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
      card.addEventListener('click', () => openProjectModal(card));

      card.addEventListener('keydown', (e) => {
         if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProjectModal(card);
         }
      });
   });
}

/*=============== SCROLL HORIZONTAL PROJETS (wheel → scroll latéral) ===============*/
const projectsScroll = document.querySelector('.projects__scroll');
if (projectsScroll) {
  projectsScroll.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 5) return;
    const maxScroll = projectsScroll.scrollWidth - projectsScroll.clientWidth;
    if (maxScroll <= 0) return;
    const atStart = projectsScroll.scrollLeft <= 0 && e.deltaY < 0;
    const atEnd = projectsScroll.scrollLeft >= maxScroll - 1 && e.deltaY > 0;
    if (atStart || atEnd) return;
    e.preventDefault();
    projectsScroll.scrollLeft += e.deltaY;
  }, { passive: false });
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

// À propos
sr.reveal('#about .section__title', { origin: 'top' });
sr.reveal('.about__panel', { origin: 'bottom', delay: 200 });

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
