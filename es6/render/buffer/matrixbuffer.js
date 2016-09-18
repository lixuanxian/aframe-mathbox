var DataBuffer, MatrixBuffer, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DataBuffer = require('./databuffer');

Util = require('../../util');


/*
 * 2D + history array
 */

MatrixBuffer = (function(superClass) {
  extend(MatrixBuffer, superClass);

  function MatrixBuffer(renderer, shaders, options) {
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.history = options.history || 1;
    this.samples = this.width * this.height;
    this.wrap = this.history > 1;
    options.depth = this.history;
    MatrixBuffer.__super__.constructor.call(this, renderer, shaders, options);
  }

  MatrixBuffer.prototype.build = function(options) {
    MatrixBuffer.__super__.build.apply(this, arguments);
    this.index = 0;
    this.pad = {
      x: 0,
      y: 0
    };
    return this.streamer = this.generate(this.data);
  };

  MatrixBuffer.prototype.getFilled = function() {
    return this.filled;
  };

  MatrixBuffer.prototype.setActive = function(i, j) {
    var ref;
    return ref = [Math.max(0, this.width - i), Math.max(0, this.height - j)], this.pad.x = ref[0], this.pad.y = ref[1], ref;
  };

  MatrixBuffer.prototype.fill = function() {
    var callback, count, done, emit, i, j, k, limit, n, pad, ref, repeat, reset, skip;
    callback = this.callback;
    if (typeof callback.reset === "function") {
      callback.reset();
    }
    ref = this.streamer, emit = ref.emit, skip = ref.skip, count = ref.count, done = ref.done, reset = ref.reset;
    reset();
    n = this.width;
    pad = this.pad.x;
    limit = this.samples - this.pad.y * n;
    i = j = k = 0;
    if (pad) {
      while (!done() && k < limit) {
        k++;
        repeat = callback(emit, i, j);
        if (++i === n - pad) {
          skip(pad);
          i = 0;
          j++;
        }
        if (repeat === false) {
          break;
        }
      }
    } else {
      while (!done() && k < limit) {
        k++;
        repeat = callback(emit, i, j);
        if (++i === n) {
          i = 0;
          j++;
        }
        if (repeat === false) {
          break;
        }
      }
    }
    return Math.floor(count() / this.items);
  };

  MatrixBuffer.prototype.write = function(n) {
    var height, width;
    if (n == null) {
      n = this.samples;
    }
    n *= this.items;
    width = this.width * this.items;
    height = Math.ceil(n / width);
    this.texture.write(this.data, 0, this.index * this.height, width, height);
    this.dataPointer.set(.5, this.index * this.height + .5);
    this.index = (this.index + this.history - 1) % this.history;
    return this.filled = Math.min(this.history, this.filled + 1);
  };

  MatrixBuffer.prototype.through = function(callback, target) {
    var consume, done, dst, emit, i, j, pipe, ref, src;
    ref = src = this.streamer, consume = ref.consume, done = ref.done;
    emit = (dst = target.streamer).emit;
    i = j = 0;
    pipe = function() {
      return consume(function(x, y, z, w) {
        return callback(emit, x, y, z, w, i, j);
      });
    };
    pipe = Util.Data.repeatCall(pipe, this.items);
    return (function(_this) {
      return function() {
        var k, limit, n, pad;
        src.reset();
        dst.reset();
        n = _this.width;
        pad = _this.pad.x;
        limit = _this.samples - _this.pad.y * n;
        i = j = k = 0;
        if (pad) {
          while (!done() && k < limit) {
            k++;
            pipe();
            if (++i === n - pad) {
              skip(pad);
              i = 0;
              j++;
            }
          }
        } else {
          while (!done() && k < limit) {
            k++;
            pipe();
            if (++i === n) {
              i = 0;
              j++;
            }
          }
        }
        return src.count();
      };
    })(this);
  };

  return MatrixBuffer;

})(DataBuffer);

module.exports = MatrixBuffer;
