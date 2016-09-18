var Cartesian4, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('./view');

Cartesian4 = (function(superClass) {
  extend(Cartesian4, superClass);

  function Cartesian4() {
    return Cartesian4.__super__.constructor.apply(this, arguments);
  }

  Cartesian4.traits = ['node', 'object', 'visible', 'view', 'view4', 'vertex'];

  Cartesian4.prototype.make = function() {
    Cartesian4.__super__.make.apply(this, arguments);
    this.uniforms = {
      basisOffset: this._attributes.make(this._types.vec4()),
      basisScale: this._attributes.make(this._types.vec4())
    };
    this.basisScale = this.uniforms.basisScale.value;
    return this.basisOffset = this.uniforms.basisOffset.value;
  };

  Cartesian4.prototype.unmake = function() {
    Cartesian4.__super__.unmake.apply(this, arguments);
    delete this.basisScale;
    delete this.basisOffset;
    return delete this.uniforms;
  };

  Cartesian4.prototype.change = function(changed, touched, init) {
    var dw, dx, dy, dz, g, mult, p, s, w, x, y, z;
    if (!(touched['view'] || touched['view4'] || init)) {
      return;
    }
    p = this.props.position;
    s = this.props.scale;
    g = this.props.range;
    x = g[0].x;
    y = g[1].x;
    z = g[2].x;
    w = g[3].x;
    dx = (g[0].y - x) || 1;
    dy = (g[1].y - y) || 1;
    dz = (g[2].y - z) || 1;
    dw = (g[3].y - w) || 1;
    mult = function(a, b) {
      a.x *= b.x;
      a.y *= b.y;
      a.z *= b.z;
      return a.w *= b.w;
    };
    this.basisScale.set(2 / dx, 2 / dy, 2 / dz, 2 / dw);
    this.basisOffset.set(-(2 * x + dx) / dx, -(2 * y + dy) / dy, -(2 * z + dz) / dz, -(2 * w + dw) / dw);
    mult(this.basisScale, s);
    mult(this.basisOffset, s);
    this.basisOffset.add(p);
    if (changed['view.range']) {
      return this.trigger({
        type: 'view.range'
      });
    }
  };

  Cartesian4.prototype.vertex = function(shader, pass) {
    if (pass === 1) {
      shader.pipe('cartesian4.position', this.uniforms);
    }
    return Cartesian4.__super__.vertex.call(this, shader, pass);
  };

  return Cartesian4;

})(View);

module.exports = Cartesian4;
