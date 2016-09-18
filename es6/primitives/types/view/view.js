var Transform, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transform = require('../transform/transform');

View = (function(superClass) {
  extend(View, superClass);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.traits = ['node', 'object', 'visible', 'view', 'vertex'];

  View.prototype.make = function() {
    return this._helpers.visible.make();
  };

  View.prototype.unmake = function() {
    return this._helpers.visible.unmake();
  };

  View.prototype.axis = function(dimension) {
    return this.props.range[dimension - 1];
  };

  return View;

})(Transform);

module.exports = View;
