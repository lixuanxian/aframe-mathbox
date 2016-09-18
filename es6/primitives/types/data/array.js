var Array_, Buffer, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Buffer = require('./buffer');

Util = require('../../../util');

Array_ = (function(superClass) {
  extend(Array_, superClass);

  function Array_() {
    return Array_.__super__.constructor.apply(this, arguments);
  }

  Array_.traits = ['node', 'buffer', 'active', 'data', 'source', 'index', 'array', 'texture', 'raw'];

  Array_.prototype.init = function() {
    this.buffer = this.spec = null;
    this.space = {
      width: 0,
      history: 0
    };
    this.used = {
      width: 0
    };
    this.storage = 'arrayBuffer';
    this.passthrough = function(emit, x) {
      return emit(x, 0, 0, 0);
    };
    return Array_.__super__.init.apply(this, arguments);
  };

  Array_.prototype.sourceShader = function(shader) {
    var dims;
    dims = this.getDimensions();
    this.alignShader(dims, shader);
    return this.buffer.shader(shader);
  };

  Array_.prototype.getDimensions = function() {
    return {
      items: this.items,
      width: this.space.width,
      height: this.space.history,
      depth: 1
    };
  };

  Array_.prototype.getActiveDimensions = function() {
    return {
      items: this.items,
      width: this.used.width,
      height: this.buffer.getFilled(),
      depth: 1
    };
  };

  Array_.prototype.getFutureDimensions = function() {
    return {
      items: this.items,
      width: this.used.width,
      height: this.space.history,
      depth: 1
    };
  };

  Array_.prototype.getRawDimensions = function() {
    return {
      items: this.items,
      width: space.width,
      height: 1,
      depth: 1
    };
  };

  Array_.prototype.make = function() {
    var channels, data, dims, history, items, magFilter, minFilter, ref, ref1, ref2, reserve, space, type, width;
    Array_.__super__.make.apply(this, arguments);
    minFilter = (ref = this.minFilter) != null ? ref : this.props.minFilter;
    magFilter = (ref1 = this.magFilter) != null ? ref1 : this.props.magFilter;
    type = (ref2 = this.type) != null ? ref2 : this.props.type;
    width = this.props.width;
    history = this.props.history;
    reserve = this.props.bufferWidth;
    channels = this.props.channels;
    items = this.props.items;
    dims = this.spec = {
      channels: channels,
      items: items,
      width: width
    };
    this.items = dims.items;
    this.channels = dims.channels;
    data = this.props.data;
    dims = Util.Data.getDimensions(data, dims);
    space = this.space;
    space.width = Math.max(reserve, dims.width || 1);
    space.history = history;
    return this.buffer = this._renderables.make(this.storage, {
      width: space.width,
      history: space.history,
      channels: channels,
      items: items,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
  };

  Array_.prototype.unmake = function() {
    Array_.__super__.unmake.apply(this, arguments);
    if (this.buffer) {
      this.buffer.dispose();
      return this.buffer = this.spec = null;
    }
  };

  Array_.prototype.change = function(changed, touched, init) {
    var width;
    if (touched['texture'] || changed['history.history'] || changed['buffer.channels'] || changed['buffer.items'] || changed['array.bufferWidth']) {
      return this.rebuild();
    }
    if (!this.buffer) {
      return;
    }
    if (changed['array.width']) {
      width = this.props.width;
      if (width > this.space.width) {
        return this.rebuild();
      }
    }
    if (changed['data.map'] || changed['data.data'] || changed['data.resolve'] || changed['data.expr'] || init) {
      return this.buffer.setCallback(this.emitter());
    }
  };

  Array_.prototype.callback = function(callback) {
    if (callback.length <= 2) {
      return callback;
    } else {
      return (function(_this) {
        return function(emit, i) {
          return callback(emit, i, _this.bufferClock, _this.bufferStep);
        };
      })(this);
    }
  };

  Array_.prototype.update = function() {
    var data, filled, l, space, used;
    if (!this.buffer) {
      return;
    }
    data = this.props.data;
    space = this.space, used = this.used;
    l = used.width;
    filled = this.buffer.getFilled();
    this.syncBuffer((function(_this) {
      return function(abort) {
        var base, dims, width;
        if (data != null) {
          dims = Util.Data.getDimensions(data, _this.spec);
          if (dims.width > space.width) {
            abort();
            return _this.rebuild();
          }
          used.width = dims.width;
          _this.buffer.setActive(used.width);
          if (typeof (base = _this.buffer.callback).rebind === "function") {
            base.rebind(data);
          }
          return _this.buffer.update();
        } else {
          width = _this.spec.width || 1;
          _this.buffer.setActive(width);
          width = _this.buffer.update();
          return used.width = width;
        }
      };
    })(this));
    if (used.width !== l || filled !== this.buffer.getFilled()) {
      return this.trigger({
        type: 'source.resize'
      });
    }
  };

  return Array_;

})(Buffer);

module.exports = Array_;
