var Inherit, Parent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Parent = require('./parent');

Inherit = (function(superClass) {
  extend(Inherit, superClass);

  function Inherit() {
    return Inherit.__super__.constructor.apply(this, arguments);
  }

  Inherit.traits = ['node', 'bind'];

  Inherit.prototype.make = function() {
    return this._helpers.bind.make([
      {
        to: 'inherit.source',
        trait: 'node'
      }
    ]);
  };

  Inherit.prototype.unmake = function() {
    return this._helpers.bind.unmake();
  };

  Inherit.prototype._find = function(trait) {
    if (this.bind.source && (indexOf.call(this.props.traits, trait) >= 0)) {
      return this.bind.source._inherit(trait);
    }
    return Inherit.__super__._find.apply(this, arguments);
  };

  return Inherit;

})(Parent);

module.exports = Inherit;
