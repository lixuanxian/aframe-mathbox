var Ease, Primitive, Track, deepCopy,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Ease = require('../../../util').Ease;

deepCopy = function(x) {
  var k, out, v;
  out = {};
  for (k in x) {
    v = x[k];
    if (v instanceof Array) {
      out[k] = v.slice();
    } else if ((v != null) && typeof v === 'object') {
      out[k] = deepCopy(v);
    } else {
      out[k] = v;
    }
  }
  return out;
};

Track = (function(superClass) {
  extend(Track, superClass);

  function Track() {
    return Track.__super__.constructor.apply(this, arguments);
  }

  Track.traits = ['node', 'track', 'seek', 'bind'];

  Track.prototype.init = function() {
    this.handlers = {};
    this.script = null;
    this.values = null;
    this.playhead = 0;
    this.velocity = null;
    this.section = null;
    return this.expr = null;
  };

  Track.prototype.make = function() {
    var node, ref, script;
    this._helpers.bind.make([
      {
        to: 'track.target',
        trait: 'node',
        callback: null
      }
    ]);
    script = this.props.script;
    node = this.bind.target.node;
    this.targetNode = node;
    return ref = this._process(node, script), this.script = ref[0], this.values = ref[1], this.start = ref[2], this.end = ref[3], ref;
  };

  Track.prototype.unmake = function() {
    this.unbindExpr();
    this._helpers.bind.unmake();
    this.script = this.values = this.start = this.end = this.section = this.expr = null;
    return this.playhead = 0;
  };

  Track.prototype.bindExpr = function(expr) {
    var clock;
    this.unbindExpr();
    this.expr = expr;
    this.targetNode.bind(expr, true);
    clock = this.targetNode.clock;
    return this._attributes.bind(this.measure = (function() {
      var playhead;
      playhead = null;
      return (function(_this) {
        return function() {
          var step;
          step = clock.getTime().step;
          if (playhead != null) {
            _this.velocity = (_this.playhead - playhead) / step;
          }
          return playhead = _this.playhead;
        };
      })(this);
    })());
  };

  Track.prototype.unbindExpr = function() {
    if (this.expr != null) {
      this.targetNode.unbind(this.expr, true);
    }
    if (this.measure != null) {
      this._attributes.unbind(this.measure);
    }
    return this.expr = this.measure = null;
  };

  Track.prototype._process = function(object, script) {
    var end, i, j, k, key, l, last, len, len1, message, props, ref, ref1, ref2, result, s, start, step, v, values;
    if (script instanceof Array) {
      s = {};
      for (i = j = 0, len = script.length; j < len; i = ++j) {
        step = script[i];
        s[i] = step;
      }
      script = s;
    }
    s = [];
    for (key in script) {
      step = script[key];
      if (step == null) {
        step = [];
      }
      if (step instanceof Array) {
        step = {
          key: +key,
          props: step[0] != null ? deepCopy(step[0]) : {},
          expr: step[1] != null ? deepCopy(step[1]) : {}
        };
      } else {
        if ((step.key == null) && !step.props && !step.expr) {
          step = {
            props: deepCopy(step)
          };
        } else {
          step = deepCopy(step);
        }
        step.key = step.key != null ? +step.key : +key;
        if (step.props == null) {
          step.props = {};
        }
        if (step.expr == null) {
          step.expr = {};
        }
      }
      s.push(step);
    }
    script = s;
    if (!script.length) {
      return [[], {}, 0, 0];
    }
    script.sort(function(a, b) {
      return a.key - b.key;
    });
    start = script[0].key;
    end = script[script.length - 1].key;
    for (key in script) {
      step = script[key];
      if (typeof last !== "undefined" && last !== null) {
        last.next = step;
      }
      last = step;
    }
    last.next = last;
    script = s;
    props = {};
    values = {};
    for (key in script) {
      step = script[key];
      ref = step.props;
      for (k in ref) {
        v = ref[k];
        props[k] = true;
      }
    }
    for (key in script) {
      step = script[key];
      ref1 = step.expr;
      for (k in ref1) {
        v = ref1[k];
        props[k] = true;
      }
    }
    for (k in props) {
      props[k] = object.get(k);
    }
    try {
      for (k in props) {
        values[k] = [object.attribute(k).T.make(), object.attribute(k).T.make(), object.attribute(k).T.make()];
      }
    } catch (_error) {
      console.warn(this.node.toMarkup());
      message = (this.node.toString()) + " - Target " + object + " has no `" + k + "` property";
      throw new Error(message);
    }
    result = [];
    for (l = 0, len1 = script.length; l < len1; l++) {
      step = script[l];
      for (k in props) {
        v = props[k];
        v = object.validate(k, (ref2 = step.props[k]) != null ? ref2 : v);
        props[k] = step.props[k] = v;
        if ((step.expr[k] != null) && typeof step.expr[k] !== 'function') {
          console.warn(this.node.toMarkup());
          message = (this.node.toString()) + " - Expression `" + step.expr[k] + "` on property `" + k + "` is not a function";
          throw new Error(message);
        }
      }
      result.push(step);
    }
    return [result, values, start, end];
  };

  Track.prototype.update = function() {
    var clock, ease, easeMethod, end, expr, find, from, getLerpFactor, getPlayhead, k, live, node, playhead, ref, script, section, seek, start, to;
    playhead = this.playhead, script = this.script;
    ref = this.props, ease = ref.ease, seek = ref.seek;
    node = this.targetNode;
    if (seek != null) {
      playhead = seek;
    }
    if (script.length) {
      find = function() {
        var i, j, last, len, step;
        last = script[0];
        for (i = j = 0, len = script.length; j < len; i = ++j) {
          step = script[i];
          if (step.key > playhead) {
            break;
          }
          last = step;
        }
        return last;
      };
      section = this.section;
      if (!section || playhead < section.key || playhead > section.next.key) {
        section = find(script, playhead);
      }
      if (section === this.section) {
        return;
      }
      this.section = section;
      from = section;
      to = section.next;
      start = from.key;
      end = to.key;
      easeMethod = (function() {
        switch (ease) {
          case 'linear':
          case 0:
            return Ease.clamp;
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
      clock = node.clock;
      getPlayhead = (function(_this) {
        return function(time) {
          var now;
          if (_this.velocity == null) {
            return _this.playhead;
          }
          now = clock.getTime();
          return _this.playhead + _this.velocity * (time - now.time);
        };
      })(this);
      getLerpFactor = (function() {
        var scale;
        scale = 1 / Math.max(0.0001, end - start);
        return function(time) {
          return easeMethod((getPlayhead(time) - start) * scale, 0, 1);
        };
      })();
      live = (function(_this) {
        return function(key) {
          var animator, attr, fromE, fromP, invalid, toE, toP, values;
          fromE = from.expr[key];
          toE = to.expr[key];
          fromP = from.props[key];
          toP = to.props[key];
          invalid = function() {
            console.warn(node.toMarkup());
            throw new Error((this.node.toString()) + " - Invalid expression result on track `" + key + "`");
          };
          attr = node.attribute(key);
          values = _this.values[key];
          animator = _this._animator;
          if (fromE && toE) {
            return (function(values, from, to) {
              return function(time, delta) {
                var _from, _to;
                values[0] = _from = attr.T.validate(fromE(time, delta), values[0], invalid);
                values[1] = _to = attr.T.validate(toE(time, delta), values[1], invalid);
                return values[2] = animator.lerp(attr.T, _from, _to, getLerpFactor(time), values[2]);
              };
            })(values, from, to);
          } else if (fromE) {
            return (function(values, from, to) {
              return function(time, delta) {
                var _from;
                values[0] = _from = attr.T.validate(fromE(time, delta), values[0], invalid);
                return values[1] = animator.lerp(attr.T, _from, toP, getLerpFactor(time), values[1]);
              };
            })(values, from, to);
          } else if (toE) {
            return (function(values, from, to) {
              return function(time, delta) {
                var _to;
                values[0] = _to = attr.T.validate(toE(time, delta), values[0], invalid);
                return values[1] = animator.lerp(attr.T, fromP, _to, getLerpFactor(time), values[1]);
              };
            })(values, from, to);
          } else {
            return (function(values, from, to) {
              return function(time, delta) {
                return values[0] = animator.lerp(attr.T, fromP, toP, getLerpFactor(time), values[0]);
              };
            })(values, from, to);
          }
        };
      })(this);
      expr = {};
      for (k in from.expr) {
        if (expr[k] == null) {
          expr[k] = live(k);
        }
      }
      for (k in to.expr) {
        if (expr[k] == null) {
          expr[k] = live(k);
        }
      }
      for (k in from.props) {
        if (expr[k] == null) {
          expr[k] = live(k);
        }
      }
      for (k in to.props) {
        if (expr[k] == null) {
          expr[k] = live(k);
        }
      }
      return this.bindExpr(expr);
    }
  };

  Track.prototype.change = function(changed, touched, init) {
    if (changed['track.target'] || changed['track.script'] || changed['track.mode']) {
      return this.rebuild();
    }
    if (changed['seek.seek'] || init) {
      return this.update();
    }
  };

  return Track;

})(Primitive);

module.exports = Track;
