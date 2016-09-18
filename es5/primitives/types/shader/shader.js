var Primitive, Shader, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Shader = (function(superClass) {
  extend(Shader, superClass);

  function Shader() {
    return Shader.__super__.constructor.apply(this, arguments);
  }

  Shader.traits = ['node', 'bind', 'shader'];

  Shader.freeform = true;

  Shader.prototype.init = function() {
    return this.shader = null;
  };

  Shader.prototype.make = function() {
    var code, def, i, language, len, make, ref, ref1, snippet, type, types, uniforms;
    ref = this.props, language = ref.language, code = ref.code;
    if (language !== 'glsl') {
      throw new Error("GLSL required");
    }
    this._helpers.bind.make([
      {
        to: 'shader.sources',
        trait: 'source',
        multiple: true
      }
    ]);
    snippet = this._shaders.fetch(code);
    types = this._types;
    uniforms = {};
    make = (function(_this) {
      return function(type) {
        var t;
        switch (type) {
          case 'i':
            return types.int();
          case 'f':
            return types.number();
          case 'v2':
            return types.vec2();
          case 'v3':
            return types.vec3();
          case 'v4':
            return types.vec4();
          case 'm3':
            return types.mat3();
          case 'm4':
            return types.mat4();
          case 't':
            return types.object();
          default:
            t = type.split('');
            if (t.pop() === 'v') {
              return types.array(make(t.join('')));
            } else {
              return null;
            }
        }
      };
    })(this);
    ref1 = snippet._signatures.uniform;
    for (i = 0, len = ref1.length; i < len; i++) {
      def = ref1[i];
      if (type = make(def.type)) {
        uniforms[def.name] = type;
      }
    }
    return this.reconfigure({
      props: {
        uniform: uniforms
      }
    });
  };

  Shader.prototype.made = function() {
    return this.trigger({
      type: 'source.rebuild'
    });
  };

  Shader.prototype.unmake = function() {
    return this.shader = null;
  };

  Shader.prototype.change = function(changed, touched, init) {
    if (changed['shader.uniforms'] || changed['shader.code'] || changed['shader.language']) {
      return this.rebuild();
    }
  };

  Shader.prototype.shaderBind = function(uniforms) {
    var code, i, k, language, len, name, ref, ref1, ref2, s, source, u, v;
    if (uniforms == null) {
      uniforms = {};
    }
    ref = this.props, language = ref.language, code = ref.code;
    ref1 = this.node.attributes;
    for (k in ref1) {
      v = ref1[k];
      if ((v.type != null) && (v.short != null) && v.ns === 'uniform') {
        if (uniforms[name = v.short] == null) {
          uniforms[name] = v;
        }
      }
    }
    if ((u = this.props.uniforms) != null) {
      for (k in u) {
        v = u[k];
        uniforms[k] = v;
      }
    }
    s = this._shaders.shader();
    if (this.bind.sources != null) {
      ref2 = this.bind.sources;
      for (i = 0, len = ref2.length; i < len; i++) {
        source = ref2[i];
        s.require(source.sourceShader(this._shaders.shader()));
      }
    }
    return s.pipe(code, uniforms);
  };

  return Shader;

})(Primitive);

module.exports = Shader;
