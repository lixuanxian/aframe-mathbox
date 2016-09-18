var Operator, Split, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');


/*
split:
  order:       Types.transpose('wxyz')
  axis:        Types.axis()
  length:      Types.int(1)
  overlap:     Types.int(0)
 */

Split = (function(superClass) {
  extend(Split, superClass);

  function Split() {
    return Split.__super__.constructor.apply(this, arguments);
  }

  Split.traits = ['node', 'bind', 'operator', 'source', 'index', 'split'];

  Split.prototype.indexShader = function(shader) {
    shader.pipe(this.operator);
    return Split.__super__.indexShader.call(this, shader);
  };

  Split.prototype.sourceShader = function(shader) {
    shader.pipe(this.operator);
    return Split.__super__.sourceShader.call(this, shader);
  };

  Split.prototype.getDimensions = function() {
    return this._resample(this.bind.source.getDimensions());
  };

  Split.prototype.getActiveDimensions = function() {
    return this._resample(this.bind.source.getActiveDimensions());
  };

  Split.prototype.getFutureDimensions = function() {
    return this._resample(this.bind.source.getFutureDimensions());
  };

  Split.prototype.getIndexDimensions = function() {
    return this._resample(this.bind.source.getIndexDimensions());
  };

  Split.prototype._resample = function(dims) {
    var axis, dim, i, index, j, labels, len, length, mapped, order, out, overlap, remain, set, stride;
    order = this.order;
    axis = this.axis;
    overlap = this.overlap;
    length = this.length;
    stride = this.stride;
    labels = ['width', 'height', 'depth', 'items'];
    mapped = order.map(function(x) {
      return labels[x - 1];
    });
    index = order.indexOf(axis);
    set = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = mapped.length; j < len; j++) {
        dim = mapped[j];
        results.push(dims[dim]);
      }
      return results;
    })();
    remain = Math.floor((set[index] - overlap) / stride);
    set.splice(index, 1, length, remain);
    set = set.slice(0, 4);
    out = {};
    for (i = j = 0, len = mapped.length; j < len; i = ++j) {
      dim = mapped[i];
      out[dim] = set[i];
    }
    return out;
  };

  Split.prototype.make = function() {
    var axis, index, length, order, overlap, permute, ref, rest, split, stride, transform, uniforms;
    Split.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    order = this.props.order;
    axis = this.props.axis;
    overlap = this.props.overlap;
    length = this.props.length;

    /*
    Calculate index transform
    
    order: wxyz
    length: 3
    overlap: 1
    
    axis: w
    index: 0
    split: wx
    rest:  0yz0
           s
    
    axis: x
    index: 1
    split: xy
    rest:  w0z0
            s
    
    axis: y
    index: 2
    split: yz
    rest:  wx00
             s
    
    axis: z
    index: 3
    split: z0
    rest: wxy0
             s
     */
    permute = order.join('');
    if (axis == null) {
      axis = order[0];
    }
    index = permute.indexOf(axis);
    split = permute[index] + ((ref = permute[index + 1]) != null ? ref : 0);
    rest = permute.replace(split[1], '').replace(split[0], '0') + '0';
    overlap = Math.min(length - 1, overlap);
    stride = length - overlap;
    uniforms = {
      splitStride: this._attributes.make(this._types.number(stride))
    };
    transform = this._shaders.shader();
    transform.require(Util.GLSL.swizzleVec4(split, 2));
    transform.require(Util.GLSL.swizzleVec4(rest, 4));
    transform.require(Util.GLSL.injectVec4(index));
    transform.pipe('split.position', uniforms);
    transform.pipe(Util.GLSL.invertSwizzleVec4(order));
    this.operator = transform;
    this.order = order;
    this.axis = axis;
    this.overlap = overlap;
    this.length = length;
    return this.stride = stride;
  };

  Split.prototype.unmake = function() {
    return Split.__super__.unmake.apply(this, arguments);
  };

  Split.prototype.change = function(changed, touched, init) {
    if (changed['split.axis'] || changed['split.order'] || touched['operator']) {
      return this.rebuild();
    }
  };

  return Split;

})(Operator);

module.exports = Split;
