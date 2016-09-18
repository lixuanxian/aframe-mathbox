var Grow, Operator,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Grow = (function(superClass) {
  extend(Grow, superClass);

  function Grow() {
    return Grow.__super__.constructor.apply(this, arguments);
  }

  Grow.traits = ['node', 'bind', 'operator', 'source', 'index', 'grow'];

  Grow.prototype.sourceShader = function(shader) {
    return shader.pipe(this.operator);
  };

  Grow.prototype.make = function() {
    var transform, uniforms;
    Grow.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    uniforms = {
      growScale: this.node.attributes['grow.scale'],
      growMask: this._attributes.make(this._types.vec4()),
      growAnchor: this._attributes.make(this._types.vec4())
    };
    this.growMask = uniforms.growMask.value;
    this.growAnchor = uniforms.growAnchor.value;
    transform = this._shaders.shader();
    transform.require(this.bind.source.sourceShader(this._shaders.shader()));
    transform.pipe('grow.position', uniforms);
    return this.operator = transform;
  };

  Grow.prototype.unmake = function() {
    return Grow.__super__.unmake.apply(this, arguments);
  };

  Grow.prototype.resize = function() {
    this.update();
    return Grow.__super__.resize.apply(this, arguments);
  };

  Grow.prototype.update = function() {
    var anchor, dims, i, j, key, len, m, order, results;
    dims = this.bind.source.getFutureDimensions();
    order = ['width', 'height', 'depth', 'items'];
    m = function(d, anchor) {
      return ((d || 1) - 1) * (.5 - anchor * .5);
    };
    results = [];
    for (i = j = 0, len = order.length; j < len; i = ++j) {
      key = order[i];
      anchor = this.props[key];
      this.growMask.setComponent(i, +(anchor == null));
      results.push(this.growAnchor.setComponent(i, anchor != null ? m(dims[key], anchor) : 0));
    }
    return results;
  };

  Grow.prototype.change = function(changed, touched, init) {
    if (touched['operator']) {
      return this.rebuild();
    }
    if (touched['grow']) {
      return this.update();
    }
  };

  return Grow;

})(Operator);

module.exports = Grow;
