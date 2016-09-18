var Buffer, PushBuffer, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Buffer = require('./buffer');

Util = require('../../util');


/*
 * Buffer for CPU-side use
 */

PushBuffer = (function(superClass) {
  extend(PushBuffer, superClass);

  function PushBuffer(renderer, shaders, options) {
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.depth = options.depth || 1;
    if (this.samples == null) {
      this.samples = this.width * this.height * this.depth;
    }
    PushBuffer.__super__.constructor.call(this, renderer, shaders, options);
    this.build(options);
  }

  PushBuffer.prototype.build = function(options) {
    this.data = [];
    this.data.length = this.samples;
    this.filled = 0;
    this.pad = {
      x: 0,
      y: 0,
      z: 0
    };
    return this.streamer = this.generate(this.data);
  };

  PushBuffer.prototype.dispose = function() {
    this.data = null;
    return PushBuffer.__super__.dispose.apply(this, arguments);
  };

  PushBuffer.prototype.getFilled = function() {
    return this.filled;
  };

  PushBuffer.prototype.setActive = function(i, j, k) {
    var ref;
    return ref = [this.width - i, this.height - j, this.depth - k], this.pad.x = ref[0], this.pad.y = ref[1], this.pad.z = ref[2], ref;
  };

  PushBuffer.prototype.read = function() {
    return this.data;
  };

  PushBuffer.prototype.copy = function(data) {
    var d, i, n, p, ref, results;
    n = Math.min(data.length, this.samples);
    d = this.data;
    results = [];
    for (i = p = 0, ref = n; 0 <= ref ? p < ref : p > ref; i = 0 <= ref ? ++p : --p) {
      results.push(d[i] = data[i]);
    }
    return results;
  };

  PushBuffer.prototype.fill = function() {
    var callback, count, done, emit, i, j, k, l, limit, m, n, o, padX, padY, ref, repeat, reset, skip;
    callback = this.callback;
    if (typeof callback.reset === "function") {
      callback.reset();
    }
    ref = this.streamer, emit = ref.emit, skip = ref.skip, count = ref.count, done = ref.done, reset = ref.reset;
    reset();
    n = this.width;
    m = this.height;
    o = this.depth;
    padX = this.pad.x;
    padY = this.pad.y;
    limit = this.samples - this.pad.z * n * m;
    i = j = k = l = 0;
    if (padX > 0 || padY > 0) {
      while (!done() && l < limit) {
        l++;
        repeat = callback(emit, i, j, k);
        if (++i === n - padX) {
          skip(padX);
          i = 0;
          if (++j === m - padY) {
            skip(n * padY);
            j = 0;
            k++;
          }
        }
        if (repeat === false) {
          break;
        }
      }
    } else {
      while (!done() && l < limit) {
        l++;
        repeat = callback(emit, i, j, k);
        if (++i === n) {
          i = 0;
          if (++j === m) {
            j = 0;
            k++;
          }
        }
        if (repeat === false) {
          break;
        }
      }
    }
    this.filled = 1;
    return count();
  };

  return PushBuffer;

})(Buffer);

module.exports = PushBuffer;
