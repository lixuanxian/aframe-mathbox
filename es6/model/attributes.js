/*
 Custom attribute model
 - Organizes attributes by trait in .attributes
 - Provides constant-time .props / .get() access to flat dictionary
 - Provides .get(key) with or without trait namespaces
 - Change attributes with .set(key) or .set(dictionary)
 - Validation is double-buffered and in-place to detect changes and nops
 - Change notifications are coalesced per object and per trait, digested later
 - Values are stored in three.js uniform-style objects so they can be bound as GL uniforms
 - Originally passed (unnormalized) values are preserved and can be fetched via .orig()
 - Attributes can be defined as final/const
 - Attributes can be computed from both public or private expressions with .bind(key, false/true)
 - Expressions are time-dependent, can be time-travelled with .evaluate()
 - This enables continous simulation and data logging despite choppy animation updates
 
  Actual type and trait definitions are injected from Primitives
 */
var Attributes, Data, shallowCopy;

Attributes = (function() {
  function Attributes(definitions, context) {
    this.context = context;
    this.traits = definitions.Traits;
    this.types = definitions.Types;
    this.pending = [];
    this.bound = [];
    this.last = null;
  }

  Attributes.prototype.make = function(type) {
    return {
      "enum": typeof type["enum"] === "function" ? type["enum"]() : void 0,
      type: typeof type.uniform === "function" ? type.uniform() : void 0,
      value: type.make()
    };
  };

  Attributes.prototype.apply = function(object, config) {
    return new Data(object, config, this);
  };

  Attributes.prototype.bind = function(callback) {
    return this.bound.push(callback);
  };

  Attributes.prototype.unbind = function(callback) {
    var cb;
    return this.bound = (function() {
      var j, len, ref, results;
      ref = this.bound;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        cb = ref[j];
        if (cb !== callback) {
          results.push(cb);
        }
      }
      return results;
    }).call(this);
  };

  Attributes.prototype.queue = function(callback, object, key, value) {
    this.lastObject = object;
    this.lastKey = key;
    this.lastValue = value;
    return this.pending.push(callback);
  };

  Attributes.prototype.invoke = function(callback) {
    return callback(this.context.time.clock, this.context.time.step);
  };

  Attributes.prototype.compute = function() {
    var cb, j, len, ref;
    if (this.bound.length) {
      ref = this.bound;
      for (j = 0, len = ref.length; j < len; j++) {
        cb = ref[j];
        this.invoke(cb);
      }
    }
  };

  Attributes.prototype.digest = function() {
    var callback, calls, j, len, ref;
    if (!this.pending.length) {
      return false;
    }
    ref = [this.pending, []], calls = ref[0], this.pending = ref[1];
    for (j = 0, len = calls.length; j < len; j++) {
      callback = calls[j];
      callback();
    }
    return true;
  };

  Attributes.prototype.getTrait = function(name) {
    return this.traits[name];
  };

  Attributes.prototype.getLastTrigger = function() {
    return (this.lastObject.toString()) + " - " + this.lastKey + "=`" + this.lastValue + "`";
  };

  return Attributes;

})();

shallowCopy = function(x) {
  var k, out, v;
  out = {};
  for (k in x) {
    v = x[k];
    out[k] = v;
  }
  return out;
};

Data = (function() {
  function Data(object, config, _attributes) {
    var _bound, _computed, _eval, _expr, _finals, addSpec, bind, change, changed, changes, constant, data, define, digest, dirty, equalors, equals, evaluate, event, expr, finals, flattened, freeform, get, getNS, j, key, len, list, makers, mapTo, name, ns, oldComputed, oldExpr, oldOrig, oldProps, originals, props, ref, ref1, set, shorthand, spec, to, touched, touches, trait, traits, unbind, unique, validate, validators, value, values;
    traits = config.traits, props = config.props, finals = config.finals, freeform = config.freeform;
    data = this;
    if ((object.props != null) && (object.expr != null) && (object.orig != null) && (object.computed != null) && (object.attributes != null)) {
      oldProps = shallowCopy(object.props);
      oldExpr = shallowCopy(object.expr);
      oldOrig = object.orig();
      oldComputed = object.computed();
      if ((ref = object.attributes) != null) {
        ref.dispose();
      }
    }
    flattened = {};
    originals = {};
    mapTo = {};
    to = function(name) {
      var ref1;
      return (ref1 = mapTo[name]) != null ? ref1 : name;
    };
    define = function(name, alias) {
      if (mapTo[alias]) {
        throw new Error((object.toString()) + " - Duplicate property `" + alias + "`");
      }
      return mapTo[alias] = name;
    };
    get = function(key) {
      var ref1, ref2, ref3;
      return (ref1 = (ref2 = data[key]) != null ? ref2.value : void 0) != null ? ref1 : (ref3 = data[to(key)]) != null ? ref3.value : void 0;
    };
    set = function(key, value, ignore, initial) {
      var attr, ref1, short, valid, validated;
      key = to(key);
      if ((attr = data[key]) == null) {
        if (!freeform) {
          throw new Error((object.toString()) + " - Setting unknown property `" + key + "={" + value + "}`");
        }
        attr = data[key] = {
          short: key,
          type: null,
          last: null,
          value: null
        };
        validators[key] = function(v) {
          return v;
        };
      }
      if (!ignore) {
        if (_expr[key]) {
          throw new Error((object.toString()) + " - Can't set bound property `" + key + "={" + value + "}`");
        }
        if (_computed[key]) {
          throw new Error((object.toString()) + " - Can't set computed property `" + key + "={" + value + "}`");
        }
        if (_finals[key]) {
          throw new Error((object.toString()) + " - Can't set final property `" + key + "={" + value + "}`");
        }
      }
      valid = true;
      validated = validate(key, value, attr.last, function() {
        valid = false;
        return null;
      });
      if (valid) {
        ref1 = [validated, attr.value], attr.value = ref1[0], attr.last = ref1[1];
        short = attr.short;
        flattened[short] = validated;
        if (!ignore) {
          originals[short] = value;
        }
        if (!(initial || equals(key, attr.value, attr.last))) {
          change(key, value);
        }
      }
      return valid;
    };
    constant = function(key, value, initial) {
      key = to(key);
      set(key, value, true, initial);
      return _finals[key] = true;
    };
    expr = {};
    _bound = {};
    _eval = {};
    _expr = {};
    _computed = {};
    _finals = {};
    bind = function(key, expression, computed) {
      var list, short;
      if (computed == null) {
        computed = false;
      }
      key = to(key);
      if (typeof expression !== 'function') {
        throw new Error((object.toString()) + " - Expression `" + key + "=>{" + expr + "}` is not a function");
      }
      if (_expr[key]) {
        throw new Error((object.toString()) + " - Property `" + key + "=>{" + expr + "}` is already bound");
      }
      if (_computed[key]) {
        throw new Error((object.toString()) + " - Property `" + key + "` is computed");
      }
      if (_finals[key]) {
        throw new Error((object.toString()) + " - Property `" + key + "` is final");
      }
      list = computed ? _computed : _expr;
      list[key] = expression;
      short = data[key] != null ? data[key].short : key;
      if (!computed) {
        expr[short] = expression;
      }
      _eval[key] = expression;
      expression = expression.bind(object);
      _bound[key] = function(t, d) {
        var clock, ref1;
        if (clock = (ref1 = object.clock) != null ? ref1.getTime() : void 0) {
          t = clock.clock;
          d = clock.step;
        }
        return object.set(key, expression(t, d), true);
      };
      return _attributes.bind(_bound[key]);
    };
    unbind = function(key, computed) {
      var list;
      if (computed == null) {
        computed = false;
      }
      key = to(key);
      list = computed ? _computed : _expr;
      if (!list[key]) {
        return;
      }
      _attributes.unbind(_bound[key]);
      delete _bound[key];
      delete list[key];
      if (data[key] != null) {
        key = data[key].short;
      }
      return delete expr[key];
    };
    evaluate = function(key, time) {
      var ref1;
      key = to(key);
      return (ref1 = typeof _eval[key] === "function" ? _eval[key](time, 0) : void 0) != null ? ref1 : data[key].value;
    };
    object.expr = expr;
    object.props = flattened;
    object.evaluate = function(key, time) {
      var out;
      if (key != null) {
        return evaluate(key, time);
      } else {
        out = {};
        for (key in props) {
          out[key] = evaluate(key, time);
        }
        return out;
      }
    };
    object.get = function(key) {
      if (key != null) {
        return get(key);
      } else {
        return flattened;
      }
    };
    object.set = function(key, value, ignore, initial) {
      var options;
      if (typeof key === 'string') {
        set(key, value, ignore, initial);
      } else {
        initial = ignore;
        ignore = value;
        options = key;
        for (key in options) {
          value = options[key];
          set(key, value, ignore, initial);
        }
      }
    };
    object.bind = function(key, expr, computed) {
      var binds;
      if (typeof key === 'string') {
        bind(key, expr, computed);
      } else {
        computed = expr;
        binds = key;
        for (key in binds) {
          expr = binds[key];
          bind(key, expr, computed);
        }
      }
    };
    object.unbind = function(key, computed) {
      var binds;
      if (typeof key === 'string') {
        unbind(key, computed);
      } else {
        computed = expr;
        binds = key;
        for (key in binds) {
          unbind(key, computed);
        }
      }
    };
    object.attribute = function(key) {
      if (key != null) {
        return data[to(key)];
      } else {
        return data;
      }
    };
    object.orig = function(key) {
      if (key != null) {
        return originals[to(key)];
      } else {
        return shallowCopy(originals);
      }
    };
    object.computed = function(key) {
      if (key != null) {
        return _computed[to(key)];
      } else {
        return shallowCopy(_computed);
      }
    };
    makers = {};
    validators = {};
    equalors = {};
    equals = function(key, value, target) {
      return equalors[key](value, target);
    };
    validate = function(key, value, target, invalid) {
      return validators[key](value, target, invalid);
    };
    object.validate = function(key, value) {
      var make, target;
      key = to(key);
      make = makers[key];
      if (make != null) {
        target = make();
      }
      return target = validate(key, value, target, function() {
        throw new Error((object.toString()) + " - Invalid value `" + key + "={" + value + "}`");
      });
    };
    dirty = false;
    changes = {};
    touches = {};
    changed = {};
    touched = {};
    getNS = function(key) {
      return key.split('.')[0];
    };
    change = function(key, value) {
      var trait;
      if (!dirty) {
        dirty = true;
        _attributes.queue(digest, object, key, value);
      }
      trait = getNS(key);
      changes[key] = true;
      return touches[trait] = true;
    };
    event = {
      type: 'change',
      changed: null,
      touched: null
    };
    digest = function() {
      var k, results, trait;
      event.changed = changes;
      event.touched = touches;
      changes = changed;
      touches = touched;
      changed = event.changed;
      touched = event.touched;
      dirty = false;
      for (k in changes) {
        changes[k] = false;
      }
      for (k in touches) {
        touches[k] = false;
      }
      event.type = 'change';
      object.trigger(event);
      results = [];
      for (trait in event.touched) {
        event.type = "change:" + trait;
        results.push(object.trigger(event));
      }
      return results;
    };
    shorthand = function(name) {
      var parts, suffix;
      parts = name.split(/\./g);
      suffix = parts.pop();
      parts.pop();
      parts.unshift(suffix);
      return parts.reduce(function(a, b) {
        return a + b.charAt(0).toUpperCase() + b.substring(1);
      });
    };
    addSpec = function(name, spec) {
      var attr, key, ref1, ref2, results, short, type, value;
      results = [];
      for (key in spec) {
        type = spec[key];
        key = [name, key].join('.');
        short = shorthand(key);
        data[key] = attr = {
          T: type,
          ns: name,
          short: short,
          "enum": typeof type["enum"] === "function" ? type["enum"]() : void 0,
          type: typeof type.uniform === "function" ? type.uniform() : void 0,
          last: type.make(),
          value: value = type.make()
        };
        define(key, short);
        flattened[short] = value;
        makers[key] = type.make;
        validators[key] = (ref1 = type.validate) != null ? ref1 : function(a) {
          return a;
        };
        results.push(equalors[key] = (ref2 = type.equals) != null ? ref2 : function(a, b) {
          return a === b;
        });
      }
      return results;
    };
    list = [];
    values = {};
    for (j = 0, len = traits.length; j < len; j++) {
      trait = traits[j];
      ref1 = trait.split(':'), trait = ref1[0], ns = ref1[1];
      name = ns ? [ns, trait].join('.') : trait;
      spec = _attributes.getTrait(trait);
      list.push(trait);
      if (spec != null) {
        addSpec(name, spec);
      }
    }
    if (props != null) {
      for (ns in props) {
        spec = props[ns];
        addSpec(ns, spec);
      }
    }
    unique = list.filter(function(object, i) {
      return list.indexOf(object) === i;
    });
    object.traits = unique;
    if (oldProps != null) {
      object.set(oldProps, true, true);
    }
    if (finals != null) {
      for (key in finals) {
        value = finals[key];
        constant(key, value, true);
      }
    }
    if (oldOrig != null) {
      object.set(oldOrig, false, true);
    }
    if (oldComputed != null) {
      object.bind(oldComputed, true);
    }
    if (oldExpr != null) {
      object.bind(oldExpr, false);
    }
    this.dispose = function() {
      for (key in _computed) {
        unbind(key, true);
      }
      for (key in _expr) {
        unbind(key, false);
      }
      props = {};
      delete object.attributes;
      delete object.get;
      return delete object.set;
    };
    null;
  }

  return Data;

})();

module.exports = Attributes;
