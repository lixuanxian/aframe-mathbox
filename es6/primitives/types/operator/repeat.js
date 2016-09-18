var Operator, Repeat,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Repeat = (function(superClass) {
  extend(Repeat, superClass);

  function Repeat() {
    return Repeat.__super__.constructor.apply(this, arguments);
  }

  Repeat.traits = ['node', 'bind', 'operator', 'source', 'index', 'repeat'];

  Repeat.prototype.indexShader = function(shader) {
    shader.pipe(this.operator);
    return Repeat.__super__.indexShader.call(this, shader);
  };

  Repeat.prototype.sourceShader = function(shader) {
    shader.pipe(this.operator);
    return Repeat.__super__.sourceShader.call(this, shader);
  };

  Repeat.prototype.getDimensions = function() {
    return this._resample(this.bind.source.getDimensions());
  };

  Repeat.prototype.getActiveDimensions = function() {
    return this._resample(this.bind.source.getActiveDimensions());
  };

  Repeat.prototype.getFutureDimensions = function() {
    return this._resample(this.bind.source.getFutureDimensions());
  };

  Repeat.prototype.getIndexDimensions = function() {
    return this._resample(this.bind.source.getIndexDimensions());
  };

  Repeat.prototype._resample = function(dims) {
    var r;
    r = this.resample;
    return {
      items: r.items * dims.items,
      width: r.width * dims.width,
      height: r.height * dims.height,
      depth: r.depth * dims.depth
    };
  };

  Repeat.prototype.make = function() {
    var transform, uniforms;
    Repeat.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    this.resample = {};
    uniforms = {
      repeatModulus: this._attributes.make(this._types.vec4())
    };
    this.repeatModulus = uniforms.repeatModulus;
    transform = this._shaders.shader();
    transform.pipe('repeat.position', uniforms);
    return this.operator = transform;
  };

  Repeat.prototype.unmake = function() {
    return Repeat.__super__.unmake.apply(this, arguments);
  };

  Repeat.prototype.resize = function() {
    var dims;
    if (this.bind.source != null) {
      dims = this.bind.source.getActiveDimensions();
      this.repeatModulus.value.set(dims.width, dims.height, dims.depth, dims.items);
    }
    return Repeat.__super__.resize.apply(this, arguments);
  };

  Repeat.prototype.change = function(changed, touched, init) {
    var i, key, len, ref, results;
    if (touched['operator'] || touched['repeat']) {
      return this.rebuild();
    }
    if (init) {
      ref = ['items', 'width', 'height', 'depth'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(this.resample[key] = this.props[key]);
      }
      return results;
    }
  };

  return Repeat;

})(Operator);

module.exports = Repeat;
