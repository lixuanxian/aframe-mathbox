var ScreenGeometry, SurfaceGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SurfaceGeometry = require('./surfacegeometry');


/*
Grid Surface in normalized screen space

+----+----+----+----+
|    |    |    |    |
+----+----+----+----+
|    |    |    |    |
+----+----+----+----+

+----+----+----+----+
|    |    |    |    |
+----+----+----+----+
|    |    |    |    |
+----+----+----+----+
 */

ScreenGeometry = (function(superClass) {
  extend(ScreenGeometry, superClass);

  function ScreenGeometry(options) {
    var ref, ref1;
    if (this.uniforms == null) {
      this.uniforms = {};
    }
    this.uniforms.geometryScale = {
      type: 'v4',
      value: new THREE.Vector4
    };
    options.width = Math.max(2, (ref = +options.width) != null ? ref : 2);
    options.height = Math.max(2, (ref1 = +options.height) != null ? ref1 : 2);
    this.cover();
    ScreenGeometry.__super__.constructor.call(this, options);
  }

  ScreenGeometry.prototype.cover = function(scaleX, scaleY, scaleZ, scaleW) {
    this.scaleX = scaleX != null ? scaleX : 1;
    this.scaleY = scaleY != null ? scaleY : 1;
    this.scaleZ = scaleZ != null ? scaleZ : 1;
    this.scaleW = scaleW != null ? scaleW : 1;
  };

  ScreenGeometry.prototype.clip = function(width, height, surfaces, layers) {
    var invert;
    if (width == null) {
      width = this.width;
    }
    if (height == null) {
      height = this.height;
    }
    if (surfaces == null) {
      surfaces = this.surfaces;
    }
    if (layers == null) {
      layers = this.layers;
    }
    ScreenGeometry.__super__.clip.call(this, width, height, surfaces, layers);
    invert = function(x) {
      return 1 / Math.max(1, x - 1);
    };
    return this.uniforms.geometryScale.value.set(invert(width) * this.scaleX, invert(height) * this.scaleY, invert(surfaces) * this.scaleZ, invert(layers) * this.scaleW);
  };

  return ScreenGeometry;

})(SurfaceGeometry);

module.exports = ScreenGeometry;
