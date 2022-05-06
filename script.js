'use strict';
const tabs = document.querySelectorAll('.operations__tab');
const tabConatiner = document.querySelector('.operations__tab-container');
const contents = document.querySelectorAll('.operations__content');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const headerId = document.querySelector('#header');
const headerNav = document.querySelector('.header-nav');
const sections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('.lazy-img');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(modal => modal.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////
//Smooth scrolling
document.querySelector('.btn--scroll-to').addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });

  // window.scrollTo({
  //   left: section1.getBoundingClientRect().left + window.pageXOffset,
  //   top: section1.getBoundingClientRect().top + window.pageYOffset,
  //   behavior: "smooth",
  // })
});

///////////////////////////////////////
// Page navigation
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////
// Operation Tab
tabConatiner.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  //tab selection
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //content selection
  contents.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////
//Menu fade animation
function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const clicked = e.target;
    const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== e.target) {
        el.style.opacity = this;
      }
    });
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////
// Sticky nav-bar
const navObserver = new IntersectionObserver(
  function (entries, observer) {
    let [entry] = entries;
    if (entry.isIntersecting) nav.classList.remove('sticky');
    else nav.classList.add('sticky');
  },
  {
    root: null,
    threshold: 0.01,
    rootMargin: `-${nav.clientHeight}px`,
  }
);

navObserver.observe(header);
//console.log(nav.clientHeight);

////////////////////////////////////
// Section fade in animation
const secObserver = new IntersectionObserver(
  (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  },
  {
    threshold: 0.1,
    root: null,
  }
);

new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    sections.forEach(sec => {
      sec.classList.add('section--hidden');
      secObserver.observe(sec);
    });
  },
  {
    threshold: 1,
    root: null,
    //rootMargin: '-200px',
  }
).observe(header);

//////////////////////////////////////
// Lazy loading images
const imgObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  },
  {
    threshold: 0.2,
  }
);

lazyImages.forEach(img => {
  imgObserver.observe(img);
});

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const leftArrow = document.querySelector('.slider__btn--left');
  const rightArrow = document.querySelector('.slider__btn--right');
  const dots = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 100}%)`;
  });

  const nextSlide = function () {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    gotoSlide(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    gotoSlide(curSlide);
  };

  const gotoSlide = function (curSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
    activateDot(curSlide);
  };

  const createDot = function () {
    slides.forEach(function (_, i) {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (i) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    dots.forEach(dot => {
      if (Number(dot.dataset.slide) === i)
        dot.classList.add('dots__dot--active');
    });
  };

  const init = function () {
    createDot();
    activateDot(0);
  };

  rightArrow.addEventListener('click', nextSlide);
  leftArrow.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
  });

  init();

  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide);
    }
  });
};

slider();

/////////////////////////////////////////
//Going to top
document.querySelector('.header-nav').addEventListener('click', function ()
{
  headerId.scrollIntoView({ behavior: 'smooth' });
});

const topIntersectionObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (entry.isIntersecting) headerNav.classList.remove('visible');
    else headerNav.classList.add('visible');
  },
  {
    threshold: 0.5,
    root: null,
  }
).observe(header);
