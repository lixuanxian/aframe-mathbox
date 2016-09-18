var Parent, RTT, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Util = require('../../../util');

RTT = (function(superClass) {
  extend(RTT, superClass);

  function RTT() {
    return RTT.__super__.constructor.apply(this, arguments);
  }

  RTT.traits = ['node', 'root', 'scene', 'vertex', 'texture', 'rtt', 'source', 'index', 'image'];

  RTT.defaults = {
    minFilter: 'linear',
    magFilter: 'linear',
    type: 'unsignedByte'
  };

  RTT.prototype.init = function() {
    return this.rtt = this.scene = this.camera = this.width = this.height = this.history = this.rootSize = this.size = null;
  };

  RTT.prototype.indexShader = function(shader) {
    return shader;
  };

  RTT.prototype.imageShader = function(shader) {
    return this.rtt.shaderRelative(shader);
  };

  RTT.prototype.sourceShader = function(shader) {
    return this.rtt.shaderAbsolute(shader, this.history);
  };

  RTT.prototype.getDimensions = function() {
    return {
      items: 1,
      width: this.width,
      height: this.height,
      depth: this.history
    };
  };

  RTT.prototype.getActiveDimensions = function() {
    return this.getDimensions();
  };

  RTT.prototype.make = function() {
    var aspect, height, heightFactor, history, magFilter, minFilter, ref, ref1, relativeSize, size, type, viewHeight, viewWidth, width, widthFactor;
    this.parentRoot = this._inherit('root');
    this.rootSize = this.parentRoot.getSize();
    this._listen(this.parentRoot, 'root.pre', this.pre);
    this._listen(this.parentRoot, 'root.update', this.update);
    this._listen(this.parentRoot, 'root.render', this.render);
    this._listen(this.parentRoot, 'root.post', this.post);
    this._listen(this.parentRoot, 'root.camera', this.setCamera);
    this._listen(this.parentRoot, 'root.resize', function(event) {
      return this.resize(event.size);
    });
    if (this.rootSize == null) {
      return;
    }
    ref = this.props, minFilter = ref.minFilter, magFilter = ref.magFilter, type = ref.type;
    ref1 = this.props, width = ref1.width, height = ref1.height, history = ref1.history, size = ref1.size;
    relativeSize = size === this.node.attributes['rtt.size']["enum"].relative;
    widthFactor = relativeSize ? this.rootSize.renderWidth : 1;
    heightFactor = relativeSize ? this.rootSize.renderHeight : 1;
    this.width = Math.round(width != null ? width * widthFactor : this.rootSize.renderWidth);
    this.height = Math.round(height != null ? height * heightFactor : this.rootSize.renderHeight);
    this.history = history;
    this.aspect = aspect = this.width / this.height;
    if (this.scene == null) {
      this.scene = this._renderables.make('scene');
    }
    this.rtt = this._renderables.make('renderToTexture', {
      scene: this.scene,
      camera: this._context.defaultCamera,
      width: this.width,
      height: this.height,
      frames: this.history,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
    aspect = width || height ? aspect : this.rootSize.aspect;
    viewWidth = width != null ? width : this.rootSize.viewWidth;
    viewHeight = height != null ? height : this.rootSize.viewHeight;
    return this.size = {
      renderWidth: this.width,
      renderHeight: this.height,
      aspect: aspect,
      viewWidth: viewWidth,
      viewHeight: viewHeight,
      pixelRatio: this.height / viewHeight
    };
  };

  RTT.prototype.made = function() {
    this.trigger({
      type: 'source.rebuild'
    });
    if (this.size) {
      return this.trigger({
        type: 'root.resize',
        size: this.size
      });
    }
  };

  RTT.prototype.unmake = function(rebuild) {
    if (this.rtt == null) {
      return;
    }
    this.rtt.dispose();
    if (!rebuild) {
      this.scene.dispose();
    }
    return this.rtt = this.width = this.height = this.history = null;
  };

  RTT.prototype.change = function(changed, touched, init) {
    if (touched['texture'] || changed['rtt.width'] || changed['rtt.height']) {
      return this.rebuild();
    }
    if (changed['root.camera'] || init) {
      this._unattach();
      this._attach(this.props.camera, 'camera', this.setCamera, this, this, true);
      return this.setCamera();
    }
  };

  RTT.prototype.adopt = function(renderable) {
    var i, len, object, ref, results;
    ref = renderable.renders;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      results.push(this.scene.add(object));
    }
    return results;
  };

  RTT.prototype.unadopt = function(renderable) {
    var i, len, object, ref, results;
    ref = renderable.renders;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      results.push(this.scene.remove(object));
    }
    return results;
  };

  RTT.prototype.resize = function(size) {
    var height, ref, relativeSize, width;
    this.rootSize = size;
    ref = this.props, width = ref.width, height = ref.height, size = ref.size;
    relativeSize = size === this.node.attributes['rtt.size']["enum"].relative;
    if (!this.rtt || (width == null) || (height == null) || relativeSize) {
      return this.rebuild();
    }
  };

  RTT.prototype.select = function(selector) {
    return this._root.node.model.select(selector, [this.node]);
  };

  RTT.prototype.watch = function(selector, handler) {
    return this._root.node.model.watch(selector, handler);
  };

  RTT.prototype.unwatch = function(handler) {
    return this._root.node.model.unwatch(handler);
  };

  RTT.prototype.pre = function(e) {
    return this.trigger(e);
  };

  RTT.prototype.update = function(e) {
    var camera;
    if ((camera = this.getOwnCamera()) != null) {
      camera.aspect = this.aspect || 1;
      camera.updateProjectionMatrix();
    }
    return this.trigger(e);
  };

  RTT.prototype.render = function(e) {
    var ref;
    this.trigger(e);
    return (ref = this.rtt) != null ? ref.render(this.getCamera()) : void 0;
  };

  RTT.prototype.post = function(e) {
    return this.trigger(e);
  };

  RTT.prototype.setCamera = function() {
    var camera, ref;
    camera = (ref = this.select(this.props.camera)[0]) != null ? ref.controller : void 0;
    if (this.camera !== camera) {
      this.camera = camera;
      this.rtt.camera = this.getCamera();
      return this.trigger({
        type: 'root.camera'
      });
    } else if (!this.camera) {
      return this.trigger({
        type: 'root.camera'
      });
    }
  };

  RTT.prototype.getOwnCamera = function() {
    var ref;
    return (ref = this.camera) != null ? ref.getCamera() : void 0;
  };

  RTT.prototype.getCamera = function() {
    var ref;
    return (ref = this.getOwnCamera()) != null ? ref : this._inherit('root').getCamera();
  };

  RTT.prototype.vertex = function(shader, pass) {
    if (pass === 2) {
      return shader.pipe('view.position');
    }
    if (pass === 3) {
      return shader.pipe('root.position');
    }
    return shader;
  };

  return RTT;

})(Parent);

module.exports = RTT;
