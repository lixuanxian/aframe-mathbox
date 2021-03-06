var Data, Resolve, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Data = require('./data');

Util = require('../../../util');

Resolve = (function(superClass) {
  extend(Resolve, superClass);

  function Resolve() {
    return Resolve.__super__.constructor.apply(this, arguments);
  }

  Resolve.traits = ['node', 'data', 'active', 'source', 'index', 'voxel'];

  Resolve.prototype.init = function() {
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
    return Resolve.__super__.init.apply(this, arguments);
  };

  Resolve.prototype.sourceShader = function(shader) {
    return this.buffer.shader(shader);
  };

  Resolve.prototype.getDimensions = function() {
    var space;
    space = this.space;
    return {
      items: this.items,
      width: space.width,
      height: space.height,
      depth: space.depth
    };
  };

  Resolve.prototype.getActiveDimensions = function() {
    var used;
    used = this.used;
    return {
      items: this.items,
      width: used.width,
      height: used.height,
      depth: used.depth * this.buffer.getFilled()
    };
  };

  Resolve.prototype.make = function() {
    var base, base1, base2, data, depth, dims, height, reserveX, reserveY, reserveZ, space, width;
    Resolve.__super__.make.apply(this, arguments);
    width = this.props.width;
    height = this.props.height;
    depth = this.props.depth;
    reserveX = this.props.bufferWidth;
    reserveY = this.props.bufferHeight;
    reserveZ = this.props.bufferDepth;
    dims = this.spec = {
      channels: 1,
      items: 1,
      width: width,
      height: height,
      depth: depth
    };
    data = this.props.data;
    dims = Util.Data.getDimensions(data, dims);
    space = this.space;
    space.width = Math.max(reserveX, dims.width || 1);
    space.height = Math.max(reserveY, dims.height || 1);
    space.depth = Math.max(reserveZ, dims.depth || 1);
    if ((base = this.spec).width == null) {
      base.width = 1;
    }
    if ((base1 = this.spec).height == null) {
      base1.height = 1;
    }
    if ((base2 = this.spec).depth == null) {
      base2.depth = 1;
    }
    return this.buffer = this._renderables.make('voxelBuffer', {
      width: space.width,
      height: space.height,
      depth: space.depth,
      channels: 2,
      items: 1
    });
  };

  Resolve.prototype.callback = function() {};

  Resolve.prototype.emitter = function() {
    return Resolve.__super__.emitter.call(this, 1, 1);
  };

  Resolve.prototype.change = function(changed, touched, init) {
    var depth, height, width;
    Resolve.__super__.change.apply(this, arguments);
    if (false) {
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
    if (changed['data.map'] || changed['data.data'] || changed['data.resolve']) {
      init;
      return this.buffer.setCallback(this.emitter());
    }
  };

  Resolve.prototype.update = function() {
    var data, dims, filled, l, length, space, used;
    if (!this.buffer) {
      return;
    }
    filled = this.buffer.getFilled();
    if (!(!filled || this.props.live)) {
      return;
    }
    data = this.props.data;
    space = this.space;
    used = this.used;
    l = used.length;
    if (data != null) {
      dims = Util.Data.getDimensions(data, this.spec);
      if (dims.width > space.length) {
        this.rebuild();
      }
      used.length = dims.width;
      this.buffer.setActive(used.length);
      this.buffer.callback.rebind(data);
      this.buffer.update();
    } else {
      this.buffer.setActive(this.spec.width);
      length = this.buffer.update();
      used.length = length;
    }
    this.filled = true;
    if (used.length !== l || filled !== this.buffer.getFilled()) {
      return this.trigger({
        type: 'source.resize'
      });
    }
  };

  return Resolve;

})(Data);

module.exports = Data;

// ---
// generated by coffee-script 1.9.2