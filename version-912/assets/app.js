(function() {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function() {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (toggle && panel) {
      toggle.addEventListener('click', function() {
        var isOpen = panel.hasAttribute('hidden') === false;
        if (isOpen) {
          panel.setAttribute('hidden', '');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '☰';
        } else {
          panel.removeAttribute('hidden');
          toggle.setAttribute('aria-expanded', 'true');
          toggle.textContent = '×';
        }
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function showSlide(target) {
        if (!slides.length) {
          return;
        }
        index = (target + slides.length) % slides.length;
        slides.forEach(function(slide, current) {
          slide.classList.toggle('is-active', current === index);
        });
        dots.forEach(function(dot, current) {
          dot.classList.toggle('is-active', current === index);
        });
      }

      function startTimer() {
        stopTimer();
        timer = window.setInterval(function() {
          showSlide(index + 1);
        }, 5200);
      }

      function stopTimer() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener('click', function() {
          showSlide(index - 1);
          startTimer();
        });
      }
      if (next) {
        next.addEventListener('click', function() {
          showSlide(index + 1);
          startTimer();
        });
      }
      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
          startTimer();
        });
      });
      hero.addEventListener('mouseenter', stopTimer);
      hero.addEventListener('mouseleave', startTimer);
      startTimer();
    }

    var filterRoot = document.querySelector('[data-filter-root]');
    if (filterRoot) {
      var searchInput = filterRoot.querySelector('[data-local-search]');
      var yearButtons = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-filter-year]'));
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
      var activeYear = 'all';

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function applyFilter() {
        var keyword = normalize(searchInput ? searchInput.value : '');
        cards.forEach(function(card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type')
          ].join(' '));
          var year = card.getAttribute('data-year');
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchYear = activeYear === 'all' || year === activeYear;
          card.style.display = matchKeyword && matchYear ? '' : 'none';
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
      }
      yearButtons.forEach(function(button) {
        button.addEventListener('click', function() {
          activeYear = button.getAttribute('data-filter-year') || 'all';
          yearButtons.forEach(function(item) {
            item.classList.toggle('is-active', item === button);
          });
          applyFilter();
        });
      });
    }
  });
}());
