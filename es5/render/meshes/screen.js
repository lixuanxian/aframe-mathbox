var Base, Screen, ScreenGeometry, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Base = require('./base');

ScreenGeometry = require('../geometry').ScreenGeometry;

Util = require('../../util');

Screen = (function(superClass) {
  extend(Screen, superClass);

  function Screen(renderer, shaders, options) {
    var combine, f, factory, hasStyle, linear, map, object, stpq, uniforms, v;
    Screen.__super__.constructor.call(this, renderer, shaders, options);
    uniforms = options.uniforms, map = options.map, combine = options.combine, stpq = options.stpq, linear = options.linear;
    if (uniforms == null) {
      uniforms = {};
    }
    hasStyle = uniforms.styleColor != null;
    this.geometry = new ScreenGeometry({
      width: options.width,
      height: options.height
    });
    this._adopt(uniforms);
    this._adopt(this.geometry.uniforms);
    factory = shaders.material();
    v = factory.vertex;
    v.pipe('raw.position.scale', this.uniforms);
    v.fan();
    v.pipe('stpq.xyzw.2d', this.uniforms);
    v.next();
    v.pipe('screen.position', this.uniforms);
    v.join();
    factory.fragment = f = this._fragmentColor(hasStyle, false, null, null, map, 2, stpq, combine, linear);
    f.pipe('fragment.color', this.uniforms);
    this.material = this._material(factory.link({
      side: THREE.DoubleSide
    }));
    object = new THREE.Mesh(this.geometry, this.material);
    object.frustumCulled = false;
    this._raw(object);
    this.renders = [object];
  }

  Screen.prototype.dispose = function() {
    this.geometry.dispose();
    this.material.dispose();
    this.renders = this.geometry = this.material = null;
    return Screen.__super__.dispose.apply(this, arguments);
  };

  return Screen;

})(Base);

module.exports = Screen;
