var Memo, Operator, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');

Memo = (function(superClass) {
  extend(Memo, superClass);

  function Memo() {
    return Memo.__super__.constructor.apply(this, arguments);
  }

  Memo.traits = ['node', 'bind', 'active', 'operator', 'source', 'index', 'texture', 'memo'];

  Memo.prototype.sourceShader = function(shader) {
    return this.memo.shaderAbsolute(shader, 1);
  };

  Memo.prototype.make = function() {
    var depth, dims, height, items, magFilter, minFilter, operator, ref, type, width;
    Memo.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    this._helpers.active.make();
    this._listen('root', 'root.update', (function(_this) {
      return function() {
        if (_this.isActive) {
          return _this.update();
        }
      };
    })(this));
    ref = this.props, minFilter = ref.minFilter, magFilter = ref.magFilter, type = ref.type;
    dims = this.bind.source.getDimensions();
    items = dims.items, width = dims.width, height = dims.height, depth = dims.depth;
    this.memo = this._renderables.make('memo', {
      items: items,
      width: width,
      height: height,
      depth: depth,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
    operator = this._shaders.shader();
    this.bind.source.sourceShader(operator);
    this.compose = this._renderables.make('memoScreen', {
      map: operator,
      items: items,
      width: width,
      height: height,
      depth: depth
    });
    this.memo.adopt(this.compose);
    this.objects = [this.compose];
    return this.renders = this.compose.renders;
  };

  Memo.prototype.unmake = function() {
    Memo.__super__.unmake.apply(this, arguments);
    if (this.bind.source != null) {
      this._helpers.active.unmake();
      this.memo.unadopt(this.compose);
      this.memo.dispose();
      return this.memo = this.compose = null;
    }
  };

  Memo.prototype.update = function() {
    var ref;
    return (ref = this.memo) != null ? ref.render() : void 0;
  };

  Memo.prototype.resize = function() {
    var depth, dims, height, width;
    if (this.bind.source == null) {
      return;
    }
    dims = this.bind.source.getActiveDimensions();
    width = dims.width, height = dims.height, depth = dims.depth;
    this.compose.cover(width, height, depth);
    return Memo.__super__.resize.apply(this, arguments);
  };

  Memo.prototype.change = function(changed, touched, init) {
    if (touched['texture'] || touched['operator']) {
      return this.rebuild();
    }
  };

  return Memo;

})(Operator);

module.exports = Memo;
