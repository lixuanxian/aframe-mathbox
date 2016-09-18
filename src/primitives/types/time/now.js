var Now, Parent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Now = (function(superClass) {
  extend(Now, superClass);

  function Now() {
    return Now.__super__.constructor.apply(this, arguments);
  }

  Now.traits = ['node', 'clock', 'now'];

  Now.prototype.init = function() {
    var now;
    this.now = now = +new Date() / 1000;
    this.skew = 0;
    return this.time = {
      now: now,
      time: 0,
      delta: 0,
      clock: 0,
      step: 0
    };
  };

  Now.prototype.make = function() {
    this.clockParent = this._inherit('clock');
    return this._listen('clock', 'clock.tick', this.tick);
  };

  Now.prototype.unmake = function() {
    return this.clockParent = null;
  };

  Now.prototype.change = function(changed, touched, init) {
    if (changed['date.now']) {
      return this.skew = 0;
    }
  };

  Now.prototype.tick = function(e) {
    var now, pace, parent, ref, ref1, seek, speed;
    ref = this.props, now = ref.now, seek = ref.seek, pace = ref.pace, speed = ref.speed;
    parent = this.clockParent.getTime();
    this.skew += parent.step * pace / speed;
    if (seek != null) {
      this.skew = seek;
    }
    this.time.now = this.time.time = this.time.clock = ((ref1 = this.props.now) != null ? ref1 : this.now) + this.skew;
    this.time.delta = this.time.step = parent.delta;
    return this.trigger(e);
  };

  Now.prototype.getTime = function() {
    return this.time;
  };

  return Now;

})(Parent);

module.exports = Now;
