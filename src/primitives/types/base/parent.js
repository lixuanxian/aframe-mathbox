var Parent, Primitive,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Parent = (function(superClass) {
  extend(Parent, superClass);

  function Parent() {
    return Parent.__super__.constructor.apply(this, arguments);
  }

  Parent.model = Primitive.Group;

  Parent.traits = ['node'];

  return Parent;

})(Primitive);

module.exports = Parent;
