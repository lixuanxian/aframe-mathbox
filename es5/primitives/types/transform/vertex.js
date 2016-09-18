var Transform, Vertex,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transform = require('./transform');

Vertex = (function(superClass) {
  extend(Vertex, superClass);

  function Vertex() {
    return Vertex.__super__.constructor.apply(this, arguments);
  }

  Vertex.traits = ['node', 'include', 'vertex', 'bind'];

  Vertex.prototype.make = function() {
    return this._helpers.bind.make([
      {
        to: 'include.shader',
        trait: 'shader',
        optional: true
      }
    ]);
  };

  Vertex.prototype.unmake = function() {
    return this._helpers.bind.unmake();
  };

  Vertex.prototype.change = function(changed, touched, init) {
    if (touched['include']) {
      return this.rebuild();
    }
  };

  Vertex.prototype.vertex = function(shader, pass) {
    if (this.bind.shader != null) {
      if (pass === this.props.pass) {
        shader.pipe(this.bind.shader.shaderBind());
      }
    }
    return Vertex.__super__.vertex.call(this, shader, pass);
  };

  return Vertex;

})(Transform);

module.exports = Vertex;
