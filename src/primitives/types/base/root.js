var Parent, Root, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('./parent');

Util = require('../../../util');

Root = (function(superClass) {
  extend(Root, superClass);

  function Root() {
    return Root.__super__.constructor.apply(this, arguments);
  }

  Root.traits = ['node', 'root', 'clock', 'scene', 'vertex', 'unit'];

  Root.prototype.init = function() {
    this.size = null;
    this.cameraEvent = {
      type: 'root.camera'
    };
    this.preEvent = {
      type: 'root.pre'
    };
    this.updateEvent = {
      type: 'root.update'
    };
    this.renderEvent = {
      type: 'root.render'
    };
    this.postEvent = {
      type: 'root.post'
    };
    this.clockEvent = {
      type: 'clock.tick'
    };
    return this.camera = null;
  };

  Root.prototype.make = function() {
    return this._helpers.unit.make();
  };

  Root.prototype.unmake = function() {
    return this._helpers.unit.unmake();
  };

  Root.prototype.change = function(changed, touched, init) {
    if (changed['root.camera'] || init) {
      this._unattach();
      this._attach(this.props.camera, 'camera', this.setCamera, this, this, true);
      return this.setCamera();
    }
  };

  Root.prototype.adopt = function(renderable) {
    var i, len, object, ref, results;
    ref = renderable.renders;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      results.push(this._context.scene.add(object));
    }
    return results;
  };

  Root.prototype.unadopt = function(renderable) {
    var i, len, object, ref, results;
    ref = renderable.renders;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      results.push(this._context.scene.remove(object));
    }
    return results;
  };

  Root.prototype.select = function(selector) {
    return this.node.model.select(selector);
  };

  Root.prototype.watch = function(selector, handler) {
    return this.node.model.watch(selector, handler);
  };

  Root.prototype.unwatch = function(handler) {
    return this.node.model.unwatch(handler);
  };

  Root.prototype.resize = function(size) {
    this.size = size;
    return this.trigger({
      type: 'root.resize',
      size: size
    });
  };

  Root.prototype.getSize = function() {
    return this.size;
  };

  Root.prototype.getSpeed = function() {
    return this.props.speed;
  };

  Root.prototype.getUnit = function() {
    return this._helpers.unit.get();
  };

  Root.prototype.getUnitUniforms = function() {
    return this._helpers.unit.uniforms();
  };

  Root.prototype.pre = function() {
    this.getCamera().updateProjectionMatrix();
    this.trigger(this.clockEvent);
    return this.trigger(this.preEvent);
  };

  Root.prototype.update = function() {
    return this.trigger(this.updateEvent);
  };

  Root.prototype.render = function() {
    return this.trigger(this.renderEvent);
  };

  Root.prototype.post = function() {
    return this.trigger(this.postEvent);
  };

  Root.prototype.setCamera = function() {
    var camera, ref;
    camera = (ref = this.select(this.props.camera)[0]) != null ? ref.controller : void 0;
    if (this.camera !== camera) {
      this.camera = camera;
      return this.trigger({
        type: 'root.camera'
      });
    }
  };

  Root.prototype.getCamera = function() {
    var ref, ref1;
    return (ref = (ref1 = this.camera) != null ? ref1.getCamera() : void 0) != null ? ref : this._context.defaultCamera;
  };

  Root.prototype.getTime = function() {
    return this._context.time;
  };

  Root.prototype.vertex = function(shader, pass) {
    if (pass === 2) {
      return shader.pipe('view.position');
    }
    if (pass === 3) {
      return shader.pipe('root.position');
    }
    return shader;
  };

  return Root;

})(Parent);

module.exports = Root;
