var Buffer, Util, Voxel,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Buffer = require('./buffer');

Util = require('../../../util');

Voxel = (function(superClass) {
  extend(Voxel, superClass);

  function Voxel() {
    this.update = bind(this.update, this);
    return Voxel.__super__.constructor.apply(this, arguments);
  }

  Voxel.traits = ['node', 'buffer', 'active', 'data', 'source', 'index', 'texture', 'voxel', 'raw'];

  Voxel.prototype.init = function() {
    this.buffer = this.spec = null;
    this.space = {
      width: 0,
      height: 0,
      depth: 0
    };
    this.used = {
      width: 0,
      height: 0,
      depth: 0
    };
    this.storage = 'voxelBuffer';
    this.passthrough = function(emit, x, y, z) {
      return emit(x, y, z, 0);
    };
    return Voxel.__super__.init.apply(this, arguments);
  };

  Voxel.prototype.sourceShader = function(shader) {
    var dims;
    dims = this.getDimensions();
    this.alignShader(dims, shader);
    return this.buffer.shader(shader);
  };

  Voxel.prototype.getDimensions = function() {
    return {
      items: this.items,
      width: this.space.width,
      height: this.space.height,
      depth: this.space.depth
    };
  };

  Voxel.prototype.getActiveDimensions = function() {
    return {
      items: this.items,
      width: this.used.width,
      height: this.used.height,
      depth: this.used.depth * this.buffer.getFilled()
    };
  };

  Voxel.prototype.getRawDimensions = function() {
    return this.getDimensions();
  };

  Voxel.prototype.make = function() {
    var channels, data, depth, dims, height, items, magFilter, minFilter, ref, ref1, ref2, reserveX, reserveY, reserveZ, space, type, width;
    Voxel.__super__.make.apply(this, arguments);
    minFilter = (ref = this.minFilter) != null ? ref : this.props.minFilter;
    magFilter = (ref1 = this.magFilter) != null ? ref1 : this.props.magFilter;
    type = (ref2 = this.type) != null ? ref2 : this.props.type;
    width = this.props.width;
    height = this.props.height;
    depth = this.props.depth;
    reserveX = this.props.bufferWidth;
    reserveY = this.props.bufferHeight;
    reserveZ = this.props.bufferDepth;
    channels = this.props.channels;
    items = this.props.items;
    dims = this.spec = {
      channels: channels,
      items: items,
      width: width,
      height: height,
      depth: depth
    };
    this.items = dims.items;
    this.channels = dims.channels;
    data = this.props.data;
    dims = Util.Data.getDimensions(data, dims);
    space = this.space;
    space.width = Math.max(reserveX, dims.width || 1);
    space.height = Math.max(reserveY, dims.height || 1);
    space.depth = Math.max(reserveZ, dims.depth || 1);
    return this.buffer = this._renderables.make(this.storage, {
      width: space.width,
      height: space.height,
      depth: space.depth,
      channels: channels,
      items: items,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
  };

  Voxel.prototype.unmake = function() {
    Voxel.__super__.unmake.apply(this, arguments);
    if (this.buffer) {
      this.buffer.dispose();
      return this.buffer = this.spec = null;
    }
  };

  Voxel.prototype.change = function(changed, touched, init) {
    var depth, height, width;
    if (touched['texture'] || changed['buffer.channels'] || changed['buffer.items'] || changed['voxel.bufferWidth'] || changed['voxel.bufferHeight'] || changed['voxel.bufferDepth']) {
      return this.rebuild();
    }
    if (!this.buffer) {
      return;
    }
    if (changed['voxel.width']) {
      width = this.props.width;
      if (width > this.space.width) {
        return this.rebuild();
      }
    }
    if (changed['voxel.height']) {
      height = this.props.height;
      if (height > this.space.height) {
        return this.rebuild();
      }
    }
    if (changed['voxel.depth']) {
      depth = this.props.depth;
      if (depth > this.space.depth) {
        return this.rebuild();
      }
    }
    if (changed['data.map'] || changed['data.data'] || changed['data.resolve'] || changed['data.expr'] || init) {
      return this.buffer.setCallback(this.emitter());
    }
  };

  Voxel.prototype.callback = function(callback) {
    if (callback.length <= 4) {
      return callback;
    } else {
      return (function(_this) {
        return function(emit, i, j, k) {
          return callback(emit, i, j, k, _this.bufferClock, _this.bufferStep);
        };
      })(this);
    }
  };

  Voxel.prototype.update = function() {
    var d, data, filled, h, space, used, w;
    if (!this.buffer) {
      return;
    }
    data = this.props.data;
    space = this.space, used = this.used;
    w = used.width;
    h = used.height;
    d = used.depth;
    filled = this.buffer.getFilled();
    this.syncBuffer((function(_this) {
      return function(abort) {
        var _h, _w, base, depth, dims, height, length, width;
        if (data != null) {
          dims = Util.Data.getDimensions(data, _this.spec);
          if (dims.width > space.width || dims.height > space.height || dims.depth > space.depth) {
            abort();
            return _this.rebuild();
          }
          used.width = dims.width;
          used.height = dims.height;
          used.depth = dims.depth;
          _this.buffer.setActive(used.width, used.height, used.depth);
          if (typeof (base = _this.buffer.callback).rebind === "function") {
            base.rebind(data);
          }
          return _this.buffer.update();
        } else {
          width = _this.spec.width || 1;
          height = _this.spec.height || 1;
          depth = _this.spec.depth || 1;
          _this.buffer.setActive(width, height, depth);
          length = _this.buffer.update();
          used.width = _w = width;
          used.height = _h = height;
          used.depth = Math.ceil(length / _w / _h);
          if (used.depth === 1) {
            used.height = Math.ceil(length / _w);
            if (used.height === 1) {
              return used.width = length;
            }
          }
        }
      };
    })(this));
    if (used.width !== w || used.height !== h || used.depth !== d || filled !== this.buffer.getFilled()) {
      return this.trigger({
        type: 'source.resize'
      });
    }
  };

  return Voxel;

})(Buffer);

module.exports = Voxel;
