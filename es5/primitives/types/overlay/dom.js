var DOM, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

DOM = (function(superClass) {
  extend(DOM, superClass);

  function DOM() {
    return DOM.__super__.constructor.apply(this, arguments);
  }

  DOM.traits = ['node', 'bind', 'object', 'visible', 'overlay', 'dom', 'attach', 'position'];

  DOM.prototype.init = function() {
    this.emitter = this.root = null;
    return this.active = {};
  };

  DOM.prototype.make = function() {
    var depth, height, htmlDims, indexer, items, pointDims, position, projection, width;
    DOM.__super__.make.apply(this, arguments);
    this._helpers.bind.make([
      {
        to: 'dom.html',
        trait: 'html'
      }, {
        to: 'dom.points',
        trait: 'source'
      }
    ]);
    if (!((this.bind.points != null) && (this.bind.html != null))) {
      return;
    }
    this.root = this._inherit('root');
    this._listen('root', 'root.update', this.update);
    this._listen('root', 'root.post', this.post);
    pointDims = this.bind.points.getDimensions();
    htmlDims = this.bind.html.getDimensions();
    items = Math.min(pointDims.items, htmlDims.items);
    width = Math.min(pointDims.width, htmlDims.width);
    height = Math.min(pointDims.height, htmlDims.height);
    depth = Math.min(pointDims.depth, htmlDims.depth);
    position = this.bind.points.sourceShader(this._shaders.shader());
    position = this._helpers.position.pipeline(position);
    projection = this._shaders.shader({
      globals: ['projectionMatrix']
    });
    projection.pipe('project.readback');
    position.pipe(projection);
    indexer = this._shaders.shader();
    this.readback = this._renderables.make('readback', {
      map: position,
      indexer: indexer,
      items: items,
      width: width,
      height: height,
      depth: depth,
      channels: 4,
      stpq: true
    });
    this.dom = this._overlays.make('dom');
    this.dom.hint(items * width * height * depth * 2);
    this.readback.setCallback(this.emitter = this.callback(this.bind.html.nodes()));
    return this._helpers.visible.make();
  };

  DOM.prototype.unmake = function() {
    if (this.readback != null) {
      this.readback.dispose();
      this.dom.dispose();
      this.readback = this.dom = null;
      this.root = null;
      this.emitter = null;
      this.active = {};
    }
    this._helpers.bind.unmake();
    return this._helpers.visible.unmake();
  };

  DOM.prototype.update = function() {
    var ref;
    if (this.readback == null) {
      return;
    }
    if (this.props.visible) {
      this.readback.update((ref = this.root) != null ? ref.getCamera() : void 0);
      this.readback.post();
      return this.readback.iterate();
    }
  };

  DOM.prototype.post = function() {
    if (this.readback == null) {
      return;
    }
    return this.dom.render(this.isVisible ? this.emitter.nodes() : []);
  };

  DOM.prototype.callback = function(data) {
    var attr, className, color, colorString, depth, el, f, height, nodes, offset, opacity, outline, pointer, size, snap, strideI, strideJ, strideK, styles, uniforms, width, zIndex, zoom;
    uniforms = this._inherit('unit').getUnitUniforms();
    width = uniforms.viewWidth;
    height = uniforms.viewHeight;
    attr = this.node.attributes['dom.attributes'];
    size = this.node.attributes['dom.size'];
    zoom = this.node.attributes['dom.zoom'];
    color = this.node.attributes['dom.color'];
    outline = this.node.attributes['dom.outline'];
    pointer = this.node.attributes['dom.pointerEvents'];
    opacity = this.node.attributes['overlay.opacity'];
    zIndex = this.node.attributes['overlay.zIndex'];
    offset = this.node.attributes['attach.offset'];
    depth = this.node.attributes['attach.depth'];
    snap = this.node.attributes['attach.snap'];
    el = this.dom.el;
    nodes = [];
    styles = null;
    className = null;
    strideI = strideJ = strideK = 0;
    colorString = '';
    f = function(x, y, z, w, i, j, k, l) {
      var a, alpha, children, clip, flatZ, index, iw, ox, oy, props, ref, s, scale, v, xx, yy;
      index = l + strideI * i + strideJ * j + strideK * k;
      children = data[index];
      clip = w < 0;
      iw = 1 / w;
      flatZ = 1 + (iw - 1) * depth.value;
      scale = clip ? 0 : flatZ;
      ox = +offset.value.x * scale;
      oy = +offset.value.y * scale;
      xx = (x + 1) * width.value * .5 + ox;
      yy = (y - 1) * height.value * .5 + oy;
      xx /= zoom.value;
      yy /= zoom.value;
      if (snap.value) {
        xx = Math.round(xx);
        yy = Math.round(yy);
      }
      alpha = Math.min(.999, clip ? 0 : opacity.value);
      props = {
        className: className,
        style: {
          transform: "translate3d(" + xx + "px, " + (-yy) + "px, " + (1 - w) + "px) translate(-50%, -50%) scale(" + scale + "," + scale + ")",
          opacity: alpha
        }
      };
      for (k in styles) {
        v = styles[k];
        props.style[k] = v;
      }
      a = attr.value;
      if (a != null) {
        s = a.style;
        for (k in a) {
          v = a[k];
          if (k !== 'style' && k !== 'className') {
            props[k] = v;
          }
        }
        if (s != null) {
          for (k in s) {
            v = s[k];
            props.style[k] = v;
          }
        }
      }
      props.className += ' ' + ((ref = a != null ? a.className : void 0) != null ? ref : 'mathbox-label');
      return nodes.push(el('div', props, children));
    };
    f.reset = (function(_this) {
      return function() {
        var c, m, ref;
        nodes = [];
        ref = [_this.strideI, _this.strideJ, _this.strideK], strideI = ref[0], strideJ = ref[1], strideK = ref[2];
        c = color.value;
        m = function(x) {
          return Math.floor(x * 255);
        };
        colorString = c ? "rgb(" + [m(c.x), m(c.y), m(c.z)] + ")" : '';
        className = "mathbox-outline-" + (Math.round(outline.value));
        styles = {};
        if (c) {
          styles.color = colorString;
        }
        styles.fontSize = size.value + "px";
        if (zoom.value !== 1) {
          styles.zoom = zoom.value;
        }
        if (zIndex.value > 0) {
          styles.zIndex = zIndex.value;
        }
        if (pointer.value) {
          return styles.pointerEvents = 'auto';
        }
      };
    })(this);
    f.nodes = function() {
      return nodes;
    };
    return f;
  };

  DOM.prototype.resize = function() {
    var depth, height, htmlDims, items, pointDims, sI, sJ, sK, width;
    if (this.readback == null) {
      return;
    }
    pointDims = this.bind.points.getActiveDimensions();
    htmlDims = this.bind.html.getActiveDimensions();
    items = Math.min(pointDims.items, htmlDims.items);
    width = Math.min(pointDims.width, htmlDims.width);
    height = Math.min(pointDims.height, htmlDims.height);
    depth = Math.min(pointDims.depth, htmlDims.depth);
    this.readback.setActive(items, width, height, depth);
    this.strideI = sI = htmlDims.items;
    this.strideJ = sJ = sI * htmlDims.width;
    return this.strideK = sK = sJ * htmlDims.height;
  };

  DOM.prototype.change = function(changed, touched, init) {
    if (changed['dom.html'] || changed['dom.points']) {
      return this.rebuild();
    }
  };

  return DOM;

})(Primitive);

module.exports = DOM;
