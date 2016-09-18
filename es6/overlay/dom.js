var DOM, Overlay, VDOM,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Overlay = require('./overlay');

VDOM = require('../util').VDOM;

DOM = (function(superClass) {
  extend(DOM, superClass);

  function DOM() {
    return DOM.__super__.constructor.apply(this, arguments);
  }

  DOM.prototype.el = VDOM.element;

  DOM.prototype.hint = VDOM.hint;

  DOM.prototype.apply = VDOM.apply;

  DOM.prototype.recycle = VDOM.recycle;

  DOM.prototype.init = function(options) {
    return this.last = null;
  };

  DOM.prototype.dispose = function() {
    this.unmount();
    return DOM.__super__.dispose.apply(this, arguments);
  };

  DOM.prototype.mount = function() {
    var overlay;
    overlay = document.createElement('div');
    overlay.classList.add('mathbox-overlay');
    this.element.appendChild(overlay);
    return this.overlay = overlay;
  };

  DOM.prototype.unmount = function(overlay) {
    if (this.overlay.parentNode) {
      this.element.removeChild(this.overlay);
    }
    return this.overlay = null;
  };

  DOM.prototype.render = function(el) {
    var last, naked, node, overlay, parent, ref;
    if (!this.overlay) {
      this.mount();
    }
    if ((ref = typeof el) === 'string' || ref === 'number') {
      el = this.el('div', null, el);
    }
    if (el instanceof Array) {
      el = this.el('div', null, el);
    }
    naked = el.type === 'div';
    last = this.last;
    overlay = this.overlay;
    node = naked ? overlay : overlay.childNodes[0];
    parent = naked ? overlay.parentNode : overlay;
    if (!last && node) {
      last = this.el('div');
    }
    this.apply(el, last, node, parent, 0);
    this.last = el;
    if (last != null) {
      this.recycle(last);
    }
  };

  return DOM;

})(Overlay);

module.exports = DOM;
