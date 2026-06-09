(function() {
  'use strict';

  function init() {
    loadTheme();
    Agenda.calendar.init();
    Agenda.events.init();
    showTodaysEvents();
    registerServiceWorker();
    setupThemeToggle();
    setupResizeHandler();
  }

  function showTodaysEvents() {
    var today = new Date();
    if (Agenda.events && Agenda.calendar) {
      Agenda.events.showDayEvents(today);
    }
  }

  function loadTheme() {
    var theme = Agenda.storage.getTheme();
    if (theme === 'dark') {
      document.body.classList.add('dark');
    }
  }

  function setupThemeToggle() {
    var btn = document.getElementById('btn-theme');
    if (!btn) return;
    btn.addEventListener('click', function() {
      document.body.classList.toggle('dark');
      var isDark = document.body.classList.contains('dark');
      Agenda.storage.setTheme(isDark ? 'dark' : 'light');
    });
  }

  function setupResizeHandler() {
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (Agenda.calendar) Agenda.calendar.render();
      }, 300);
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function(err) {
        console.log('ServiceWorker não registrado:', err);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
