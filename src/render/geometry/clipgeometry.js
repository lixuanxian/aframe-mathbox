var ClipGeometry, Geometry, debug, tick,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Geometry = require('./geometry');

debug = false;

tick = function() {
  var now;
  now = +(new Date);
  return function(label) {
    var delta;
    delta = +new Date() - now;
    console.log(label, delta + " ms");
    return delta;
  };
};

ClipGeometry = (function(superClass) {
  extend(ClipGeometry, superClass);

  function ClipGeometry() {
    return ClipGeometry.__super__.constructor.apply(this, arguments);
  }

  ClipGeometry.prototype._clipUniforms = function() {
    this.geometryClip = new THREE.Vector4(1e10, 1e10, 1e10, 1e10);
    this.geometryResolution = new THREE.Vector4;
    this.mapSize = new THREE.Vector4;
    if (this.uniforms == null) {
      this.uniforms = {};
    }
    this.uniforms.geometryClip = {
      type: 'v4',
      value: this.geometryClip
    };
    this.uniforms.geometryResolution = {
      type: 'v4',
      value: this.geometryResolution
    };
    return this.uniforms.mapSize = {
      type: 'v4',
      value: this.mapSize
    };
  };

  ClipGeometry.prototype._clipGeometry = function(width, height, depth, items) {
    var c, r;
    c = function(x) {
      return Math.max(0, x - 1);
    };
    r = function(x) {
      return 1 / Math.max(1, x - 1);
    };
    this.geometryClip.set(c(width), c(height), c(depth), c(items));
    return this.geometryResolution.set(r(width), r(height), r(depth), r(items));
  };

  ClipGeometry.prototype._clipMap = function(mapWidth, mapHeight, mapDepth, mapItems) {
    return this.mapSize.set(mapWidth, mapHeight, mapDepth, mapItems);
  };

  ClipGeometry.prototype._clipOffsets = function(factor, width, height, depth, items, _width, _height, _depth, _items) {
    var dims, elements, maxs;
    dims = [depth, height, width, items];
    maxs = [_depth, _height, _width, _items];
    elements = this._reduce(dims, maxs);
    return this._offsets([
      {
        start: 0,
        count: elements * factor
      }
    ]);
  };

  return ClipGeometry;

})(Geometry);

module.exports = ClipGeometry;
