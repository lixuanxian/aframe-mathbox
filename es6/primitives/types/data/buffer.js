var Buffer, Data, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Data = require('./data');

Util = require('../../../util');

Buffer = (function(superClass) {
  extend(Buffer, superClass);

  function Buffer() {
    return Buffer.__super__.constructor.apply(this, arguments);
  }

  Buffer.traits = ['node', 'buffer', 'active', 'data', 'source', 'index', 'texture'];

  Buffer.prototype.init = function() {
    this.bufferSlack = 0;
    this.bufferFrames = 0;
    this.bufferTime = 0;
    this.bufferDelta = 0;
    this.bufferClock = 0;
    this.bufferStep = 0;
    return Buffer.__super__.init.apply(this, arguments);
  };

  Buffer.prototype.make = function() {
    Buffer.__super__.make.apply(this, arguments);
    return this.clockParent = this._inherit('clock');
  };

  Buffer.prototype.unmake = function() {
    return Buffer.__super__.unmake.apply(this, arguments);
  };

  Buffer.prototype.rawBuffer = function() {
    return this.buffer;
  };

  Buffer.prototype.emitter = function() {
    var channels, items, ref;
    ref = this.props, channels = ref.channels, items = ref.items;
    return Buffer.__super__.emitter.call(this, channels, items);
  };

  Buffer.prototype.change = function(changed, touched, init) {
    var fps;
    if (changed['buffer.fps'] || init) {
      fps = this.props.fps;
      return this.bufferSlack = fps ? .5 / fps : 0;
    }
  };

  Buffer.prototype.syncBuffer = function(callback) {
    var abort, delta, filled, fps, frame, frames, hurry, i, j, limit, live, observe, realtime, ref, ref1, results, slack, speed, step, stop, time;
    if (!this.buffer) {
      return;
    }
    ref = this.props, live = ref.live, fps = ref.fps, hurry = ref.hurry, limit = ref.limit, realtime = ref.realtime, observe = ref.observe;
    filled = this.buffer.getFilled();
    if (!(!filled || live)) {
      return;
    }
    time = this.clockParent.getTime();
    if (fps != null) {
      slack = this.bufferSlack;
      speed = time.step / time.delta;
      delta = realtime ? time.delta : time.step;
      frame = 1 / fps;
      step = realtime && observe ? speed * frame : frame;
      this.bufferSlack = Math.min(limit / fps, slack + delta);
      this.bufferDelta = delta;
      this.bufferStep = step;
      frames = Math.min(hurry, Math.floor(slack * fps));
      if (!filled) {
        frames = Math.max(1, frames);
      }
      stop = false;
      abort = function() {
        return stop = true;
      };
      results = [];
      for (i = j = 0, ref1 = frames; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
        this.bufferTime += delta;
        this.bufferClock += step;
        if (stop) {
          break;
        }
        callback(abort, this.bufferFrames++, i, frames);
        results.push(this.bufferSlack -= frame);
      }
      return results;
    } else {
      this.bufferTime = time.time;
      this.bufferDelta = time.delta;
      this.bufferClock = time.clock;
      this.bufferStep = time.step;
      return callback((function() {}), this.bufferFrames++, 0, 1);
    }
  };

  Buffer.prototype.alignShader = function(dims, shader) {
    var aligned, magFilter, minFilter, mixed, nearest, ref;
    ref = this.props, minFilter = ref.minFilter, magFilter = ref.magFilter, aligned = ref.aligned;
    mixed = (dims.items > 1 && dims.width > 1) || (dims.height > 1 && dims.depth > 1);
    if (aligned || !mixed) {
      return;
    }
    nearest = minFilter === this.node.attributes['texture.minFilter']["enum"].nearest && magFilter === this.node.attributes['texture.magFilter']["enum"].nearest;
    if (!nearest) {
      console.warn((this.node.toString()) + " - Cannot use linear min/magFilter with 3D/4D sampling");
    }
    return shader.pipe('map.xyzw.align');
  };

  return Buffer;

})(Data);

module.exports = Buffer;
