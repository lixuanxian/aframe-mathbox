var Memo, RenderToTexture, Renderable, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Renderable = require('../renderable');

RenderToTexture = require('./rendertotexture');

Util = require('../../util');


/*
 * Wrapped RTT for memoizing 4D arrays back to a 2D texture
 */

Memo = (function(superClass) {
  extend(Memo, superClass);

  function Memo(renderer, shaders, options) {
    if (this.items == null) {
      this.items = options.items || 1;
    }
    if (this.channels == null) {
      this.channels = options.channels || 4;
    }
    if (this.width == null) {
      this.width = options.width || 1;
    }
    if (this.height == null) {
      this.height = options.height || 1;
    }
    if (this.depth == null) {
      this.depth = options.depth || 1;
    }
    options.format = THREE.RGBAFormat;
    options.width = this._width = this.items * this.width;
    options.height = this._height = this.height * this.depth;
    options.frames = 1;
    delete options.items;
    delete options.depth;
    delete options.channels;
    Memo.__super__.constructor.call(this, renderer, shaders, options);
    this._adopt({
      textureItems: {
        type: 'f',
        value: this.items
      },
      textureHeight: {
        type: 'f',
        value: this.height
      }
    });
  }

  Memo.prototype.shaderAbsolute = function(shader) {
    if (shader == null) {
      shader = this.shaders.shader();
    }
    shader.pipe('map.xyzw.texture', this.uniforms);
    return Memo.__super__.shaderAbsolute.call(this, shader, 1, 2);
  };

  return Memo;

})(RenderToTexture);

module.exports = Memo;
