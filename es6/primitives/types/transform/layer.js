var Layer, Transform, π,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Transform = require('./transform');

π = Math.PI;

Layer = (function(superClass) {
  extend(Layer, superClass);

  function Layer() {
    return Layer.__super__.constructor.apply(this, arguments);
  }

  Layer.traits = ['node', 'vertex', 'layer'];

  Layer.prototype.make = function() {
    this._listen('root', 'root.resize', this.update);
    return this.uniforms = {
      layerScale: this._attributes.make(this._types.vec4()),
      layerBias: this._attributes.make(this._types.vec4())
    };
  };

  Layer.prototype.update = function() {
    var _enum, aspect, camera, depth, fit, fov, pitch, ref, ref1, ref2, scale, size;
    camera = this._inherit('root').getCamera();
    size = this._inherit('root').getSize();
    aspect = (ref = camera.aspect) != null ? ref : 1;
    fov = (ref1 = camera.fov) != null ? ref1 : 1;
    pitch = Math.tan(fov * π / 360);
    _enum = this.node.attributes['layer.fit']["enum"];
    ref2 = this.props, fit = ref2.fit, depth = ref2.depth, scale = ref2.scale;
    switch (fit) {
      case _enum.contain:
        fit = aspect > 1 ? _enum.y : _enum.x;
        break;
      case _enum.cover:
        fit = aspect > 1 ? _enum.x : _enum.y;
    }
    switch (fit) {
      case _enum.x:
        this.uniforms.layerScale.value.set(pitch * aspect, pitch * aspect);
        break;
      case _enum.y:
        this.uniforms.layerScale.value.set(pitch, pitch);
    }
    return this.uniforms.layerBias.value.set(0, 0, -depth, 0);
  };

  Layer.prototype.change = function(changed, touched, init) {
    if (changed['layer.fit'] || changed['layer.depth'] || init) {
      return this.update();
    }
  };

  Layer.prototype.vertex = function(shader, pass) {
    if (pass === 2) {
      return shader.pipe('layer.position', this.uniforms);
    }
    if (pass === 3) {
      return shader.pipe('root.position');
    }
    return shader;
  };

  return Layer;

})(Transform);

module.exports = Layer;
