var Data, Source, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Source = require('../base/source');

Util = require('../../../util');

Data = (function(superClass) {
  extend(Data, superClass);

  function Data() {
    return Data.__super__.constructor.apply(this, arguments);
  }

  Data.traits = ['node', 'data', 'source', 'index', 'entity', 'active'];

  Data.prototype.init = function() {
    this.dataEmitter = null;
    return this.dataSizes = null;
  };

  Data.prototype.emitter = function(channels, items) {
    var bind, data, emitter, expr, last, resolve, sizes, thunk;
    data = this.props.data;
    bind = this.props.bind;
    expr = this.props.expr;
    if (data != null) {
      last = this.dataSizes;
      sizes = Util.Data.getSizes(data);
      if (!last || last.length !== sizes.length) {
        thunk = Util.Data.getThunk(data);
        this.dataEmitter = this.callback(Util.Data.makeEmitter(thunk, items, channels));
        this.dataSizes = sizes;
      }
      emitter = this.dataEmitter;
    } else if (typeof resolve !== "undefined" && resolve !== null) {
      resolve = this._inherit('resolve');
      emitter = this.callback(resolve.callback(bind));
    } else if (expr != null) {
      emitter = this.callback(expr);
    } else {
      emitter = this.callback(this.passthrough);
    }
    return emitter;
  };

  Data.prototype.callback = function(callback) {
    return callback != null ? callback : function() {};
  };

  Data.prototype.update = function() {};

  Data.prototype.make = function() {
    this._helpers.active.make();
    this.first = true;
    return this._listen('root', 'root.update', (function(_this) {
      return function() {
        if (_this.isActive || _this.first) {
          _this.update();
        }
        return _this.first = false;
      };
    })(this));
  };

  Data.prototype.unmake = function() {
    this._helpers.active.unmake();
    this.dataEmitter = null;
    return this.dataSizes = null;
  };

  return Data;

})(Source);

module.exports = Data;
