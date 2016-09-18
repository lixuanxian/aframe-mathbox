var Group, Parent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('./parent');

Group = (function(superClass) {
  extend(Group, superClass);

  function Group() {
    return Group.__super__.constructor.apply(this, arguments);
  }

  Group.traits = ['node', 'object', 'entity', 'visible', 'active'];

  Group.prototype.make = function() {
    this._helpers.visible.make();
    return this._helpers.active.make();
  };

  Group.prototype.unmake = function() {
    this._helpers.visible.unmake();
    return this._helpers.active.unmake();
  };

  return Group;

})(Parent);

module.exports = Group;
