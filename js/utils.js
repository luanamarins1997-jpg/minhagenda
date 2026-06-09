window.Agenda = window.Agenda || {};

(function() {
  const U = {
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    formatDate(date) {
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatDateShort(date) {
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    },

    getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    },

    getFirstDayOfMonth(year, month) {
      return new Date(year, month, 1).getDay();
    },

    isSameDay(d1, d2) {
      if (!d1 || !d2) return false;
      return d1.getFullYear() === d2.getFullYear() &&
             d1.getMonth() === d2.getMonth() &&
             d1.getDate() === d2.getDate();
    },

    isToday(date) {
      return this.isSameDay(date, new Date());
    },

    dateToString(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },

    stringToDate(str) {
      if (!str) return new Date();
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    },

    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],

    dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],

    defaultCategories: [
      { id: 'trabalho', name: 'Trabalho', color: '#007AFF' },
      { id: 'pessoal', name: 'Pessoal', color: '#34C759' },
      { id: 'saude', name: 'Saúde', color: '#FF9500' },
      { id: 'estudos', name: 'Estudos', color: '#AF52DE' },
      { id: 'outros', name: 'Outros', color: '#8E8E93' }
    ],

    recurrenceOptions: [
      { id: 'none', label: 'Não repete' },
      { id: 'daily', label: 'Diário' },
      { id: 'weekly', label: 'Semanal' },
      { id: 'monthly', label: 'Mensal' },
      { id: 'yearly', label: 'Anual' }
    ],

    getCategoryColor(catId) {
      const cats = Agenda.storage.getCategories();
      const c = cats.find(c => c.id === catId);
      return c ? c.color : '#8E8E93';
    },

    getCategoryName(catId) {
      const cats = Agenda.storage.getCategories();
      const c = cats.find(c => c.id === catId);
      return c ? c.name : 'Outros';
    },

    getRecurrenceLabel(id) {
      const r = this.recurrenceOptions.find(r => r.id === id);
      return r ? r.label : 'Não repete';
    },

    getNextRecurrenceDate(event) {
      if (!event.recurrence || event.recurrence === 'none') return null;
      const d = this.stringToDate(event.date);
      switch (event.recurrence) {
        case 'daily': d.setDate(d.getDate() + 1); break;
        case 'weekly': d.setDate(d.getDate() + 7); break;
        case 'monthly': d.setMonth(d.getMonth() + 1); break;
        case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
      }
      return this.dateToString(d);
    },

    showToast(message, duration) {
      duration = duration || 2500;
      var toast = document.getElementById('toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.remove('hidden');
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(function() {
        toast.classList.add('hidden');
      }, duration);
    }
  };

  Agenda.utils = U;
})();
