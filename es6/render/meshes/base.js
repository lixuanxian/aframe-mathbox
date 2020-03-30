var Base, Renderable, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Renderable = require('../renderable');

Util = require('../../util');

Base = (function(superClass) {
  extend(Base, superClass);

  function Base(renderer, shaders, options) {
    var ref;
    Base.__super__.constructor.call(this, renderer, shaders, options);
    this.zUnits = (ref = options.zUnits) != null ? ref : 0;
  }

  Base.prototype.raw = function() {
    var i, len, object, ref;
    ref = this.renders;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      this._raw(object);
    }
    return null;
  };

  Base.prototype.depth = function(write, test) {
    var i, len, object, ref;
    ref = this.renders;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      this._depth(object, write, test);
    }
    return null;
  };

  Base.prototype.polygonOffset = function(factor, units) {
    var i, len, object, ref;
    ref = this.renders;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      this._polygonOffset(object, factor, units);
    }
    return null;
  };

  Base.prototype.show = function(transparent, blending, order) {
    var i, len, object, ref, results;
    ref = this.renders;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      results.push(this._show(object, transparent, blending, order));
    }
    return results;
  };

  Base.prototype.hide = function() {
    var i, len, object, ref;
    ref = this.renders;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      this._hide(object);
    }
    return null;
  };

  Base.prototype._material = function(options) {
    var fragmentPrefix, i, key, len, material, precision, ref, vertexPrefix;
    precision = this.renderer.getPrecision();
    vertexPrefix = "    precision " + precision + " float;\n    precision " + precision + " int;\nuniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;";
    fragmentPrefix = "    precision " + precision + " float;\n    precision " + precision + " int;\nuniform mat4 viewMatrix;\nuniform vec3 cameraPosition;";
    options.attributes = undefined
    material = new THREE.RawShaderMaterial(options);
    ref = ['vertexGraph', 'fragmentGraph'];
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      material[key] = options[key];
    }
    material.vertexShader = [vertexPrefix, material.vertexShader].join('\n');
    material.fragmentShader = [fragmentPrefix, material.fragmentShader].join('\n');
    return material;
  };

  Base.prototype._raw = function(object) {
    object.rotationAutoUpdate = false;
    object.frustumCulled = false;
    object.matrixAutoUpdate = false;
    return object.material.defaultAttributeValues = void 0;
  };

  Base.prototype._depth = function(object, write, test) {
    var m;
    m = object.material;
    m.depthWrite = write;
    return m.depthTest = test;
  };

  Base.prototype._polygonOffset = function(object, factor, units) {
    var enabled, m;
    units -= this.zUnits;
    enabled = units !== 0;
    m = object.material;
    m.polygonOffset = enabled;
    if (enabled) {
      m.polygonOffsetFactor = factor;
      return m.polygonOffsetUnits = units;
    }
  };

  Base.prototype._show = function(object, transparent, blending, order) {
    var m;
    transparent = true;
    m = object.material;
    object.renderOrder = -order;
    object.visible = true;
    m.transparent = transparent;
    m.blending = blending;
    return null;
  };

  Base.prototype._hide = function(object) {
    return object.visible = false;
  };

  Base.prototype._vertexColor = function(color, mask) {
    var v;
    if (!(color || mask)) {
      return;
    }
    v = this.shaders.shader();
    if (color) {
      v.require(color);
      v.pipe('mesh.vertex.color', this.uniforms);
    }
    if (mask) {
      v.require(mask);
      v.pipe('mesh.vertex.mask', this.uniforms);
    }
    return v;
  };

  Base.prototype._vertexPosition = function(position, material, map, channels, stpq) {
    var defs, v;
    v = this.shaders.shader();
    if (map || (material && material !== true)) {
      defs = {};
      if (channels > 0 || stpq) {
        defs.POSITION_MAP = '';
      }
      if (channels > 0) {
        defs[['POSITION_U', 'POSITION_UV', 'POSITION_UVW', 'POSITION_UVWO'][channels - 1]] = '';
      }
      if (stpq) {
        defs.POSITION_STPQ = '';
      }
    }
    v.require(position);
    return v.pipe('mesh.vertex.position', this.uniforms, defs);
  };

  Base.prototype._fragmentColor = function(hasStyle, material, color, mask, map, channels, stpq, combine, linear) {
    var defs, f, gamma, join;
    f = this.shaders.shader();
    join = false;
    gamma = false;
    defs = {};
    if (channels > 0) {
      defs[['POSITION_U', 'POSITION_UV', 'POSITION_UVW', 'POSITION_UVWO'][channels - 1]] = '';
    }
    if (stpq) {
      defs.POSITION_STPQ = '';
    }
    if (hasStyle) {
      f.pipe('style.color', this.uniforms);
      join = true;
      if (color || map || material) {
        if (!linear || color) {
          f.pipe('mesh.gamma.in');
        }
        gamma = true;
      }
    }
    if (color) {
      f.isolate();
      f.pipe('mesh.fragment.color', this.uniforms);
      if (!linear || join) {
        f.pipe('mesh.gamma.in');
      }
      f.end();
      if (join) {
        f.pipe(Util.GLSL.binaryOperator('vec4', '*'));
      }
      if (linear && join) {
        f.pipe('mesh.gamma.out');
      }
      join = true;
      gamma = true;
    }
    if (map) {
      if (!join && combine) {
        f.pipe(Util.GLSL.constant('vec4', 'vec4(1.0)'));
      }
      f.isolate();
      f.require(map);
      f.pipe('mesh.fragment.map', this.uniforms, defs);
      if (!linear) {
        f.pipe('mesh.gamma.in');
      }
      f.end();
      if (combine) {
        f.pipe(combine);
      } else {
        if (join) {
          f.pipe(Util.GLSL.binaryOperator('vec4', '*'));
        }
      }
      join = true;
      gamma = true;
    }
    if (material) {
      if (!join) {
        f.pipe(Util.GLSL.constant('vec4', 'vec4(1.0)'));
      }
      if (material === true) {
        f.pipe('mesh.fragment.shaded', this.uniforms);
      } else {
        f.require(material);
        f.pipe('mesh.fragment.material', this.uniforms, defs);
      }
      gamma = true;
    }
    if (gamma && !linear) {
      f.pipe('mesh.gamma.out');
    }
    if (mask) {
      f.pipe('mesh.fragment.mask', this.uniforms);
      if (join) {
        f.pipe(Util.GLSL.binaryOperator('vec4', '*'));
      }
    }
    return f;
  };

  return Base;

})(Renderable);

module.exports = Base;
