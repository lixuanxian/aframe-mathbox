var MathBox, Renderable, Scene,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Renderable = require('./renderable');


/*
 All MathBox renderables sit inside this root, to keep things tidy.
 */

MathBox = (function(superClass) {
  extend(MathBox, superClass);

  function MathBox() {
    MathBox.__super__.constructor.apply(this, arguments);
    this.rotationAutoUpdate = false;
    this.frustumCulled = false;
    this.matrixAutoUpdate = false;
  }

  return MathBox;

})(THREE.Object3D);


/*
 Holds the root and binds to a THREE.Scene

 Will hold objects and inject them a few at a time
 to avoid long UI blocks.

 Will render injected objects to a 1x1 scratch buffer to ensure availability
 */

Scene = (function(superClass) {
  extend(Scene, superClass);

  function Scene(renderer, shaders, options) {
    Scene.__super__.constructor.call(this, renderer, shaders, options);
    this.root = new MathBox;
    if ((options != null ? options.scene : void 0) != null) {
      this.scene = options.scene;
    }
    if (this.scene == null) {
      this.scene = new THREE.Scene;
    }
    this.pending = [];
    this.async = 0;
    this.scratch = new THREE.WebGLRenderTarget(1, 1);
    this.camera = new THREE.PerspectiveCamera;
  }

  Scene.prototype.inject = function(scene) {
    if (scene != null) {
      this.scene = scene;
    }
    return this.scene.add(this.root);
  };

  Scene.prototype.unject = function() {
    var ref;
    return (ref = this.scene) != null ? ref.remove(this.root) : void 0;
  };

  Scene.prototype.add = function(object) {
    if (this.async) {
      return this.pending.push(object);
    } else {
      return this._add(object);
    }
  };

  Scene.prototype.remove = function(object) {
    this.pending = this.pending.filter(function(o) {
      return o !== object;
    });
    if (object.parent != null) {
      return this._remove(object);
    }
  };

  Scene.prototype._add = function(object) {
    return this.root.add(object);
  };

  Scene.prototype._remove = function(object) {
    return this.root.remove(object);
  };

  Scene.prototype.dispose = function() {
    if (this.root.parent != null) {
      return this.unject();
    }
  };

  Scene.prototype.warmup = function(n) {
    return this.async = +n || 0;
  };

  Scene.prototype.render = function() {
    var added, children, i, j, pending, ref, visible;
    if (!this.pending.length) {
      return;
    }
    children = this.root.children;
    added = [];
    for (i = j = 0, ref = this.async; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      pending = this.pending.shift();
      if (!pending) {
        break;
      }
      this._add(pending);
      added.push(added);
    }
    visible = children.map(function(o) {
      var v;
      return v = o.visible;
    });
    children.map(function(o) {
      return o.visible = indexOf.call(added, o) < 0;
    });
    this.renderer.render(this.scene, this.camera, this.scratch);
    return children.map(function(o, i) {
      return o.visible = visible[i];
    });
  };

  Scene.prototype.toJSON = function() {
    return this.root.toJSON();
  };

  return Scene;

})(Renderable);

module.exports = Scene;
