var Atlas, BackedTexture, DataTexture, Renderable, Row, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Renderable = require('../renderable');

Util = require('../../util');

DataTexture = require('./texture/datatexture');

BackedTexture = require('./texture/backedtexture');


/*
 * Dynamic sprite atlas
#
 * - Allocates variable-sized sprites in rows
 * - Will grow itself when full
 */

Atlas = (function(superClass) {
  extend(Atlas, superClass);

  function Atlas(renderer, shaders, options) {
    if (this.width == null) {
      this.width = options.width || 512;
    }
    if (this.height == null) {
      this.height = options.height || 512;
    }
    if (this.channels == null) {
      this.channels = options.channels || 4;
    }
    if (this.backed == null) {
      this.backed = options.backed || false;
    }
    this.samples = this.width * this.height;
    Atlas.__super__.constructor.call(this, renderer, shaders);
    this.build(options);
  }

  Atlas.prototype.shader = function(shader) {
    shader.pipe("map.2d.data", this.uniforms);
    shader.pipe("sample.2d", this.uniforms);
    if (this.channels < 4) {
      shader.pipe(Util.GLSL.swizzleVec4(['0000', 'x000', 'xw00', 'xyz0'][this.channels]));
    }
    return shader;
  };

  Atlas.prototype.build = function(options) {
    var klass;
    this.klass = klass = this.backed ? BackedTexture : DataTexture;
    this.texture = new klass(this.gl, this.width, this.height, this.channels, options);
    this.uniforms = {
      dataPointer: {
        type: 'v2',
        value: new THREE.Vector2(0, 0)
      }
    };
    this._adopt(this.texture.uniforms);
    return this.reset();
  };

  Atlas.prototype.reset = function() {
    this.rows = [];
    return this.bottom = 0;
  };

  Atlas.prototype.resize = function(width, height) {
    if (!this.backed) {
      throw new Error("Cannot resize unbacked texture atlas");
    }
    if (width > 2048 && height > 2048) {
      console.warn("Giant text atlas " + width + "x" + height + ".");
    } else {
      console.info("Resizing text atlas " + width + "x" + height + ".");
    }
    this.texture.resize(width, height);
    this.width = width;
    this.height = height;
    return this.samples = width * height;
  };

  Atlas.prototype.collapse = function(row) {
    var ref, ref1, rows;
    rows = this.rows;
    rows.splice(rows.indexOf(row), 1);
    this.bottom = (ref = (ref1 = rows[rows.length - 1]) != null ? ref1.bottom : void 0) != null ? ref : 0;
    if (this.last === row) {
      return this.last = null;
    }
  };

  Atlas.prototype.allocate = function(key, width, height, emit) {
    var bottom, gap, h, i, index, j, len, max, ref, row, top, w;
    w = this.width;
    h = this.height;
    max = height * 2;
    if (width > w) {
      this.resize(w * 2, h * 2);
      this.last = null;
      return this.allocate(key, width, height, emit);
    }
    row = this.last;
    if (row != null) {
      if (row.height >= height && row.height < max && row.width + width <= w) {
        row.append(key, width, height, emit);
        return;
      }
    }
    bottom = 0;
    index = -1;
    top = 0;
    ref = this.rows;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      row = ref[i];
      gap = row.top - bottom;
      if (gap >= height && index < 0) {
        index = i;
        top = bottom;
      }
      bottom = row.bottom;
      if (row.height >= height && row.height < max && row.width + width <= w) {
        row.append(key, width, height, emit);
        this.last = row;
        return;
      }
    }
    if (index >= 0) {
      row = new Row(top, height);
      this.rows.splice(index, 0, row);
    } else {
      top = bottom;
      bottom += height;
      if (bottom >= h) {
        this.resize(w * 2, h * 2);
        this.last = null;
        return this.allocate(key, width, height, emit);
      }
      row = new Row(top, height);
      this.rows.push(row);
      this.bottom = bottom;
    }
    row.append(key, width, height, emit);
    this.last = row;
  };

  Atlas.prototype.read = function() {
    return this.texture.textureObject;
  };

  Atlas.prototype.write = function(data, x, y, w, h) {
    return this.texture.write(data, x, y, w, h);
  };

  Atlas.prototype.dispose = function() {
    this.texture.dispose();
    this.data = null;
    return Atlas.__super__.dispose.apply(this, arguments);
  };

  return Atlas;

})(Renderable);

Row = (function() {
  function Row(top, height) {
    this.top = top;
    this.bottom = top + height;
    this.width = 0;
    this.height = height;
    this.alive = 0;
    this.keys = [];
  }

  Row.prototype.append = function(key, width, height, emit) {
    var x, y;
    x = this.width;
    y = this.top;
    this.alive++;
    this.width += width;
    this.keys.push(key);
    return emit(this, x, y);
  };

  return Row;

})();

module.exports = Atlas;
