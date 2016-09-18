var Clamp, Operator,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Clamp = (function(superClass) {
  extend(Clamp, superClass);

  function Clamp() {
    return Clamp.__super__.constructor.apply(this, arguments);
  }

  Clamp.traits = ['node', 'bind', 'operator', 'source', 'index', 'clamp'];

  Clamp.prototype.indexShader = function(shader) {
    shader.pipe(this.operator);
    return Clamp.__super__.indexShader.call(this, shader);
  };

  Clamp.prototype.sourceShader = function(shader) {
    shader.pipe(this.operator);
    return Clamp.__super__.sourceShader.call(this, shader);
  };

  Clamp.prototype.make = function() {
    var transform, uniforms;
    Clamp.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    uniforms = {
      clampLimit: this._attributes.make(this._types.vec4())
    };
    this.clampLimit = uniforms.clampLimit;
    transform = this._shaders.shader();
    transform.pipe('clamp.position', uniforms);
    return this.operator = transform;
  };

  Clamp.prototype.unmake = function() {
    return Clamp.__super__.unmake.apply(this, arguments);
  };

  Clamp.prototype.resize = function() {
    var dims;
    if (this.bind.source != null) {
      dims = this.bind.source.getActiveDimensions();
      this.clampLimit.value.set(dims.width - 1, dims.height - 1, dims.depth - 1, dims.items - 1);
    }
    return Clamp.__super__.resize.apply(this, arguments);
  };

  Clamp.prototype.change = function(changed, touched, init) {
    if (touched['operator'] || touched['clamp']) {
      return this.rebuild();
    }
  };

  return Clamp;

})(Operator);

module.exports = Clamp;
