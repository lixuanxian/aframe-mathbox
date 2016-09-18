var Base, Line, LineGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Base = require('./base');

LineGeometry = require('../geometry').LineGeometry;

Line = (function(superClass) {
  extend(Line, superClass);

  function Line(renderer, shaders, options) {
    var clip, color, combine, defs, detail, f, factory, hasStyle, join, linear, map, mask, material, object, position, proximity, ref, stpq, stroke, uniforms, v;
    Line.__super__.constructor.call(this, renderer, shaders, options);
    uniforms = options.uniforms, material = options.material, position = options.position, color = options.color, mask = options.mask, map = options.map, combine = options.combine, stpq = options.stpq, linear = options.linear, clip = options.clip, stroke = options.stroke, join = options.join, proximity = options.proximity;
    if (uniforms == null) {
      uniforms = {};
    }
    stroke = [null, 'dotted', 'dashed'][stroke];
    hasStyle = uniforms.styleColor != null;
    join = (ref = ['miter', 'round', 'bevel'][join]) != null ? ref : 'miter';
    detail = {
      miter: 1,
      round: 4,
      bevel: 2
    }[join];
    this.geometry = new LineGeometry({
      samples: options.samples,
      strips: options.strips,
      ribbons: options.ribbons,
      layers: options.layers,
      anchor: options.anchor,
      closed: options.closed,
      detail: detail
    });
    this._adopt(uniforms);
    this._adopt(this.geometry.uniforms);
    factory = shaders.material();
    defs = {};
    if (stroke) {
      defs.LINE_STROKE = '';
    }
    if (clip) {
      defs.LINE_CLIP = '';
    }
    if (proximity != null) {
      defs.LINE_PROXIMITY = '';
    }
    defs['LINE_JOIN_' + join.toUpperCase()] = '';
    if (detail > 1) {
      defs['LINE_JOIN_DETAIL'] = detail;
    }
    v = factory.vertex;
    v.pipe(this._vertexColor(color, mask));
    v.require(this._vertexPosition(position, material, map, 2, stpq));
    v.pipe('line.position', this.uniforms, defs);
    v.pipe('project.position', this.uniforms);
    f = factory.fragment;
    if (stroke) {
      f.pipe("fragment.clip." + stroke, this.uniforms);
    }
    if (clip) {
      f.pipe('fragment.clip.ends', this.uniforms);
    }
    if (proximity != null) {
      f.pipe('fragment.clip.proximity', this.uniforms);
    }
    f.pipe(this._fragmentColor(hasStyle, material, color, mask, map, 2, stpq, combine, linear));
    f.pipe('fragment.color', this.uniforms);
    this.material = this._material(factory.link({
      side: THREE.DoubleSide
    }));
    object = new THREE.Mesh(this.geometry, this.material);
    this._raw(object);
    this.renders = [object];
  }

  Line.prototype.dispose = function() {
    this.geometry.dispose();
    this.material.dispose();
    this.renders = this.geometry = this.material = null;
    return Line.__super__.dispose.apply(this, arguments);
  };

  return Line;

})(Base);

module.exports = Line;
