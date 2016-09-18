var Base, Point, SpriteGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Base = require('./base');

SpriteGeometry = require('../geometry').SpriteGeometry;

Point = (function(superClass) {
  extend(Point, superClass);

  function Point(renderer, shaders, options) {
    var _scale, _shape, alpha, color, combine, defines, edgeFactory, f, factory, fill, fillFactory, hasStyle, linear, map, mask, material, optical, pass, passes, position, ref, ref1, ref2, ref3, scales, shape, shapes, size, stpq, uniforms, v;
    Point.__super__.constructor.call(this, renderer, shaders, options);
    uniforms = options.uniforms, material = options.material, position = options.position, color = options.color, size = options.size, mask = options.mask, map = options.map, combine = options.combine, linear = options.linear, shape = options.shape, optical = options.optical, fill = options.fill, stpq = options.stpq;
    if (uniforms == null) {
      uniforms = {};
    }
    shape = (ref = +shape) != null ? ref : 0;
    if (fill == null) {
      fill = true;
    }
    hasStyle = uniforms.styleColor != null;
    shapes = ['circle', 'square', 'diamond', 'up', 'down', 'left', 'right'];
    passes = ['circle', 'generic', 'generic', 'generic', 'generic', 'generic', 'generic'];
    scales = [1.2, 1, 1.414, 1.16, 1.16, 1.16, 1.16];
    pass = (ref1 = passes[shape]) != null ? ref1 : passes[0];
    _shape = (ref2 = shapes[shape]) != null ? ref2 : shapes[0];
    _scale = (ref3 = optical && scales[shape]) != null ? ref3 : 1;
    alpha = fill ? pass : pass + ".hollow";
    this.geometry = new SpriteGeometry({
      items: options.items,
      width: options.width,
      height: options.height,
      depth: options.depth
    });
    this._adopt(uniforms);
    this._adopt(this.geometry.uniforms);
    defines = {
      POINT_SHAPE_SCALE: +(_scale + .00001)
    };
    factory = shaders.material();
    v = factory.vertex;
    v.pipe(this._vertexColor(color, mask));
    if (size) {
      v.isolate();
      v.require(size);
      v.require('point.size.varying', this.uniforms);
      v.end();
    } else {
      v.require('point.size.uniform', this.uniforms);
    }
    v.require(this._vertexPosition(position, material, map, 2, stpq));
    v.pipe('point.position', this.uniforms, defines);
    v.pipe('project.position', this.uniforms);
    factory.fragment = f = this._fragmentColor(hasStyle, material, color, mask, map, 2, stpq, combine, linear);
    edgeFactory = shaders.material();
    edgeFactory.vertex.pipe(v);
    f = edgeFactory.fragment.pipe(factory.fragment);
    f.require("point.mask." + _shape, this.uniforms);
    f.require("point.alpha." + alpha, this.uniforms);
    f.pipe('point.edge', this.uniforms);
    fillFactory = shaders.material();
    fillFactory.vertex.pipe(v);
    f = fillFactory.fragment.pipe(factory.fragment);
    f.require("point.mask." + _shape, this.uniforms);
    f.require("point.alpha." + alpha, this.uniforms);
    f.pipe('point.fill', this.uniforms);
    this.fillMaterial = this._material(fillFactory.link({
      side: THREE.DoubleSide
    }));
    this.edgeMaterial = this._material(edgeFactory.link({
      side: THREE.DoubleSide
    }));
    this.fillObject = new THREE.Mesh(this.geometry, this.fillMaterial);
    this.edgeObject = new THREE.Mesh(this.geometry, this.edgeMaterial);
    this._raw(this.fillObject);
    this._raw(this.edgeObject);
    this.renders = [this.fillObject, this.edgeObject];
  }

  Point.prototype.show = function(transparent, blending, order, depth) {
    this._show(this.edgeObject, true, blending, order, depth);
    return this._show(this.fillObject, transparent, blending, order, depth);
  };

  Point.prototype.dispose = function() {
    this.geometry.dispose();
    this.edgeMaterial.dispose();
    this.fillMaterial.dispose();
    this.renders = this.edgeObject = this.fillObject = this.geometry = this.edgeMaterial = this.fillMaterial = null;
    return Point.__super__.dispose.apply(this, arguments);
  };

  return Point;

})(Base);

module.exports = Point;
