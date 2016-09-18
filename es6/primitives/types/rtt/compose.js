var Compose, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Compose = (function(superClass) {
  extend(Compose, superClass);

  function Compose() {
    return Compose.__super__.constructor.apply(this, arguments);
  }

  Compose.traits = ['node', 'bind', 'object', 'visible', 'operator', 'style', 'compose'];

  Compose.defaults = {
    zWrite: false,
    zTest: false,
    color: '#ffffff'
  };

  Compose.prototype.init = function() {
    return this.compose = null;
  };

  Compose.prototype.resize = function() {
    var depth, dims, height, layers, width;
    if (!(this.compose && this.bind.source)) {
      return;
    }
    dims = this.bind.source.getActiveDimensions();
    width = dims.width;
    height = dims.height;
    depth = dims.depth;
    layers = dims.items;
    return this.remapUVScale.set(width, height);
  };

  Compose.prototype.make = function() {
    var alpha, composeUniforms, fragment, resampleUniforms;
    this._helpers.bind.make([
      {
        to: 'operator.source',
        trait: 'source'
      }
    ]);
    if (this.bind.source == null) {
      return;
    }
    resampleUniforms = {
      remapUVScale: this._attributes.make(this._types.vec2())
    };
    this.remapUVScale = resampleUniforms.remapUVScale.value;
    fragment = this._shaders.shader();
    alpha = this.props.alpha;
    if (this.bind.source.is('image')) {
      fragment.pipe('screen.pass.uv', resampleUniforms);
      fragment = this.bind.source.imageShader(fragment);
    } else {
      fragment.pipe('screen.map.xy', resampleUniforms);
      fragment = this.bind.source.sourceShader(fragment);
    }
    if (!alpha) {
      fragment.pipe('color.opaque');
    }
    composeUniforms = this._helpers.style.uniforms();
    this.compose = this._renderables.make('screen', {
      map: fragment,
      uniforms: composeUniforms,
      linear: true
    });
    this._helpers.visible.make();
    return this._helpers.object.make([this.compose]);
  };

  Compose.prototype.made = function() {
    return this.resize();
  };

  Compose.prototype.unmake = function() {
    this._helpers.bind.unmake();
    this._helpers.visible.unmake();
    return this._helpers.object.unmake();
  };

  Compose.prototype.change = function(changed, touched, init) {
    if (changed['operator.source'] || changed['compose.alpha']) {
      return this.rebuild();
    }
  };

  return Compose;

})(Primitive);

module.exports = Compose;
