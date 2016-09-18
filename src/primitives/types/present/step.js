var Step, Track,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Track = require('./track');

Step = (function(superClass) {
  extend(Step, superClass);

  function Step() {
    return Step.__super__.constructor.apply(this, arguments);
  }

  Step.traits = ['node', 'track', 'step', 'trigger', 'bind'];

  Step.prototype.make = function() {
    var clock, j, ref, ref1, results;
    Step.__super__.make.apply(this, arguments);
    clock = this._inherit('clock');
    if (this.actualIndex == null) {
      this.actualIndex = null;
    }
    this.animateIndex = this._animator.make(this._types.number(0), {
      clock: clock,
      realtime: this.props.realtime,
      step: (function(_this) {
        return function(value) {
          return _this.actualIndex = value;
        };
      })(this)
    });
    if (this.lastIndex == null) {
      this.lastIndex = null;
    }
    this.animateStep = this._animator.make(this._types.number(0), {
      clock: clock,
      realtime: this.props.realtime,
      step: (function(_this) {
        return function(value) {
          _this.playhead = value;
          return _this.update();
        };
      })(this)
    });
    this.stops = (ref = this.props.stops) != null ? ref : (function() {
      results = [];
      for (var j = 0, ref1 = this.script.length; 0 <= ref1 ? j < ref1 : j > ref1; 0 <= ref1 ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this);
    this._listen('slide', 'slide.reset', (function(_this) {
      return function(e) {
        return _this.lastIndex = null;
      };
    })(this));
    return this._listen('slide', 'slide.step', (function(_this) {
      return function(e) {
        var delay, duration, factor, free, from, i, k, last, len, pace, playback, ref2, ref3, ref4, rewind, skip, skips, speed, step, stop, to, trigger;
        ref2 = _this.props, delay = ref2.delay, duration = ref2.duration, pace = ref2.pace, speed = ref2.speed, playback = ref2.playback, rewind = ref2.rewind, skip = ref2.skip, trigger = ref2.trigger;
        i = Math.max(0, Math.min(_this.stops.length - 1, e.index - trigger));
        from = _this.playhead;
        to = _this.stops[i];
        if ((_this.lastIndex == null) && trigger) {
          _this.lastIndex = i;
          _this.animateStep.set(to);
          _this.animateIndex.set(i);
          return;
        }
        last = (ref3 = (ref4 = _this.actualIndex) != null ? ref4 : _this.lastIndex) != null ? ref3 : 0;
        step = i - last;
        skips = _this.stops.slice(Math.min(last, i), Math.max(last, i));
        free = 0;
        last = skips.shift();
        for (k = 0, len = skips.length; k < len; k++) {
          stop = skips[k];
          if (last === stop) {
            free++;
          }
          last = stop;
        }
        _this.lastIndex = i;
        factor = speed * (e.step >= 0 ? 1 : rewind);
        factor *= skip ? Math.max(1, Math.abs(step) - free) : 1;
        duration += Math.abs(to - from) * pace / factor;
        if (from !== to) {
          _this.animateIndex.immediate(i, {
            delay: delay,
            duration: duration,
            ease: playback
          });
          return _this.animateStep.immediate(to, {
            delay: delay,
            duration: duration,
            ease: playback
          });
        }
      };
    })(this));
  };

  Step.prototype.made = function() {
    return this.update();
  };

  Step.prototype.unmake = function() {
    this.animateIndex.dispose();
    this.animateStep.dispose();
    this.animateIndex = this.animateStep = null;
    return Step.__super__.unmake.apply(this, arguments);
  };

  Step.prototype.change = function(changed, touched, init) {
    if (changed['step.stops'] || changed['step.realtime']) {
      return this.rebuild();
    }
    return Step.__super__.change.call(this, changed, touched, init);
  };

  return Step;

})(Track);

module.exports = Step;
