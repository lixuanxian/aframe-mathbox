var Operator, Source,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Source = require('../base/source');

Operator = (function(superClass) {
  extend(Operator, superClass);

  function Operator() {
    return Operator.__super__.constructor.apply(this, arguments);
  }

  Operator.traits = ['node', 'bind', 'operator', 'source', 'index'];

  Operator.prototype.indexShader = function(shader) {
    var ref;
    return (ref = this.bind.source) != null ? typeof ref.indexShader === "function" ? ref.indexShader(shader) : void 0 : void 0;
  };

  Operator.prototype.sourceShader = function(shader) {
    var ref;
    return (ref = this.bind.source) != null ? typeof ref.sourceShader === "function" ? ref.sourceShader(shader) : void 0 : void 0;
  };

  Operator.prototype.getDimensions = function() {
    return this.bind.source.getDimensions();
  };

  Operator.prototype.getFutureDimensions = function() {
    return this.bind.source.getFutureDimensions();
  };

  Operator.prototype.getActiveDimensions = function() {
    return this.bind.source.getActiveDimensions();
  };

  Operator.prototype.getIndexDimensions = function() {
    return this.bind.source.getIndexDimensions();
  };

  Operator.prototype.init = function() {
    return this.sourceSpec = [
      {
        to: 'operator.source',
        trait: 'source'
      }
    ];
  };

  Operator.prototype.make = function() {
    Operator.__super__.make.apply(this, arguments);
    return this._helpers.bind.make(this.sourceSpec);
  };

  Operator.prototype.made = function() {
    this.resize();
    return Operator.__super__.made.apply(this, arguments);
  };

  Operator.prototype.unmake = function() {
    return this._helpers.bind.unmake();
  };

  Operator.prototype.resize = function(rebuild) {
    return this.trigger({
      type: 'source.resize'
    });
  };

  return Operator;

})(Source);

module.exports = Operator;
