window.Agenda = window.Agenda || {};

(function() {
  var state = {
    viewYear: new Date().getFullYear(),
    viewMonth: new Date().getMonth(),
    selectedDate: new Date()
  };

  function render() {
    renderGrid();
    renderTitle();
  }

  function renderGrid() {
    var grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    var U = Agenda.utils;
    var days = U.dayNames;

    for (var d = 0; d < 7; d++) {
      var header = document.createElement('div');
      header.className = 'calendar-day-header';
      header.textContent = days[d];
      grid.appendChild(header);
    }

    var year = state.viewYear;
    var month = state.viewMonth;
    var firstDay = U.getFirstDayOfMonth(year, month);
    var daysInMonth = U.getDaysInMonth(year, month);
    var daysInPrev = U.getDaysInMonth(year, month - 1);

    var prevMonth = month - 1;
    var prevYear = year;
    if (prevMonth < 0) { prevMonth = 11; prevYear--; }
    var nextMonth = month + 1;
    var nextYear = year;
    if (nextMonth > 11) { nextMonth = 0; nextYear++; }

    var monthStr = year + '-' + String(month + 1).padStart(2, '0');
    var events = Agenda.storage.getEventsByMonth(year, month);
    var eventDates = {};
    for (var i = 0; i < events.length; i++) {
      var dateStr = events[i].date;
      if (!eventDates[dateStr]) eventDates[dateStr] = [];
      eventDates[dateStr].push(events[i]);
    }

    var today = new Date();

    for (var i = 0; i < firstDay; i++) {
      var day = daysInPrev - firstDay + 1 + i;
      var cell = createCell(day, true, prevMonth, prevYear, null, today, null);
      grid.appendChild(cell);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = monthStr + '-' + String(day).padStart(2, '0');
      var dayEvents = eventDates[dateStr] || null;
      var cellDate = new Date(year, month, day);
      var cell = createCell(day, false, month, year, cellDate, today, dayEvents);
      grid.appendChild(cell);
    }

    var totalCells = firstDay + daysInMonth;
    var remaining = 42 - totalCells;
    for (var i = 0; i < remaining; i++) {
      var day = i + 1;
      var cell = createCell(day, true, nextMonth, nextYear, null, today, null);
      grid.appendChild(cell);
    }
  }

  function createCell(day, isOther, month, year, date, today, dayEvents) {
    var cell = document.createElement('div');
    cell.className = 'calendar-cell';
    if (isOther) cell.classList.add('other-month');

    var U = Agenda.utils;

    if (date && U.isToday(date)) {
      cell.classList.add('today');
    }

    if (date && state.selectedDate && U.isSameDay(date, state.selectedDate)) {
      cell.classList.add('selected');
    }

    var dayNum = document.createElement('span');
    dayNum.textContent = day;
    cell.appendChild(dayNum);

    if (dayEvents && dayEvents.length > 0) {
      var dots = document.createElement('div');
      dots.className = 'event-dots';
      var colors = {};
      for (var i = 0; i < Math.min(dayEvents.length, 4); i++) {
        var catColor = U.getCategoryColor(dayEvents[i].categoryId);
        if (!colors[catColor]) {
          colors[catColor] = true;
          var dot = document.createElement('span');
          dot.className = 'dot';
          dot.style.background = catColor;
          dots.appendChild(dot);
        }
      }
      cell.appendChild(dots);
    }

    if (date) {
      cell.addEventListener('click', function(d) {
        return function() {
          state.selectedDate = d;
          render();
          if (Agenda.events) Agenda.events.showDayEvents(d);
        };
      }(date));
    }

    return cell;
  }

  function renderTitle() {
    var title = document.getElementById('month-title');
    if (title) {
      title.textContent = Agenda.utils.monthNames[state.viewMonth] + ' ' + state.viewYear;
    }
  }

  function goToPrevMonth() {
    state.viewMonth--;
    if (state.viewMonth < 0) {
      state.viewMonth = 11;
      state.viewYear--;
    }
    render();
  }

  function goToNextMonth() {
    state.viewMonth++;
    if (state.viewMonth > 11) {
      state.viewMonth = 0;
      state.viewYear++;
    }
    render();
  }

  function goToToday() {
    var now = new Date();
    state.viewYear = now.getFullYear();
    state.viewMonth = now.getMonth();
    state.selectedDate = now;
    render();
    if (Agenda.events) Agenda.events.showDayEvents(now);
  }

  function goToDate(date) {
    state.viewYear = date.getFullYear();
    state.viewMonth = date.getMonth();
    state.selectedDate = date;
    render();
  }

  function getSelectedDate() {
    return state.selectedDate;
  }

  function init() {
    var now = new Date();
    state.selectedDate = now;
    render();

    document.getElementById('btn-prev-month').addEventListener('click', goToPrevMonth);
    document.getElementById('btn-next-month').addEventListener('click', goToNextMonth);
    document.getElementById('btn-today').addEventListener('click', goToToday);
  }

  Agenda.calendar = {
    render: render,
    goToPrevMonth: goToPrevMonth,
    goToNextMonth: goToNextMonth,
    goToToday: goToToday,
    goToDate: goToDate,
    getSelectedDate: getSelectedDate,
    init: init
  };
})();
