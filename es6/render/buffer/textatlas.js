var Atlas, SCRATCH_SIZE, TextAtlas,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Atlas = require('./atlas');

SCRATCH_SIZE = 512 / 16;


/*
 * Dynamic text atlas
 * - Stores entire strings as sprites
 * - Renders alpha mask (fast) or signed distance field (slow)
 * - Emits (x,y,width,height) pointers into the atlas
 */

TextAtlas = (function(superClass) {
  extend(TextAtlas, superClass);

  function TextAtlas(renderer, shaders, options) {
    var ref, ref1, ref2, ref3, ref4, ref5, ua;
    this.font = (ref = options.font) != null ? ref : ['sans-serif'];
    this.size = options.size || 24;
    this.style = (ref1 = options.style) != null ? ref1 : 'normal';
    this.variant = (ref2 = options.variant) != null ? ref2 : 'normal';
    this.weight = (ref3 = options.weight) != null ? ref3 : 'normal';
    this.outline = (ref4 = +((ref5 = options.outline) != null ? ref5 : 5)) != null ? ref4 : 0;
    options.width || (options.width = 256);
    options.height || (options.height = 256);
    options.type = THREE.UnsignedByteType;
    options.channels = 1;
    options.backed = true;
    this.gamma = 1;
    if (typeof navigator !== 'undefined') {
      ua = navigator.userAgent;
      if (ua.match(/Chrome/) && ua.match(/OS X/)) {
        this.gamma = .5;
      }
    }
    this.scratchW = this.scratchH = 0;
    TextAtlas.__super__.constructor.call(this, renderer, shaders, options);
  }

  TextAtlas.prototype.build = function(options) {
    var canvas, colors, context, dilate, font, hex, i, k, lineHeight, maxWidth, quote, ref, scratch;
    TextAtlas.__super__.build.call(this, options);
    lineHeight = 16;
    lineHeight = this.size;
    lineHeight += 4 + 2 * Math.min(1, this.outline);
    maxWidth = SCRATCH_SIZE * lineHeight;
    canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = lineHeight;
    quote = function(str) {
      return "\"" + (str.replace(/(['"\\])/g, '\\$1')) + "\"";
    };
    font = this.font.map(quote).join(", ");
    context = canvas.getContext('2d');
    context.font = this.style + " " + this.variant + " " + this.weight + " " + this.size + "px " + this.font;
    context.fillStyle = '#FF0000';
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.lineJoin = 'round';

    /*
    document.body.appendChild canvas
    canvas.setAttribute('style', "position: absolute; top: 0; left: 0; z-index: 100; border: 1px solid red; background: rgba(255,0,255,.25);")
     */
    colors = [];
    dilate = this.outline * 3;
    for (i = k = 0, ref = dilate; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      hex = ('00' + Math.max(0, -i * 8 + 128 - (!i) * 8).toString(16)).slice(-2);
      colors.push('#' + hex + hex + hex);
    }
    scratch = new Uint8Array(maxWidth * lineHeight * 2);
    this.canvas = canvas;
    this.context = context;
    this.lineHeight = lineHeight;
    this.maxWidth = maxWidth;
    this.colors = colors;
    this.scratch = scratch;
    this._allocate = this.allocate.bind(this);
    return this._write = this.write.bind(this);
  };

  TextAtlas.prototype.reset = function() {
    TextAtlas.__super__.reset.apply(this, arguments);
    return this.mapped = {};
  };

  TextAtlas.prototype.begin = function() {
    var k, len, ref, results, row;
    ref = this.rows;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      row = ref[k];
      results.push(row.alive = 0);
    }
    return results;
  };

  TextAtlas.prototype.end = function() {
    var k, key, l, len, len1, mapped, ref, ref1, row;
    mapped = this.mapped;
    ref = this.rows.slice();
    for (k = 0, len = ref.length; k < len; k++) {
      row = ref[k];
      if (!(row.alive === 0)) {
        continue;
      }
      ref1 = row.keys;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        key = ref1[l];
        delete mapped[key];
      }
      this.collapse(row);
    }
  };

  TextAtlas.prototype.map = function(text, emit) {
    var allocate, c, data, h, mapped, w, write;
    mapped = this.mapped;
    c = mapped[text];
    if (c != null) {
      c.row.alive++;
      return emit(c.x, c.y, c.w, c.h);
    }
    this.draw(text);
    data = this.scratch;
    w = this.scratchW;
    h = this.scratchH;
    allocate = this._allocate;
    write = this._write;
    return allocate(text, w, h, function(row, x, y) {
      mapped[text] = {
        x: x,
        y: y,
        w: w,
        h: h,
        row: row
      };
      write(data, x, y, w, h);
      return emit(x, y, w, h);
    });
  };

  TextAtlas.prototype.draw = function(text) {
    var a, b, c, colors, ctx, data, dst, gamma, h, i, imageData, j, k, l, m, mask, max, n, o, ref, ref1, ref2, w, x, y;
    w = this.width;
    h = this.lineHeight;
    o = this.outline;
    ctx = this.context;
    dst = this.scratch;
    max = this.maxWidth;
    colors = this.colors;
    x = o + 1;
    y = Math.round(h * 1.05 - 1);
    m = ctx.measureText(text);
    w = Math.min(max, Math.ceil(m.width + 2 * x + 1));
    ctx.clearRect(0, 0, w, h);
    if (this.outline === 0) {
      ctx.fillText(text, x, y);
      data = (imageData = ctx.getImageData(0, 0, w, h)).data;
      j = 3;
      for (i = k = 0, ref = data.length / 4; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        dst[i] = data[j];
        j += 4;
      }
      this.scratchW = w;
      return this.scratchH = h;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      for (i = l = ref1 = o + 1; ref1 <= 1 ? l <= 1 : l >= 1; i = ref1 <= 1 ? ++l : --l) {
        j = i > 1 ? i * 2 - 2 : i;
        ctx.strokeStyle = colors[j - 1];
        ctx.lineWidth = j;
        ctx.strokeText(text, x, y);
      }
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillText(text, x, y);
      data = (imageData = ctx.getImageData(0, 0, w, h)).data;
      j = 0;
      gamma = this.gamma;
      for (i = n = 0, ref2 = data.length / 4; 0 <= ref2 ? n < ref2 : n > ref2; i = 0 <= ref2 ? ++n : --n) {
        a = data[j];
        mask = a ? data[j + 1] / a : 1;
        if (gamma === .5) {
          mask = Math.sqrt(mask);
        }
        mask = Math.min(1, Math.max(0, mask));
        b = 256 - a;
        c = b + (a - b) * mask;
        dst[i] = Math.max(0, Math.min(255, c + 2));
        j += 4;
      }

      /*
      j = 0
      for i in [0...data.length / 4]
        v = dst[i]
        #data[j] = v
        #data[j+1] = v
        data[j+2] = v
        data[j+3] = 255
        j += 4
      ctx.putImageData imageData, 0, 0
       */
      this.scratchW = w;
      return this.scratchH = h;
    }
  };

  return TextAtlas;

})(Atlas);

module.exports = TextAtlas;
