var Polar, Util, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('./view');

Util = require('../../../util');

Polar = (function(superClass) {
  extend(Polar, superClass);

  function Polar() {
    return Polar.__super__.constructor.apply(this, arguments);
  }

  Polar.traits = ['node', 'object', 'visible', 'view', 'view3', 'polar', 'vertex'];

  Polar.prototype.make = function() {
    var types;
    Polar.__super__.make.apply(this, arguments);
    types = this._attributes.types;
    this.uniforms = {
      polarBend: this.node.attributes['polar.bend'],
      polarHelix: this.node.attributes['polar.helix'],
      polarFocus: this._attributes.make(types.number()),
      polarAspect: this._attributes.make(types.number()),
      viewMatrix: this._attributes.make(types.mat4())
    };
    this.viewMatrix = this.uniforms.viewMatrix.value;
    this.composer = Util.Three.transformComposer();
    return this.aspect = 1;
  };

  Polar.prototype.unmake = function() {
    Polar.__super__.unmake.apply(this, arguments);
    delete this.viewMatrix;
    delete this.objectMatrix;
    delete this.aspect;
    return delete this.uniforms;
  };

  Polar.prototype.change = function(changed, touched, init) {
    var ady, aspect, bend, dx, dy, dz, e, fdx, focus, g, helix, idx, p, q, r, ref, s, sdx, sdy, sx, sy, sz, transformMatrix, x, y, z;
    if (!(touched['view'] || touched['view3'] || touched['polar'] || init)) {
      return;
    }
    this.helix = helix = this.props.helix;
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
    idx = dx > 0 ? 1 : -1;
    ref = Util.Axis.recenterAxis(y, dy, bend), y = ref[0], dy = ref[1];
    ady = Math.abs(dy);
    fdx = dx + (ady * idx - dx) * bend;
    sdx = fdx / sx;
    sdy = dy / sy;
    this.aspect = aspect = Math.abs(sdx / sdy);
    this.uniforms.polarFocus.value = focus;
    this.uniforms.polarAspect.value = aspect;
    this.viewMatrix.set(2 / fdx, 0, 0, -(2 * x + dx) / dx, 0, 2 / dy, 0, -(2 * y + dy) / dy, 0, 0, 2 / dz, -(2 * z + dz) / dz, 0, 0, 0, 1);
    transformMatrix = this.composer(p, r, q, s, null, e);
    this.viewMatrix.multiplyMatrices(transformMatrix, this.viewMatrix);
    if (changed['view.range'] || touched['polar']) {
      return this.trigger({
        type: 'view.range'
      });
    }
  };

  Polar.prototype.vertex = function(shader, pass) {
    if (pass === 1) {
      shader.pipe('polar.position', this.uniforms);
    }
    return Polar.__super__.vertex.call(this, shader, pass);
  };

  Polar.prototype.axis = function(dimension) {
    var max, min, range;
    range = this.props.range[dimension - 1];
    min = range.x;
    max = range.y;
    if (dimension === 2 && this.bend > 0) {
      max = Math.max(Math.abs(max), Math.abs(min));
      min = Math.max(-this.focus / this.aspect, min);
    }
    return new THREE.Vector2(min, max);
  };

  return Polar;

})(View);

module.exports = Polar;
