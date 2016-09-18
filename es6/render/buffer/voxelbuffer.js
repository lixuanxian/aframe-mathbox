var DataBuffer, Util, VoxelBuffer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DataBuffer = require('./databuffer');

Util = require('../../util');

VoxelBuffer = (function(superClass) {
  extend(VoxelBuffer, superClass);

  function VoxelBuffer() {
    return VoxelBuffer.__super__.constructor.apply(this, arguments);
  }

  VoxelBuffer.prototype.build = function(options) {
    VoxelBuffer.__super__.build.apply(this, arguments);
    this.pad = {
      x: 0,
      y: 0,
      z: 0
    };
    return this.streamer = this.generate(this.data);
  };

  VoxelBuffer.prototype.setActive = function(i, j, k) {
    var ref;
    return ref = [Math.max(0, this.width - i), Math.max(0, this.height - j), Math.max(0, this.depth - k)], this.pad.x = ref[0], this.pad.y = ref[1], this.pad.z = ref[2], ref;
  };

  VoxelBuffer.prototype.fill = function() {
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
    return Math.floor(count() / this.items);
  };

  VoxelBuffer.prototype.through = function(callback, target) {
    var consume, done, dst, emit, i, j, k, pipe, ref, src;
    ref = src = this.streamer, consume = ref.consume, done = ref.done;
    emit = (dst = target.streamer).emit;
    i = j = k = 0;
    pipe = function() {
      return consume(function(x, y, z, w) {
        return callback(emit, x, y, z, w, i, j, k);
      });
    };
    pipe = Util.Data.repeatCall(pipe, this.items);
    return (function(_this) {
      return function() {
        var l, limit, m, n, o, padX, padY;
        src.reset();
        dst.reset();
        n = _this.width;
        m = _this.height;
        o = _this.depth;
        padX = _this.pad.x;
        padY = _this.pad.y;
        limit = _this.samples - _this.pad.z * n * m;
        i = j = k = l = 0;
        if (padX > 0 || padY > 0) {
          while (!done() && l < limit) {
            l++;
            pipe();
            if (++i === n - padX) {
              skip(padX);
              i = 0;
              if (++j === m - padY) {
                skip(n * padY);
                j = 0;
                k++;
              }
            }
          }
        } else {
          while (!done() && l < limit) {
            l++;
            pipe();
            if (++i === n) {
              i = 0;
              if (++j === m) {
                j = 0;
                k++;
              }
            }
          }
        }
        return src.count();
      };
    })(this);
  };

  return VoxelBuffer;

})(DataBuffer);

module.exports = VoxelBuffer;
