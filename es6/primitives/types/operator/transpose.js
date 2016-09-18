var Operator, Transpose, Util, labels,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');

labels = {
  1: 'width',
  2: 'height',
  3: 'depth',
  4: 'items'
};

Transpose = (function(superClass) {
  extend(Transpose, superClass);

  function Transpose() {
    return Transpose.__super__.constructor.apply(this, arguments);
  }

  Transpose.traits = ['node', 'bind', 'operator', 'source', 'index', 'transpose'];

  Transpose.prototype.indexShader = function(shader) {
    if (this.swizzler) {
      shader.pipe(this.swizzler);
    }
    return Transpose.__super__.indexShader.call(this, shader);
  };

  Transpose.prototype.sourceShader = function(shader) {
    if (this.swizzler) {
      shader.pipe(this.swizzler);
    }
    return Transpose.__super__.sourceShader.call(this, shader);
  };

  Transpose.prototype.getDimensions = function() {
    return this._remap(this.transpose, this.bind.source.getDimensions());
  };

  Transpose.prototype.getActiveDimensions = function() {
    return this._remap(this.transpose, this.bind.source.getActiveDimensions());
  };

  Transpose.prototype.getFutureDimensions = function() {
    return this._remap(this.transpose, this.bind.source.getFutureDimensions());
  };

  Transpose.prototype.getIndexDimensions = function() {
    return this._remap(this.transpose, this.bind.source.getIndexDimensions());
  };

  Transpose.prototype._remap = function(transpose, dims) {
    var dst, i, j, out, ref, src;
    out = {};
    for (i = j = 0; j <= 3; i = ++j) {
      dst = labels[i + 1];
      src = labels[transpose[i]];
      out[dst] = (ref = dims[src]) != null ? ref : 1;
    }
    return out;
  };

  Transpose.prototype.make = function() {
    var order;
    Transpose.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    order = this.props.order;
    if (order.join() !== '1234') {
      this.swizzler = Util.GLSL.invertSwizzleVec4(order);
    }
    this.transpose = order;
    return this.trigger({
      type: 'source.rebuild'
    });
  };

  Transpose.prototype.unmake = function() {
    Transpose.__super__.unmake.apply(this, arguments);
    return this.swizzler = null;
  };

  Transpose.prototype.change = function(changed, touched, init) {
    if (touched['transpose'] || touched['operator']) {
      return this.rebuild();
    }
  };

  return Transpose;

})(Operator);

module.exports = Transpose;
