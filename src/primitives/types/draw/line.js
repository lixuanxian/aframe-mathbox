var Line, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Line = (function(superClass) {
  extend(Line, superClass);

  Line.traits = ['node', 'object', 'visible', 'style', 'line', 'arrow', 'geometry', 'position', 'bind', 'shade'];

  function Line(node, context, helpers) {
    Line.__super__.constructor.call(this, node, context, helpers);
    this.line = this.arrows = null;
  }

  Line.prototype.resize = function() {
    var arrow, dims, i, layers, len, ref, results, ribbons, samples, strips;
    if (this.bind.points == null) {
      return;
    }
    dims = this.bind.points.getActiveDimensions();
    samples = dims.width;
    strips = dims.height;
    ribbons = dims.depth;
    layers = dims.items;
    this.line.geometry.clip(samples, strips, ribbons, layers);
    ref = this.arrows;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      arrow = ref[i];
      results.push(arrow.geometry.clip(samples, strips, ribbons, layers));
    }
    return results;
  };

  Line.prototype.make = function() {
    var arrowUniforms, color, dims, end, join, layers, lineUniforms, mask, material, position, proximity, ref, ref1, ribbons, samples, start, strips, stroke, styleUniforms, uniforms, unitUniforms;
    this._helpers.bind.make([
      {
        to: 'geometry.points',
        trait: 'source'
      }, {
        to: 'geometry.colors',
        trait: 'source'
      }
    ]);
    if (this.bind.points == null) {
      return;
    }
    position = this._shaders.shader();
    position = this.bind.points.sourceShader(position);
    position = this._helpers.position.pipeline(position);
    styleUniforms = this._helpers.style.uniforms();
    lineUniforms = this._helpers.line.uniforms();
    arrowUniforms = this._helpers.arrow.uniforms();
    unitUniforms = this._inherit('unit').getUnitUniforms();
    ref = this.props, start = ref.start, end = ref.end;
    ref1 = this.props, stroke = ref1.stroke, join = ref1.join, proximity = ref1.proximity;
    this.proximity = proximity;
    dims = this.bind.points.getDimensions();
    samples = dims.width;
    strips = dims.height;
    ribbons = dims.depth;
    layers = dims.items;
    if (this.bind.colors) {
      color = this._shaders.shader();
      this.bind.colors.sourceShader(color);
    }
    mask = this._helpers.object.mask();
    material = this._helpers.shade.pipeline() || false;
    uniforms = Util.JS.merge(arrowUniforms, lineUniforms, styleUniforms, unitUniforms);
    this.line = this._renderables.make('line', {
      uniforms: uniforms,
      samples: samples,
      strips: strips,
      ribbons: ribbons,
      layers: layers,
      position: position,
      color: color,
      clip: start || end,
      stroke: stroke,
      join: join,
      proximity: proximity,
      mask: mask,
      material: material
    });
    this.arrows = [];
    if (start) {
      this.arrows.push(this._renderables.make('arrow', {
        uniforms: uniforms,
        flip: true,
        samples: samples,
        strips: strips,
        ribbons: ribbons,
        layers: layers,
        position: position,
        color: color,
        mask: mask,
        material: material
      }));
    }
    if (end) {
      this.arrows.push(this._renderables.make('arrow', {
        uniforms: uniforms,
        samples: samples,
        strips: strips,
        ribbons: ribbons,
        layers: layers,
        position: position,
        color: color,
        mask: mask,
        material: material
      }));
    }
    this._helpers.visible.make();
    return this._helpers.object.make(this.arrows.concat([this.line]));
  };

  Line.prototype.made = function() {
    return this.resize();
  };

  Line.prototype.unmake = function() {
    this._helpers.bind.unmake();
    this._helpers.visible.unmake();
    this._helpers.object.unmake();
    return this.line = this.arrows = null;
  };

  Line.prototype.change = function(changed, touched, init) {
    if (changed['geometry.points'] || changed['line.stroke'] || changed['line.join'] || changed['arrow.start'] || changed['arrow.end']) {
      return this.rebuild();
    }
    if (changed['line.proximity']) {
      if ((this.proximity != null) !== (this.props.proximity != null)) {
        return this.rebuild();
      }
    }
  };

  return Line;

})(Primitive);

module.exports = Line;
