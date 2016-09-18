var Lerp, Operator, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');

Lerp = (function(superClass) {
  extend(Lerp, superClass);

  function Lerp() {
    return Lerp.__super__.constructor.apply(this, arguments);
  }

  Lerp.traits = ['node', 'bind', 'operator', 'source', 'index', 'lerp', 'sampler:x', 'sampler:y', 'sampler:z', 'sampler:w'];

  Lerp.prototype.indexShader = function(shader) {
    shader.pipe(this.indexer);
    return Lerp.__super__.indexShader.call(this, shader);
  };

  Lerp.prototype.sourceShader = function(shader) {
    return shader.pipe(this.operator);
  };

  Lerp.prototype.getDimensions = function() {
    return this._resample(this.bind.source.getDimensions());
  };

  Lerp.prototype.getActiveDimensions = function() {
    return this._resample(this.bind.source.getActiveDimensions());
  };

  Lerp.prototype.getFutureDimensions = function() {
    return this._resample(this.bind.source.getFutureDimensions());
  };

  Lerp.prototype.getIndexDimensions = function() {
    return this._resample(this.bind.source.getIndexDimensions());
  };

  Lerp.prototype._resample = function(dims) {
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

  Lerp.prototype.make = function() {
    var any, centered, depth, height, i, id, indexer, items, j, k, key, len, len1, operator, ref, ref1, ref2, relativeSize, resize, sampler, size, uniforms, vec, width;
    Lerp.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    ref = this.props, size = ref.size, items = ref.items, width = ref.width, height = ref.height, depth = ref.depth;
    relativeSize = size === this.node.attributes['lerp.size']["enum"].relative;
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
    uniforms = {
      resampleFactor: this._attributes.make(this._types.vec4(0, 0, 0, 0)),
      resampleBias: this._attributes.make(this._types.vec4(0, 0, 0, 0))
    };
    this.resampleFactor = uniforms.resampleFactor;
    this.resampleBias = uniforms.resampleBias;
    resize = (items != null) || (width != null) || (height != null) || (depth != null);
    operator.pipe('resample.padding', uniforms);
    vec = [];
    any = false;
    ref1 = ['width', 'height', 'depth', 'items'];
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      key = ref1[i];
      centered = this.centered[key];
      any || (any = centered);
      vec[i] = centered ? "0.5" : "0.0";
    }
    if (any && resize) {
      vec = "vec4(" + vec + ")";
      operator.pipe(Util.GLSL.binaryOperator(4, '+', vec4));
      indexer.pipe(Util.GLSL.binaryOperator(4, '+', vec4));
    }
    if (resize) {
      operator.pipe('resample.relative', uniforms);
      indexer.pipe('resample.relative', uniforms);
    } else {
      operator.pipe(Util.GLSL.identity('vec4'));
      indexer.pipe(Util.GLSL.identity('vec4'));
    }
    if (any && resize) {
      operator.pipe(Util.GLSL.binaryOperator(4, '-', vec));
      indexer.pipe(Util.GLSL.binaryOperator(4, '-', vec));
    }
    sampler = this.bind.source.sourceShader(this._shaders.shader());
    ref2 = ['width', 'height', 'depth', 'items'];
    for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
      key = ref2[i];
      id = "lerp." + key;
      if (this.props[key] != null) {
        sampler = this._shaders.shader().require(sampler);
        sampler.pipe(id, uniforms);
      }
    }
    operator.pipe(sampler);
    this.operator = operator;
    this.indexer = indexer;
    return this.relativeSize = relativeSize;
  };

  Lerp.prototype.unmake = function() {
    Lerp.__super__.unmake.apply(this, arguments);
    return this.operator = null;
  };

  Lerp.prototype.resize = function() {
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
    this.resampleFactor.value.set(rw, rh, rd, ri);
    this.resampleBias.value.set(bw, bh, bd, bi);
    return Lerp.__super__.resize.apply(this, arguments);
  };

  Lerp.prototype.change = function(changed, touched, init) {
    if (touched['operator'] || touched['lerp'] || touched['sampler']) {
      return this.rebuild();
    }
  };

  return Lerp;

})(Operator);

module.exports = Lerp;
