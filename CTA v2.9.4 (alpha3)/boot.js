  (function() {
    try {
      var overlay = document.getElementById("disclaimerOverlay");
      var hideUntil = localStorage.getItem("dispenser_hide_disclaimer");
      var now = Date.now();
      if (hideUntil && now <= parseInt(hideUntil, 10)) {
        if (overlay) overlay.classList.remove("open");
      } else {
        document.body.style.overflow = "hidden";
      }
    } catch (e) {}
  })();
