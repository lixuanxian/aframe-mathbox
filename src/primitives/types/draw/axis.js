var Axis, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Axis = (function(superClass) {
  extend(Axis, superClass);

  Axis.traits = ['node', 'object', 'visible', 'style', 'line', 'axis', 'span', 'interval', 'arrow', 'position', 'origin', 'shade'];

  Axis.defaults = {
    end: true,
    zBias: -1
  };

  function Axis(node, context, helpers) {
    Axis.__super__.constructor.call(this, node, context, helpers);
    this.axisPosition = this.axisStep = this.resolution = this.line = this.arrows = null;
  }

  Axis.prototype.make = function() {
    var arrowUniforms, axis, crossed, detail, end, join, lineUniforms, mask, material, position, positionUniforms, ref, ref1, ref2, samples, start, stroke, styleUniforms, swizzle, uniforms, unitUniforms;
    positionUniforms = {
      axisPosition: this._attributes.make(this._types.vec4()),
      axisStep: this._attributes.make(this._types.vec4())
    };
    this.axisPosition = positionUniforms.axisPosition.value;
    this.axisStep = positionUniforms.axisStep.value;
    position = this._shaders.shader();
    position.pipe('axis.position', positionUniforms);
    position = this._helpers.position.pipeline(position);
    styleUniforms = this._helpers.style.uniforms();
    lineUniforms = this._helpers.line.uniforms();
    arrowUniforms = this._helpers.arrow.uniforms();
    unitUniforms = this._inherit('unit').getUnitUniforms();
    detail = this.props.detail;
    samples = detail + 1;
    this.resolution = 1 / detail;
    ref = this.props, start = ref.start, end = ref.end;
    ref1 = this.props, stroke = ref1.stroke, join = ref1.join;
    mask = this._helpers.object.mask();
    material = this._helpers.shade.pipeline() || false;
    ref2 = this.props, crossed = ref2.crossed, axis = ref2.axis;
    if (!crossed && (mask != null) && axis > 1) {
      swizzle = ['x000', 'y000', 'z000', 'w000'][axis];
      mask = this._helpers.position.swizzle(mask, swizzle);
    }
    uniforms = Util.JS.merge(arrowUniforms, lineUniforms, styleUniforms, unitUniforms);
    this.line = this._renderables.make('line', {
      uniforms: uniforms,
      samples: samples,
      position: position,
      clip: start || end,
      stroke: stroke,
      join: join,
      mask: mask,
      material: material
    });
    this.arrows = [];
    if (start) {
      this.arrows.push(this._renderables.make('arrow', {
        uniforms: uniforms,
        flip: true,
        samples: samples,
        position: position,
        mask: mask,
        material: material
      }));
    }
    if (end) {
      this.arrows.push(this._renderables.make('arrow', {
        uniforms: uniforms,
        samples: samples,
        position: position,
        mask: mask,
        material: material
      }));
    }
    this._helpers.visible.make();
    this._helpers.object.make(this.arrows.concat([this.line]));
    this._helpers.span.make();
    return this._listen(this, 'span.range', this.updateRanges);
  };

  Axis.prototype.unmake = function() {
    this._helpers.visible.unmake();
    this._helpers.object.unmake();
    return this._helpers.span.unmake();
  };

  Axis.prototype.change = function(changed, touched, init) {
    if (changed['axis.detail'] || changed['line.stroke'] || changed['line.join'] || changed['axis.crossed'] || (changed['interval.axis'] && this.props.crossed)) {
      return this.rebuild();
    }
    if (touched['interval'] || touched['span'] || touched['view'] || init) {
      return this.updateRanges();
    }
  };

  Axis.prototype.updateRanges = function() {
    var axis, max, min, origin, range, ref;
    ref = this.props, axis = ref.axis, origin = ref.origin;
    range = this._helpers.span.get('', axis);
    min = range.x;
    max = range.y;
    Util.Axis.setDimension(this.axisPosition, axis).multiplyScalar(min);
    Util.Axis.setDimension(this.axisStep, axis).multiplyScalar((max - min) * this.resolution);
    return Util.Axis.addOrigin(this.axisPosition, axis, origin);
  };

  return Axis;

})(Primitive);

module.exports = Axis;
