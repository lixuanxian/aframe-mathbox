var Parent, Transition, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Util = require('../../../util');

Transition = (function(superClass) {
  extend(Transition, superClass);

  function Transition() {
    return Transition.__super__.constructor.apply(this, arguments);
  }

  Transition.traits = ['node', 'transition', 'transform', 'mask', 'visible', 'active'];

  Transition.prototype.init = function() {
    this.animate = null;
    this.uniforms = null;
    this.state = {
      isVisible: true,
      isActive: true,
      enter: 1,
      exit: 1
    };
    this.latched = null;
    return this.locked = null;
  };

  Transition.prototype.make = function() {
    var activeParent, slideParent, visibleParent;
    this.uniforms = {
      transitionFrom: this._attributes.make(this._types.vec4()),
      transitionTo: this._attributes.make(this._types.vec4()),
      transitionActive: this._attributes.make(this._types.bool()),
      transitionScale: this._attributes.make(this._types.vec4()),
      transitionBias: this._attributes.make(this._types.vec4()),
      transitionEnter: this._attributes.make(this._types.number()),
      transitionExit: this._attributes.make(this._types.number()),
      transitionSkew: this._attributes.make(this._types.number())
    };
    slideParent = this._inherit('slide');
    visibleParent = this._inherit('visible');
    activeParent = this._inherit('active');
    this._listen(slideParent, 'transition.latch', (function(_this) {
      return function(e) {
        return _this.latch(e.step);
      };
    })(this));
    this._listen(slideParent, 'transition.release', (function(_this) {
      return function() {
        return _this.release();
      };
    })(this));
    this._listen(visibleParent, 'visible.change', (function(_this) {
      return function() {
        return _this.update((_this.state.isVisible = visibleParent.isVisible));
      };
    })(this));
    this._listen(activeParent, 'active.change', (function(_this) {
      return function() {
        return _this.update((_this.state.isActive = activeParent.isActive));
      };
    })(this));
    this.animate = this._animator.make(this._types.vec2(1, 1), {
      step: (function(_this) {
        return function(value) {
          _this.state.enter = value.x;
          _this.state.exit = value.y;
          return _this.update();
        };
      })(this),
      complete: (function(_this) {
        return function(done) {
          return _this.complete(done);
        };
      })(this)
    });
    return this.move = (this.props.from != null) || (this.props.to != null);
  };

  Transition.prototype.unmake = function() {
    return this.animate.dispose();
  };

  Transition.prototype.latch = function(step) {
    var enter, exit, forward, latched, ref, visible;
    this.locked = null;
    this.latched = latched = {
      isVisible: this.state.isVisible,
      isActive: this.state.isActive,
      step: step
    };
    visible = this.isVisible;
    if (!visible) {
      forward = latched.step >= 0;
      ref = forward ? [0, 1] : [1, 0], enter = ref[0], exit = ref[1];
      return this.animate.set(enter, exit);
    }
  };

  Transition.prototype.release = function() {
    var delay, delayEnter, delayExit, duration, durationEnter, durationExit, enter, exit, forward, latched, ref, ref1, ref2, state, visible;
    latched = this.latched;
    state = this.state;
    this.latched = null;
    if (latched.isVisible !== state.isVisible) {
      forward = latched.step >= 0;
      visible = state.isVisible;
      ref = visible ? [1, 1] : forward ? [1, 0] : [0, 1], enter = ref[0], exit = ref[1];
      ref1 = this.props, duration = ref1.duration, durationEnter = ref1.durationEnter, durationExit = ref1.durationExit;
      if (durationEnter == null) {
        durationEnter = duration;
      }
      if (durationExit == null) {
        durationExit = duration;
      }
      duration = visible * durationEnter + !visible * durationExit;
      ref2 = this.props, delay = ref2.delay, delayEnter = ref2.delayEnter, delayExit = ref2.delayExit;
      if (delayEnter == null) {
        delayEnter = delay;
      }
      if (delayExit == null) {
        delayExit = delay;
      }
      delay = visible * delayEnter + !visible * delayExit;
      this.animate.immediate({
        x: enter,
        y: exit
      }, {
        duration: duration,
        delay: delay,
        ease: 'linear'
      });
      this.locked = {
        isVisible: true,
        isActive: latched.isActive || state.isActive
      };
    }
    return this.update();
  };

  Transition.prototype.complete = function(done) {
    if (!done) {
      return;
    }
    this.locked = null;
    return this.update();
  };

  Transition.prototype.update = function() {
    var active, enter, exit, level, partial, ref, ref1, visible;
    if (this.latched != null) {
      return;
    }
    ref = this.props, enter = ref.enter, exit = ref.exit;
    if (enter == null) {
      enter = this.state.enter;
    }
    if (exit == null) {
      exit = this.state.exit;
    }
    level = enter * exit;
    visible = level > 0;
    partial = level < 1;
    this.uniforms.transitionEnter.value = enter;
    this.uniforms.transitionExit.value = exit;
    this.uniforms.transitionActive.value = partial;
    if (visible) {
      visible = !!this.state.isVisible;
    }
    if (this.locked != null) {
      visible = this.locked.isVisible;
    }
    if (this.isVisible !== visible) {
      this.isVisible = visible;
      this.trigger({
        type: 'visible.change'
      });
    }
    active = !!(this.state.isActive || ((ref1 = this.locked) != null ? ref1.isActive : void 0));
    if (this.isActive !== active) {
      this.isActive = active;
      return this.trigger({
        type: 'active.change'
      });
    }
  };

  Transition.prototype.change = function(changed, touched, init) {
    var flipW, flipX, flipY, flipZ, stagger, staggerW, staggerX, staggerY, staggerZ;
    if (changed['transition.enter'] || changed['transition.exit'] || init) {
      this.update();
    }
    if (changed['transition.stagger'] || init) {
      stagger = this.props.stagger;
      flipX = stagger.x < 0;
      flipY = stagger.y < 0;
      flipZ = stagger.z < 0;
      flipW = stagger.w < 0;
      staggerX = Math.abs(stagger.x);
      staggerY = Math.abs(stagger.y);
      staggerZ = Math.abs(stagger.z);
      staggerW = Math.abs(stagger.w);
      this.uniforms.transitionSkew.value = staggerX + staggerY + staggerZ + staggerW;
      this.uniforms.transitionScale.value.set((1 - flipX * 2) * staggerX, (1 - flipY * 2) * staggerY, (1 - flipZ * 2) * staggerZ, (1 - flipW * 2) * staggerW);
      return this.uniforms.transitionBias.value.set(flipX * staggerX, flipY * staggerY, flipZ * staggerZ, flipW * staggerW);
    }
  };

  return Transition;

})(Parent);

module.exports = Transition;
