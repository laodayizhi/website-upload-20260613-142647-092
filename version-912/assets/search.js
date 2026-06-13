(function() {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[match];
    });
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 4).map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '  <a class="poster" href="' + escapeHtml(movie.url) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="duration">' + escapeHtml(movie.duration) + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <a class="card-title" href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a>',
      '    <div class="card-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.category) + '</div>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function runSearch() {
    var query = getQuery();
    var title = document.querySelector('[data-search-title]');
    var desc = document.querySelector('[data-search-desc]');
    var results = document.querySelector('[data-search-results]');
    var input = document.querySelector('.search-page-form input[name="q"]');
    if (input) {
      input.value = query;
    }
    if (!query || !results || !window.SITE_SEARCH_DATA) {
      return;
    }
    var lower = query.toLowerCase();
    var matched = window.SITE_SEARCH_DATA.filter(function(movie) {
      return [
        movie.title,
        movie.region,
        movie.category,
        movie.genre,
        movie.year,
        movie.oneLine,
        (movie.tags || []).join(' ')
      ].join(' ').toLowerCase().indexOf(lower) !== -1;
    }).slice(0, 120);
    if (title) {
      title.textContent = '搜索结果：' + query;
    }
    if (desc) {
      desc.textContent = matched.length ? '以下为相关影片结果。' : '没有找到完全匹配的影片，可尝试更换关键词。';
    }
    results.innerHTML = matched.length ? matched.map(card).join('') : '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSearch);
  } else {
    runSearch();
  }
}());
