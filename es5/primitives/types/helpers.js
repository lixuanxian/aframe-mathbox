var Util, View, helpers,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Util = require('../../util');

View = require('./view/view');


/*

This is the general dumping ground for trait behavior.

Helpers are auto-attached to primitives that have the matching trait
 */

helpers = {
  bind: {
    make: function(slots) {
      var callback, done, i, isUnique, j, len, len1, multiple, name, optional, s, selector, slot, source, start, to, trait, unique;
      if (this.bind == null) {
        this.bind = {};
      }
      if (this.bound == null) {
        this.bound = [];
      }
      for (i = 0, len = slots.length; i < len; i++) {
        slot = slots[i];
        to = slot.to, trait = slot.trait, optional = slot.optional, unique = slot.unique, multiple = slot.multiple, callback = slot.callback;
        if (callback == null) {
          callback = this.rebuild;
        }
        name = to.split(/\./g).pop();
        selector = this._get(to);
        source = null;
        if (selector != null) {
          start = this;
          done = false;
          while (!done) {
            start = source = this._attach(selector, trait, callback, this, start, optional, multiple);
            isUnique = unique && ((source == null) || this.bound.indexOf(source) < 0);
            done = multiple || optional || !unique || isUnique;
          }
        }
        if (source != null) {
          if (this.resize != null) {
            this._listen(source, 'source.resize', this.resize);
          }
          if (callback) {
            this._listen(source, 'source.rebuild', callback);
          }
          if (multiple) {
            for (j = 0, len1 = source.length; j < len1; j++) {
              s = source[j];
              this.bound.push(s);
            }
          } else {
            this.bound.push(source);
          }
        }
        this.bind[name] = source;
      }
      return null;
    },
    unmake: function() {
      if (!this.bind) {
        return;
      }
      delete this.bind;
      return delete this.bound;
    }
  },
  span: {
    make: function() {
      this.spanView = this._inherit('view');
      return this._listen('view', 'view.range', (function(_this) {
        return function() {
          return _this.trigger({
            type: 'span.range'
          });
        };
      })(this));
    },
    unmake: function() {
      return delete this.spanView;
    },
    get: (function() {
      var def;
      def = new THREE.Vector2(-1, 1);
      return function(prefix, dimension) {
        var range, ref, ref1;
        range = this._get(prefix + 'span.range');
        if (range != null) {
          return range;
        }
        return (ref = (ref1 = this.spanView) != null ? ref1.axis(dimension) : void 0) != null ? ref : def;
      };
    })()
  },
  scale: {
    divide: function(prefix) {
      var divide, factor;
      divide = this._get(prefix + 'scale.divide');
      factor = this._get(prefix + 'scale.factor');
      return Math.round(divide * 2.5 / factor);
    },
    generate: function(prefix, buffer, min, max) {
      var base, divide, end, factor, mode, nice, start, ticks, unit, zero;
      mode = this._get(prefix + 'scale.mode');
      divide = this._get(prefix + 'scale.divide');
      unit = this._get(prefix + 'scale.unit');
      base = this._get(prefix + 'scale.base');
      factor = this._get(prefix + 'scale.factor');
      start = this._get(prefix + 'scale.start');
      end = this._get(prefix + 'scale.end');
      zero = this._get(prefix + 'scale.zero');
      nice = this._get(prefix + 'scale.nice');
      ticks = Util.Ticks.make(mode, min, max, divide, unit, base, factor, start, end, zero, nice);
      buffer.copy(ticks);
      return ticks;
    }
  },
  style: {
    uniforms: function() {
      return {
        styleColor: this.node.attributes['style.color'],
        styleOpacity: this.node.attributes['style.opacity'],
        styleZBias: this.node.attributes['style.zBias'],
        styleZIndex: this.node.attributes['style.zIndex']
      };
    }
  },
  arrow: {
    uniforms: function() {
      var end, size, space, start, style;
      start = this.props.start;
      end = this.props.end;
      space = this._attributes.make(this._types.number(1.25 / (start + end)));
      style = this._attributes.make(this._types.vec2(+start, +end));
      size = this.node.attributes['arrow.size'];
      return {
        clipStyle: style,
        clipRange: size,
        clipSpace: space,
        arrowSpace: space,
        arrowSize: size
      };
    }
  },
  point: {
    uniforms: function() {
      return {
        pointSize: this.node.attributes['point.size'],
        pointDepth: this.node.attributes['point.depth']
      };
    }
  },
  line: {
    uniforms: function() {
      return {
        lineWidth: this.node.attributes['line.width'],
        lineDepth: this.node.attributes['line.depth'],
        lineProximity: this.node.attributes['line.proximity']
      };
    }
  },
  surface: {
    uniforms: function() {
      return {};
    }
  },
  shade: {
    pipeline: function(shader) {
      var i, pass, ref;
      if (!this._inherit('fragment')) {
        return shader;
      }
      if (shader == null) {
        shader = this._shaders.shader();
      }
      for (pass = i = 0; i <= 2; pass = ++i) {
        shader = (ref = this._inherit('fragment')) != null ? ref.fragment(shader, pass) : void 0;
      }
      shader.pipe('fragment.map.rgba');
      return shader;
    },
    map: function(shader) {
      if (!shader) {
        return shader;
      }
      return shader = this._shaders.shader().pipe('mesh.map.uvwo').pipe(shader);
    }
  },
  position: {
    pipeline: function(shader) {
      var i, pass, ref;
      if (!this._inherit('vertex')) {
        return shader;
      }
      if (shader == null) {
        shader = this._shaders.shader();
      }
      for (pass = i = 0; i <= 3; pass = ++i) {
        shader = (ref = this._inherit('vertex')) != null ? ref.vertex(shader, pass) : void 0;
      }
      return shader;
    },
    swizzle: function(shader, order) {
      if (shader) {
        return this._shaders.shader().pipe(Util.GLSL.swizzleVec4(order)).pipe(shader);
      }
    },
    swizzle2: function(shader, order1, order2) {
      if (shader) {
        return this._shaders.shader().split().pipe(Util.GLSL.swizzleVec4(order1)).next().pipe(Util.GLSL.swizzleVec4(order2)).join().pipe(shader);
      }
    }
  },
  visible: {
    make: function() {
      var e, onVisible, visible, visibleParent;
      e = {
        type: 'visible.change'
      };
      visible = null;
      this.setVisible = function(vis) {
        if (vis != null) {
          visible = vis;
        }
        return onVisible();
      };
      onVisible = (function(_this) {
        return function() {
          var last, ref, self;
          last = _this.isVisible;
          self = (ref = visible != null ? visible : _this._get('object.visible')) != null ? ref : true;
          if (typeof visibleParent !== "undefined" && visibleParent !== null) {
            self && (self = visibleParent.isVisible);
          }
          _this.isVisible = self;
          if (last !== _this.isVisible) {
            return _this.trigger(e);
          }
        };
      })(this);
      visibleParent = this._inherit('visible');
      if (visibleParent) {
        this._listen(visibleParent, 'visible.change', onVisible);
      }
      if (this.is('object')) {
        this._listen(this.node, 'change:object', onVisible);
      }
      return onVisible();
    },
    unmake: function() {
      return delete this.isVisible;
    }
  },
  active: {
    make: function() {
      var active, activeParent, e, onActive;
      e = {
        type: 'active.change'
      };
      active = null;
      this.setActive = function(act) {
        if (act != null) {
          active = act;
        }
        return onActive();
      };
      onActive = (function(_this) {
        return function() {
          var last, ref, self;
          last = _this.isActive;
          self = (ref = active != null ? active : _this._get('entity.active')) != null ? ref : true;
          if (typeof activeParent !== "undefined" && activeParent !== null) {
            self && (self = activeParent.isActive);
          }
          _this.isActive = self;
          if (last !== _this.isActive) {
            return _this.trigger(e);
          }
        };
      })(this);
      activeParent = this._inherit('active');
      if (activeParent) {
        this._listen(activeParent, 'active.change', onActive);
      }
      if (this.is('entity')) {
        this._listen(this.node, 'change:entity', onActive);
      }
      return onActive();
    },
    unmake: function() {
      return delete this.isActive;
    }
  },
  object: {
    make: function(objects) {
      var blending, hasStyle, i, last, len, object, objectScene, onChange, onVisible, opacity, ref, zOrder, zTest, zWrite;
      this.objects = objects != null ? objects : [];
      this.renders = this.objects.reduce((function(a, b) {
        return a.concat(b.renders);
      }), []);
      objectScene = this._inherit('scene');
      opacity = blending = zOrder = null;
      hasStyle = indexOf.call(this.traits, 'style') >= 0;
      opacity = 1;
      blending = THREE.NormalBlending;
      zWrite = true;
      zTest = true;
      if (hasStyle) {
        opacity = this.props.opacity;
        blending = this.props.blending;
        zOrder = this.props.zOrder;
        zWrite = this.props.zWrite;
        zTest = this.props.zTest;
      }
      onChange = (function(_this) {
        return function(event) {
          var changed, refresh;
          changed = event.changed;
          refresh = null;
          if (changed['style.opacity']) {
            refresh = opacity = _this.props.opacity;
          }
          if (changed['style.blending']) {
            refresh = blending = _this.props.blending;
          }
          if (changed['style.zOrder']) {
            refresh = zOrder = _this.props.zOrder;
          }
          if (changed['style.zWrite']) {
            refresh = zWrite = _this.props.zWrite;
          }
          if (changed['style.zTest']) {
            refresh = zTest = _this.props.zTest;
          }
          if (refresh != null) {
            return onVisible();
          }
        };
      })(this);
      last = null;
      onVisible = (function(_this) {
        return function() {
          var i, j, l, len, len1, len2, o, order, ref, ref1, ref2, ref3, results, results1, results2, visible;
          order = zOrder != null ? -zOrder : _this.node.order;
          visible = ((ref = _this.isVisible) != null ? ref : true) && opacity > 0;
          if (visible) {
            if (hasStyle) {
              ref1 = _this.objects;
              results = [];
              for (i = 0, len = ref1.length; i < len; i++) {
                o = ref1[i];
                o.show(opacity < 1, blending, order);
                results.push(o.depth(zWrite, zTest));
              }
              return results;
            } else {
              ref2 = _this.objects;
              results1 = [];
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                o = ref2[j];
                results1.push(o.show(true, blending, order));
              }
              return results1;
            }
          } else {
            ref3 = _this.objects;
            results2 = [];
            for (l = 0, len2 = ref3.length; l < len2; l++) {
              o = ref3[l];
              results2.push(o.hide());
            }
            return results2;
          }
        };
      })(this);
      this._listen(this.node, 'change:style', onChange);
      this._listen(this.node, 'reindex', onVisible);
      this._listen(this, 'visible.change', onVisible);
      ref = this.objects;
      for (i = 0, len = ref.length; i < len; i++) {
        object = ref[i];
        objectScene.adopt(object);
      }
      return onVisible();
    },
    unmake: function(dispose) {
      var i, j, len, len1, object, objectScene, ref, ref1, results;
      if (dispose == null) {
        dispose = true;
      }
      if (!this.objects) {
        return;
      }
      objectScene = this._inherit('scene');
      ref = this.objects;
      for (i = 0, len = ref.length; i < len; i++) {
        object = ref[i];
        objectScene.unadopt(object);
      }
      if (dispose) {
        ref1 = this.objects;
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          object = ref1[j];
          results.push(object.dispose());
        }
        return results;
      }
    },
    mask: function() {
      var mask, shader;
      if (!(mask = this._inherit('mask'))) {
        return;
      }
      return shader = mask.mask(shader);
    }
  },
  unit: {
    make: function() {
      var bottom, focusDepth, handler, pixelRatio, pixelUnit, renderAspect, renderHeight, renderOdd, renderScale, renderScaleInv, renderWidth, root, top, viewHeight, viewWidth, worldUnit, π;
      π = Math.PI;
      this.unitUniforms = {
        renderScaleInv: renderScaleInv = this._attributes.make(this._types.number(1)),
        renderScale: renderScale = this._attributes.make(this._types.number(1)),
        renderAspect: renderAspect = this._attributes.make(this._types.number(1)),
        renderWidth: renderWidth = this._attributes.make(this._types.number(0)),
        renderHeight: renderHeight = this._attributes.make(this._types.number(0)),
        viewWidth: viewWidth = this._attributes.make(this._types.number(0)),
        viewHeight: viewHeight = this._attributes.make(this._types.number(0)),
        pixelRatio: pixelRatio = this._attributes.make(this._types.number(1)),
        pixelUnit: pixelUnit = this._attributes.make(this._types.number(1)),
        worldUnit: worldUnit = this._attributes.make(this._types.number(1)),
        focusDepth: focusDepth = this._attributes.make(this._types.number(1)),
        renderOdd: renderOdd = this._attributes.make(this._types.vec2())
      };
      top = new THREE.Vector3();
      bottom = new THREE.Vector3();
      handler = (function(_this) {
        return function() {
          var camera, dpr, focus, fov, fovtan, isAbsolute, m, measure, pixel, ref, rscale, scale, size, world;
          if ((size = typeof root !== "undefined" && root !== null ? root.getSize() : void 0) == null) {
            return;
          }
          π = Math.PI;
          scale = _this.props.scale;
          fov = _this.props.fov;
          focus = (ref = _this.props.focus) != null ? ref : _this.inherit('unit').props.focus;
          isAbsolute = scale === null;
          measure = 1;
          if ((camera = typeof root !== "undefined" && root !== null ? root.getCamera() : void 0)) {
            m = camera.projectionMatrix;
            top.set(0, -.5, 1).applyMatrix4(m);
            bottom.set(0, .5, 1).applyMatrix4(m);
            top.sub(bottom);
            measure = top.y;
          }
          dpr = size.renderHeight / size.viewHeight;
          fovtan = fov != null ? measure * Math.tan(fov * π / 360) : 1;
          pixel = isAbsolute ? dpr : size.renderHeight / scale * fovtan;
          rscale = size.renderHeight * measure / 2;
          world = pixel / rscale;
          viewWidth.value = size.viewWidth;
          viewHeight.value = size.viewHeight;
          renderWidth.value = size.renderWidth;
          renderHeight.value = size.renderHeight;
          renderAspect.value = size.aspect;
          renderScale.value = rscale;
          renderScaleInv.value = 1 / rscale;
          pixelRatio.value = dpr;
          pixelUnit.value = pixel;
          worldUnit.value = world;
          focusDepth.value = focus;
          return renderOdd.value.set(size.renderWidth % 2, size.renderHeight % 2).multiplyScalar(.5);
        };
      })(this);
      root = this.is('root') ? this : this._inherit('root');
      this._listen(root, 'root.update', handler);
      return handler();
    },
    unmake: function() {
      return delete this.unitUniforms;
    },
    get: function() {
      var k, ref, u, v;
      u = {};
      ref = this.unitUniforms;
      for (k in ref) {
        v = ref[k];
        u[k] = v.value;
      }
      return u;
    },
    uniforms: function() {
      return this.unitUniforms;
    }
  }
};

module.exports = function(object, traits) {
  var h, i, key, len, method, methods, trait;
  h = {};
  for (i = 0, len = traits.length; i < len; i++) {
    trait = traits[i];
    if (!(methods = helpers[trait])) {
      continue;
    }
    h[trait] = {};
    for (key in methods) {
      method = methods[key];
      h[trait][key] = method.bind(object);
    }
  }
  return h;
};
