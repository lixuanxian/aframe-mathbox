var Primitive, Ticks, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Ticks = (function(superClass) {
  extend(Ticks, superClass);

  function Ticks() {
    return Ticks.__super__.constructor.apply(this, arguments);
  }

  Ticks.traits = ['node', 'object', 'visible', 'style', 'line', 'ticks', 'geometry', 'position', 'bind', 'shade'];

  Ticks.prototype.init = function() {
    return this.tickStrip = this.line = null;
  };

  Ticks.prototype.resize = function() {
    var active, dims, layers, ribbons, strips;
    if (this.bind.points == null) {
      return;
    }
    dims = this.bind.points.getActiveDimensions();
    active = +(dims.items > 0);
    strips = dims.width * active;
    ribbons = dims.height * active;
    layers = dims.depth * active;
    this.line.geometry.clip(2, strips, ribbons, layers);
    return this.tickStrip.set(0, strips - 1);
  };

  Ticks.prototype.make = function() {
    var color, dims, join, layers, lineUniforms, mask, material, p, position, positionUniforms, ref, ref1, ribbons, strips, stroke, styleUniforms, swizzle, swizzle2, uniforms, unitUniforms;
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
    styleUniforms = this._helpers.style.uniforms();
    lineUniforms = this._helpers.line.uniforms();
    unitUniforms = this._inherit('unit').getUnitUniforms();
    uniforms = Util.JS.merge(lineUniforms, styleUniforms, unitUniforms);
    positionUniforms = {
      tickEpsilon: this.node.attributes['ticks.epsilon'],
      tickSize: this.node.attributes['ticks.size'],
      tickNormal: this.node.attributes['ticks.normal'],
      tickStrip: this._attributes.make(this._types.vec2(0, 0)),
      worldUnit: uniforms.worldUnit,
      focusDepth: uniforms.focusDepth
    };
    this.tickStrip = positionUniforms.tickStrip.value;
    p = position = this._shaders.shader();
    p.require(this.bind.points.sourceShader(this._shaders.shader()));
    p.require(this._helpers.position.pipeline(this._shaders.shader()));
    p.pipe('ticks.position', positionUniforms);
    ref = this.props, stroke = ref.stroke, join = ref.join;
    dims = this.bind.points.getDimensions();
    strips = dims.width;
    ribbons = dims.height;
    layers = dims.depth;
    if (this.bind.colors) {
      color = this._shaders.shader();
      this.bind.colors.sourceShader(color);
    }
    mask = this._helpers.object.mask();
    material = this._helpers.shade.pipeline() || false;
    ref1 = this._helpers.position, swizzle = ref1.swizzle, swizzle2 = ref1.swizzle2;
    this.line = this._renderables.make('line', {
      uniforms: uniforms,
      samples: 2,
      strips: strips,
      ribbons: ribbons,
      layers: layers,
      position: position,
      color: color,
      stroke: stroke,
      join: join,
      mask: swizzle(mask, 'yzwx'),
      material: material
    });
    this._helpers.visible.make();
    return this._helpers.object.make([this.line]);
  };

  Ticks.prototype.made = function() {
    return this.resize();
  };

  Ticks.prototype.unmake = function() {
    this.line = null;
    this._helpers.visible.unmake();
    return this._helpers.object.unmake();
  };

  Ticks.prototype.change = function(changed, touched, init) {
    if (changed['geometry.points'] || changed['line.stroke'] || changed['line.join']) {
      return this.rebuild();
    }
  };

  return Ticks;

})(Primitive);

module.exports = Ticks;
