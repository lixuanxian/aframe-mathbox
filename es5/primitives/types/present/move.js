var Move, Transition,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transition = require('./transition');

Move = (function(superClass) {
  extend(Move, superClass);

  function Move() {
    return Move.__super__.constructor.apply(this, arguments);
  }

  Move.traits = ['node', 'transition', 'vertex', 'move', 'visible', 'active'];

  Move.prototype.make = function() {
    var k, ref, v;
    Move.__super__.make.apply(this, arguments);
    ref = {
      moveFrom: this.node.attributes['move.from'],
      moveTo: this.node.attributes['move.to']
    };
    for (k in ref) {
      v = ref[k];
      this.uniforms[k] = v;
    }
  };

  Move.prototype.vertex = function(shader, pass) {
    var ref, ref1;
    if (pass === this.props.pass) {
      shader.pipe('move.position', this.uniforms);
    }
    return (ref = (ref1 = this._inherit('vertex')) != null ? ref1.vertex(shader, pass) : void 0) != null ? ref : shader;
  };

  return Move;

})(Transition);

module.exports = Move;
