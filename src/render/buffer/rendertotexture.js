var RenderTarget, RenderToTexture, Renderable, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Renderable = require('../renderable');

RenderTarget = require('./texture/rendertarget');

Util = require('../../util');


/*
 * Render-To-Texture with history
 */

RenderToTexture = (function(superClass) {
  extend(RenderToTexture, superClass);

  function RenderToTexture(renderer, shaders, options) {
    var ref;
    this.scene = (ref = options.scene) != null ? ref : new THREE.Scene();
    this.camera = options.camera;
    RenderToTexture.__super__.constructor.call(this, renderer, shaders);
    this.build(options);
  }

  RenderToTexture.prototype.shaderRelative = function(shader) {
    if (shader == null) {
      shader = this.shaders.shader();
    }
    return shader.pipe("sample.2d", this.uniforms);
  };

  RenderToTexture.prototype.shaderAbsolute = function(shader, frames, indices) {
    var sample2DArray;
    if (frames == null) {
      frames = 1;
    }
    if (indices == null) {
      indices = 4;
    }
    if (shader == null) {
      shader = this.shaders.shader();
    }
    if (frames <= 1) {
      if (indices > 2) {
        shader.pipe(Util.GLSL.truncateVec(indices, 2));
      }
      shader.pipe("map.2d.data", this.uniforms);
      return shader.pipe("sample.2d", this.uniforms);
    } else {
      sample2DArray = Util.GLSL.sample2DArray(Math.min(frames, this.target.frames));
      if (indices < 4) {
        shader.pipe(Util.GLSL.extendVec(indices, 4));
      }
      shader.pipe("map.xyzw.2dv");
      shader.split();
      shader.pipe("map.2d.data", this.uniforms);
      shader.pass();
      return shader.pipe(sample2DArray, this.uniforms);
    }
  };

  RenderToTexture.prototype.build = function(options) {
    var base;
    if (!this.camera) {
      this.camera = new THREE.PerspectiveCamera();
      this.camera.position.set(0, 0, 3);
      this.camera.lookAt(new THREE.Vector3());
    }
    if (typeof (base = this.scene).inject === "function") {
      base.inject();
    }
    this.target = new RenderTarget(this.gl, options.width, options.height, options.frames, options);
    this.target.warmup((function(_this) {
      return function(target) {
        return _this.renderer.setRenderTarget(target);
      };
    })(this));
    this.renderer.setRenderTarget(null);
    this._adopt(this.target.uniforms);
    this._adopt({
      dataPointer: {
        type: 'v2',
        value: new THREE.Vector2(.5, .5)
      }
    });
    return this.filled = 0;
  };

  RenderToTexture.prototype.adopt = function(renderable) {
    var i, len, object, ref, results;
    ref = renderable.renders;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      results.push(this.scene.add(object));
    }
    return results;
  };

  RenderToTexture.prototype.unadopt = function(renderable) {
    var i, len, object, ref, results;
    ref = renderable.renders;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      results.push(this.scene.remove(object));
    }
    return results;
  };

  RenderToTexture.prototype.render = function(camera) {
    var ref;
    if (camera == null) {
      camera = this.camera;
    }
    this.renderer.render((ref = this.scene.scene) != null ? ref : this.scene, camera, this.target.write);
    this.target.cycle();
    if (this.filled < this.target.frames) {
      return this.filled++;
    }
  };

  RenderToTexture.prototype.read = function(frame) {
    if (frame == null) {
      frame = 0;
    }
    return this.target.reads[Math.abs(frame)];
  };

  RenderToTexture.prototype.getFrames = function() {
    return this.target.frames;
  };

  RenderToTexture.prototype.getFilled = function() {
    return this.filled;
  };

  RenderToTexture.prototype.dispose = function() {
    var base;
    if (typeof (base = this.scene).unject === "function") {
      base.unject();
    }
    this.scene = this.camera = null;
    this.target.dispose();
    return RenderToTexture.__super__.dispose.apply(this, arguments);
  };

  return RenderToTexture;

})(Renderable);

module.exports = RenderToTexture;
