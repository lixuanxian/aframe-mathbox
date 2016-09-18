var Parent, Unit, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('./parent');

Util = require('../../../util');

Unit = (function(superClass) {
  extend(Unit, superClass);

  function Unit() {
    return Unit.__super__.constructor.apply(this, arguments);
  }

  Unit.traits = ['node', 'unit'];

  Unit.prototype.make = function() {
    return this._helpers.unit.make();
  };

  Unit.prototype.unmake = function() {
    return this._helpers.unit.unmake();
  };

  Unit.prototype.getUnit = function() {
    return this._helpers.unit.get();
  };

  Unit.prototype.getUnitUniforms = function() {
    return this._helpers.unit.uniforms();
  };

  return Unit;

})(Parent);

module.exports = Unit;
