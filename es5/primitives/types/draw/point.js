var Point, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Point = (function(superClass) {
  extend(Point, superClass);

  Point.traits = ['node', 'object', 'visible', 'style', 'point', 'geometry', 'position', 'bind', 'shade'];

  function Point(node, context, helpers) {
    Point.__super__.constructor.call(this, node, context, helpers);
    this.point = null;
  }

  Point.prototype.resize = function() {
    var depth, dims, height, items, width;
    if (this.bind.points == null) {
      return;
    }
    dims = this.bind.points.getActiveDimensions();
    items = dims.items, width = dims.width, height = dims.height, depth = dims.depth;
    return this.point.geometry.clip(width, height, depth, items);
  };

  Point.prototype.make = function() {
    var color, depth, dims, fill, height, items, mask, material, optical, pointUniforms, position, shape, size, styleUniforms, uniforms, unitUniforms, width;
    this._helpers.bind.make([
      {
        to: 'geometry.points',
        trait: 'source'
      }, {
        to: 'geometry.colors',
        trait: 'source'
      }, {
        to: 'point.sizes',
        trait: 'source'
      }
    ]);
    if (this.bind.points == null) {
      return;
    }
    position = this._shaders.shader();
    position = this.bind.points.sourceShader(position);
    position = this._helpers.position.pipeline(position);
    dims = this.bind.points.getDimensions();
    items = dims.items, width = dims.width, height = dims.height, depth = dims.depth;
    styleUniforms = this._helpers.style.uniforms();
    pointUniforms = this._helpers.point.uniforms();
    unitUniforms = this._inherit('unit').getUnitUniforms();
    if (this.bind.colors) {
      color = this._shaders.shader();
      this.bind.colors.sourceShader(color);
    }
    if (this.bind.sizes) {
      size = this._shaders.shader();
      this.bind.sizes.sourceShader(size);
    }
    mask = this._helpers.object.mask();
    material = this._helpers.shade.pipeline() || false;
    shape = this.props.shape;
    fill = this.props.fill;
    optical = this.props.optical;
    uniforms = Util.JS.merge(unitUniforms, pointUniforms, styleUniforms);
    this.point = this._renderables.make('point', {
      uniforms: uniforms,
      width: width,
      height: height,
      depth: depth,
      items: items,
      position: position,
      color: color,
      size: size,
      shape: shape,
      optical: optical,
      fill: fill,
      mask: mask,
      material: material
    });
    this._helpers.visible.make();
    return this._helpers.object.make([this.point]);
  };

  Point.prototype.made = function() {
    return this.resize();
  };

  Point.prototype.unmake = function() {
    this._helpers.bind.unmake();
    this._helpers.visible.unmake();
    this._helpers.object.unmake();
    return this.point = null;
  };

  Point.prototype.change = function(changed, touched, init) {
    if (changed['geometry.points'] || changed['point.shape'] || changed['point.fill']) {
      return this.rebuild();
    }
  };

  return Point;

})(Primitive);

module.exports = Point;
