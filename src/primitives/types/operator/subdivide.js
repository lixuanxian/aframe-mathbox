var Operator, Subdivide, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');

Subdivide = (function(superClass) {
  extend(Subdivide, superClass);

  function Subdivide() {
    return Subdivide.__super__.constructor.apply(this, arguments);
  }

  Subdivide.traits = ['node', 'bind', 'operator', 'source', 'index', 'subdivide'];

  Subdivide.prototype.indexShader = function(shader) {
    shader.pipe(this.indexer);
    return Subdivide.__super__.indexShader.call(this, shader);
  };

  Subdivide.prototype.sourceShader = function(shader) {
    return shader.pipe(this.operator);
  };

  Subdivide.prototype.getDimensions = function() {
    return this._resample(this.bind.source.getDimensions());
  };

  Subdivide.prototype.getActiveDimensions = function() {
    return this._resample(this.bind.source.getActiveDimensions());
  };

  Subdivide.prototype.getFutureDimensions = function() {
    return this._resample(this.bind.source.getFutureDimensions());
  };

  Subdivide.prototype.getIndexDimensions = function() {
    return this._resample(this.bind.source.getIndexDimensions());
  };

  Subdivide.prototype._resample = function(dims) {
    var r;
    r = this.resampled;
    dims.items--;
    dims.width--;
    dims.height--;
    dims.depth--;
    if (r.items != null) {
      dims.items *= r.items;
    }
    if (r.width != null) {
      dims.width *= r.width;
    }
    if (r.height != null) {
      dims.height *= r.height;
    }
    if (r.depth != null) {
      dims.depth *= r.depth;
    }
    dims.items++;
    dims.width++;
    dims.height++;
    dims.depth++;
    return dims;
  };

  Subdivide.prototype.make = function() {
    var depth, height, i, id, indexer, items, j, key, len, lerp, operator, ref, ref1, resize, sampler, size, uniforms, width;
    Subdivide.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    ref = this.props, size = ref.size, items = ref.items, width = ref.width, height = ref.height, depth = ref.depth, lerp = ref.lerp;
    this.resampled = {};
    if (items != null) {
      this.resampled.items = items;
    }
    if (width != null) {
      this.resampled.width = width;
    }
    if (height != null) {
      this.resampled.height = height;
    }
    if (depth != null) {
      this.resampled.depth = depth;
    }
    operator = this._shaders.shader();
    indexer = this._shaders.shader();
    uniforms = {
      resampleFactor: this._attributes.make(this._types.vec4(0, 0, 0, 0)),
      subdivideBevel: this.node.attributes['subdivide.bevel']
    };
    this.resampleFactor = uniforms.resampleFactor;
    this.resampleBias = uniforms.resampleBias;
    resize = (items != null) || (width != null) || (height != null) || (depth != null);
    if (resize) {
      operator.pipe('resample.relative', uniforms);
      indexer.pipe('resample.relative', uniforms);
    } else {
      operator.pipe(Util.GLSL.identity('vec4'));
      indexer.pipe(Util.GLSL.identity('vec4'));
    }
    sampler = this.bind.source.sourceShader(this._shaders.shader());
    lerp = lerp ? '.lerp' : '';
    ref1 = ['width', 'height', 'depth', 'items'];
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      key = ref1[i];
      id = "subdivide." + key + lerp;
      if (this.props[key] != null) {
        sampler = this._shaders.shader().require(sampler);
        sampler.pipe(id, uniforms);
      }
    }
    operator.pipe(sampler);
    this.operator = operator;
    return this.indexer = indexer;
  };

  Subdivide.prototype.unmake = function() {
    Subdivide.__super__.unmake.apply(this, arguments);
    return this.operator = null;
  };

  Subdivide.prototype.resize = function() {
    var axis, dims, rd, rh, ri, rw, target;
    if (this.bind.source == null) {
      return;
    }
    dims = this.bind.source.getActiveDimensions();
    target = this.getActiveDimensions();
    axis = function(key) {
      return Math.max(1, dims[key] - 1) / Math.max(1, target[key] - 1);
    };
    rw = axis('width');
    rh = axis('height');
    rd = axis('depth');
    ri = axis('items');
    this.resampleFactor.value.set(rw, rh, rd, ri);
    return Subdivide.__super__.resize.apply(this, arguments);
  };

  Subdivide.prototype.change = function(changed, touched, init) {
    if (touched['operator'] || touched['subdivide']) {
      return this.rebuild();
    }
  };

  return Subdivide;

})(Operator);

module.exports = Subdivide;
