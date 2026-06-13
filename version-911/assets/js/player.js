(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var video = document.querySelector("[data-player]");
    var button = document.querySelector("[data-play-button]");
    var message = document.querySelector("[data-player-message]");
    var Hls = window.Hls;

    if (!video) {
      return;
    }

    var source = video.dataset.src;
    var hls = null;
    var initialized = false;

    function setMessage(text) {
      if (message) {
        message.textContent = text;
      }
    }

    function initializePlayer() {
      if (initialized || !source) {
        return;
      }

      initialized = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        setMessage("已绑定播放源，可直接播放。");
        return;
      }

      if (Hls && Hls.isSupported()) {
        video.removeAttribute("src");
        video.querySelectorAll("source").forEach(function (item) {
          item.remove();
        });

        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          setMessage("播放源加载完成。");
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setMessage("播放源加载遇到问题，请刷新页面后重试。");
          }
        });

        return;
      }

      setMessage("当前浏览器暂不支持 HLS 播放，请更换现代浏览器。");
    }

    initializePlayer();

    if (button) {
      button.addEventListener("click", function () {
        initializePlayer();

        var promise = video.play();
        button.classList.add("is-hidden");

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            button.classList.remove("is-hidden");
            setMessage("请再次点击播放按钮开始观看。");
          });
        }
      });

      video.addEventListener("play", function () {
        button.classList.add("is-hidden");
      });

      video.addEventListener("pause", function () {
        if (video.currentTime === 0 || video.ended) {
          button.classList.remove("is-hidden");
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
