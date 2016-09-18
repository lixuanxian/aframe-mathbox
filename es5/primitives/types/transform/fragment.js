var Fragment, Transform,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transform = require('./transform');

Fragment = (function(superClass) {
  extend(Fragment, superClass);

  function Fragment() {
    return Fragment.__super__.constructor.apply(this, arguments);
  }

  Fragment.traits = ['node', 'include', 'fragment', 'bind'];

  Fragment.prototype.make = function() {
    return this._helpers.bind.make([
      {
        to: 'include.shader',
        trait: 'shader',
        optional: true
      }
    ]);
  };

  Fragment.prototype.unmake = function() {
    return this._helpers.bind.unmake();
  };

  Fragment.prototype.change = function(changed, touched, init) {
    if (touched['include'] || changed['fragment.gamma']) {
      return this.rebuild();
    }
  };

  Fragment.prototype.fragment = function(shader, pass) {
    if (this.bind.shader != null) {
      if (pass === this.props.pass) {
        if (this.props.gamma) {
          shader.pipe('mesh.gamma.out');
        }
        shader.pipe(this.bind.shader.shaderBind());
        shader.split();
        if (this.props.gamma) {
          shader.pipe('mesh.gamma.in');
        }
        shader.pass();
      }
    }
    return Fragment.__super__.fragment.call(this, shader, pass);
  };

  return Fragment;

})(Transform);

module.exports = Fragment;
