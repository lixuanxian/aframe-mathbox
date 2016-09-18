var Spherical, Util, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('./view');

Util = require('../../../util');

Spherical = (function(superClass) {
  extend(Spherical, superClass);

  function Spherical() {
    return Spherical.__super__.constructor.apply(this, arguments);
  }

  Spherical.traits = ['node', 'object', 'visible', 'view', 'view3', 'spherical', 'vertex'];

  Spherical.prototype.make = function() {
    var types;
    Spherical.__super__.make.apply(this, arguments);
    types = this._attributes.types;
    this.uniforms = {
      sphericalBend: this.node.attributes['spherical.bend'],
      sphericalFocus: this._attributes.make(this._types.number()),
      sphericalAspectX: this._attributes.make(this._types.number()),
      sphericalAspectY: this._attributes.make(this._types.number()),
      sphericalScaleY: this._attributes.make(this._types.number()),
      viewMatrix: this._attributes.make(this._types.mat4())
    };
    this.viewMatrix = this.uniforms.viewMatrix.value;
    this.composer = Util.Three.transformComposer();
    this.aspectX = 1;
    return this.aspectY = 1;
  };

  Spherical.prototype.unmake = function() {
    Spherical.__super__.unmake.apply(this, arguments);
    delete this.viewMatrix;
    delete this.objectMatrix;
    delete this.aspectX;
    delete this.aspectY;
    return delete this.uniforms;
  };

  Spherical.prototype.change = function(changed, touched, init) {
    var adz, aspectX, aspectY, aspectZ, bend, dx, dy, dz, e, fdx, fdy, focus, g, idx, idy, p, q, r, ref, ref1, s, scaleY, sdx, sdy, sdz, sx, sy, sz, transformMatrix, x, y, z;
    if (!(touched['view'] || touched['view3'] || touched['spherical'] || init)) {
      return;
    }
    this.bend = bend = this.props.bend;
    this.focus = focus = bend > 0 ? 1 / bend - 1 : 0;
    p = this.props.position;
    s = this.props.scale;
    q = this.props.quaternion;
    r = this.props.rotation;
    g = this.props.range;
    e = this.props.eulerOrder;
    x = g[0].x;
    y = g[1].x;
    z = g[2].x;
    dx = (g[0].y - x) || 1;
    dy = (g[1].y - y) || 1;
    dz = (g[2].y - z) || 1;
    sx = s.x;
    sy = s.y;
    sz = s.z;
    ref = Util.Axis.recenterAxis(y, dy, bend), y = ref[0], dy = ref[1];
    ref1 = Util.Axis.recenterAxis(z, dz, bend), z = ref1[0], dz = ref1[1];
    idx = dx > 0 ? 1 : -1;
    idy = dy > 0 ? 1 : -1;
    adz = Math.abs(dz);
    fdx = dx + (adz * idx - dx) * bend;
    fdy = dy + (adz * idy - dy) * bend;
    sdx = fdx / sx;
    sdy = fdy / sy;
    sdz = dz / sz;
    this.aspectX = aspectX = Math.abs(sdx / sdz);
    this.aspectY = aspectY = Math.abs(sdy / sdz / aspectX);
    aspectZ = dy / dx * sx / sy * 2;
    this.scaleY = scaleY = Math.min(aspectY / bend, 1 + (aspectZ - 1) * bend);
    this.uniforms.sphericalBend.value = bend;
    this.uniforms.sphericalFocus.value = focus;
    this.uniforms.sphericalAspectX.value = aspectX;
    this.uniforms.sphericalAspectY.value = aspectY;
    this.uniforms.sphericalScaleY.value = scaleY;
    this.viewMatrix.set(2 / fdx, 0, 0, -(2 * x + dx) / dx, 0, 2 / fdy, 0, -(2 * y + dy) / dy, 0, 0, 2 / dz, -(2 * z + dz) / dz, 0, 0, 0, 1);
    transformMatrix = this.composer(p, r, q, s, null, e);
    this.viewMatrix.multiplyMatrices(transformMatrix, this.viewMatrix);
    if (changed['view.range'] || touched['spherical']) {
      return this.trigger({
        type: 'view.range'
      });
    }
  };

  Spherical.prototype.vertex = function(shader, pass) {
    if (pass === 1) {
      shader.pipe('spherical.position', this.uniforms);
    }
    return Spherical.__super__.vertex.call(this, shader, pass);
  };

  Spherical.prototype.axis = function(dimension) {
    var max, min, range;
    range = this.props.range[dimension - 1];
    min = range.x;
    max = range.y;
    if (dimension === 3 && this.bend > 0) {
      max = Math.max(Math.abs(max), Math.abs(min));
      min = Math.max(-this.focus / this.aspectX + .001, min);
    }
    return new THREE.Vector2(min, max);
  };

  return Spherical;

})(View);

module.exports = Spherical;
