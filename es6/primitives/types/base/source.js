var Primitive, Source, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Source = (function(superClass) {
  extend(Source, superClass);

  function Source() {
    return Source.__super__.constructor.apply(this, arguments);
  }

  Source.traits = ['node', 'source', 'index'];

  Source.prototype.made = function() {
    return this.trigger({
      type: 'source.rebuild'
    });
  };

  Source.prototype.indexShader = function(shader) {
    return shader.pipe(Util.GLSL.identity('vec4'));
  };

  Source.prototype.sourceShader = function(shader) {
    return shader.pipe(Util.GLSL.identity('vec4'));
  };

  Source.prototype.getDimensions = function() {
    return {
      items: 1,
      width: 1,
      height: 1,
      depth: 1
    };
  };

  Source.prototype.getActiveDimensions = function() {
    return this.getDimensions();
  };

  Source.prototype.getIndexDimensions = function() {
    return this.getActiveDimensions();
  };

  Source.prototype.getFutureDimensions = function() {
    return this.getActiveDimensions();
  };

  return Source;

})(Primitive);

module.exports = Source;
