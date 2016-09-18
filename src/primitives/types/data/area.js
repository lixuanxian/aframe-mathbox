var Area, Matrix, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Matrix = require('./matrix');

Util = require('../../../util');

Area = (function(superClass) {
  extend(Area, superClass);

  function Area() {
    return Area.__super__.constructor.apply(this, arguments);
  }

  Area.traits = ['node', 'buffer', 'active', 'data', 'source', 'index', 'matrix', 'texture', 'raw', 'span:x', 'span:y', 'area', 'sampler:x', 'sampler:y'];

  Area.prototype.updateSpan = function() {
    var centeredX, centeredY, dimensions, height, inverseX, inverseY, padX, padY, rangeX, rangeY, spanX, spanY, width;
    dimensions = this.props.axes;
    width = this.props.width;
    height = this.props.height;
    centeredX = this.props.centeredX;
    centeredY = this.props.centeredY;
    padX = this.props.paddingX;
    padY = this.props.paddingY;
    rangeX = this._helpers.span.get('x.', dimensions[0]);
    rangeY = this._helpers.span.get('y.', dimensions[1]);
    this.aX = rangeX.x;
    this.aY = rangeY.x;
    spanX = rangeX.y - rangeX.x;
    spanY = rangeY.y - rangeY.x;
    width += padX * 2;
    height += padY * 2;
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
    this.bX = spanX * inverseX;
    this.bY = spanY * inverseY;
    this.aX += padX * this.bX;
    return this.aY += padY * this.bY;
  };

  Area.prototype.callback = function(callback) {
    this.updateSpan();
    if (this.last === callback) {
      return this._callback;
    }
    this.last = callback;
    if (callback.length <= 5) {
      return this._callback = (function(_this) {
        return function(emit, i, j) {
          var x, y;
          x = _this.aX + _this.bX * i;
          y = _this.aY + _this.bY * j;
          return callback(emit, x, y, i, j);
        };
      })(this);
    } else {
      return this._callback = (function(_this) {
        return function(emit, i, j) {
          var x, y;
          x = _this.aX + _this.bX * i;
          y = _this.aY + _this.bY * j;
          return callback(emit, x, y, i, j, _this.bufferClock, _this.bufferStep);
        };
      })(this);
    }
  };

  Area.prototype.make = function() {
    Area.__super__.make.apply(this, arguments);
    this._helpers.span.make();
    return this._listen(this, 'span.range', this.updateSpan);
  };

  Area.prototype.unmake = function() {
    Area.__super__.unmake.apply(this, arguments);
    return this._helpers.span.unmake();
  };

  return Area;

})(Matrix);

module.exports = Area;
