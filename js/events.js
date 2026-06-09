window.Agenda = window.Agenda || {};

(function() {
  var currentEvents = [];
  var editingId = null;
  var titleInk = null;
  var notesInk = null;

  function showDayEvents(date) {
    var dateStr = Agenda.utils.dateToString(date);
    var events = Agenda.storage.getEventsByDate(dateStr);
    currentEvents = events;

    var label = document.getElementById('day-label');
    if (label) {
      label.textContent = Agenda.utils.formatDate(date);
    }

    var container = document.getElementById('day-events');
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML = '<div class="empty-state">Nenhum evento neste dia</div>';
      return;
    }

    container.innerHTML = '';

    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var card = document.createElement('div');
      card.className = 'event-card';
      var catColor = Agenda.utils.getCategoryColor(ev.categoryId);
      card.style.setProperty('--card-color', catColor);

      if (ev.time) {
        var timeBadge = document.createElement('span');
        timeBadge.className = 'event-time-badge';
        timeBadge.textContent = ev.time;
        card.appendChild(timeBadge);
      }

      var catDot = document.createElement('span');
      catDot.className = 'event-category-dot';
      catDot.style.background = catColor;
      card.appendChild(catDot);

      var preview = document.createElement('div');
      preview.className = 'event-title-preview';

      var previewCanvas = document.createElement('canvas');
      previewCanvas.width = 200;
      previewCanvas.height = 36;
      preview.appendChild(previewCanvas);
      card.appendChild(preview);

      (function(ev, pCanvas) {
        setTimeout(function() {
          if (ev.title && ev.title.strokes && ev.title.strokes.length > 0) {
            Agenda.ink.renderToCanvas(pCanvas, ev.title);
          }
        }, 10);
      })(ev, previewCanvas);

      card.addEventListener('click', function(e) {
        Agenda.events.showEventDetail(ev.id);
      });

      container.appendChild(card);
    }
  }

  function showEventForm(eventId) {
    editingId = eventId || null;

    var overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');

    var formView = document.getElementById('view-event-form');
    var detailView = document.getElementById('view-event-detail');
    formView.classList.remove('hidden');
    detailView.classList.add('hidden');

    var titleEl = document.getElementById('form-title');
    var saveBtn = document.getElementById('btn-save');
    var deleteBtn = document.getElementById('btn-delete-event');

    var eventData = null;
    if (editingId) {
      eventData = Agenda.storage.getEvent(editingId);
    }

    if (eventData) {
      titleEl.textContent = 'Editar Evento';
      saveBtn.textContent = 'Atualizar Evento';
      deleteBtn.classList.remove('hidden');
    } else {
      titleEl.textContent = 'Novo Evento';
      saveBtn.textContent = 'Salvar Evento';
      deleteBtn.classList.add('hidden');
    }

    document.getElementById('event-date').value = eventData ? (eventData.date || Agenda.utils.dateToString(Agenda.calendar.getSelectedDate())) : Agenda.utils.dateToString(Agenda.calendar.getSelectedDate());
    document.getElementById('event-time').value = eventData ? (eventData.time || '') : '';
    selectCategory(eventData ? (eventData.categoryId || 'outros') : 'outros');
    selectRecurrence(eventData ? (eventData.recurrence || 'none') : 'none');

    initFormCanvases(eventData);
  }

  function initFormCanvases(eventData) {
    if (titleInk) { titleInk.destroy(); titleInk = null; }
    if (notesInk) { notesInk.destroy(); notesInk = null; }

    requestAnimationFrame(function() {
      var titleCanvas = document.getElementById('canvas-title');
      var notesCanvas = document.getElementById('canvas-notes');

      if (titleCanvas) {
        titleInk = new Agenda.ink(titleCanvas, {
          penColor: '#1C1C1E',
          penSize: 4,
          onChange: function() {}
        });
        if (eventData && eventData.title) titleInk.loadData(eventData.title);
        setupFormToolbar('toolbar-title', titleInk);
      }

      if (notesCanvas) {
        notesInk = new Agenda.ink(notesCanvas, {
          penColor: '#1C1C1E',
          penSize: 3,
          onChange: function() {}
        });
        if (eventData && eventData.notes) notesInk.loadData(eventData.notes);
        setupFormToolbar('toolbar-notes', notesInk);
      }
    });
  }

  function setupFormToolbar(toolbarId, inkInstance) {
    var toolbar = document.getElementById(toolbarId);
    if (!toolbar || !inkInstance) return;

    var colorBtns = toolbar.querySelectorAll('.ink-color-btn');
    for (var i = 0; i < colorBtns.length; i++) {
      (function(btn) {
        btn.onclick = function() {
          var active = toolbar.querySelectorAll('.ink-color-btn.active');
          for (var j = 0; j < active.length; j++) active[j].classList.remove('active');
          btn.classList.add('active');
          inkInstance.setPenColor(btn.getAttribute('data-color'));
        };
      })(colorBtns[i]);
    }

    var sizeBtns = toolbar.querySelectorAll('.ink-size-btn');
    for (var i = 0; i < sizeBtns.length; i++) {
      (function(btn) {
        btn.onclick = function() {
          var active = toolbar.querySelectorAll('.ink-size-btn.active');
          for (var j = 0; j < active.length; j++) active[j].classList.remove('active');
          btn.classList.add('active');
          inkInstance.setPenSize(parseInt(btn.getAttribute('data-size')));
        };
      })(sizeBtns[i]);
    }

    var undoBtn = toolbar.querySelector('.ink-undo-btn');
    if (undoBtn) undoBtn.onclick = function() { inkInstance.undo(); };

    var eraserBtn = toolbar.querySelector('.ink-eraser-btn');
    if (eraserBtn) eraserBtn.onclick = function() {
      inkInstance.toggleEraser();
      eraserBtn.classList.toggle('active');
    };

    var clearBtn = toolbar.querySelector('.ink-clear-btn');
    if (clearBtn) clearBtn.onclick = function() { inkInstance.clear(); };
  }

  function selectCategory(catId) {
    var container = document.getElementById('category-selector');
    if (!container) return;
    var btns = container.querySelectorAll('.category-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('selected', btns[i].getAttribute('data-cat-id') === catId);
    }
  }

  function selectRecurrence(recId) {
    var container = document.getElementById('recurrence-selector');
    if (!container) return;
    var btns = container.querySelectorAll('.recurrence-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('selected', btns[i].getAttribute('data-rec-id') === recId);
    }
  }

  function saveEvent() {
    var date = document.getElementById('event-date').value;
    var time = document.getElementById('event-time').value;

    if (!date) {
      Agenda.utils.showToast('Selecione uma data');
      return;
    }

    var selectedCat = document.querySelector('#category-selector .category-btn.selected');
    var categoryId = selectedCat ? selectedCat.getAttribute('data-cat-id') : 'outros';

    var selectedRec = document.querySelector('#recurrence-selector .recurrence-btn.selected');
    var recurrence = selectedRec ? selectedRec.getAttribute('data-rec-id') : 'none';

    var titleData = titleInk ? titleInk.getData() : { strokes: [] };
    var notesData = notesInk ? notesInk.getData() : { strokes: [] };

    var eventData = {
      title: titleData,
      notes: notesData,
      date: date,
      time: time,
      categoryId: categoryId,
      recurrence: recurrence
    };

    var saved;
    if (editingId) {
      saved = Agenda.storage.updateEvent(editingId, eventData);
      if (saved) Agenda.utils.showToast('Evento atualizado');
    } else {
      saved = Agenda.storage.addEvent(eventData);
      if (saved) Agenda.utils.showToast('Evento criado');
    }

    if (saved) {
      closeForm();
      Agenda.calendar.render();
      var dateObj = Agenda.utils.stringToDate(date);
      showDayEvents(dateObj);
    } else {
      Agenda.utils.showToast('Erro ao salvar evento');
    }
  }

  function deleteEvent() {
    if (!editingId) return;
    if (!confirm('Excluir este evento?')) return;

    var deleted = Agenda.storage.deleteEvent(editingId);
    if (deleted) {
      Agenda.utils.showToast('Evento excluído');
      closeForm();
      Agenda.calendar.render();
      showDayEvents(Agenda.calendar.getSelectedDate());
    } else {
      Agenda.utils.showToast('Erro ao excluir evento');
    }
  }

  function closeForm() {
    var overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
    if (titleInk) { titleInk.destroy(); titleInk = null; }
    if (notesInk) { notesInk.destroy(); notesInk = null; }
    editingId = null;
  }

  function showEventDetail(eventId) {
    var eventData = Agenda.storage.getEvent(eventId);
    if (!eventData) return;

    var overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');

    var formView = document.getElementById('view-event-form');
    var detailView = document.getElementById('view-event-detail');
    formView.classList.add('hidden');
    detailView.classList.remove('hidden');

    var badge = document.getElementById('detail-category-badge');
    var catColor = Agenda.utils.getCategoryColor(eventData.categoryId);
    var catName = Agenda.utils.getCategoryName(eventData.categoryId);
    badge.style.background = catColor;
    badge.textContent = catName;

    requestAnimationFrame(function() {
      var titleCanvas = document.getElementById('detail-title-canvas');
      if (titleCanvas && eventData.title) {
        Agenda.ink.renderToCanvas(titleCanvas, eventData.title);
      }

      var notesCanvas = document.getElementById('detail-notes-canvas');
      if (notesCanvas && eventData.notes) {
        Agenda.ink.renderToCanvas(notesCanvas, eventData.notes);
      }
    });

    var dateObj = Agenda.utils.stringToDate(eventData.date);
    document.getElementById('detail-date').textContent = '\uD83D\uDCC5 ' + Agenda.utils.formatDate(dateObj);
    document.getElementById('detail-time').textContent = eventData.time ? '\u23F0 ' + eventData.time : '\u23F0 Sem horário';
    document.getElementById('detail-recurrence').textContent = '\uD83D\uDD01 ' + Agenda.utils.getRecurrenceLabel(eventData.recurrence);

    document.getElementById('btn-edit-event').onclick = function() { showEventForm(eventId); };
    document.getElementById('btn-delete-from-detail').onclick = function() {
      deleteEventById(eventId);
    };
    document.getElementById('btn-share-event').onclick = function() { shareEvent(eventData); };
    document.getElementById('btn-export-event').onclick = function() { exportEvent(eventData); };
  }

  function deleteEventById(id) {
    if (!confirm('Excluir este evento?')) return;
    Agenda.storage.deleteEvent(id);
    Agenda.utils.showToast('Evento excluído');
    closeDetail();
    Agenda.calendar.render();
    showDayEvents(Agenda.calendar.getSelectedDate());
  }

  function closeDetail() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }

  function shareEvent(eventData) {
    var dateStr = Agenda.utils.formatDate(Agenda.utils.stringToDate(eventData.date));
    var text = 'Evento: ' + dateStr;
    if (eventData.time) text += ' às ' + eventData.time;
    text += '\nCategoria: ' + Agenda.utils.getCategoryName(eventData.categoryId);

    if (navigator.share) {
      navigator.share({
        title: 'Evento da Agenda',
        text: text
      }).catch(function() {});
    } else {
      Agenda.utils.showToast('Compartilhamento não disponível neste dispositivo');
    }
  }

  function exportEvent(eventData) {
    var data = {
      tipo: 'Evento Agenda',
      data: eventData.date,
      horario: eventData.time || '',
      categoria: Agenda.utils.getCategoryName(eventData.categoryId),
      recorrencia: Agenda.utils.getRecurrenceLabel(eventData.recurrence),
      exportadoEm: new Date().toISOString()
    };
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'evento-' + eventData.date + '.json';
    a.click();
    URL.revokeObjectURL(url);
    Agenda.utils.showToast('Evento exportado');
  }

  function init() {
    var container = document.getElementById('category-selector');
    if (container) {
      var categories = Agenda.storage.getCategories();
      container.innerHTML = '';
      for (var i = 0; i < categories.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.setAttribute('data-cat-id', categories[i].id);
        btn.style.color = categories[i].color;
        btn.style.borderColor = categories[i].color;

        var dot = document.createElement('span');
        dot.className = 'cat-dot';
        dot.style.background = categories[i].color;
        btn.appendChild(dot);
        btn.appendChild(document.createTextNode(' ' + categories[i].name));

        (function(catId) {
          btn.addEventListener('click', function() {
            selectCategory(catId);
          });
        })(categories[i].id);

        container.appendChild(btn);
      }
    }

    var recContainer = document.getElementById('recurrence-selector');
    if (recContainer) {
      var recOptions = Agenda.utils.recurrenceOptions;
      recContainer.innerHTML = '';
      for (var i = 0; i < recOptions.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'recurrence-btn';
        btn.setAttribute('data-rec-id', recOptions[i].id);
        btn.textContent = recOptions[i].label;

        (function(recId) {
          btn.addEventListener('click', function() {
            selectRecurrence(recId);
          });
        })(recOptions[i].id);

        recContainer.appendChild(btn);
      }
    }

    document.getElementById('btn-new-event').addEventListener('click', function() {
      showEventForm(null);
    });

    document.getElementById('btn-form-back').addEventListener('click', closeForm);
    document.getElementById('btn-detail-back').addEventListener('click', closeDetail);
    document.getElementById('btn-save').addEventListener('click', saveEvent);
    document.getElementById('btn-delete-event').addEventListener('click', deleteEvent);

    document.getElementById('modal-overlay').addEventListener('click', function(e) {
      if (e.target === this) closeForm();
    });

    document.getElementById('event-date').value = Agenda.utils.dateToString(new Date());
  }

  Agenda.events = {
    showDayEvents: showDayEvents,
    showEventForm: showEventForm,
    showEventDetail: showEventDetail,
    init: init
  };
})();
