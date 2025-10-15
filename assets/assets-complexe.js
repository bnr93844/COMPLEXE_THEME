(function () {
  const docReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  docReady(() => {
    /* Parallax */
    const parallaxNodes = document.querySelectorAll('[data-parallax]');
    const parallaxHandler = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      parallaxNodes.forEach((node) => {
        const speed = parseFloat(node.dataset.parallaxSpeed || '0.25');
        const translateY = scrollY * speed * -0.35;
        node.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });
    };
    if (parallaxNodes.length) {
      parallaxHandler();
      window.addEventListener('scroll', parallaxHandler, { passive: true });
    }

    /* Glint effect */
    const glintTargets = document.querySelectorAll('.cta-gold[data-glint="true"]');
    glintTargets.forEach((target) => {
      target.addEventListener('mousemove', (event) => {
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        target.style.setProperty('--glint-x', `${percentX}%`);
        target.style.setProperty('--glint-y', `${percentY}%`);
      });
      target.addEventListener('mouseleave', () => {
        target.style.removeProperty('--glint-x');
        target.style.removeProperty('--glint-y');
      });
    });

    /* Intersection reveal */
    const animatedNodes = document.querySelectorAll('[data-animate], .how-it-works__card');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15
      });
      animatedNodes.forEach((node) => observer.observe(node));
    } else {
      animatedNodes.forEach((node) => node.classList.add('is-visible'));
    }

    /* FAQ accordion */
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach((toggle) => {
      const item = toggle.closest('.faq-item');
      const content = item ? item.querySelector('.faq-content') : null;
      if (!item || !content) {
        return;
      }
      toggle.addEventListener('click', () => {
        const isOpen = item.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        faqToggles.forEach((otherToggle) => {
          if (otherToggle === toggle) {
            return;
          }
          const otherItem = otherToggle.closest('.faq-item');
          const otherContent = otherItem ? otherItem.querySelector('.faq-content') : null;
          if (otherItem && otherContent) {
            otherItem.classList.remove('is-open');
            otherToggle.setAttribute('aria-expanded', 'false');
            otherContent.style.maxHeight = null;
            otherContent.style.paddingTop = null;
          }
        });
        if (isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.paddingTop = '10px';
        } else {
          content.style.maxHeight = null;
          content.style.paddingTop = null;
        }
      });
    });

    /* Lazy load product imagery */
    const lazyImages = document.querySelectorAll('[data-lazy]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.onload = () => {
                img.dataset.loaded = 'true';
              };
              img.removeAttribute('data-src');
            }
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '120px' });
      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      lazyImages.forEach((img) => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.dataset.loaded = 'true';
          img.removeAttribute('data-src');
        }
      });
    }
  });
})();