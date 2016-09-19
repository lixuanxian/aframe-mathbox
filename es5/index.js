var Context, k, mathBox, ref, v;

mathBox = function(options) {
  var ref, three;
  three = THREE.Bootstrap(options);
  if (!three.fallback) {
    if (!three.Time) {
      three.install('time');
    }
    if (!three.MathBox) {
      three.install(['mathbox', 'splash']);
    }
  }
  return (ref = three.mathbox) != null ? ref : three;
};

window.π = Math.PI;

window.τ = π * 2;

window.e = Math.E;

window.MathBox = exports;

window.mathBox = exports.mathBox = mathBox;

const version = '0.0.5';
//export version;

exports.Context = Context = require('./context');

ref = Context.Namespace;
for (k in ref) {
  v = ref[k];
  exports[k] = v;
}

import './splash';

THREE.Bootstrap.registerPlugin('mathbox', {
  defaults: {
    init: true,
    warmup: 2,
    inspect: true,
    splash: true
  },
  listen: ['ready', 'pre', 'update', 'post', 'resize'],
  install: function(three) {
    var inited;
    inited = false;
    this.first = true;
    return three.MathBox = {
      init: (function(_this) {
        return function(options) {
          var camera, scene;
          if (inited) {
            return;
          }
          inited = true;
          scene = (options != null ? options.scene : void 0) || _this.options.scene || three.scene;
          camera = (options != null ? options.camera : void 0) || _this.options.camera || three.camera;
          _this.context = new Context(three.renderer, scene, camera);
          _this.context.api.three = three.three = three;
          _this.context.api.mathbox = three.mathbox = _this.context.api;
          _this.context.api.start = function() {
            return three.Loop.start();
          };
          _this.context.api.stop = function() {
            return three.Loop.stop();
          };
          _this.context.init();
          _this.context.resize(three.Size);
          _this.context.setWarmup(_this.options.warmup);
          _this.pending = 0;
          _this.warm = !_this.options.warmup;
          console.log('MathBox²', MathBox.version);
          return three.trigger({
            type: 'mathbox/init',
            version: MathBox.version,
            context: _this.context
          });
        };
      })(this),
      destroy: (function(_this) {
        return function() {
          if (!inited) {
            return;
          }
          inited = false;
          three.trigger({
            type: 'mathbox/destroy',
            context: _this.context
          });
          _this.context.destroy();
          delete three.mathbox;
          delete _this.context.api.three;
          return delete _this.context;
        };
      })(this),
      object: (function(_this) {
        return function() {
          var ref1;
          return (ref1 = _this.context) != null ? ref1.scene.root : void 0;
        };
      })(this)
    };
  },
  uninstall: function(three) {
    three.MathBox.destroy();
    return delete three.MathBox;
  },
  ready: function(event, three) {
    if (this.options.init) {
      three.MathBox.init();
      return setTimeout((function(_this) {
        return function() {
          if (_this.options.inspect) {
            return _this.inspect(three);
          }
        };
      })(this));
    }
  },
  inspect: function(three) {
    this.context.api.inspect();
    if (!this.options.warmup) {
      return this.info(three);
    }
  },
  info: function(three) {
    var fmt, info;
    fmt = function(x) {
      var out;
      out = [];
      while (x >= 1000) {
        out.unshift(("000" + (x % 1000)).slice(-3));
        x = Math.floor(x / 1000);
      }
      out.unshift(x);
      return out.join(',');
    };
    info = three.renderer.info.render;
    return console.log('Geometry  ', fmt(info.faces) + ' faces  ', fmt(info.vertices) + ' vertices  ', fmt(info.calls) + ' draw calls  ');
  },
  resize: function(event, three) {
    var ref1;
    return (ref1 = this.context) != null ? ref1.resize(three.Size) : void 0;
  },
  pre: function(event, three) {
    var ref1;
    return (ref1 = this.context) != null ? ref1.pre(three.Time) : void 0;
  },
  update: function(event, three) {
    var camera, ref1, ref2, ref3;
    if ((ref1 = this.context) != null) {
      ref1.update();
    }
    if ((camera = (ref2 = this.context) != null ? ref2.camera : void 0) && camera !== three.camera) {
      three.camera = camera;
    }
    three.Time.set({
      speed: this.context.speed
    });
    this.progress(this.context.getPending(), three);
    return (ref3 = this.context) != null ? ref3.render() : void 0;
  },
  post: function(event, three) {
    var ref1;
    return (ref1 = this.context) != null ? ref1.post() : void 0;
  },
  progress: function(remain, three) {
    var current, pending, total;
    if (!(remain || this.pending)) {
      return;
    }
    pending = Math.max(remain + this.options.warmup, this.pending);
    current = pending - remain;
    total = pending;
    three.trigger({
      type: 'mathbox/progress',
      current: pending - remain,
      total: pending
    });
    if (remain === 0) {
      pending = 0;
    }
    this.pending = pending;
    if (current === total && !this.warm) {
      this.warm = true;
      if (this.options.inspect) {
        return this.info(three);
      }
    }
  }
});
