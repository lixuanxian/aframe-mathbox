var Primitive, Surface, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Surface = (function(superClass) {
  extend(Surface, superClass);

  Surface.traits = ['node', 'object', 'visible', 'style', 'line', 'mesh', 'geometry', 'surface', 'position', 'grid', 'bind', 'shade'];

  Surface.defaults = {
    lineX: false,
    lineY: false
  };

  function Surface(node, context, helpers) {
    Surface.__super__.constructor.call(this, node, context, helpers);
    this.lineX = this.lineY = this.surface = null;
  }

  Surface.prototype.resize = function() {
    var depth, dims, height, items, map, width;
    if (this.bind.points == null) {
      return;
    }
    dims = this.bind.points.getActiveDimensions();
    width = dims.width, height = dims.height, depth = dims.depth, items = dims.items;
    if (this.surface) {
      this.surface.geometry.clip(width, height, depth, items);
    }
    if (this.lineX) {
      this.lineX.geometry.clip(width, height, depth, items);
    }
    if (this.lineY) {
      this.lineY.geometry.clip(height, width, depth, items);
    }
    if (this.bind.map != null) {
      map = this.bind.map.getActiveDimensions();
      if (this.surface) {
        return this.surface.geometry.map(map.width, map.height, map.depth, map.items);
      }
    }
  };

  Surface.prototype.make = function() {
    var closedX, closedY, color, crossed, depth, dims, faceMaterial, fill, height, items, join, lineMaterial, lineUniforms, lineX, lineY, map, mask, material, objects, position, proximity, ref, ref1, ref2, shaded, stroke, styleUniforms, surfaceUniforms, swizzle, swizzle2, uniforms, unitUniforms, width, wireUniforms, zUnits;
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
    wireUniforms = this._helpers.style.uniforms();
    lineUniforms = this._helpers.line.uniforms();
    surfaceUniforms = this._helpers.surface.uniforms();
    unitUniforms = this._inherit('unit').getUnitUniforms();
    wireUniforms.styleColor = this._attributes.make(this._types.color());
    wireUniforms.styleZBias = this._attributes.make(this._types.number());
    this.wireColor = wireUniforms.styleColor.value;
    this.wireZBias = wireUniforms.styleZBias;
    this.wireScratch = new THREE.Color;
    dims = this.bind.points.getDimensions();
    width = dims.width, height = dims.height, depth = dims.depth, items = dims.items;
    ref = this.props, shaded = ref.shaded, fill = ref.fill, lineX = ref.lineX, lineY = ref.lineY, closedX = ref.closedX, closedY = ref.closedY, stroke = ref.stroke, join = ref.join, proximity = ref.proximity, crossed = ref.crossed;
    objects = [];
    this.proximity = proximity;
    if (this.bind.colors) {
      color = this._shaders.shader();
      this.bind.colors.sourceShader(color);
    }
    mask = this._helpers.object.mask();
    map = this._helpers.shade.map((ref1 = this.bind.map) != null ? ref1.sourceShader(this._shaders.shader()) : void 0);
    material = this._helpers.shade.pipeline();
    faceMaterial = material || shaded;
    lineMaterial = material || false;
    ref2 = this._helpers.position, swizzle = ref2.swizzle, swizzle2 = ref2.swizzle2;
    uniforms = Util.JS.merge(unitUniforms, lineUniforms, styleUniforms, wireUniforms);
    zUnits = lineX || lineY ? -50 : 0;
    if (lineX) {
      this.lineX = this._renderables.make('line', {
        uniforms: uniforms,
        samples: width,
        strips: height,
        ribbons: depth,
        layers: items,
        position: position,
        color: color,
        zUnits: -zUnits,
        stroke: stroke,
        join: join,
        mask: mask,
        material: lineMaterial,
        proximity: proximity,
        closed: closedX || closed
      });
      objects.push(this.lineX);
    }
    if (lineY) {
      this.lineY = this._renderables.make('line', {
        uniforms: uniforms,
        samples: height,
        strips: width,
        ribbons: depth,
        layers: items,
        position: swizzle2(position, 'yxzw', 'yxzw'),
        color: swizzle(color, 'yxzw'),
        zUnits: -zUnits,
        stroke: stroke,
        join: join,
        mask: swizzle(mask, crossed ? 'xyzw' : 'yxzw'),
        material: lineMaterial,
        proximity: proximity,
        closed: closedY || closed
      });
      objects.push(this.lineY);
    }
    if (fill) {
      uniforms = Util.JS.merge(unitUniforms, surfaceUniforms, styleUniforms);
      this.surface = this._renderables.make('surface', {
        uniforms: uniforms,
        width: width,
        height: height,
        surfaces: depth,
        layers: items,
        position: position,
        color: color,
        zUnits: zUnits,
        stroke: stroke,
        material: faceMaterial,
        mask: mask,
        map: map,
        intUV: true,
        closedX: closedX || closed,
        closedY: closedY || closed
      });
      objects.push(this.surface);
    }
    this._helpers.visible.make();
    return this._helpers.object.make(objects);
  };

  Surface.prototype.made = function() {
    return this.resize();
  };

  Surface.prototype.unmake = function() {
    this._helpers.bind.unmake();
    this._helpers.visible.unmake();
    this._helpers.object.unmake();
    return this.lineX = this.lineY = this.surface = null;
  };

  Surface.prototype.change = function(changed, touched, init) {
    var c, color, fill, lineBias, ref, zBias;
    if (changed['geometry.points'] || changed['mesh.shaded'] || changed['mesh.fill'] || changed['line.stroke'] || changed['line.join'] || touched['grid']) {
      return this.rebuild();
    }
    if (changed['style.color'] || changed['style.zBias'] || changed['mesh.fill'] || changed['mesh.lineBias'] || init) {
      ref = this.props, fill = ref.fill, color = ref.color, zBias = ref.zBias, lineBias = ref.lineBias;
      this.wireZBias.value = zBias + (fill ? lineBias : 0);
      this.wireColor.copy(color);
      if (fill) {
        c = this.wireScratch;
        c.setRGB(color.x, color.y, color.z);
        c.convertGammaToLinear().multiplyScalar(.75).convertLinearToGamma();
        this.wireColor.x = c.r;
        this.wireColor.y = c.g;
        this.wireColor.z = c.b;
      }
    }
    if (changed['line.proximity']) {
      if ((this.proximity != null) !== (this.props.proximity != null)) {
        return this.rebuild();
      }
    }
  };

  return Surface;

})(Primitive);

module.exports = Surface;
