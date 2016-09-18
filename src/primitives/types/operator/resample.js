var Operator, Resample, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');

Resample = (function(superClass) {
  extend(Resample, superClass);

  function Resample() {
    return Resample.__super__.constructor.apply(this, arguments);
  }

  Resample.traits = ['node', 'bind', 'operator', 'source', 'index', 'resample', 'sampler:x', 'sampler:y', 'sampler:z', 'sampler:w', 'include'];

  Resample.prototype.indexShader = function(shader) {
    shader.pipe(this.indexer);
    return Resample.__super__.indexShader.call(this, shader);
  };

  Resample.prototype.sourceShader = function(shader) {
    return shader.pipe(this.operator);
  };

  Resample.prototype.getDimensions = function() {
    return this._resample(this.bind.source.getDimensions());
  };

  Resample.prototype.getActiveDimensions = function() {
    return this._resample(this.bind.source.getActiveDimensions());
  };

  Resample.prototype.getFutureDimensions = function() {
    return this._resample(this.bind.source.getFutureDimensions());
  };

  Resample.prototype.getIndexDimensions = function() {
    return this._resample(this.bind.source.getIndexDimensions());
  };

  Resample.prototype._resample = function(dims) {
    var c, p, r;
    r = this.resampled;
    c = this.centered;
    p = this.padding;
    if (this.relativeSize) {
      if (!c.items) {
        dims.items--;
      }
      if (!c.width) {
        dims.width--;
      }
      if (!c.height) {
        dims.height--;
      }
      if (!c.depth) {
        dims.depth--;
      }
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
      if (!c.items) {
        dims.items++;
      }
      if (!c.width) {
        dims.width++;
      }
      if (!c.height) {
        dims.height++;
      }
      if (!c.depth) {
        dims.depth++;
      }
      dims.items -= p.items * 2;
      dims.width -= p.width * 2;
      dims.height -= p.height * 2;
      dims.depth -= p.depth * 2;
    } else {
      if (r.items != null) {
        dims.items = r.items;
      }
      if (r.width != null) {
        dims.width = r.width;
      }
      if (r.height != null) {
        dims.height = r.height;
      }
      if (r.depth != null) {
        dims.depth = r.depth;
      }
    }
    dims.items = Math.max(0, Math.floor(dims.items));
    dims.width = Math.max(0, Math.floor(dims.width));
    dims.height = Math.max(0, Math.floor(dims.height));
    dims.depth = Math.max(0, Math.floor(dims.depth));
    return dims;
  };

  Resample.prototype.make = function() {
    var any, centered, channels, depth, height, i, indexer, indices, items, j, key, len, operator, ref, ref1, ref2, relativeSample, relativeSize, resize, sample, shader, size, type, uniforms, vec, width;
    Resample.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    this._helpers.bind.make([
      {
        to: 'include.shader',
        trait: 'shader',
        optional: true
      }
    ]);
    ref = this.props, indices = ref.indices, channels = ref.channels;
    shader = this.bind.shader;
    ref1 = this.props, sample = ref1.sample, size = ref1.size, items = ref1.items, width = ref1.width, height = ref1.height, depth = ref1.depth;
    relativeSample = sample === this.node.attributes['resample.sample']["enum"].relative;
    relativeSize = size === this.node.attributes['resample.size']["enum"].relative;
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
    this.centered = {};
    this.centered.items = this.props.centeredW;
    this.centered.width = this.props.centeredX;
    this.centered.height = this.props.centeredY;
    this.centered.depth = this.props.centeredZ;
    this.padding = {};
    this.padding.items = this.props.paddingW;
    this.padding.width = this.props.paddingX;
    this.padding.height = this.props.paddingY;
    this.padding.depth = this.props.paddingZ;
    operator = this._shaders.shader();
    indexer = this._shaders.shader();
    type = [null, this._types.number, this._types.vec2, this._types.vec3, this._types.vec4][indices];
    uniforms = {
      dataSize: this._attributes.make(type(0, 0, 0, 0)),
      dataResolution: this._attributes.make(type(0, 0, 0, 0)),
      targetSize: this._attributes.make(type(0, 0, 0, 0)),
      targetResolution: this._attributes.make(type(0, 0, 0, 0)),
      resampleFactor: this._attributes.make(this._types.vec4(0, 0, 0, 0)),
      resampleBias: this._attributes.make(this._types.vec4(0, 0, 0, 0))
    };
    this.dataResolution = uniforms.dataResolution;
    this.dataSize = uniforms.dataSize;
    this.targetResolution = uniforms.targetResolution;
    this.targetSize = uniforms.targetSize;
    this.resampleFactor = uniforms.resampleFactor;
    this.resampleBias = uniforms.resampleBias;
    resize = (items != null) || (width != null) || (height != null) || (depth != null);
    operator.pipe('resample.padding', uniforms);
    vec = [];
    any = false;
    ref2 = ['width', 'height', 'depth', 'items'];
    for (i = j = 0, len = ref2.length; j < len; i = ++j) {
      key = ref2[i];
      centered = this.centered[key];
      any || (any = centered);
      vec[i] = centered ? "0.5" : "0.0";
    }
    if (any) {
      vec = "vec4(" + vec + ")";
      operator.pipe(Util.GLSL.binaryOperator(4, '+', vec4));
      if (resize) {
        indexer.pipe(Util.GLSL.binaryOperator(4, '+', vec4));
      }
    }
    if (relativeSample) {
      if (resize) {
        operator.pipe('resample.relative', uniforms);
        indexer.pipe('resample.relative', uniforms);
      } else {
        indexer.pipe(Util.GLSL.identity('vec4'));
      }
    }
    if (shader != null) {
      if (indices !== 4) {
        operator.pipe(Util.GLSL.truncateVec(4, indices));
      }
      operator.callback();
      if (indices !== 4) {
        operator.pipe(Util.GLSL.extendVec(indices, 4));
      }
      if (any) {
        operator.pipe(Util.GLSL.binaryOperator(4, '-', vec));
      }
      operator.pipe(this.bind.source.sourceShader(this._shaders.shader()));
      if (channels !== 4) {
        operator.pipe(Util.GLSL.truncateVec(4, channels));
      }
      operator.join();
      if (this.bind.shader != null) {
        operator.pipe(this.bind.shader.shaderBind(uniforms));
      }
      if (channels !== 4) {
        operator.pipe(Util.GLSL.extendVec(channels, 4));
      }
    } else {
      if (any) {
        operator.pipe(Util.GLSL.binaryOperator(4, '-', vec));
      }
      operator.pipe(this.bind.source.sourceShader(this._shaders.shader()));
    }
    if (any && resize) {
      indexer.pipe(Util.GLSL.binaryOperator(4, '-', vec));
    }
    this.operator = operator;
    this.indexer = indexer;
    this.indices = indices;
    this.relativeSample = relativeSample;
    return this.relativeSize = relativeSize;
  };

  Resample.prototype.unmake = function() {
    Resample.__super__.unmake.apply(this, arguments);
    return this.operator = null;
  };

  Resample.prototype.resize = function() {
    var axis, bd, bh, bi, bw, dims, rd, ref, ref1, ref2, ref3, rh, ri, rw, target;
    if (this.bind.source == null) {
      return;
    }
    dims = this.bind.source.getActiveDimensions();
    target = this.getActiveDimensions();
    axis = (function(_this) {
      return function(key) {
        var centered, pad, res;
        centered = _this.centered[key];
        pad = _this.padding[key];
        target[key] += pad * 2;
        res = centered ? dims[key] / Math.max(1, target[key]) : Math.max(1, dims[key] - 1) / Math.max(1, target[key] - 1);
        return [res, pad];
      };
    })(this);
    ref = axis('width'), rw = ref[0], bw = ref[1];
    ref1 = axis('height'), rh = ref1[0], bh = ref1[1];
    ref2 = axis('depth'), rd = ref2[0], bd = ref2[1];
    ref3 = axis('items'), ri = ref3[0], bi = ref3[1];
    if (this.indices === 1) {
      this.dataResolution.value = 1 / dims.width;
      this.targetResolution.value = 1 / target.width;
      this.dataSize.value = dims.width;
      this.targetSize.value = target.width;
    } else {
      this.dataResolution.value.set(1 / dims.width, 1 / dims.height, 1 / dims.depth, 1 / dims.items);
      this.targetResolution.value.set(1 / target.width, 1 / target.height, 1 / target.depth, 1 / target.items);
      this.dataSize.value.set(dims.width, dims.height, dims.depth, dims.items);
      this.targetSize.value.set(target.width, target.height, target.depth, target.items);
    }
    this.resampleFactor.value.set(rw, rh, rd, ri);
    this.resampleBias.value.set(bw, bh, bd, bi);
    return Resample.__super__.resize.apply(this, arguments);
  };

  Resample.prototype.change = function(changed, touched, init) {
    if (touched['operator'] || touched['resample'] || touched['sampler'] || touched['include']) {
      return this.rebuild();
    }
  };

  return Resample;

})(Operator);

module.exports = Resample;
