(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function includesText(value, query) {
    return normalize(value).indexOf(normalize(query)) !== -1;
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.from(hero.querySelectorAll(".hero-slide"));
      var dots = Array.from(hero.querySelectorAll(".hero-dot"));
      var next = hero.querySelector("[data-hero-next]");
      var prev = hero.querySelector("[data-hero-prev]");
      var active = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        active = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          start();
        });
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          start();
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          start();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-grid]").forEach(function (grid) {
      var scope = grid.closest("[data-filter-scope]") || document;
      var keyword = scope.querySelector("[data-filter-keyword]");
      var year = scope.querySelector("[data-filter-year]");
      var region = scope.querySelector("[data-filter-region]");
      var type = scope.querySelector("[data-filter-type]");
      var cards = Array.from(grid.querySelectorAll("[data-title]"));

      function applyFilters() {
        var q = keyword ? keyword.value : "";
        var y = year ? year.value : "";
        var r = region ? region.value : "";
        var t = type ? type.value : "";

        cards.forEach(function (card) {
          var matched = true;

          if (q) {
            matched = includesText(card.dataset.title, q) || includesText(card.dataset.genre, q);
          }

          if (matched && y) {
            matched = card.dataset.year === y;
          }

          if (matched && r) {
            matched = card.dataset.region === r;
          }

          if (matched && t) {
            matched = card.dataset.type === t;
          }

          card.style.display = matched ? "" : "none";
        });
      }

      [keyword, year, region, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });
    });

    var searchForm = document.querySelector("[data-search-page]");
    if (searchForm && window.MOVIE_INDEX) {
      var searchInput = searchForm.querySelector("[data-search-input]");
      var searchYear = searchForm.querySelector("[data-search-year]");
      var searchRegion = searchForm.querySelector("[data-search-region]");
      var searchType = searchForm.querySelector("[data-search-type]");
      var results = document.querySelector("[data-search-results]");
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q") || "";

      if (searchInput) {
        searchInput.value = initialQuery;
      }

      function renderResults() {
        var q = searchInput ? searchInput.value : "";
        var y = searchYear ? searchYear.value : "";
        var r = searchRegion ? searchRegion.value : "";
        var t = searchType ? searchType.value : "";

        var matched = window.MOVIE_INDEX.filter(function (movie) {
          var textMatch = !q ||
            includesText(movie.title, q) ||
            includesText(movie.genre, q) ||
            includesText(movie.tags, q) ||
            includesText(movie.oneLine, q);

          return textMatch &&
            (!y || movie.year === y) &&
            (!r || movie.region === r) &&
            (!t || movie.type === t);
        }).slice(0, 120);

        if (!results) {
          return;
        }

        if (!matched.length) {
          results.innerHTML = '<div class="search-empty">没有找到匹配的影片，请尝试更换关键词或筛选条件。</div>';
          return;
        }

        results.innerHTML = matched.map(function (movie) {
          return [
            '<article class="movie-row">',
            '  <a class="movie-row-poster" href="' + movie.path + '">',
            '    <img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, "&quot;") + '" loading="lazy">',
            '  </a>',
            '  <div class="movie-row-body">',
            '    <div class="movie-card-tags">',
            '      <span>' + movie.category + '</span>',
            '      <span>' + movie.year + '</span>',
            '      <span>' + movie.type + '</span>',
            '    </div>',
            '    <h3><a href="' + movie.path + '">' + movie.title + '</a></h3>',
            '    <p>' + movie.oneLine + '</p>',
            '    <div class="movie-row-meta">',
            '      <span>' + movie.region + '</span>',
            '      <span>' + movie.genre + '</span>',
            '    </div>',
            '  </div>',
            '</article>'
          ].join("");
        }).join("");
      }

      [searchInput, searchYear, searchRegion, searchType].forEach(function (control) {
        if (control) {
          control.addEventListener("input", renderResults);
          control.addEventListener("change", renderResults);
        }
      });

      renderResults();
    }
  });
})();
