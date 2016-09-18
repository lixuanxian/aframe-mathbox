var Animation, Animator, Ease;

Ease = require('../util').Ease;

Animator = (function() {
  function Animator(context) {
    this.context = context;
    this.anims = [];
  }

  Animator.prototype.make = function(type, options) {
    var anim;
    anim = new Animation(this, this.context.time, type, options);
    this.anims.push(anim);
    return anim;
  };

  Animator.prototype.unmake = function(anim) {
    var a;
    return this.anims = (function() {
      var i, len, ref, results;
      ref = this.anims;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        if (a !== anim) {
          results.push(a);
        }
      }
      return results;
    }).call(this);
  };

  Animator.prototype.update = function() {
    var anim, time;
    time = this.context.time;
    return this.anims = (function() {
      var i, len, ref, results;
      ref = this.anims;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        anim = ref[i];
        if (anim.update(time) !== false) {
          results.push(anim);
        }
      }
      return results;
    }).call(this);
  };

  Animator.prototype.lerp = function(type, from, to, f, value) {
    var emitter, fromE, lerp, toE;
    if (value == null) {
      value = type.make();
    }
    if (type.lerp) {
      value = type.lerp(from, to, value, f);
    } else if (type.emitter) {
      fromE = from.emitterFrom;
      toE = to.emitterTo;
      if ((fromE != null) && (toE != null) && fromE === toE) {
        fromE.lerp(f);
        return fromE;
      } else {
        emitter = type.emitter(from, to);
        from.emitterFrom = emitter;
        to.emitterTo = emitter;
      }
    } else if (type.op) {
      lerp = function(a, b) {
        if (a === +a && b === +b) {
          return a + (b - a) * f;
        } else {
          if (f > .5) {
            return b;
          } else {
            return a;
          }
        }
      };
      value = type.op(from, to, value, lerp);
    } else {
      value = f > .5 ? to : from;
    }
    return value;
  };

  return Animator;

})();

Animation = (function() {
  function Animation(animator, time1, type1, options1) {
    this.animator = animator;
    this.time = time1;
    this.type = type1;
    this.options = options1;
    this.value = this.type.make();
    this.target = this.type.make();
    this.queue = [];
  }

  Animation.prototype.dispose = function() {
    return this.animator.unmake(this);
  };

  Animation.prototype.set = function() {
    var invalid, target, value;
    target = this.target;
    value = arguments.length > 1 ? [].slice.call(arguments) : arguments[0];
    invalid = false;
    value = this.type.validate(value, target, function() {
      return invalid = true;
    });
    if (!invalid) {
      target = value;
    }
    this.cancel();
    this.target = this.value;
    this.value = target;
    return this.notify();
  };

  Animation.prototype.getTime = function() {
    var clock, time;
    clock = this.options.clock;
    time = clock ? clock.getTime() : this.time;
    if (this.options.realtime) {
      return time.time;
    } else {
      return time.clock;
    }
  };

  Animation.prototype.cancel = function(from) {
    var base, cancelled, i, len, queue, stage;
    if (from == null) {
      from = this.getTime();
    }
    queue = this.queue;
    cancelled = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = queue.length; i < len; i++) {
        stage = queue[i];
        if (stage.end >= from) {
          results.push(stage);
        }
      }
      return results;
    })();
    this.queue = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = queue.length; i < len; i++) {
        stage = queue[i];
        if (stage.end < from) {
          results.push(stage);
        }
      }
      return results;
    })();
    for (i = 0, len = cancelled.length; i < len; i++) {
      stage = cancelled[i];
      if (typeof stage.complete === "function") {
        stage.complete(false);
      }
    }
    if (typeof (base = this.options).complete === "function") {
      base.complete(false);
    }
  };

  Animation.prototype.notify = function() {
    var base;
    return typeof (base = this.options).step === "function" ? base.step(this.value) : void 0;
  };

  Animation.prototype.immediate = function(value, options) {
    var complete, delay, duration, ease, end, invalid, start, step, target, time;
    duration = options.duration, delay = options.delay, ease = options.ease, step = options.step, complete = options.complete;
    time = this.getTime();
    start = time + delay;
    end = start + duration;
    invalid = false;
    target = this.type.make();
    value = this.type.validate(value, target, function() {
      invalid = true;
      return null;
    });
    if (value !== void 0) {
      target = value;
    }
    this.cancel(start);
    return this.queue.push({
      from: null,
      to: target,
      start: start,
      end: end,
      ease: ease,
      step: step,
      complete: complete
    });
  };

  Animation.prototype.update = function(time1) {
    var active, base, clock, complete, ease, end, f, from, method, queue, ref, stage, start, step, to, value;
    this.time = time1;
    if (this.queue.length === 0) {
      return true;
    }
    clock = this.getTime();
    value = this.value, queue = this.queue;
    active = false;
    while (!active) {
      ref = stage = queue[0], from = ref.from, to = ref.to, start = ref.start, end = ref.end, step = ref.step, complete = ref.complete, ease = ref.ease;
      if (from == null) {
        from = stage.from = this.type.clone(this.value);
      }
      f = Ease.clamp(((clock - start) / Math.max(0.00001, end - start)) || 0, 0, 1);
      if (f === 0) {
        return;
      }
      method = (function() {
        switch (ease) {
          case 'linear':
          case 0:
            return null;
          case 'cosine':
          case 1:
            return Ease.cosine;
          case 'binary':
          case 2:
            return Ease.binary;
          case 'hold':
          case 3:
            return Ease.hold;
          default:
            return Ease.cosine;
        }
      })();
      if (method != null) {
        f = method(f);
      }
      active = f < 1;
      value = active ? this.animator.lerp(this.type, from, to, f, value) : to;
      if (typeof step === "function") {
        step(value);
      }
      if (!active) {
        if (typeof complete === "function") {
          complete(true);
        }
        if (typeof (base = this.options).complete === "function") {
          base.complete(true);
        }
        queue.shift();
        if (queue.length === 0) {
          break;
        }
      }
    }
    this.value = value;
    return this.notify();
  };

  return Animation;

})();

module.exports = Animator;
