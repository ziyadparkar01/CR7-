gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // ===== INIT =====
  const loader = document.getElementById('loader');
  const progressFill = document.getElementById('progressFill');
  const depthMeter = document.getElementById('depth-meter');

  // Hide loader after 2.5s
  gsap.to(loader, {
    opacity: 0,
    pointerEvents: 'none',
    duration: 1.5,
    delay: 2
  });

  // ===== SCROLL TRACKING =====
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressFill.style.width = scrolled + '%';
    depthMeter.textContent = Math.round(scrolled) + '%';
  });

  // ===== STAT COUNTERS =====
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        gsap.to({ v: 0 }, {
          v: target,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].v).toLocaleString();
          }
        });
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  // ===== CARD 3D TILT =====
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -15;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  });

  // ===== HERO PARALLAX =====
  const hero = document.querySelector('.hero-section');
  const heroTitle = document.querySelector('.monumental-title');

  hero.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    gsap.to(heroTitle, {
      x: x,
      y: y,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  hero.addEventListener('mouseleave', () => {
    gsap.to(heroTitle, {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // ===== SCROLL TRIGGER ANIMATIONS =====

  // Hero section entrance
  gsap.from('.hero-center', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
  });

  // Chapter headers entrance
  document.querySelectorAll('.chapter-header').forEach(header => {
    gsap.from(header, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Cards stagger entrance
  document.querySelectorAll('.card-3d').forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Stat cubes pop-in
  document.querySelectorAll('.stat-cube').forEach((cube, i) => {
    gsap.from(cube, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out',
      delay: i * 0.15,
      scrollTrigger: {
        trigger: cube,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Dashboard cells animate in
  document.querySelectorAll('.dash-cell').forEach((cell, i) => {
    gsap.from(cell, {
      x: (i % 2 === 0 ? -50 : 50),
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: i * 0.08,
      scrollTrigger: {
        trigger: cell,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Section backgrounds fade-in on scroll
  document.querySelectorAll('.chapter-section').forEach(section => {
    gsap.from(section, {
      backgroundColor: 'rgba(5, 5, 8, 0)',
      duration: 1.5,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'top 20%',
        scrub: 0.5
      }
    });
  });

  // Number counters auto-count when visible
  gsap.utils.toArray('[data-count]').forEach(element => {
    const endValue = parseInt(element.dataset.count);
    ScrollTrigger.create({
      trigger: element,
      onEnter: () => {
        if (!element.hasAttribute('data-counted')) {
          gsap.to({ val: 0 }, {
            val: endValue,
            duration: 2,
            ease: 'power1.out',
            onUpdate: function() {
              element.textContent = Math.round(this.targets()[0].val).toLocaleString();
            }
          });
          element.setAttribute('data-counted', 'true');
        }
      }
    });
  });

  // ===== SECTION TRANSITIONS =====
  gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  })
  .to('.cyber-grid', { opacity: 0.5 }, 0)
  .to('.cinema-vignette', { opacity: 0.8 }, 0);

  // ===== NAV HIGHLIGHT ON SCROLL =====
  const sections = gsap.utils.toArray('.section');
  const navLinks = document.querySelectorAll('.hud-link');

  ScrollTrigger.create({
    onUpdate: self => {
      let current = sections[0];
      sections.forEach(section => {
        if (self.getVelocity() > 0) {
          if (section.offsetTop - 100 < self.getScrollY()) {
            current = section;
          }
        } else {
          if (section.offsetTop - window.innerHeight / 2 < self.getScrollY()) {
            current = section;
          }
        }
      });

      navLinks.forEach(link => link.classList.remove('active'));
      const currentId = current.getAttribute('id');
      const activeLink = document.querySelector(`[href="#${currentId}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });

  // ===== SMOOTH SCROLL LINKS =====
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        gsap.to(window, {
          scrollTo: {
            y: targetSection,
            offsetY: 80
          },
          duration: 1.2,
          ease: 'power2.inOut'
        });
      }
    });
  });

  console.log('✨ CR7 Interactive Experience Initialized');
});