var Parent, Slide,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Slide = (function(superClass) {
  extend(Slide, superClass);

  function Slide() {
    return Slide.__super__.constructor.apply(this, arguments);
  }

  Slide.traits = ['node', 'slide', 'visible', 'active'];

  Slide.prototype.make = function() {
    this._helpers.visible.make();
    this._helpers.active.make();
    if (!this._inherit('present')) {
      throw new Error((this.node.toString()) + " must be placed inside <present></present>");
    }
    return this._inherit('present').adopt(this);
  };

  Slide.prototype.unmake = function() {
    this._helpers.visible.unmake();
    this._helpers.active.unmake();
    return this._inherit('present')(unadopt(this));
  };

  Slide.prototype.change = function(changed, touched, init) {
    if (changed['slide.early'] || changed['slide.late'] || changed['slide.steps'] || changed['slide.from'] || changed['slide.to']) {
      return this.rebuild();
    }
  };

  Slide.prototype.slideLatch = function(enabled, step) {
    this.trigger({
      'type': 'transition.latch',
      'step': step
    });
    if (enabled != null) {
      return this._instant(enabled);
    }
  };

  Slide.prototype.slideStep = function(index, step) {
    return this.trigger({
      'type': 'slide.step',
      'index': index,
      'step': step
    });
  };

  Slide.prototype.slideRelease = function() {
    return this.trigger({
      'type': 'transition.release'
    });
  };

  Slide.prototype.slideReset = function() {
    this._instant(false);
    return this.trigger({
      'type': 'slide.reset'
    });
  };

  Slide.prototype._instant = function(enabled) {
    this.setVisible(enabled);
    return this.setActive(enabled);
  };

  return Slide;

})(Parent);

module.exports = Slide;
