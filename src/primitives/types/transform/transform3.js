var Transform, Transform3, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transform = require('./transform');

Util = require('../../../util');

Transform3 = (function(superClass) {
  extend(Transform3, superClass);

  function Transform3() {
    return Transform3.__super__.constructor.apply(this, arguments);
  }

  Transform3.traits = ['node', 'vertex', 'transform3'];

  Transform3.prototype.make = function() {
    this.uniforms = {
      transformMatrix: this._attributes.make(this._types.mat4())
    };
    return this.composer = Util.Three.transformComposer();
  };

  Transform3.prototype.unmake = function() {
    return delete this.uniforms;
  };

  Transform3.prototype.change = function(changed, touched, init) {
    var e, m, p, q, r, s;
    if (changed['transform3.pass']) {
      return this.rebuild();
    }
    if (!(touched['transform3'] || init)) {
      return;
    }
    p = this.props.position;
    q = this.props.quaternion;
    r = this.props.rotation;
    s = this.props.scale;
    m = this.props.matrix;
    e = this.props.eulerOrder;
    return this.uniforms.transformMatrix.value = this.composer(p, r, q, s, m, e);
  };

  Transform3.prototype.vertex = function(shader, pass) {
    if (pass === this.props.pass) {
      shader.pipe('transform3.position', this.uniforms);
    }
    return Transform3.__super__.vertex.call(this, shader, pass);
  };

  return Transform3;

})(Transform);

module.exports = Transform3;
