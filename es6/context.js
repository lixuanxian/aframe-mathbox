var Context, Model, Overlay, Primitives, Render, Shaders, Stage, Util;

Model = require('./model');

Overlay = require('./overlay');

Primitives = require('./primitives');

Render = require('./render');

Shaders = require('./shaders');

Stage = require('./stage');

Util = require('./util');

Context = (function() {
  Context.Namespace = {
    Model: Model,
    Overlay: Overlay,
    Primitives: Primitives,
    Render: Render,
    Shaders: Shaders,
    Stage: Stage,
    Util: Util,
    DOM: Util.VDOM
  };

  function Context(renderer, scene, camera) {
    var canvas;
    if (scene == null) {
      scene = null;
    }
    if (camera == null) {
      camera = null;
    }
    this.canvas = canvas = renderer.domElement;
    this.element = null;
    this.shaders = new Shaders.Factory(Shaders.Snippets);
    this.renderables = new Render.Factory(Render.Classes, renderer, this.shaders);
    this.overlays = new Overlay.Factory(Overlay.Classes, canvas);
    this.scene = this.renderables.make('scene', {
      scene: scene
    });
    this.camera = this.defaultCamera = camera != null ? camera : new THREE.PerspectiveCamera();
    this.attributes = new Model.Attributes(Primitives.Types, this);
    this.primitives = new Primitives.Factory(Primitives.Types, this);
    this.root = this.primitives.make('root');
    this.model = new Model.Model(this.root);
    this.guard = new Model.Guard;
    this.controller = new Stage.Controller(this.model, this.primitives);
    this.animator = new Stage.Animator(this);
    this.api = new Stage.API(this);
    this.speed = 1;
    this.time = {
      now: +new Date() / 1000,
      time: 0,
      delta: 0,
      clock: 0,
      step: 0
    };
  }

  Context.prototype.init = function() {
    this.scene.inject();
    this.overlays.inject();
    return this;
  };

  Context.prototype.destroy = function() {
    this.scene.unject();
    this.overlays.unject();
    return this;
  };

  Context.prototype.resize = function(size) {

    /*
    {
      viewWidth, viewHeight, renderWidth, renderHeight, aspect, pixelRatio
    }
     */
    if (size == null) {
      size = {};
    }
    if (size.renderWidth == null) {
      size.renderWidth = size.viewWidth != null ? size.viewWidth : size.viewWidth = 1280;
    }
    if (size.renderHeight == null) {
      size.renderHeight = size.viewHeight != null ? size.viewHeight : size.viewHeight = 720;
    }
    if (size.pixelRatio == null) {
      size.pixelRatio = size.renderWidth / Math.max(.000001, size.viewWidth);
    }
    if (size.aspect == null) {
      size.aspect = size.viewWidth / Math.max(.000001, size.viewHeight);
    }
    this.root.controller.resize(size);
    return this;
  };

  Context.prototype.frame = function(time) {

    /*
    {
      now, clock, step
    }
     */
    this.pre(time);
    this.update();
    this.render();
    this.post();
    return this;
  };

  Context.prototype.pre = function(time) {
    var base;
    if (!time) {
      time = {
        now: +new Date() / 1000,
        time: 0,
        delta: 0,
        clock: 0,
        step: 0
      };
      time.delta = this.time.now != null ? time.now - this.time.now : 0;
      if (time.delta > 1) {
        time.delta = 1 / 60;
      }
      time.step = time.delta * this.speed;
      time.time = this.time.time + time.delta;
      time.clock = this.time.clock + time.step;
    }
    this.time = time;
    if (typeof (base = this.root.controller).pre === "function") {
      base.pre();
    }
    return this;
  };

  Context.prototype.update = function() {
    var base;
    this.animator.update();
    this.attributes.compute();
    this.guard.iterate({
      step: (function(_this) {
        return function() {
          var change;
          change = _this.attributes.digest();
          return change || (change = _this.model.digest());
        };
      })(this),
      last: function() {
        return {
          attribute: this.attributes.getLastTrigger(),
          model: this.model.getLastTrigger()
        };
      }
    });
    if (typeof (base = this.root.controller).update === "function") {
      base.update();
    }
    this.camera = this.root.controller.getCamera();
    this.speed = this.root.controller.getSpeed();
    return this;
  };

  Context.prototype.render = function() {
    var base;
    if (typeof (base = this.root.controller).render === "function") {
      base.render();
    }
    this.scene.render();
    return this;
  };

  Context.prototype.post = function() {
    var base;
    if (typeof (base = this.root.controller).post === "function") {
      base.post();
    }
    return this;
  };

  Context.prototype.setWarmup = function(n) {
    this.scene.warmup(n);
    return this;
  };

  Context.prototype.getPending = function() {
    return this.scene.pending.length;
  };

  return Context;

})();

module.exports = Context;