var ArrayBuffer_, DataBuffer, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DataBuffer = require('./databuffer');

Util = require('../../util');


/*
 * 1D + history array
 */

ArrayBuffer_ = (function(superClass) {
  extend(ArrayBuffer_, superClass);

  function ArrayBuffer_(renderer, shaders, options) {
    this.width = options.width || 1;
    this.history = options.history || 1;
    this.samples = this.width;
    this.wrap = this.history > 1;
    options.width = this.width;
    options.height = this.history;
    options.depth = 1;
    ArrayBuffer_.__super__.constructor.call(this, renderer, shaders, options);
  }

  ArrayBuffer_.prototype.build = function(options) {
    ArrayBuffer_.__super__.build.apply(this, arguments);
    this.index = 0;
    this.pad = 0;
    return this.streamer = this.generate(this.data);
  };

  ArrayBuffer_.prototype.setActive = function(i) {
    return this.pad = Math.max(0, this.width - i);
  };

  ArrayBuffer_.prototype.fill = function() {
    var callback, count, done, emit, i, limit, ref, reset, skip;
    callback = this.callback;
    if (typeof callback.reset === "function") {
      callback.reset();
    }
    ref = this.streamer, emit = ref.emit, skip = ref.skip, count = ref.count, done = ref.done, reset = ref.reset;
    reset();
    limit = this.samples - this.pad;
    i = 0;
    while (!done() && i < limit && callback(emit, i++) !== false) {
      true;
    }
    return Math.floor(count() / this.items);
  };

  ArrayBuffer_.prototype.write = function(n) {
    if (n == null) {
      n = this.samples;
    }
    n *= this.items;
    this.texture.write(this.data, 0, this.index, n, 1);
    this.dataPointer.set(.5, this.index + .5);
    this.index = (this.index + this.history - 1) % this.history;
    return this.filled = Math.min(this.history, this.filled + 1);
  };

  ArrayBuffer_.prototype.through = function(callback, target) {
    var consume, done, dst, emit, i, pipe, ref, src;
    ref = src = this.streamer, consume = ref.consume, done = ref.done;
    emit = (dst = target.streamer).emit;
    i = 0;
    pipe = function() {
      return consume(function(x, y, z, w) {
        return callback(emit, x, y, z, w, i);
      });
    };
    pipe = Util.Data.repeatCall(pipe, this.items);
    return (function(_this) {
      return function() {
        var limit;
        src.reset();
        dst.reset();
        limit = _this.samples - _this.pad;
        i = 0;
        while (!done() && i < limit) {
          pipe();
          i++;
        }
        return src.count();
      };
    })(this);
  };

  return ArrayBuffer_;

})(DataBuffer);

module.exports = ArrayBuffer_;
