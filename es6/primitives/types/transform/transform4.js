var Transform, Transform4,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transform = require('./transform');

Transform4 = (function(superClass) {
  extend(Transform4, superClass);

  function Transform4() {
    return Transform4.__super__.constructor.apply(this, arguments);
  }

  Transform4.traits = ['node', 'vertex', 'transform4'];

  Transform4.prototype.make = function() {
    this.uniforms = {
      transformMatrix: this._attributes.make(this._types.mat4()),
      transformOffset: this.node.attributes['transform4.position']
    };
    return this.transformMatrix = this.uniforms.transformMatrix.value;
  };

  Transform4.prototype.unmake = function() {
    return delete this.uniforms;
  };

  Transform4.prototype.change = function(changed, touched, init) {
    var m, s, t;
    if (changed['transform4.pass']) {
      return this.rebuild();
    }
    if (!(touched['transform4'] || init)) {
      return;
    }
    s = this.props.scale;
    m = this.props.matrix;
    t = this.transformMatrix;
    t.copy(m);
    return t.scale(s);
  };

  Transform4.prototype.vertex = function(shader, pass) {
    if (pass === this.props.pass) {
      shader.pipe('transform4.position', this.uniforms);
    }
    return Transform4.__super__.vertex.call(this, shader, pass);
  };

  return Transform4;

})(Transform);

module.exports = Transform4;
