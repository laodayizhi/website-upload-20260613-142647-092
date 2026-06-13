(function() {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function() {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function() {
        mobileMenu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-site-search]").forEach(function(form) {
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var keyword = input ? input.value.trim() : "";
        if (keyword) {
          window.location.href = "./search.html?q=" + encodeURIComponent(keyword);
        }
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var index = 0;

      function showSlide(nextIndex) {
        index = nextIndex % slides.length;
        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function(dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
          var nextIndex = Number(dot.getAttribute("data-hero-dot"));
          showSlide(nextIndex);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function() {
          showSlide(index + 1);
        }, 5200);
      }
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var filterInput = document.querySelector("[data-filter-input]");
    var filterYear = document.querySelector("[data-filter-year]");
    var filterType = document.querySelector("[data-filter-type]");
    var filterCategory = document.querySelector("[data-filter-category]");
    var emptyResult = document.querySelector("[data-empty-result]");

    if (cards.length && (filterInput || filterYear || filterType || filterCategory)) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";

      if (filterInput && query) {
        filterInput.value = query;
      }

      function yearMatches(cardYear, selectedYear) {
        if (!selectedYear) {
          return true;
        }

        if (selectedYear === "1990") {
          return /^199/.test(cardYear);
        }

        if (selectedYear === "1980") {
          return /^198/.test(cardYear);
        }

        return cardYear.indexOf(selectedYear) !== -1;
      }

      function applyFilters() {
        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
        var year = filterYear ? filterYear.value : "";
        var type = filterType ? filterType.value : "";
        var category = filterCategory ? filterCategory.value : "";
        var visible = 0;

        cards.forEach(function(card) {
          var haystack = card.getAttribute("data-search") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var cardCategory = card.getAttribute("data-category") || "";
          var matched = true;

          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }

          if (!yearMatches(cardYear, year)) {
            matched = false;
          }

          if (type && cardType.indexOf(type) === -1) {
            matched = false;
          }

          if (category && cardCategory !== category) {
            matched = false;
          }

          card.style.display = matched ? "" : "none";

          if (matched) {
            visible += 1;
          }
        });

        if (emptyResult) {
          emptyResult.classList.toggle("is-visible", visible === 0);
        }
      }

      [filterInput, filterYear, filterType, filterCategory].forEach(function(element) {
        if (element) {
          element.addEventListener("input", applyFilters);
          element.addEventListener("change", applyFilters);
        }
      });

      applyFilters();
    }
  });
}());
