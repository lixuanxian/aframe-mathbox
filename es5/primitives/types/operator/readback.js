var Primitive, Readback, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Readback = (function(superClass) {
  extend(Readback, superClass);

  function Readback() {
    return Readback.__super__.constructor.apply(this, arguments);
  }

  Readback.traits = ['node', 'bind', 'operator', 'readback', 'entity', 'active'];

  Readback.finals = {
    channels: 4
  };

  Readback.prototype.init = function() {
    this.emitter = this.root = null;
    return this.active = {};
  };

  Readback.prototype.make = function() {
    var channels, depth, expr, height, items, ref, ref1, sampler, type, width;
    Readback.__super__.make.apply(this, arguments);
    this._compute('readback.data', (function(_this) {
      return function() {
        var ref;
        return (ref = _this.readback) != null ? ref.data : void 0;
      };
    })(this));
    this._compute('readback.items', (function(_this) {
      return function() {
        var ref;
        return (ref = _this.readback) != null ? ref.items : void 0;
      };
    })(this));
    this._compute('readback.width', (function(_this) {
      return function() {
        var ref;
        return (ref = _this.readback) != null ? ref.width : void 0;
      };
    })(this));
    this._compute('readback.height', (function(_this) {
      return function() {
        var ref;
        return (ref = _this.readback) != null ? ref.height : void 0;
      };
    })(this));
    this._compute('readback.depth', (function(_this) {
      return function() {
        var ref;
        return (ref = _this.readback) != null ? ref.depth : void 0;
      };
    })(this));
    this._helpers.bind.make([
      {
        to: 'operator.source',
        trait: 'source'
      }
    ]);
    if (this.bind.source == null) {
      return;
    }
    ref = this.props, type = ref.type, channels = ref.channels, expr = ref.expr;
    this.root = this._inherit('root');
    this._listen('root', 'root.update', this.update);
    ref1 = this.bind.source.getDimensions(), items = ref1.items, width = ref1.width, height = ref1.height, depth = ref1.depth;
    sampler = this.bind.source.sourceShader(this._shaders.shader());
    this.readback = this._renderables.make('readback', {
      map: sampler,
      items: items,
      width: width,
      height: height,
      depth: depth,
      channels: channels,
      type: type
    });
    if (expr != null) {
      this.readback.setCallback(expr);
    }
    return this._helpers.active.make();
  };

  Readback.prototype.unmake = function() {
    if (this.readback != null) {
      this.readback.dispose();
      this.readback = null;
      this.root = null;
      this.emitter = null;
      this.active = {};
    }
    this._helpers.active.unmake();
    return this._helpers.bind.unmake();
  };

  Readback.prototype.update = function() {
    var ref;
    if (this.readback == null) {
      return;
    }
    if (this.isActive) {
      this.readback.update((ref = this.root) != null ? ref.getCamera() : void 0);
      this.readback.post();
      if (this.props.expr != null) {
        return this.readback.iterate();
      }
    }
  };

  Readback.prototype.resize = function() {
    var depth, height, items, ref, sI, sJ, sK, width;
    if (this.readback == null) {
      return;
    }
    ref = this.bind.source.getActiveDimensions(), items = ref.items, width = ref.width, height = ref.height, depth = ref.depth;
    this.readback.setActive(items, width, height, depth);
    this.strideI = sI = items;
    this.strideJ = sJ = sI * width;
    return this.strideK = sK = sJ * height;
  };

  Readback.prototype.change = function(changed, touched, init) {
    if (changed['readback.type']) {
      return this.rebuild();
    }
    if (changed['readback.expr'] && this.readback) {
      return this.readback.setCallback(this.props.expr);
    }
  };

  return Readback;

})(Primitive);

module.exports = Readback;
