var DataBuffer, ItemBuffer, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DataBuffer = require('./databuffer');

Util = require('../../util');


/*
 * 4D array
 */

ItemBuffer = (function(superClass) {
  extend(ItemBuffer, superClass);

  function ItemBuffer() {
    return ItemBuffer.__super__.constructor.apply(this, arguments);
  }

  ItemBuffer.prototype.build = function(options) {
    ItemBuffer.__super__.build.apply(this, arguments);
    this.pad = {
      x: 0,
      y: 0,
      z: 0,
      w: 0
    };
    return this.streamer = this.generate(this.data);
  };

  ItemBuffer.prototype.getFilled = function() {
    return this.filled;
  };

  ItemBuffer.prototype.setActive = function(i, j, k, l) {
    var ref;
    return ref = [this.width - i, this.height - j, this.depth - k, this.items - l], this.pad.x = ref[0], this.pad.y = ref[1], this.pad.z = ref[2], this.pad.w = ref[3], ref;
  };

  ItemBuffer.prototype.fill = function() {
    var callback, count, done, emit, i, j, k, l, limit, m, n, o, p, padW, padX, padY, ref, repeat, reset, skip;
    callback = this.callback;
    if (typeof callback.reset === "function") {
      callback.reset();
    }
    ref = this.streamer, emit = ref.emit, skip = ref.skip, count = ref.count, done = ref.done, reset = ref.reset;
    reset();
    n = this.width;
    m = this.height;
    o = this.depth;
    p = this.items;
    padX = this.pad.x;
    padY = this.pad.y;
    padW = this.pad.w;
    limit = (this.samples - this.pad.z * n * m) * p;
    i = j = k = l = m = 0;
    if (padX > 0 || padY > 0 || padW > 0) {
      while (!done() && m < limit) {
        m++;
        repeat = callback(emit, i, j, k, l);
        if (++l === p - padW) {
          skip(padW);
          l = 0;
          if (++i === n - padX) {
            skip(p * padX);
            i = 0;
            if (++j === m - padY) {
              skip(p * n * padY);
              j = 0;
              k++;
            }
          }
        }
        if (repeat === false) {
          break;
        }
      }
    } else {
      while (!done() && m < limit) {
        m++;
        repeat = callback(emit, i, j, k, l);
        if (++l === p) {
          l = 0;
          if (++i === n) {
            i = 0;
            if (++j === m) {
              j = 0;
              k++;
            }
          }
        }
        if (repeat === false) {
          break;
        }
      }
    }
    return Math.floor(count() / this.items);
  };

  return ItemBuffer;

})(DataBuffer);

module.exports = ItemBuffer;
