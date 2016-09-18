var Join, Operator, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');


/*
split:
  order:       Types.transpose('wxyz')
  axis:        Types.axis()
  overlap:     Types.int(0)
 */

Join = (function(superClass) {
  extend(Join, superClass);

  function Join() {
    return Join.__super__.constructor.apply(this, arguments);
  }

  Join.traits = ['node', 'bind', 'operator', 'source', 'index', 'join'];

  Join.prototype.indexShader = function(shader) {
    shader.pipe(this.operator);
    return Join.__super__.indexShader.call(this, shader);
  };

  Join.prototype.sourceShader = function(shader) {
    shader.pipe(this.operator);
    return Join.__super__.sourceShader.call(this, shader);
  };

  Join.prototype.getDimensions = function() {
    return this._resample(this.bind.source.getDimensions());
  };

  Join.prototype.getActiveDimensions = function() {
    return this._resample(this.bind.source.getActiveDimensions());
  };

  Join.prototype.getFutureDimensions = function() {
    return this._resample(this.bind.source.getFutureDimensions());
  };

  Join.prototype.getIndexDimensions = function() {
    return this._resample(this.bind.source.getIndexDimensions());
  };

  Join.prototype._resample = function(dims) {
    var axis, dim, i, index, j, labels, len, length, mapped, order, out, overlap, product, ref, set, stride;
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
    product = ((ref = set[index + 1]) != null ? ref : 1) * stride;
    set.splice(index, 2, product);
    set = set.slice(0, 3);
    set.push(1);
    out = {};
    for (i = j = 0, len = mapped.length; j < len; i = ++j) {
      dim = mapped[i];
      out[dim] = set[i];
    }
    return out;
  };

  Join.prototype.make = function() {
    var axis, dims, index, labels, length, major, order, overlap, permute, rest, stride, transform, uniforms;
    Join.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    order = this.props.order;
    axis = this.props.axis;
    overlap = this.props.overlap;

    /*
    Calculate index transform
    
    order: wxyz
    length: 3
    overlap: 1
    
    axis: w
    index: 0
    rest: 00xy
    
    axis: x
    index: 1
    rest: w00y
    
    axis: y
    index: 2
    rest: wx00
    
    axis: z
    index: 3
    rest: wxy0
     */
    permute = order.join('');
    if (axis == null) {
      axis = order[0];
    }
    index = permute.indexOf(axis);
    rest = permute.replace(axis, '00').substring(0, 4);
    labels = [null, 'width', 'height', 'depth', 'items'];
    major = labels[axis];
    dims = this.bind.source.getDimensions();
    length = dims[major];
    overlap = Math.min(length - 1, overlap);
    stride = length - overlap;
    uniforms = {
      joinStride: this._attributes.make(this._types.number(stride)),
      joinStrideInv: this._attributes.make(this._types.number(1 / stride))
    };
    transform = this._shaders.shader();
    transform.require(Util.GLSL.swizzleVec4(axis, 1));
    transform.require(Util.GLSL.swizzleVec4(rest, 4));
    transform.require(Util.GLSL.injectVec4([index, index + 1]));
    transform.pipe('join.position', uniforms);
    transform.pipe(Util.GLSL.invertSwizzleVec4(order));
    this.operator = transform;
    this.order = order;
    this.axis = axis;
    this.overlap = overlap;
    this.length = length;
    return this.stride = stride;
  };

  Join.prototype.unmake = function() {
    return Join.__super__.unmake.apply(this, arguments);
  };

  Join.prototype.change = function(changed, touched, init) {
    if (touched['join'] || touched['operator']) {
      return this.rebuild();
    }
  };

  return Join;

})(Operator);

module.exports = Join;
