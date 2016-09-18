var Scale, Source, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Source = require('../base/source');

Util = require('../../../util');

Scale = (function(superClass) {
  extend(Scale, superClass);

  function Scale() {
    return Scale.__super__.constructor.apply(this, arguments);
  }

  Scale.traits = ['node', 'source', 'index', 'interval', 'span', 'scale', 'raw', 'origin'];

  Scale.prototype.init = function() {
    return this.used = this.space = this.scaleAxis = this.sampler = null;
  };

  Scale.prototype.rawBuffer = function() {
    return this.buffer;
  };

  Scale.prototype.sourceShader = function(shader) {
    return shader.pipe(this.sampler);
  };

  Scale.prototype.getDimensions = function() {
    return {
      items: 1,
      width: this.space,
      height: 1,
      depth: 1
    };
  };

  Scale.prototype.getActiveDimensions = function() {
    return {
      items: 1,
      width: this.used,
      height: this.buffer.getFilled(),
      depth: 1
    };
  };

  Scale.prototype.getRawDimensions = function() {
    return this.getDimensions();
  };

  Scale.prototype.make = function() {
    var p, positionUniforms, samples;
    this.space = samples = this._helpers.scale.divide('');
    this.buffer = this._renderables.make('dataBuffer', {
      width: samples,
      channels: 1,
      items: 1
    });
    positionUniforms = {
      scaleAxis: this._attributes.make(this._types.vec4()),
      scaleOffset: this._attributes.make(this._types.vec4())
    };
    this.scaleAxis = positionUniforms.scaleAxis.value;
    this.scaleOffset = positionUniforms.scaleOffset.value;
    p = this.sampler = this._shaders.shader();
    p.require(this.buffer.shader(this._shaders.shader(), 1));
    p.pipe('scale.position', positionUniforms);
    this._helpers.span.make();
    return this._listen(this, 'span.range', this.updateRanges);
  };

  Scale.prototype.unmake = function() {
    this.scaleAxis = null;
    return this._helpers.span.unmake();
  };

  Scale.prototype.change = function(changed, touched, init) {
    if (changed['scale.divide']) {
      return this.rebuild();
    }
    if (touched['view'] || touched['interval'] || touched['span'] || touched['scale'] || init) {
      return this.updateRanges();
    }
  };

  Scale.prototype.updateRanges = function() {
    var axis, max, min, origin, range, ref, ticks, used;
    used = this.used;
    ref = this.props, axis = ref.axis, origin = ref.origin;
    range = this._helpers.span.get('', axis);
    min = range.x;
    max = range.y;
    ticks = this._helpers.scale.generate('', this.buffer, min, max);
    Util.Axis.setDimension(this.scaleAxis, axis);
    Util.Axis.setOrigin(this.scaleOffset, axis, origin);
    this.used = ticks.length;
    if (this.used !== used) {
      return this.trigger({
        type: 'source.resize'
      });
    }
  };

  return Scale;

})(Source);

module.exports = Scale;
