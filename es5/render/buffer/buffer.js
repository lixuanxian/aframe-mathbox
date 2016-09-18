var Buffer, Renderable, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Renderable = require('../renderable');

Util = require('../../util');


/*
 * Base class for sample buffers
 */

Buffer = (function(superClass) {
  extend(Buffer, superClass);

  function Buffer(renderer, shaders, options) {
    if (this.items == null) {
      this.items = options.items || 1;
    }
    if (this.samples == null) {
      this.samples = options.samples || 1;
    }
    if (this.channels == null) {
      this.channels = options.channels || 4;
    }
    if (this.callback == null) {
      this.callback = options.callback || function() {};
    }
    Buffer.__super__.constructor.call(this, renderer, shaders);
  }

  Buffer.prototype.dispose = function() {
    return Buffer.__super__.dispose.apply(this, arguments);
  };

  Buffer.prototype.update = function() {
    var n;
    n = this.fill();
    this.write(n);
    return n;
  };

  Buffer.prototype.setActive = function(i, j, k, l) {};

  Buffer.prototype.setCallback = function(callback) {
    this.callback = callback;
  };

  Buffer.prototype.write = function() {};

  Buffer.prototype.fill = function() {};

  Buffer.prototype.generate = function(data) {
    return Util.Data.getStreamer(data, this.samples, this.channels, this.items);
  };

  return Buffer;

})(Renderable);

module.exports = Buffer;
