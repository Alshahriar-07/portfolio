/* ---------------- Custom cursor ---------------- */
const ring = document.getElementById('cursor-ring');
const glow = document.getElementById('cursor-glow');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

window.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  glow.style.left = mx + 'px';
  glow.style.top = my + 'px';
});

(function loop() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .chip, [data-tilt]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '52px';
    ring.style.height = '52px';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '28px';
    ring.style.height = '28px';
  });
});

/* ---------------- Lenis smooth scroll ---------------- */
let lenis;
try {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
} catch (e) {
  console.warn('Lenis unavailable', e);
}

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Nav blur on scroll ---------------- */
const header = document.getElementById('site-header');
ScrollTrigger.create({
  start: 40,
  end: 99999,
  onUpdate: self => {
    if (self.scroll() > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
});

/* ---------------- Hero text reveal ---------------- */
gsap.to('.hero-kicker .line-inner', { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
gsap.set('.hero-kicker .line-inner', { y: '40%', opacity: 0 });
gsap.to('.hero-kicker .line-inner', { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });

gsap.to('.hero-title .line-inner', {
  y: '0%', duration: 1.3, ease: 'power4.out', stagger: 0.12, delay: 0.35
});
gsap.from('.hero-roles, .hero-sub, .hero-actions, .scroll-indicator', {
  opacity: 0, y: 20, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 1.1
});
gsap.set('.hero-roles, .hero-sub, .hero-actions, .scroll-indicator', { opacity: 0 });
gsap.to('.hero-roles, .hero-sub, .hero-actions, .scroll-indicator', {
  opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 1.1
});

/* ---------------- Scroll reveals ---------------- */
document.querySelectorAll('.reveal').forEach(el => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

/* ---------------- Project card tilt ---------------- */
document.querySelectorAll('[data-tilt]').forEach(card => {
  const damp = 22;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateX: py * -6,
      rotateY: px * 6,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
  });
});

/* ---------------- Hero background disabled ---------------- */
(function disableHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    canvas.style.opacity = '0';
  }
})();
