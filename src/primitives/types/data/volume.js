var Util, Volume, Voxel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Voxel = require('./voxel');

Util = require('../../../util');

Volume = (function(superClass) {
  extend(Volume, superClass);

  function Volume() {
    return Volume.__super__.constructor.apply(this, arguments);
  }

  Volume.traits = ['node', 'buffer', 'active', 'data', 'source', 'index', 'texture', 'voxel', 'span:x', 'span:y', 'span:z', 'volume', 'sampler:x', 'sampler:y', 'sampler:z', 'raw'];

  Volume.prototype.updateSpan = function() {
    var centeredX, centeredY, centeredZ, depth, dimensions, height, inverseX, inverseY, inverseZ, padX, padY, padZ, rangeX, rangeY, rangeZ, spanX, spanY, spanZ, width;
    dimensions = this.props.axes;
    width = this.props.width;
    height = this.props.height;
    depth = this.props.depth;
    centeredX = this.props.centeredX;
    centeredY = this.props.centeredY;
    centeredZ = this.props.centeredZ;
    padX = this.props.paddingX;
    padY = this.props.paddingY;
    padZ = this.props.paddingZ;
    rangeX = this._helpers.span.get('x.', dimensions[0]);
    rangeY = this._helpers.span.get('y.', dimensions[1]);
    rangeZ = this._helpers.span.get('z.', dimensions[2]);
    this.aX = rangeX.x;
    this.aY = rangeY.x;
    this.aZ = rangeZ.x;
    spanX = rangeX.y - rangeX.x;
    spanY = rangeY.y - rangeY.x;
    spanZ = rangeZ.y - rangeZ.x;
    width += padX * 2;
    height += padY * 2;
    depth += padZ * 2;
    if (centeredX) {
      inverseX = 1 / Math.max(1, width);
      this.aX += spanX * inverseX / 2;
    } else {
      inverseX = 1 / Math.max(1, width - 1);
    }
    if (centeredY) {
      inverseY = 1 / Math.max(1, height);
      this.aY += spanY * inverseY / 2;
    } else {
      inverseY = 1 / Math.max(1, height - 1);
    }
    if (centeredZ) {
      inverseZ = 1 / Math.max(1, depth);
      this.aZ += spanZ * inverseZ / 2;
    } else {
      inverseZ = 1 / Math.max(1, depth - 1);
    }
    this.bX = spanX * inverseX;
    this.bY = spanY * inverseY;
    this.bZ = spanZ * inverseZ;
    this.aX += this.bX * padX;
    this.aY += this.bY * padY;
    return this.aZ += this.bZ * padY;
  };

  Volume.prototype.callback = function(callback) {
    this.updateSpan();
    if (this.last === callback) {
      return this._callback;
    }
    this.last = callback;
    if (callback.length <= 7) {
      return this._callback = (function(_this) {
        return function(emit, i, j, k) {
          var x, y, z;
          x = _this.aX + _this.bX * i;
          y = _this.aY + _this.bY * j;
          z = _this.aZ + _this.bZ * k;
          return callback(emit, x, y, z, i, j, k);
        };
      })(this);
    } else {
      return this._callback = (function(_this) {
        return function(emit, i, j, k) {
          var x, y, z;
          x = _this.aX + _this.bX * i;
          y = _this.aY + _this.bY * j;
          z = _this.aZ + _this.bZ * k;
          return callback(emit, x, y, z, i, j, k, _this.bufferClock, _this.bufferStep);
        };
      })(this);
    }
  };

  Volume.prototype.make = function() {
    Volume.__super__.make.apply(this, arguments);
    this._helpers.span.make();
    return this._listen(this, 'span.range', this.updateSpan);
  };

  Volume.prototype.unmake = function() {
    Volume.__super__.unmake.apply(this, arguments);
    return this._helpers.span.unmake();
  };

  return Volume;

})(Voxel);

module.exports = Volume;
