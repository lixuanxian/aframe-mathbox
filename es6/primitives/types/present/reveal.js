var Reveal, Transition, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transition = require('./transition');

Util = require('../../../util');

Reveal = (function(superClass) {
  extend(Reveal, superClass);

  function Reveal() {
    return Reveal.__super__.constructor.apply(this, arguments);
  }

  Reveal.traits = ['node', 'transition', 'mask', 'visible', 'active'];

  Reveal.prototype.mask = function(shader) {
    var ref, ref1, s;
    if (shader) {
      s = this._shaders.shader();
      s.pipe(Util.GLSL.identity('vec4'));
      s.fan();
      s.pipe(shader, this.uniforms);
      s.next();
      s.pipe('reveal.mask', this.uniforms);
      s.end();
      s.pipe("float combine(float a, float b) { return min(a, b); }");
    } else {
      s = this._shaders.shader();
      s.pipe('reveal.mask', this.uniforms);
    }
    return (ref = (ref1 = this._inherit('mask')) != null ? ref1.mask(s) : void 0) != null ? ref : s;
  };

  return Reveal;

})(Transition);

module.exports = Reveal;
