var Interval, Util, _Array,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_Array = require('./array');

Util = require('../../../util');

Interval = (function(superClass) {
  extend(Interval, superClass);

  function Interval() {
    return Interval.__super__.constructor.apply(this, arguments);
  }

  Interval.traits = ['node', 'buffer', 'active', 'data', 'source', 'index', 'texture', 'array', 'span', 'interval', 'sampler', 'raw'];

  Interval.prototype.updateSpan = function() {
    var centered, dimension, inverse, pad, range, span, width;
    dimension = this.props.axis;
    width = this.props.width;
    centered = this.props.centered;
    pad = this.props.padding;
    range = this._helpers.span.get('', dimension);
    width += pad * 2;
    this.a = range.x;
    span = range.y - range.x;
    if (centered) {
      inverse = 1 / Math.max(1, width);
      this.a += span * inverse / 2;
    } else {
      inverse = 1 / Math.max(1, width - 1);
    }
    this.b = span * inverse;
    return this.a += pad * this.b;
  };

  Interval.prototype.callback = function(callback) {
    this.updateSpan();
    if (this.last === callback) {
      return this._callback;
    }
    this.last = callback;
    if (callback.length <= 3) {
      return this._callback = (function(_this) {
        return function(emit, i) {
          var x;
          x = _this.a + _this.b * i;
          return callback(emit, x, i);
        };
      })(this);
    } else {
      return this._callback = (function(_this) {
        return function(emit, i) {
          var x;
          x = _this.a + _this.b * i;
          return callback(emit, x, i, _this.bufferClock, _this.bufferStep);
        };
      })(this);
    }
  };

  Interval.prototype.make = function() {
    Interval.__super__.make.apply(this, arguments);
    this._helpers.span.make();
    return this._listen(this, 'span.range', this.updateSpan);
  };

  Interval.prototype.unmake = function() {
    Interval.__super__.unmake.apply(this, arguments);
    return this._helpers.span.unmake();
  };

  return Interval;

})(_Array);

module.exports = Interval;
