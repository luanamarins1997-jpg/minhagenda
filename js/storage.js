window.Agenda = window.Agenda || {};

(function() {
  var S = {
    KEYS: {
      EVENTS: 'agenda_events',
      CATEGORIES: 'agenda_categories',
      THEME: 'agenda_theme'
    },

    _save(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (e) {
        console.error('Erro ao salvar:', e);
        return false;
      }
    },

    _load(key, defaultValue) {
      try {
        var data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (e) {
        console.error('Erro ao carregar:', e);
        return defaultValue;
      }
    },

    getEvents() {
      return this._load(this.KEYS.EVENTS, []);
    },

    saveEvents(events) {
      return this._save(this.KEYS.EVENTS, events);
    },

    addEvent(event) {
      var events = this.getEvents();
      event.id = Agenda.utils.generateId();
      event.createdAt = new Date().toISOString();
      event.updatedAt = new Date().toISOString();
      events.push(event);
      this.saveEvents(events);
      return event;
    },

    updateEvent(id, updates) {
      var events = this.getEvents();
      var index = events.findIndex(function(e) { return e.id === id; });
      if (index === -1) return null;
      for (var key in updates) {
        if (updates.hasOwnProperty(key)) {
          events[index][key] = updates[key];
        }
      }
      events[index].updatedAt = new Date().toISOString();
      this.saveEvents(events);
      return events[index];
    },

    deleteEvent(id) {
      var events = this.getEvents();
      var filtered = events.filter(function(e) { return e.id !== id; });
      if (filtered.length === events.length) return false;
      this.saveEvents(filtered);
      return true;
    },

    getEvent(id) {
      var events = this.getEvents();
      for (var i = 0; i < events.length; i++) {
        if (events[i].id === id) return events[i];
      }
      return null;
    },

    getEventsByDate(dateStr) {
      var events = this.getEvents();
      var result = [];
      for (var i = 0; i < events.length; i++) {
        if (events[i].date === dateStr) {
          result.push(events[i]);
        }
      }
      result.sort(function(a, b) {
        var tA = a.time || '99:99';
        var tB = b.time || '99:99';
        return tA > tB ? 1 : -1;
      });
      return result;
    },

    getEventsByMonth(year, month) {
      var prefix = year + '-' + String(month + 1).padStart(2, '0');
      var events = this.getEvents();
      var result = [];
      for (var i = 0; i < events.length; i++) {
        if (events[i].date && events[i].date.indexOf(prefix) === 0) {
          result.push(events[i]);
        }
      }
      return result;
    },

    getCategories() {
      return this._load(this.KEYS.CATEGORIES, Agenda.utils.defaultCategories.slice());
    },

    saveCategories(categories) {
      return this._save(this.KEYS.CATEGORIES, categories);
    },

    getTheme() {
      return this._load(this.KEYS.THEME, 'light');
    },

    setTheme(theme) {
      return this._save(this.KEYS.THEME, theme);
    }
  };

  Agenda.storage = S;
})();
