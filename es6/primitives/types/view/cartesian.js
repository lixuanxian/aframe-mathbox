var Cartesian, Util, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('./view');

Util = require('../../../util');

Cartesian = (function(superClass) {
  extend(Cartesian, superClass);

  function Cartesian() {
    return Cartesian.__super__.constructor.apply(this, arguments);
  }

  Cartesian.traits = ['node', 'object', 'visible', 'view', 'view3', 'vertex'];

  Cartesian.prototype.make = function() {
    Cartesian.__super__.make.apply(this, arguments);
    this.uniforms = {
      viewMatrix: this._attributes.make(this._types.mat4())
    };
    this.viewMatrix = this.uniforms.viewMatrix.value;
    return this.composer = Util.Three.transformComposer();
  };

  Cartesian.prototype.unmake = function() {
    Cartesian.__super__.unmake.apply(this, arguments);
    delete this.viewMatrix;
    delete this.objectMatrix;
    return delete this.uniforms;
  };

  Cartesian.prototype.change = function(changed, touched, init) {
    var dx, dy, dz, e, g, p, q, r, s, sx, sy, sz, transformMatrix, x, y, z;
    if (!(touched['view'] || touched['view3'] || init)) {
      return;
    }
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
    this.viewMatrix.set(2 / dx, 0, 0, -(2 * x + dx) / dx, 0, 2 / dy, 0, -(2 * y + dy) / dy, 0, 0, 2 / dz, -(2 * z + dz) / dz, 0, 0, 0, 1);
    transformMatrix = this.composer(p, r, q, s, null, e);
    this.viewMatrix.multiplyMatrices(transformMatrix, this.viewMatrix);
    if (changed['view.range']) {
      return this.trigger({
        type: 'view.range'
      });
    }
  };

  Cartesian.prototype.vertex = function(shader, pass) {
    if (pass === 1) {
      shader.pipe('cartesian.position', this.uniforms);
    }
    return Cartesian.__super__.vertex.call(this, shader, pass);
  };

  return Cartesian;

})(View);

module.exports = Cartesian;
