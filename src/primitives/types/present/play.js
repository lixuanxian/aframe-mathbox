var Play, Track,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Track = require('./track');

Play = (function(superClass) {
  extend(Play, superClass);

  function Play() {
    return Play.__super__.constructor.apply(this, arguments);
  }

  Play.traits = ['node', 'track', 'trigger', 'play', 'bind'];

  Play.prototype.init = function() {
    Play.__super__.init.apply(this, arguments);
    this.skew = null;
    return this.start = null;
  };

  Play.prototype.reset = function(go) {
    if (go == null) {
      go = true;
    }
    this.skew = go ? 0 : null;
    return this.start = null;
  };

  Play.prototype.make = function() {
    var parentClock;
    Play.__super__.make.apply(this, arguments);
    this._listen('slide', 'slide.step', (function(_this) {
      return function(e) {
        var trigger;
        trigger = _this.props.trigger;
        if ((trigger != null) && e.index === trigger) {
          return _this.reset();
        }
        if ((trigger != null) && e.index === 0) {
          return _this.reset(false);
        }
      };
    })(this));
    if (!this.props.trigger || (this._inherit('slide') == null)) {
      this.reset();
    }
    parentClock = this._inherit('clock');
    return this._listen(parentClock, 'clock.tick', (function(_this) {
      return function() {
        var delay, delta, from, now, offset, pace, ratio, realtime, ref, speed, time, to;
        ref = _this.props, from = ref.from, to = ref.to, speed = ref.speed, pace = ref.pace, delay = ref.delay, realtime = ref.realtime;
        time = parentClock.getTime();
        if (_this.skew != null) {
          now = realtime ? time.time : time.clock;
          delta = realtime ? time.delta : time.step;
          ratio = speed / pace;
          if (_this.start == null) {
            _this.start = now;
          }
          _this.skew += delta * (ratio - 1);
          offset = Math.max(0, now - _this.start + _this.skew - delay * ratio);
          if (_this.props.loop) {
            offset = offset % (to - from);
          }
          _this.playhead = Math.min(to, from + offset);
        } else {
          _this.playhead = 0;
        }
        return _this.update();
      };
    })(this));
  };

  Play.prototype.update = function() {
    return Play.__super__.update.apply(this, arguments);
  };

  Play.prototype.change = function(changed, touched, init) {
    if (changed['trigger.trigger'] || changed['play.realtime']) {
      return this.rebuild();
    }
    return Play.__super__.change.call(this, changed, touched, init);
  };

  return Play;

})(Track);

module.exports = Play;
