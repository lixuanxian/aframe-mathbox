var Primitive, Strip, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Strip = (function(superClass) {
  extend(Strip, superClass);

  Strip.traits = ['node', 'object', 'visible', 'style', 'line', 'mesh', 'strip', 'geometry', 'position', 'bind', 'shade'];

  function Strip(node, context, helpers) {
    Strip.__super__.constructor.call(this, node, context, helpers);
    this.strip = null;
  }

  Strip.prototype.resize = function() {
    var depth, dims, height, items, map, width;
    if (this.bind.points == null) {
      return;
    }
    dims = this.bind.points.getActiveDimensions();
    items = dims.items, width = dims.width, height = dims.height, depth = dims.depth;
    if (this.strip) {
      this.strip.geometry.clip(width, height, depth, items);
    }
    if (this.line) {
      this.line.geometry.clip(items, width, height, depth);
    }
    if (this.bind.map != null) {
      map = this.bind.map.getActiveDimensions();
      if (this.strip) {
        return this.strip.geometry.map(map.width, map.height, map.depth, map.items);
      }
    }
  };

  Strip.prototype.make = function() {
    var color, depth, dims, faceMaterial, fill, height, items, join, line, lineMaterial, lineUniforms, map, mask, material, objects, position, ref, ref1, shaded, stroke, styleUniforms, swizzle, uniforms, unitUniforms, width, wireUniforms;
    this._helpers.bind.make([
      {
        to: 'geometry.points',
        trait: 'source'
      }, {
        to: 'geometry.colors',
        trait: 'source'
      }, {
        to: 'mesh.map',
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
    unitUniforms = this._inherit('unit').getUnitUniforms();
    line = this.props.line;
    shaded = this.props.shaded;
    fill = this.props.fill;
    wireUniforms = {};
    wireUniforms.styleZBias = this._attributes.make(this._types.number());
    this.wireZBias = wireUniforms.styleZBias;
    dims = this.bind.points.getDimensions();
    items = dims.items, width = dims.width, height = dims.height, depth = dims.depth;
    ref = this.props, line = ref.line, shaded = ref.shaded, fill = ref.fill, stroke = ref.stroke, join = ref.join;
    if (this.bind.colors) {
      color = this._shaders.shader();
      color = this.bind.colors.sourceShader(color);
    }
    mask = this._helpers.object.mask();
    map = this._helpers.shade.map((ref1 = this.bind.map) != null ? ref1.sourceShader(this._shaders.shader()) : void 0);
    material = this._helpers.shade.pipeline();
    faceMaterial = material || shaded;
    lineMaterial = material || false;
    objects = [];
    if (line) {
      swizzle = this._shaders.shader();
      swizzle.pipe(Util.GLSL.swizzleVec4('yzwx'));
      swizzle.pipe(position);
      uniforms = Util.JS.merge(unitUniforms, lineUniforms, styleUniforms, wireUniforms);
      this.line = this._renderables.make('line', {
        uniforms: uniforms,
        samples: items,
        strips: width,
        ribbons: height,
        layers: depth,
        position: swizzle,
        color: color,
        stroke: stroke,
        join: join,
        mask: mask,
        material: lineMaterial
      });
      objects.push(this.line);
    }
    if (fill) {
      uniforms = Util.JS.merge(styleUniforms, {});
      this.strip = this._renderables.make('strip', {
        uniforms: uniforms,
        width: width,
        height: height,
        depth: depth,
        items: items,
        position: position,
        color: color,
        material: faceMaterial
      });
      objects.push(this.strip);
    }
    this._helpers.visible.make();
    return this._helpers.object.make(objects);
  };

  Strip.prototype.made = function() {
    return this.resize();
  };

  Strip.prototype.unmake = function() {
    this._helpers.bind.unmake();
    this._helpers.visible.unmake();
    this._helpers.object.unmake();
    return this.strip = null;
  };

  Strip.prototype.change = function(changed, touched, init) {
    var fill, lineBias, ref, zBias;
    if (changed['geometry.points'] || touched['mesh']) {
      return this.rebuild();
    }
    if (changed['style.zBias'] || changed['mesh.lineBias'] || init) {
      ref = this.props, fill = ref.fill, zBias = ref.zBias, lineBias = ref.lineBias;
      return this.wireZBias.value = zBias + (fill ? lineBias : 0);
    }
  };

  return Strip;

})(Primitive);

module.exports = Strip;
