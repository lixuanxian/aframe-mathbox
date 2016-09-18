var Operator, Slice, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');

Slice = (function(superClass) {
  extend(Slice, superClass);

  function Slice() {
    return Slice.__super__.constructor.apply(this, arguments);
  }

  Slice.traits = ['node', 'bind', 'operator', 'source', 'index', 'slice'];

  Slice.prototype.getDimensions = function() {
    return this._resample(this.bind.source.getDimensions());
  };

  Slice.prototype.getActiveDimensions = function() {
    return this._resample(this.bind.source.getActiveDimensions());
  };

  Slice.prototype.getFutureDimensions = function() {
    return this._resample(this.bind.source.getFutureDimensions());
  };

  Slice.prototype.getIndexDimensions = function() {
    return this._resample(this.bind.source.getIndexDimensions());
  };

  Slice.prototype.sourceShader = function(shader) {
    shader.pipe('slice.position', this.uniforms);
    return this.bind.source.sourceShader(shader);
  };

  Slice.prototype._resolve = function(key, dims) {
    var dim, end, index, range, start;
    range = this.props[key];
    dim = dims[key];
    if (range == null) {
      return [0, dim];
    }
    index = function(i, dim) {
      if (i < 0) {
        return dim + i;
      } else {
        return i;
      }
    };
    start = index(Math.round(range.x), dim);
    end = index(Math.round(range.y), dim);
    end = Math.max(start, end);
    return [start, end - start];
  };

  Slice.prototype._resample = function(dims) {
    dims.width = this._resolve('width', dims)[1];
    dims.height = this._resolve('height', dims)[1];
    dims.depth = this._resolve('depth', dims)[1];
    dims.items = this._resolve('items', dims)[1];
    return dims;
  };

  Slice.prototype.make = function() {
    Slice.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    return this.uniforms = {
      sliceOffset: this._attributes.make(this._types.vec4())
    };
  };

  Slice.prototype.unmake = function() {
    return Slice.__super__.unmake.apply(this, arguments);
  };

  Slice.prototype.resize = function() {
    var dims;
    if (this.bind.source == null) {
      return;
    }
    dims = this.bind.source.getActiveDimensions();
    this.uniforms.sliceOffset.value.set(this._resolve('width', dims)[0], this._resolve('height', dims)[0], this._resolve('depth', dims)[0], this._resolve('items', dims)[0]);
    return Slice.__super__.resize.apply(this, arguments);
  };

  Slice.prototype.change = function(changed, touched, init) {
    if (touched['operator']) {
      return this.rebuild();
    }
    if (touched['slice']) {
      return this.resize();
    }
  };

  return Slice;

})(Operator);

module.exports = Slice;
