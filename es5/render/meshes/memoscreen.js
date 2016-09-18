var MemoScreen, Screen, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Screen = require('./screen');

Util = require('../../util');

MemoScreen = (function(superClass) {
  extend(MemoScreen, superClass);

  function MemoScreen(renderer, shaders, options) {
    var depth, height, i, inv, inv1, items, len, map, object, ref, stpq, width;
    this.memo = (items = options.items, width = options.width, height = options.height, depth = options.depth, stpq = options.stpq, options);
    inv = function(x) {
      return 1 / Math.max(1, x);
    };
    inv1 = function(x) {
      return 1 / Math.max(1, x - 1);
    };
    this.uniforms = {
      remapUVScale: {
        type: 'v2',
        value: new THREE.Vector2(items * width, height * depth)
      },
      remapModulus: {
        type: 'v2',
        value: new THREE.Vector2(items, height)
      },
      remapModulusInv: {
        type: 'v2',
        value: new THREE.Vector2(inv(items), inv(height))
      },
      remapSTPQScale: {
        type: 'v4',
        value: new THREE.Vector4(inv1(width), inv1(height), inv1(depth), inv1(items))
      }
    };
    map = shaders.shader();
    map.pipe('screen.map.xyzw', this.uniforms);
    if (options.map != null) {
      if (stpq) {
        map.pipe('screen.map.stpq', this.uniforms);
      }
      map.pipe(options.map);
    }
    MemoScreen.__super__.constructor.call(this, renderer, shaders, {
      map: map,
      linear: true
    });
    ref = this.renders;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      object.transparent = false;
    }
    null;
  }

  MemoScreen.prototype.cover = function(width, height, depth, items) {
    var inv1, x, y;
    if (width == null) {
      width = this.memo.width;
    }
    if (height == null) {
      height = this.memo.height;
    }
    if (depth == null) {
      depth = this.memo.depth;
    }
    if (items == null) {
      items = this.memo.items;
    }
    inv1 = function(x) {
      return 1 / Math.max(1, x - 1);
    };
    this.uniforms.remapSTPQScale.value.set(inv1(width), inv1(height), inv1(depth), inv1(items));
    x = width / this.memo.width;
    y = depth / this.memo.depth;
    if (this.memo.depth === 1) {
      y = height / this.memo.height;
    }
    return this.geometry.cover(x, y);
  };

  return MemoScreen;

})(Screen);

module.exports = MemoScreen;
