var Resample, Retext, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Resample = require('../operator/resample');

Util = require('../../../util');

Retext = (function(superClass) {
  extend(Retext, superClass);

  function Retext() {
    return Retext.__super__.constructor.apply(this, arguments);
  }

  Retext.traits = ['node', 'bind', 'operator', 'resample', 'sampler:x', 'sampler:y', 'sampler:z', 'sampler:w', 'include', 'text'];

  Retext.prototype.init = function() {
    return this.sourceSpec = [
      {
        to: 'operator.source',
        trait: 'text'
      }
    ];
  };

  Retext.prototype.textShader = function(shader) {
    return this.bind.source.textShader(shader);
  };

  Retext.prototype.textIsSDF = function() {
    var ref;
    return ((ref = this.bind.source) != null ? ref.props.sdf : void 0) > 0;
  };

  Retext.prototype.textHeight = function() {
    var ref;
    return (ref = this.bind.source) != null ? ref.props.detail : void 0;
  };

  return Retext;

})(Resample);

module.exports = Retext;
