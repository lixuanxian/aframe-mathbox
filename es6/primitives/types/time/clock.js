var Clock, Parent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Clock = (function(superClass) {
  extend(Clock, superClass);

  function Clock() {
    return Clock.__super__.constructor.apply(this, arguments);
  }

  Clock.traits = ['node', 'clock', 'seek', 'play'];

  Clock.prototype.init = function() {
    this.skew = 0;
    this.last = 0;
    return this.time = {
      now: +new Date() / 1000,
      time: 0,
      delta: 0,
      clock: 0,
      step: 0
    };
  };

  Clock.prototype.make = function() {
    return this._listen('clock', 'clock.tick', this.tick);
  };

  Clock.prototype.reset = function() {
    return this.skew = 0;
  };

  Clock.prototype.tick = function(e) {
    var clock, delay, delta, from, pace, parent, ratio, realtime, ref, seek, speed, time, to;
    ref = this.props, from = ref.from, to = ref.to, speed = ref.speed, seek = ref.seek, pace = ref.pace, delay = ref.delay, realtime = ref.realtime;
    parent = this._inherit('clock').getTime();
    time = realtime ? parent.time : parent.clock;
    delta = realtime ? parent.delta : parent.step;
    ratio = speed / pace;
    this.skew += delta * (ratio - 1);
    if (this.last > time) {
      this.skew = 0;
    }
    this.time.now = parent.now + this.skew;
    this.time.time = parent.time;
    this.time.delta = parent.delta;
    clock = seek != null ? seek : parent.clock + this.skew;
    this.time.clock = Math.min(to, from + Math.max(0, clock - delay * ratio));
    this.time.step = delta * ratio;
    this.last = time;
    return this.trigger(e);
  };

  Clock.prototype.getTime = function() {
    return this.time;
  };

  return Clock;

})(Parent);

module.exports = Clock;
