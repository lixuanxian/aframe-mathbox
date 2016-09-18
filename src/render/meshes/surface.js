var Base, Surface, SurfaceGeometry, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Base = require('./base');

SurfaceGeometry = require('../geometry').SurfaceGeometry;

Util = require('../../util');

Surface = (function(superClass) {
  extend(Surface, superClass);

  function Surface(renderer, shaders, options) {
    var color, combine, defs, f, factory, hasHollow, hasStyle, intUV, linear, map, mask, material, object, position, stpq, uniforms, v;
    Surface.__super__.constructor.call(this, renderer, shaders, options);
    uniforms = options.uniforms, material = options.material, position = options.position, color = options.color, mask = options.mask, map = options.map, combine = options.combine, linear = options.linear, stpq = options.stpq, intUV = options.intUV;
    if (uniforms == null) {
      uniforms = {};
    }
    if (material == null) {
      material = true;
    }
    hasStyle = uniforms.styleColor != null;
    hasHollow = uniforms.surfaceHollow != null;
    this.geometry = new SurfaceGeometry({
      width: options.width,
      height: options.height,
      surfaces: options.surfaces,
      layers: options.layers,
      closedX: options.closedX,
      closedY: options.closedY
    });
    this._adopt(uniforms);
    this._adopt(this.geometry.uniforms);
    factory = shaders.material();
    v = factory.vertex;
    if (intUV) {
      defs = {
        POSITION_UV_INT: ''
      };
    }
    v.pipe(this._vertexColor(color, mask));
    v.require(this._vertexPosition(position, material, map, 2, stpq));
    if (!material) {
      v.pipe('surface.position', this.uniforms, defs);
    }
    if (material) {
      v.pipe('surface.position.normal', this.uniforms, defs);
    }
    v.pipe('project.position', this.uniforms);
    factory.fragment = f = this._fragmentColor(hasStyle, material, color, mask, map, 2, stpq, combine, linear);
    f.pipe('fragment.color', this.uniforms);
    this.material = this._material(factory.link({
      side: THREE.DoubleSide
    }));
    object = new THREE.Mesh(this.geometry, this.material);
    this._raw(object);
    this.renders = [object];
  }

  Surface.prototype.dispose = function() {
    this.geometry.dispose();
    this.material.dispose();
    this.renders = this.geometry = this.material = null;
    return Surface.__super__.dispose.apply(this, arguments);
  };

  return Surface;

})(Base);

module.exports = Surface;
