var Buffer, Matrix, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Buffer = require('./buffer');

Util = require('../../../util');

Matrix = (function(superClass) {
  extend(Matrix, superClass);

  function Matrix() {
    return Matrix.__super__.constructor.apply(this, arguments);
  }

  Matrix.traits = ['node', 'buffer', 'active', 'data', 'source', 'index', 'texture', 'matrix', 'raw'];

  Matrix.prototype.init = function() {
    this.buffer = this.spec = null;
    this.space = {
      width: 0,
      height: 0,
      history: 0
    };
    this.used = {
      width: 0,
      height: 0
    };
    this.storage = 'matrixBuffer';
    this.passthrough = function(emit, x, y) {
      return emit(x, y, 0, 0);
    };
    return Matrix.__super__.init.apply(this, arguments);
  };

  Matrix.prototype.sourceShader = function(shader) {
    var dims;
    dims = this.getDimensions();
    this.alignShader(dims, shader);
    return this.buffer.shader(shader);
  };

  Matrix.prototype.getDimensions = function() {
    return {
      items: this.items,
      width: this.space.width,
      height: this.space.height,
      depth: this.space.history
    };
  };

  Matrix.prototype.getActiveDimensions = function() {
    return {
      items: this.items,
      width: this.used.width,
      height: this.used.height,
      depth: this.buffer.getFilled()
    };
  };

  Matrix.prototype.getFutureDimensions = function() {
    return {
      items: this.items,
      width: this.used.width,
      height: this.used.height,
      depth: this.space.history
    };
  };

  Matrix.prototype.getRawDimensions = function() {
    return {
      items: this.items,
      width: this.space.width,
      height: this.space.height,
      depth: 1
    };
  };

  Matrix.prototype.make = function() {
    var channels, data, dims, height, history, items, magFilter, minFilter, ref, ref1, ref2, reserveX, reserveY, space, type, width;
    Matrix.__super__.make.apply(this, arguments);
    minFilter = (ref = this.minFilter) != null ? ref : this.props.minFilter;
    magFilter = (ref1 = this.magFilter) != null ? ref1 : this.props.magFilter;
    type = (ref2 = this.type) != null ? ref2 : this.props.type;
    width = this.props.width;
    height = this.props.height;
    history = this.props.history;
    reserveX = this.props.bufferWidth;
    reserveY = this.props.bufferHeight;
    channels = this.props.channels;
    items = this.props.items;
    dims = this.spec = {
      channels: channels,
      items: items,
      width: width,
      height: height
    };
    this.items = dims.items;
    this.channels = dims.channels;
    data = this.props.data;
    dims = Util.Data.getDimensions(data, dims);
    space = this.space;
    space.width = Math.max(reserveX, dims.width || 1);
    space.height = Math.max(reserveY, dims.height || 1);
    space.history = history;
    return this.buffer = this._renderables.make(this.storage, {
      width: space.width,
      height: space.height,
      history: space.history,
      channels: channels,
      items: items,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
  };

  Matrix.prototype.unmake = function() {
    Matrix.__super__.unmake.apply(this, arguments);
    if (this.buffer) {
      this.buffer.dispose();
      return this.buffer = this.spec = null;
    }
  };

  Matrix.prototype.change = function(changed, touched, init) {
    var height, width;
    if (touched['texture'] || changed['matrix.history'] || changed['buffer.channels'] || changed['buffer.items'] || changed['matrix.bufferWidth'] || changed['matrix.bufferHeight']) {
      return this.rebuild();
    }
    if (!this.buffer) {
      return;
    }
    if (changed['matrix.width']) {
      width = this.props.width;
      if (width > this.space.width) {
        return this.rebuild();
      }
    }
    if (changed['matrix.height']) {
      height = this.props.height;
      if (height > this.space.height) {
        return this.rebuild();
      }
    }
    if (changed['data.map'] || changed['data.data'] || changed['data.resolve'] || changed['data.expr'] || init) {
      return this.buffer.setCallback(this.emitter());
    }
  };

  Matrix.prototype.callback = function(callback) {
    if (callback.length <= 3) {
      return callback;
    } else {
      return (function(_this) {
        return function(emit, i, j) {
          return callback(emit, i, j, _this.bufferClock, _this.bufferStep);
        };
      })(this);
    }
  };

  Matrix.prototype.update = function() {
    var data, filled, h, space, used, w;
    if (!this.buffer) {
      return;
    }
    data = this.props.data;
    space = this.space, used = this.used;
    w = used.width;
    h = used.height;
    filled = this.buffer.getFilled();
    this.syncBuffer((function(_this) {
      return function(abort) {
        var _w, base, dims, height, length, width;
        if (data != null) {
          dims = Util.Data.getDimensions(data, _this.spec);
          if (dims.width > space.width || dims.height > space.height) {
            abort();
            return _this.rebuild();
          }
          used.width = dims.width;
          used.height = dims.height;
          _this.buffer.setActive(used.width, used.height);
          if (typeof (base = _this.buffer.callback).rebind === "function") {
            base.rebind(data);
          }
          return _this.buffer.update();
        } else {
          width = _this.spec.width || 1;
          height = _this.spec.height || 1;
          _this.buffer.setActive(width, height);
          length = _this.buffer.update();
          used.width = _w = width;
          used.height = Math.ceil(length / _w);
          if (used.height === 1) {
            return used.width = length;
          }
        }
      };
    })(this));
    if (used.width !== w || used.height !== h || filled !== this.buffer.getFilled()) {
      return this.trigger({
        type: 'source.resize'
      });
    }
  };

  return Matrix;

})(Buffer);

module.exports = Matrix;
