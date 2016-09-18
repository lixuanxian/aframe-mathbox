var BackedTexture, DataTexture, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Util = require('../../../Util');

DataTexture = require('./datatexture');


/*
Manually allocated GL texture for data streaming, locally backed.

Allows partial updates via subImage.
Contains local copy of its data to allow quick resizing without gl.copyTexImage2d
(which requires render-to-framebuffer)
 */

BackedTexture = (function(superClass) {
  extend(BackedTexture, superClass);

  function BackedTexture(gl, width, height, channels, options) {
    BackedTexture.__super__.constructor.call(this, gl, width, height, channels, options);
    this.data = new this.ctor(this.n);
  }

  BackedTexture.prototype.resize = function(width, height) {
    var gl, old, oldHeight, oldWidth;
    old = this.data;
    oldWidth = this.width;
    oldHeight = this.height;
    this.width = width;
    this.height = height;
    this.n = width * height * this.channels;
    this.data = new this.ctor(this.n);
    gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, this.data);
    this.uniforms.dataResolution.value.set(1 / width, 1 / height);
    return this.write(old, 0, 0, oldWidth, oldHeight);
  };

  BackedTexture.prototype.write = function(src, x, y, w, h) {
    var channels, dst, i, j, k, n, stride, width, ww, xx, yh, yy;
    width = this.width;
    dst = this.data;
    channels = this.channels;
    i = 0;
    if (width === w && x === 0) {
      j = y * w * channels;
      n = w * h * channels;
      while (i < n) {
        dst[j++] = src[i++];
      }
    } else {
      stride = width * channels;
      ww = w * channels;
      xx = x * channels;
      yy = y;
      yh = y + h;
      while (yy < yh) {
        k = 0;
        j = xx + yy * stride;
        while (k++ < ww) {
          dst[j++] = src[i++];
        }
        yy++;
      }
    }
    return BackedTexture.__super__.write.call(this, src, x, y, w, h);
  };

  BackedTexture.prototype.dispose = function() {
    this.data = null;
    return BackedTexture.__super__.dispose.apply(this, arguments);
  };

  return BackedTexture;

})(DataTexture);

module.exports = BackedTexture;
