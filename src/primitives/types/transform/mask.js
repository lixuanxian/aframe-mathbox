var Mask, Parent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Mask = (function(superClass) {
  extend(Mask, superClass);

  function Mask() {
    return Mask.__super__.constructor.apply(this, arguments);
  }

  Mask.traits = ['node', 'include', 'mask', 'bind'];

  Mask.prototype.make = function() {
    return this._helpers.bind.make([
      {
        to: 'include.shader',
        trait: 'shader',
        optional: true
      }
    ]);
  };

  Mask.prototype.unmake = function() {
    return this._helpers.bind.unmake();
  };

  Mask.prototype.change = function(changed, touched, init) {
    if (touched['include']) {
      return this.rebuild();
    }
  };

  Mask.prototype.mask = function(shader) {
    var ref, ref1, s;
    if (this.bind.shader != null) {
      if (shader) {
        s = this._shaders.shader();
        s.pipe(Util.GLSL.identity('vec4'));
        s.fan();
        s.pipe(shader);
        s.next();
        s.pipe(this.bind.shader.shaderBind());
        s.end();
        s.pipe("float combine(float a, float b) { return min(a, b); }");
      } else {
        s = this._shaders.shader();
        s.pipe(this.bind.shader.shaderBind());
      }
    } else {
      s = shader;
    }
    return (ref = (ref1 = this._inherit('mask')) != null ? ref1.mask(s) : void 0) != null ? ref : s;
  };

  return Mask;

})(Parent);

module.exports = Mask;
