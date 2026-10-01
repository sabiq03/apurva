const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));

document.querySelector('#year').textContent = String(new Date().getFullYear());

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.documentElement.classList.remove('js-motion');
    }
  });
}

const heroImage = document.querySelector('.hero-image');
let scrollFrame = null;
function onScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    if (!reducedMotion.matches && window.scrollY < window.innerHeight * 1.2) {
      heroImage.style.transform = `translate3d(0, ${Math.min(window.scrollY * .15, 110)}px, 0) scale(1.07)`;
    }
    scrollFrame = null;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const graphic = document.querySelector('.graphic-stage');
const graphicCard = document.querySelector('.feature-graphic');
if (graphic && graphicCard) {
  graphicCard.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const box = graphicCard.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    graphic.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
  });
  graphicCard.addEventListener('pointerleave', () => { graphic.style.transform = ''; });
}
