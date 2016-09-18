var Operator, Spread,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Spread = (function(superClass) {
  extend(Spread, superClass);

  function Spread() {
    return Spread.__super__.constructor.apply(this, arguments);
  }

  Spread.traits = ['node', 'bind', 'operator', 'source', 'index', 'spread'];

  Spread.prototype.sourceShader = function(shader) {
    return shader.pipe(this.operator);
  };

  Spread.prototype.make = function() {
    var transform, uniforms;
    Spread.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    uniforms = {
      spreadMatrix: this._attributes.make(this._types.mat4()),
      spreadOffset: this._attributes.make(this._types.vec4())
    };
    this.spreadMatrix = uniforms.spreadMatrix;
    this.spreadOffset = uniforms.spreadOffset;
    transform = this._shaders.shader();
    transform.require(this.bind.source.sourceShader(this._shaders.shader()));
    transform.pipe('spread.position', uniforms);
    return this.operator = transform;
  };

  Spread.prototype.unmake = function() {
    return Spread.__super__.unmake.apply(this, arguments);
  };

  Spread.prototype.resize = function() {
    this.update();
    return Spread.__super__.resize.apply(this, arguments);
  };

  Spread.prototype.update = function() {
    var align, anchor, d, dims, els, i, j, k, key, len, map, matrix, offset, order, ref, results, spread, unit, unitEnum, v;
    dims = this.bind.source.getFutureDimensions();
    matrix = this.spreadMatrix.value;
    els = matrix.elements;
    order = ['width', 'height', 'depth', 'items'];
    align = ['alignWidth', 'alignHeight', 'alignDepth', 'alignItems'];
    unit = this.props.unit;
    unitEnum = this.node.attributes['spread.unit']["enum"];
    map = (function() {
      switch (unit) {
        case unitEnum.relative:
          return function(key, i, k, v) {
            return els[i * 4 + k] = v / Math.max(1, dims[key] - 1);
          };
        case unitEnum.absolute:
          return function(key, i, k, v) {
            return els[i * 4 + k] = v;
          };
      }
    })();
    results = [];
    for (i = j = 0, len = order.length; j < len; i = ++j) {
      key = order[i];
      spread = this.props[key];
      anchor = this.props[align[i]];
      if (spread != null) {
        d = (ref = dims[key]) != null ? ref : 1;
        offset = -(d - 1) * (.5 - anchor * .5);
      } else {
        offset = 0;
      }
      this.spreadOffset.value.setComponent(i, offset);
      results.push((function() {
        var l, ref1, results1;
        results1 = [];
        for (k = l = 0; l <= 3; k = ++l) {
          v = (ref1 = spread != null ? spread.getComponent(k) : void 0) != null ? ref1 : 0;
          results1.push(els[i * 4 + k] = map(key, i, k, v));
        }
        return results1;
      })());
    }
    return results;
  };

  Spread.prototype.change = function(changed, touched, init) {
    if (touched['operator']) {
      return this.rebuild();
    }
    if (touched['spread']) {
      return this.update();
    }
  };

  return Spread;

})(Operator);

module.exports = Spread;
