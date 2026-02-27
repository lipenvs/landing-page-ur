// ═══════════════════════════════════════════
// GSAP Animations + Header scroll behavior
// ═══════════════════════════════════════════
(function () {
  gsap.registerPlugin(ScrollTrigger);

  // ── Header: add .scrolled class on scroll ──
  const header = document.getElementById('site-header');

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.scroll() > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
  });

  // ── Hero: fade in title, subtitle, buttons ──
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('#hero h1', {
      y: 40,
      opacity: 0,
      duration: 1,
    })
    .from('#hero p', {
      y: 30,
      opacity: 0,
      duration: 0.8,
    }, '-=0.5')
    .from('#hero .btn-primary, #hero .btn-outline', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
    }, '-=0.4');

  // ── Video player: scale up on scroll ──
  gsap.from('.video-player', {
    scrollTrigger: {
      trigger: '.video-player',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 60,
    opacity: 0,
    scale: 0.95,
    duration: 1,
    ease: 'power3.out',
  });

  // ── Feature cards: stagger in ──
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.feature-card',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
  });

  // ── FAQ: title slide in from left ──
  gsap.from('#faq .lg\\:w-1\\/3', {
    scrollTrigger: {
      trigger: '#faq',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    x: -40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // ── FAQ items: stagger in ──
  gsap.from('.faq-item', {
    scrollTrigger: {
      trigger: '.faq-item',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // ── Footer: fade up ──
  gsap.from('footer > div', {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // ── Nav links: subtle entrance ──
  gsap.from('.nav-link, header .btn-primary', {
    y: -10,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    delay: 0.3,
  });

})();
