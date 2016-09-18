var Base, Sprite, SpriteGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Base = require('./base');

SpriteGeometry = require('../geometry').SpriteGeometry;

Sprite = (function(superClass) {
  extend(Sprite, superClass);

  function Sprite(renderer, shaders, options) {
    var color, combine, edgeFactory, f, factory, fillFactory, hasStyle, linear, map, mask, material, position, sprite, stpq, uniforms, v;
    Sprite.__super__.constructor.call(this, renderer, shaders, options);
    uniforms = options.uniforms, material = options.material, position = options.position, sprite = options.sprite, map = options.map, combine = options.combine, linear = options.linear, color = options.color, mask = options.mask, stpq = options.stpq;
    if (uniforms == null) {
      uniforms = {};
    }
    hasStyle = uniforms.styleColor != null;
    this.geometry = new SpriteGeometry({
      items: options.items,
      width: options.width,
      height: options.height,
      depth: options.depth
    });
    this._adopt(uniforms);
    this._adopt(this.geometry.uniforms);
    factory = shaders.material();
    v = factory.vertex;
    v.pipe(this._vertexColor(color, mask));
    v.require(this._vertexPosition(position, material, map, 2, stpq));
    v.require(sprite);
    v.pipe('sprite.position', this.uniforms);
    v.pipe('project.position', this.uniforms);
    factory.fragment = f = this._fragmentColor(hasStyle, material, color, mask, map, 2, stpq, combine, linear);
    edgeFactory = shaders.material();
    edgeFactory.vertex.pipe(v);
    edgeFactory.fragment.pipe(f);
    edgeFactory.fragment.pipe('fragment.transparent', this.uniforms);
    fillFactory = shaders.material();
    fillFactory.vertex.pipe(v);
    fillFactory.fragment.pipe(f);
    fillFactory.fragment.pipe('fragment.solid', this.uniforms);
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

  Sprite.prototype.show = function(transparent, blending, order, depth) {
    this._show(this.edgeObject, true, blending, order, depth);
    return this._show(this.fillObject, transparent, blending, order, depth);
  };

  Sprite.prototype.dispose = function() {
    this.geometry.dispose();
    this.edgeMaterial.dispose();
    this.fillMaterial.dispose();
    this.nreders = this.geometry = this.edgeMaterial = this.fillMaterial = this.edgeObject = this.fillObject = null;
    return Sprite.__super__.dispose.apply(this, arguments);
  };

  return Sprite;

})(Base);

module.exports = Sprite;
