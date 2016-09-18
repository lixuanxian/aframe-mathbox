var Format, Operator, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('../operator/operator');

Util = require('../../../util');

Format = (function(superClass) {
  extend(Format, superClass);

  function Format() {
    return Format.__super__.constructor.apply(this, arguments);
  }

  Format.traits = ['node', 'bind', 'operator', 'texture', 'text', 'format', 'font'];

  Format.defaults = {
    minFilter: 'linear',
    magFilter: 'linear'
  };

  Format.prototype.init = function() {
    Format.__super__.init.apply(this, arguments);
    this.atlas = this.buffer = this.used = this.time = null;
    return this.filled = false;
  };

  Format.prototype.sourceShader = function(shader) {
    return this.buffer.shader(shader);
  };

  Format.prototype.textShader = function(shader) {
    return this.atlas.shader(shader);
  };

  Format.prototype.textIsSDF = function() {
    return this.props.sdf > 0;
  };

  Format.prototype.textHeight = function() {
    return this.props.detail;
  };

  Format.prototype.make = function() {
    var atlas, depth, detail, dims, emit, font, height, items, magFilter, minFilter, ref, ref1, sdf, style, type, variant, weight, width;
    this._helpers.bind.make([
      {
        to: 'operator.source',
        trait: 'raw'
      }
    ]);
    ref = this.props, minFilter = ref.minFilter, magFilter = ref.magFilter, type = ref.type;
    ref1 = this.props, font = ref1.font, style = ref1.style, variant = ref1.variant, weight = ref1.weight, detail = ref1.detail, sdf = ref1.sdf;
    this.atlas = this._renderables.make('textAtlas', {
      font: font,
      size: detail,
      style: style,
      variant: variant,
      weight: weight,
      outline: sdf,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
    minFilter = THREE.NearestFilter;
    magFilter = THREE.NearestFilter;
    type = THREE.FloatType;
    dims = this.bind.source.getDimensions();
    items = dims.items, width = dims.width, height = dims.height, depth = dims.depth;
    this.buffer = this._renderables.make('voxelBuffer', {
      width: width,
      height: height,
      depth: depth,
      channels: 4,
      items: items,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
    atlas = this.atlas;
    emit = this.buffer.streamer.emit;
    this.buffer.streamer.emit = function(t) {
      return atlas.map(t, emit);
    };
    this.clockParent = this._inherit('clock');
    return this._listen('root', 'root.update', this.update);
  };

  Format.prototype.made = function() {
    Format.__super__.made.apply(this, arguments);
    return this.resize();
  };

  Format.prototype.unmake = function() {
    Format.__super__.unmake.apply(this, arguments);
    if (this.buffer) {
      this.buffer.dispose();
      this.buffer = null;
    }
    if (this.atlas) {
      this.atlas.dispose();
      return this.atlas = null;
    }
  };

  Format.prototype.update = function() {
    var dst, src, used;
    src = this.bind.source.rawBuffer();
    dst = this.buffer;
    if ((this.filled && !this.props.live) || !this.through) {
      return;
    }
    this.time = this.clockParent.getTime();
    used = this.used;
    this.atlas.begin();
    this.used = this.through();
    this.buffer.write(this.used);
    this.atlas.end();
    this.filled = true;
    if (used !== this.used) {
      return this.trigger({
        type: 'source.resize'
      });
    }
  };

  Format.prototype.change = function(changed, touched, init) {
    var data, digits, expr, length, map, ref;
    if (touched['font']) {
      return this.rebuild();
    }
    if (changed['format.expr'] || changed['format.digits'] || changed['format.data'] || init) {
      ref = this.props, digits = ref.digits, expr = ref.expr, data = ref.data;
      if (expr == null) {
        if (data != null) {
          expr = function(x, y, z, w, i) {
            return data[i];
          };
        } else {
          expr = function(x) {
            return x;
          };
        }
      }
      length = expr.length;
      if (digits != null) {
        expr = (function(expr) {
          return function(x, y, z, w, i, j, k, l, t, d) {
            return +(expr(x, y, z, w, i, j, k, l, t, d)).toPrecision(digits);
          };
        })(expr);
      }
      if (length > 8) {
        map = (function(_this) {
          return function(emit, x, y, z, w, i, j, k, l, t, d) {
            return emit(expr(x, y, z, w, i, j, k, l, _this.time.clock, _this.time.step));
          };
        })(this);
      } else {
        map = (function(_this) {
          return function(emit, x, y, z, w, i, j, k, l) {
            return emit(expr(x, y, z, w, i, j, k, l));
          };
        })(this);
      }
      return this.through = this.bind.source.rawBuffer().through(map, this.buffer);
    }
  };

  return Format;

})(Operator);

module.exports = Format;
