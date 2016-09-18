var Parent, Transform,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Transform = (function(superClass) {
  extend(Transform, superClass);

  function Transform() {
    return Transform.__super__.constructor.apply(this, arguments);
  }

  Transform.traits = ['node', 'vertex', 'fragment'];

  Transform.prototype.vertex = function(shader, pass) {
    var ref, ref1;
    return (ref = (ref1 = this._inherit('vertex')) != null ? ref1.vertex(shader, pass) : void 0) != null ? ref : shader;
  };

  Transform.prototype.fragment = function(shader, pass) {
    var ref, ref1;
    return (ref = (ref1 = this._inherit('fragment')) != null ? ref1.fragment(shader, pass) : void 0) != null ? ref : shader;
  };

  return Transform;

})(Parent);

module.exports = Transform;
