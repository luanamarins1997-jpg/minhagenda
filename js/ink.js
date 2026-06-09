window.Agenda = window.Agenda || {};

(function() {
  function InkCanvas(canvas, options) {
    options = options || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.strokes = [];
    this.currentStroke = null;
    this.isDrawing = false;
    this.readOnly = options.readOnly || false;
    this.penColor = options.penColor || '#1C1C1E';
    this.penSize = options.penSize || 3;
    this.isEraser = false;
    this.onChange = options.onChange || null;
    this.dpr = window.devicePixelRatio || 1;

    if (!this.readOnly) {
      this._initCanvas();
      this._bindEvents();
    }
  }

  InkCanvas.prototype._initCanvas = function() {
    var rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(this.dpr, this.dpr);
    this._clearCanvas();
  };

  InkCanvas.prototype._clearCanvas = function() {
    var rect = this.canvas.getBoundingClientRect();
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, rect.width, rect.height);
  };

  InkCanvas.prototype._bindEvents = function() {
    this.canvas.style.touchAction = 'none';

    var self = this;

    this._onPointerDown = function(e) {
      if (e.pointerType === 'mouse' && !e.isPrimary) return;
      self.isDrawing = true;
      self.canvas.setPointerCapture(e.pointerId);
      var point = self._getPoint(e);
      self.currentStroke = [point];
      self._drawDot(point);
    };

    this._onPointerMove = function(e) {
      if (!self.isDrawing || !self.currentStroke) return;
      var point = self._getPoint(e);
      var last = self.currentStroke[self.currentStroke.length - 1];
      self.currentStroke.push(point);

      if (self.isEraser) {
        self._eraseSegment(last, point);
      } else {
        self._drawSegment(last, point);
      }
    };

    this._onPointerUp = function(e) {
      if (!self.isDrawing) return;
      self.isDrawing = false;
      if (self.currentStroke && self.currentStroke.length > 0) {
        self.strokes.push(self.currentStroke.slice());
      }
      self.currentStroke = null;
      if (self.onChange) self.onChange();
    };

    this.canvas.addEventListener('pointerdown', this._onPointerDown);
    this.canvas.addEventListener('pointermove', this._onPointerMove);
    this.canvas.addEventListener('pointerup', this._onPointerUp);
    this.canvas.addEventListener('pointercancel', this._onPointerUp);
  };

  InkCanvas.prototype._getPoint = function(e) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
      pointerType: e.pointerType
    };
  };

  InkCanvas.prototype._getStrokeWidth = function(point) {
    if (this.isEraser) return 24;
    var p = point.pressure || 0.5;
    return this.penSize * (0.4 + 0.6 * p);
  };

  InkCanvas.prototype._drawDot = function(point) {
    var ctx = this.ctx;
    var w = this._getStrokeWidth(point);
    ctx.beginPath();
    ctx.arc(point.x, point.y, w / 2, 0, Math.PI * 2);
    ctx.fillStyle = this.isEraser ? '#FFFFFF' : this.penColor;
    ctx.fill();
  };

  InkCanvas.prototype._drawSegment = function(p0, p1) {
    var ctx = this.ctx;
    var w0 = this._getStrokeWidth(p0) / 2;
    var w1 = this._getStrokeWidth(p1) / 2;
    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;
    var len = Math.sqrt(dx * dx + dy * dy);

    if (len < 2) {
      this._drawDot(p1);
      return;
    }

    var nx = -dy / len;
    var ny = dx / len;

    ctx.beginPath();
    ctx.moveTo(p0.x + nx * w0, p0.y + ny * w0);
    ctx.lineTo(p0.x - nx * w0, p0.y - ny * w0);
    ctx.lineTo(p1.x - nx * w1, p1.y - ny * w1);
    ctx.lineTo(p1.x + nx * w1, p1.y + ny * w1);
    ctx.closePath();
    ctx.fillStyle = this.penColor;
    ctx.fill();
  };

  InkCanvas.prototype._eraseSegment = function(p0, p1) {
    var ctx = this.ctx;
    var w = 12;
    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;
    var len = Math.sqrt(dx * dx + dy * dy);

    if (len < 2) {
      ctx.beginPath();
      ctx.arc(p0.x, p0.y, w, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      return;
    }

    var nx = -dy / len;
    var ny = dx / len;

    ctx.beginPath();
    ctx.moveTo(p0.x + nx * w, p0.y + ny * w);
    ctx.lineTo(p0.x - nx * w, p0.y - ny * w);
    ctx.lineTo(p1.x - nx * w, p1.y - ny * w);
    ctx.lineTo(p1.x + nx * w, p1.y + ny * w);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  };

  InkCanvas.prototype.clear = function() {
    this.strokes = [];
    this.currentStroke = null;
    this._clearCanvas();
    if (this.onChange) this.onChange();
  };

  InkCanvas.prototype.undo = function() {
    if (this.strokes.length === 0) return;
    this.strokes.pop();
    this._renderAll();
    if (this.onChange) this.onChange();
  };

  InkCanvas.prototype._renderAll = function() {
    this._clearCanvas();
    var wasEraser = this.isEraser;
    this.isEraser = false;

    for (var s = 0; s < this.strokes.length; s++) {
      var stroke = this.strokes[s];
      if (stroke.length === 0) continue;
      this._drawDot(stroke[0]);
      for (var i = 1; i < stroke.length; i++) {
        this._drawSegment(stroke[i - 1], stroke[i]);
      }
    }

    this.isEraser = wasEraser;
  };

  InkCanvas.prototype.getData = function() {
    return {
      strokes: this.strokes,
      penColor: this.penColor,
      penSize: this.penSize
    };
  };

  InkCanvas.prototype.loadData = function(data) {
    if (!data) {
      this.clear();
      return;
    }
    this.strokes = data.strokes || [];
    this.penColor = data.penColor || '#1C1C1E';
    this.penSize = data.penSize || 3;
    this._renderAll();
  };

  InkCanvas.prototype.setPenColor = function(color) {
    this.penColor = color;
    this.isEraser = false;
  };

  InkCanvas.prototype.setPenSize = function(size) {
    this.penSize = size;
  };

  InkCanvas.prototype.toggleEraser = function() {
    this.isEraser = !this.isEraser;
  };

  InkCanvas.prototype.resize = function() {
    var data = this.getData();
    this._initCanvas();
    this.loadData(data);
  };

  InkCanvas.prototype.destroy = function() {
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    this.canvas.removeEventListener('pointermove', this._onPointerMove);
    this.canvas.removeEventListener('pointerup', this._onPointerUp);
    this.canvas.removeEventListener('pointercancel', this._onPointerUp);
  };

  InkCanvas.renderToCanvas = function(canvas, inkData) {
    if (!inkData || !inkData.strokes) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);

    var strokes = inkData.strokes;
    var penColor = inkData.penColor || '#1C1C1E';
    var penSize = inkData.penSize || 3;

    function getWidth(point) {
      var p = point.pressure || 0.5;
      return penSize * (0.4 + 0.6 * p);
    }

    function drawDot(point) {
      var w = getWidth(point);
      ctx.beginPath();
      ctx.arc(point.x, point.y, w / 2, 0, Math.PI * 2);
      ctx.fillStyle = penColor;
      ctx.fill();
    }

    function drawSeg(a, b) {
      var w0 = getWidth(a) / 2;
      var w1 = getWidth(b) / 2;
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 2) { drawDot(b); return; }
      var nx = -dy / len;
      var ny = dx / len;
      ctx.beginPath();
      ctx.moveTo(a.x + nx * w0, a.y + ny * w0);
      ctx.lineTo(a.x - nx * w0, a.y - ny * w0);
      ctx.lineTo(b.x - nx * w1, b.y - ny * w1);
      ctx.lineTo(b.x + nx * w1, b.y + ny * w1);
      ctx.closePath();
      ctx.fillStyle = penColor;
      ctx.fill();
    }

    for (var s = 0; s < strokes.length; s++) {
      var stroke = strokes[s];
      if (stroke.length === 0) continue;
      drawDot(stroke[0]);
      for (var i = 1; i < stroke.length; i++) {
        drawSeg(stroke[i - 1], stroke[i]);
      }
    }
  };

  InkCanvas.previewToCanvas = function(canvas, inkData, targetHeight) {
    if (!inkData || !inkData.strokes || inkData.strokes.length === 0) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    this.renderToCanvas(canvas, inkData);
  };

  Agenda.ink = InkCanvas;
})();
