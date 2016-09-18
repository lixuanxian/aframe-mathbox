var Types, Util, decorate,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Util = require('../../util');

Types = {
  array: function(type, size, value) {
    var lerp, op;
    if (value == null) {
      value = null;
    }
    lerp = type.lerp ? function(a, b, target, f) {
      var i, j, l, ref;
      l = Math.min(a.length, b.length);
      for (i = j = 0, ref = l; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        target[i] = type.lerp(a[i], b[i], target[i], f);
      }
      return target;
    } : void 0;
    op = type.op ? function(a, b, target, op) {
      var i, j, l, ref;
      l = Math.min(a.length, b.length);
      for (i = j = 0, ref = l; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        target[i] = type.op(a[i], b[i], target[i], op);
      }
      return target;
    } : void 0;
    if ((value != null) && !(value instanceof Array)) {
      value = [value];
    }
    return {
      uniform: function() {
        if (type.uniform) {
          return type.uniform() + 'v';
        } else {
          return void 0;
        }
      },
      make: function() {
        var i, j, ref, results;
        if (value != null) {
          return value.slice();
        }
        if (!size) {
          return [];
        }
        results = [];
        for (i = j = 0, ref = size; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          results.push(type.make());
        }
        return results;
      },
      validate: function(value, target, invalid) {
        var i, input, j, l, ref, ref1;
        if (!(value instanceof Array)) {
          value = [value];
        }
        l = target.length = size ? size : value.length;
        for (i = j = 0, ref = l; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          input = (ref1 = value[i]) != null ? ref1 : type.make();
          target[i] = type.validate(input, target[i], invalid);
        }
        return target;
      },
      equals: function(a, b) {
        var al, bl, i, j, l, ref;
        al = a.length;
        bl = b.length;
        if (al !== bl) {
          return false;
        }
        l = Math.min(al, bl);
        for (i = j = 0, ref = l; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          if (!(typeof type.equals === "function" ? type.equals(a[i], b[i]) : void 0)) {
            return false;
          }
        }
        return true;
      },
      lerp: lerp,
      op: op,
      clone: function(v) {
        var j, len, results, x;
        results = [];
        for (j = 0, len = v.length; j < len; j++) {
          x = v[j];
          results.push(type.clone(x));
        }
        return results;
      }
    };
  },
  letters: function(type, size, value) {
    var array, i, j, len, v;
    if (value == null) {
      value = null;
    }
    if (value != null) {
      if (value === "" + value) {
        value = value.split('');
      }
      for (i = j = 0, len = value.length; j < len; i = ++j) {
        v = value[i];
        value[i] = type.validate(v, v);
      }
    }
    array = Types.array(type, size, value);
    return {
      uniform: function() {
        return array.uniform();
      },
      make: function() {
        return array.make();
      },
      validate: function(value, target, invalid) {
        if (value === "" + value) {
          value = value.split('');
        }
        return array.validate(value, target, invalid);
      },
      equals: function(a, b) {
        return array.equals(a, b);
      },
      clone: array.clone
    };
  },
  nullable: function(type, make) {
    var emitter, lerp, op, value;
    if (make == null) {
      make = false;
    }
    value = make ? type.make() : null;
    emitter = type.emitter ? function(expr1, expr2) {
      if (expr2 == null) {
        return expr1;
      }
      if (expr1 == null) {
        return expr2;
      }
      return type.emitter(expr1, expr2);
    } : void 0;
    lerp = type.lerp ? function(a, b, target, f) {
      if (a === null || b === null) {
        if (f < .5) {
          return a;
        } else {
          return b;
        }
      }
      if (target == null) {
        target = type.make();
      }
      value = type.lerp(a, b, target, f);
      return target;
    } : void 0;
    op = type.op ? function(a, b, target, op) {
      if (a === null || b === null) {
        return null;
      }
      if (target == null) {
        target = type.make();
      }
      value = type.op(a, b, target, op);
      return value;
    } : void 0;
    return {
      make: function() {
        return value;
      },
      validate: function(value, target, invalid) {
        if (value === null) {
          return value;
        }
        if (target === null) {
          target = type.make();
        }
        return type.validate(value, target, invalid);
      },
      uniform: function() {
        return typeof type.uniform === "function" ? type.uniform() : void 0;
      },
      equals: function(a, b) {
        var an, bn, ref;
        an = a === null;
        bn = b === null;
        if (an && bn) {
          return true;
        }
        if (an ^ bn) {
          return false;
        }
        return (ref = typeof type.equals === "function" ? type.equals(a, b) : void 0) != null ? ref : a === b;
      },
      lerp: lerp,
      op: op,
      emitter: emitter
    };
  },
  "enum": function(value, keys, map) {
    var i, j, key, len, len1, n, values;
    if (keys == null) {
      keys = [];
    }
    if (map == null) {
      map = {};
    }
    i = 0;
    values = {};
    for (j = 0, len = keys.length; j < len; j++) {
      key = keys[j];
      if (key !== +key) {
        if (map[key] == null) {
          map[key] = i++;
        }
      }
    }
    for (n = 0, len1 = keys.length; n < len1; n++) {
      key = keys[n];
      if (key === +key) {
        values[key] = key;
      }
    }
    for (key in map) {
      i = map[key];
      values[i] = true;
    }
    if (values[value] == null) {
      value = map[value];
    }
    return {
      "enum": function() {
        return map;
      },
      make: function() {
        return value;
      },
      validate: function(value, target, invalid) {
        var v;
        v = values[value] ? value : map[value];
        if (v != null) {
          return v;
        }
        return invalid();
      }
    };
  },
  enumber: function(value, keys, map) {
    var _enum;
    if (map == null) {
      map = {};
    }
    _enum = Types["enum"](value, keys, map);
    return {
      "enum": _enum["enum"],
      uniform: function() {
        return 'f';
      },
      make: function() {
        var ref;
        return (ref = _enum.make()) != null ? ref : +value;
      },
      validate: function(value, target, invalid) {
        if (value === +value) {
          return value;
        }
        return _enum.validate(value, target, invalid);
      },
      op: function(a, b, target, op) {
        return op(a, b);
      }
    };
  },
  select: function(value) {
    if (value == null) {
      value = '<';
    }
    value;
    return {
      make: function() {
        return value;
      },
      validate: function(value, target, invalid) {
        if (typeof value === 'string') {
          return value;
        }
        if (typeof value === 'object') {
          return value;
        }
        return invalid();
      }
    };
  },
  bool: function(value) {
    value = !!value;
    return {
      uniform: function() {
        return 'f';
      },
      make: function() {
        return value;
      },
      validate: function(value, target, invalid) {
        return !!value;
      }
    };
  },
  int: function(value) {
    if (value == null) {
      value = 0;
    }
    value = +Math.round(value);
    return {
      uniform: function() {
        return 'i';
      },
      make: function() {
        return value;
      },
      validate: function(value, target, invalid) {
        var x;
        if (value !== (x = +value)) {
          return invalid();
        }
        return Math.round(x) || 0;
      },
      op: function(a, b, target, op) {
        return op(a, b);
      }
    };
  },
  round: function(value) {
    if (value == null) {
      value = 0;
    }
    value = +Math.round(value);
    return {
      uniform: function() {
        return 'f';
      },
      make: function() {
        return value;
      },
      validate: function(value, target, invalid) {
        var x;
        if (value !== (x = +value)) {
          return invalid();
        }
        return Math.round(x) || 0;
      },
      op: function(a, b, target, op) {
        return op(a, b);
      }
    };
  },
  number: function(value) {
    if (value == null) {
      value = 0;
    }
    return {
      uniform: function() {
        return 'f';
      },
      make: function() {
        return +value;
      },
      validate: function(value, target, invalid) {
        var x;
        if (value !== (x = +value)) {
          return invalid();
        }
        return x || 0;
      },
      op: function(a, b, target, op) {
        return op(a, b);
      }
    };
  },
  positive: function(type, strict) {
    if (strict == null) {
      strict = false;
    }
    return {
      uniform: type.uniform,
      make: type.make,
      validate: function(value, target, invalid) {
        value = type.validate(value, target, invalid);
        if ((value < 0) || (strict && value <= 0)) {
          return invalid();
        }
        return value;
      },
      op: function(a, b, target, op) {
        return op(a, b);
      }
    };
  },
  string: function(value) {
    if (value == null) {
      value = '';
    }
    return {
      make: function() {
        return "" + value;
      },
      validate: function(value, target, invalid) {
        var x;
        if (value !== (x = "" + value)) {
          return invalid();
        }
        return x;
      }
    };
  },
  func: function() {
    return {
      make: function() {
        return function() {};
      },
      validate: function(value, target, invalid) {
        if (typeof value === 'function') {
          return value;
        }
        return invalid();
      }
    };
  },
  emitter: function() {
    return {
      make: function() {
        return function(emit) {
          return emit(1, 1, 1, 1);
        };
      },
      validate: function(value, target, invalid) {
        if (typeof value === 'function') {
          return value;
        }
        return invalid();
      },
      emitter: function(a, b) {
        return Util.Data.getLerpEmitter(a, b);
      }
    };
  },
  object: function(value) {
    return {
      make: function() {
        return value != null ? value : {};
      },
      validate: function(value, target, invalid) {
        if (typeof value === 'object') {
          return value;
        }
        return invalid();
      },
      clone: function(v) {
        return JSON.parse(JSON.stringify(v));
      }
    };
  },
  timestamp: function(value) {
    if (value == null) {
      value = null;
    }
    if (typeof value === 'string') {
      value = Date.parse(value);
    }
    return {
      uniform: function() {
        return 'f';
      },
      make: function() {
        return value != null ? value : +new Date();
      },
      validate: function(value, target, invalid) {
        var x;
        value = Date.parse(value);
        if (value !== (x = +value)) {
          return invalid();
        }
        return value;
      },
      op: function(a, b, target, op) {
        return op(a, b);
      }
    };
  },
  vec2: function(x, y) {
    var defaults;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    defaults = [x, y];
    return {
      uniform: function() {
        return 'v2';
      },
      make: function() {
        return new THREE.Vector2(x, y);
      },
      validate: function(value, target, invalid) {
        var ref, ref1, xx, yy;
        if (value === +value) {
          value = [value];
        }
        if (value instanceof THREE.Vector2) {
          target.copy(value);
        } else if (value instanceof Array) {
          value = value.concat(defaults.slice(value.length));
          target.set.apply(target, value);
        } else if (value != null) {
          xx = (ref = value.x) != null ? ref : x;
          yy = (ref1 = value.y) != null ? ref1 : y;
          target.set(xx, yy);
        } else {
          return invalid();
        }
        return target;
      },
      equals: function(a, b) {
        return a.x === b.x && a.y === b.y;
      },
      op: function(a, b, target, op) {
        target.x = op(a.x, b.x);
        target.y = op(a.y, b.y);
        return target;
      }
    };
  },
  ivec2: function(x, y) {
    var validate, vec2;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    vec2 = Types.vec2(x, y);
    validate = vec2.validate;
    vec2.validate = function(value, target, invalid) {
      validate(value, target, invalid);
      target.x = Math.round(target.x);
      target.y = Math.round(target.y);
      return target;
    };
    return vec2;
  },
  vec3: function(x, y, z) {
    var defaults;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    defaults = [x, y, z];
    return {
      uniform: function() {
        return 'v3';
      },
      make: function() {
        return new THREE.Vector3(x, y, z);
      },
      validate: function(value, target, invalid) {
        var ref, ref1, ref2, xx, yy, zz;
        if (value === +value) {
          value = [value];
        }
        if (value instanceof THREE.Vector3) {
          target.copy(value);
        } else if (value instanceof Array) {
          value = value.concat(defaults.slice(value.length));
          target.set.apply(target, value);
        } else if (value != null) {
          xx = (ref = value.x) != null ? ref : x;
          yy = (ref1 = value.y) != null ? ref1 : y;
          zz = (ref2 = value.z) != null ? ref2 : z;
          target.set(xx, yy, zz);
        } else {
          return invalid();
        }
        return target;
      },
      equals: function(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
      },
      op: function(a, b, target, op) {
        target.x = op(a.x, b.x);
        target.y = op(a.y, b.y);
        target.z = op(a.z, b.z);
        return target;
      }
    };
  },
  ivec3: function(x, y, z) {
    var validate, vec3;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    vec3 = Types.vec3(x, y, z);
    validate = vec3.validate;
    vec3.validate = function(value, target) {
      validate(value, target, invalid);
      target.x = Math.round(target.x);
      target.y = Math.round(target.y);
      target.z = Math.round(target.z);
      return target;
    };
    return vec3;
  },
  vec4: function(x, y, z, w) {
    var defaults;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    if (w == null) {
      w = 0;
    }
    defaults = [x, y, z, w];
    return {
      uniform: function() {
        return 'v4';
      },
      make: function() {
        return new THREE.Vector4(x, y, z, w);
      },
      validate: function(value, target, invalid) {
        var ref, ref1, ref2, ref3, ww, xx, yy, zz;
        if (value === +value) {
          value = [value];
        }
        if (value instanceof THREE.Vector4) {
          target.copy(value);
        } else if (value instanceof Array) {
          value = value.concat(defaults.slice(value.length));
          target.set.apply(target, value);
        } else if (value != null) {
          xx = (ref = value.x) != null ? ref : x;
          yy = (ref1 = value.y) != null ? ref1 : y;
          zz = (ref2 = value.z) != null ? ref2 : z;
          ww = (ref3 = value.w) != null ? ref3 : w;
          target.set(xx, yy, zz, ww);
        } else {
          return invalid();
        }
        return target;
      },
      equals: function(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
      },
      op: function(a, b, target, op) {
        target.x = op(a.x, b.x);
        target.y = op(a.y, b.y);
        target.z = op(a.z, b.z);
        target.w = op(a.w, b.w);
        return target;
      }
    };
  },
  ivec4: function(x, y, z, w) {
    var validate, vec4;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    if (w == null) {
      w = 0;
    }
    vec4 = Types.vec4(x, y, z, w);
    validate = vec4.validate;
    vec4.validate = function(value, target) {
      validate(value, target, invalid);
      target.x = Math.round(target.x);
      target.y = Math.round(target.y);
      target.z = Math.round(target.z);
      target.w = Math.round(target.w);
      return target;
    };
    return vec4;
  },
  mat3: function(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
    var defaults;
    if (n11 == null) {
      n11 = 1;
    }
    if (n12 == null) {
      n12 = 0;
    }
    if (n13 == null) {
      n13 = 0;
    }
    if (n21 == null) {
      n21 = 0;
    }
    if (n22 == null) {
      n22 = 1;
    }
    if (n23 == null) {
      n23 = 0;
    }
    if (n31 == null) {
      n31 = 0;
    }
    if (n32 == null) {
      n32 = 0;
    }
    if (n33 == null) {
      n33 = 1;
    }
    defaults = [n11, n12, n13, n21, n22, n23, n31, n32, n33];
    return {
      uniform: function() {
        return 'm4';
      },
      make: function() {
        var m;
        m = new THREE.Matrix3;
        m.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
        return m;
      },
      validate: function(value, target, invalid) {
        if (value instanceof THREE.Matrix3) {
          target.copy(value);
        } else if (value instanceof Array) {
          value = value.concat(defaults.slice(value.length));
          target.set.apply(target, value);
        } else {
          return invalid();
        }
        return target;
      }
    };
  },
  mat4: function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    var defaults;
    if (n11 == null) {
      n11 = 1;
    }
    if (n12 == null) {
      n12 = 0;
    }
    if (n13 == null) {
      n13 = 0;
    }
    if (n14 == null) {
      n14 = 0;
    }
    if (n21 == null) {
      n21 = 0;
    }
    if (n22 == null) {
      n22 = 1;
    }
    if (n23 == null) {
      n23 = 0;
    }
    if (n24 == null) {
      n24 = 0;
    }
    if (n31 == null) {
      n31 = 0;
    }
    if (n32 == null) {
      n32 = 0;
    }
    if (n33 == null) {
      n33 = 1;
    }
    if (n34 == null) {
      n34 = 0;
    }
    if (n41 == null) {
      n41 = 0;
    }
    if (n42 == null) {
      n42 = 0;
    }
    if (n43 == null) {
      n43 = 0;
    }
    if (n44 == null) {
      n44 = 1;
    }
    defaults = [n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44];
    return {
      uniform: function() {
        return 'm4';
      },
      make: function() {
        var m;
        m = new THREE.Matrix4;
        m.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
        return m;
      },
      validate: function(value, target, invalid) {
        if (value instanceof THREE.Matrix4) {
          target.copy(value);
        } else if (value instanceof Array) {
          value = value.concat(defaults.slice(value.length));
          target.set.apply(target, value);
        } else {
          return invalid();
        }
        return target;
      }
    };
  },
  quat: function(x, y, z, w) {
    var vec4;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    if (w == null) {
      w = 1;
    }
    vec4 = Types.vec4(x, y, z, w);
    return {
      uniform: function() {
        return 'v4';
      },
      make: function() {
        return new THREE.Quaternion;
      },
      validate: function(value, target, invalid) {
        if (value instanceof THREE.Quaternion) {
          target.copy(value);
        } else {
          target = vec4.validate(value, target, invalid);
        }
        target.normalize();
        return target;
      },
      equals: function(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
      },
      op: function(a, b, target, op) {
        target.x = op(a.x, b.x);
        target.y = op(a.y, b.y);
        target.z = op(a.z, b.z);
        target.w = op(a.w, b.w);
        target.normalize();
        return target;
      },
      lerp: function(a, b, target, f) {
        THREE.Quaternion.slerp(a, b, target, f);
        return target;
      }
    };
  },
  color: function(r, g, b) {
    var defaults;
    if (r == null) {
      r = .5;
    }
    if (g == null) {
      g = .5;
    }
    if (b == null) {
      b = .5;
    }
    defaults = [r, g, b];
    return {
      uniform: function() {
        return 'c';
      },
      make: function() {
        return new THREE.Color(r, g, b);
      },
      validate: function(value, target, invalid) {
        var bb, gg, ref, ref1, ref2, rr;
        if (value === "" + value) {
          value = new THREE.Color().setStyle(value);
        } else if (value === +value) {
          value = new THREE.Color(value);
        }
        if (value instanceof THREE.Color) {
          target.copy(value);
        } else if (value instanceof Array) {
          value = value.concat(defaults.slice(value.length));
          target.setRGB.apply(target, value);
        } else if (value != null) {
          rr = (ref = value.r) != null ? ref : r;
          gg = (ref1 = value.g) != null ? ref1 : g;
          bb = (ref2 = value.b) != null ? ref2 : b;
          target.set(rr, gg, bb);
        } else {
          return invalid();
        }
        return target;
      },
      equals: function(a, b) {
        return a.r === b.r && a.g === b.g && a.b === b.b;
      },
      op: function(a, b, target, op) {
        target.r = op(a.r, b.r);
        target.g = op(a.g, b.g);
        target.b = op(a.b, b.b);
        return target;
      }
    };
  },
  axis: function(value, allowZero) {
    var map, range, v;
    if (value == null) {
      value = 1;
    }
    if (allowZero == null) {
      allowZero = false;
    }
    map = {
      x: 1,
      y: 2,
      z: 3,
      w: 4,
      W: 1,
      H: 2,
      D: 3,
      I: 4,
      zero: 0,
      "null": 0,
      width: 1,
      height: 2,
      depth: 3,
      items: 4
    };
    range = allowZero ? [0, 1, 2, 3, 4] : [1, 2, 3, 4];
    if ((v = map[value]) != null) {
      value = v;
    }
    return {
      make: function() {
        return value;
      },
      validate: function(value, target, invalid) {
        var ref;
        if ((v = map[value]) != null) {
          value = v;
        }
        value = (ref = Math.round(value)) != null ? ref : 0;
        if (indexOf.call(range, value) >= 0) {
          return value;
        }
        return invalid();
      }
    };
  },
  transpose: function(order) {
    var axesArray, looseArray;
    if (order == null) {
      order = [1, 2, 3, 4];
    }
    looseArray = Types.letters(Types.axis(null, false), 0, order);
    axesArray = Types.letters(Types.axis(null, false), 4, order);
    return {
      make: function() {
        return axesArray.make();
      },
      validate: function(value, target, invalid) {
        var i, letter, missing, temp, unique;
        temp = [1, 2, 3, 4];
        looseArray.validate(value, temp, invalid);
        if (temp.length < 4) {
          missing = [1, 2, 3, 4].filter(function(x) {
            return temp.indexOf(x) === -1;
          });
          temp = temp.concat(missing);
        }
        unique = (function() {
          var j, len, results;
          results = [];
          for (i = j = 0, len = temp.length; j < len; i = ++j) {
            letter = temp[i];
            results.push(temp.indexOf(letter) === i);
          }
          return results;
        })();
        if (unique.indexOf(false) < 0) {
          return axesArray.validate(temp, target, invalid);
        }
        return invalid();
      },
      equals: axesArray.equals,
      clone: axesArray.clone
    };
  },
  swizzle: function(order, size) {
    var axesArray, looseArray;
    if (order == null) {
      order = [1, 2, 3, 4];
    }
    if (size == null) {
      size = null;
    }
    if (size == null) {
      size = order.length;
    }
    order = order.slice(0, size);
    looseArray = Types.letters(Types.axis(null, false), 0, order);
    axesArray = Types.letters(Types.axis(null, true), size, order);
    return {
      make: function() {
        return axesArray.make();
      },
      validate: function(value, target, invalid) {
        var temp;
        temp = order.slice();
        looseArray.validate(value, temp, invalid);
        if (temp.length < size) {
          temp = temp.concat([0, 0, 0, 0]).slice(0, size);
        }
        return axesArray.validate(temp, target, invalid);
      },
      equals: axesArray.equals,
      clone: axesArray.clone
    };
  },
  classes: function() {
    var stringArray;
    stringArray = Types.array(Types.string());
    return {
      make: function() {
        return stringArray.make();
      },
      validate: function(value, target, invalid) {
        if (value === "" + value) {
          value = value.split(' ');
        }
        value = value.filter(function(x) {
          return !!x.length;
        });
        return stringArray.validate(value, target, invalid);
      },
      equals: stringArray.equals,
      clone: stringArray.clone
    };
  },
  blending: function(value) {
    var keys;
    if (value == null) {
      value = 'normal';
    }
    keys = ['no', 'normal', 'add', 'subtract', 'multiply', 'custom'];
    return Types["enum"](value, keys);
  },
  filter: function(value) {
    var map;
    if (value == null) {
      value = 'nearest';
    }
    map = {
      nearest: THREE.NearestFilter,
      nearestMipMapNearest: THREE.NearestMipMapNearestFilter,
      nearestMipMapLinear: THREE.NearestMipMapLinearFilter,
      linear: THREE.LinearFilter,
      linearMipMapNearest: THREE.LinearMipMapNearestFilter,
      linearMipmapLinear: THREE.LinearMipMapLinearFilter
    };
    return Types["enum"](value, [], map);
  },
  type: function(value) {
    var map;
    if (value == null) {
      value = 'unsignedByte';
    }
    map = {
      unsignedByte: THREE.UnsignedByteType,
      byte: THREE.ByteType,
      short: THREE.ShortType,
      unsignedShort: THREE.UnsignedShortType,
      int: THREE.IntType,
      unsignedInt: THREE.UnsignedIntType,
      float: THREE.FloatType
    };
    return Types["enum"](value, [], map);
  },
  scale: function(value) {
    var keys;
    if (value == null) {
      value = 'linear';
    }
    keys = ['linear', 'log'];
    return Types["enum"](value, keys);
  },
  mapping: function(value) {
    var keys;
    if (value == null) {
      value = 'relative';
    }
    keys = ['relative', 'absolute'];
    return Types["enum"](value, keys);
  },
  indexing: function(value) {
    var keys;
    if (value == null) {
      value = 'original';
    }
    keys = ['original', 'final'];
    return Types["enum"](value, keys);
  },
  shape: function(value) {
    var keys;
    if (value == null) {
      value = 'circle';
    }
    keys = ['circle', 'square', 'diamond', 'up', 'down', 'left', 'right'];
    return Types["enum"](value, keys);
  },
  join: function(value) {
    var keys;
    if (value == null) {
      value = 'miter';
    }
    keys = ['miter', 'round', 'bevel'];
    return Types["enum"](value, keys);
  },
  stroke: function(value) {
    var keys;
    if (value == null) {
      value = 'solid';
    }
    keys = ['solid', 'dotted', 'dashed'];
    return Types["enum"](value, keys);
  },
  vertexPass: function(value) {
    var keys;
    if (value == null) {
      value = 'view';
    }
    keys = ['data', 'view', 'world', 'eye'];
    return Types["enum"](value, keys);
  },
  fragmentPass: function(value) {
    var keys;
    if (value == null) {
      value = 'light';
    }
    keys = ['color', 'light', 'rgba'];
    return Types["enum"](value, keys);
  },
  ease: function(value) {
    var keys;
    if (value == null) {
      value = 'linear';
    }
    keys = ['linear', 'cosine', 'binary', 'hold'];
    return Types["enum"](value, keys);
  },
  fit: function(value) {
    var keys;
    if (value == null) {
      value = 'contain';
    }
    keys = ['x', 'y', 'contain', 'cover'];
    return Types["enum"](value, keys);
  },
  anchor: function(value) {
    var map;
    if (value == null) {
      value = 'middle';
    }
    map = {
      first: 1,
      middle: 0,
      last: -1
    };
    return Types.enumber(value, [], map);
  },
  transitionState: function(value) {
    var map;
    if (value == null) {
      value = 'enter';
    }
    map = {
      enter: -1,
      visible: 0,
      exit: 1
    };
    return Types.enumber(value, [], map);
  },
  font: function(value) {
    var parse, stringArray;
    if (value == null) {
      value = 'sans-serif';
    }
    parse = Util.JS.parseQuoted;
    if (!(value instanceof Array)) {
      value = parse(value);
    }
    stringArray = Types.array(Types.string(), 0, value);
    return {
      make: function() {
        return stringArray.make();
      },
      validate: function(value, target, invalid) {
        try {
          if (!(value instanceof Array)) {
            value = parse(value);
          }
        } catch (_error) {
          return invalid();
        }
        value = value.filter(function(x) {
          return !!x.length;
        });
        return stringArray.validate(value, target, invalid);
      },
      equals: stringArray.equals,
      clone: stringArray.clone
    };
  },
  data: function(value) {
    if (value == null) {
      value = [];
    }
    return {
      make: function() {
        return [];
      },
      validate: function(value, target, invalid) {
        if (value instanceof Array) {
          return value;
        } else if ((value != null ? value.length : void 0) != null) {
          return value;
        } else {
          return invalid();
        }
      },
      emitter: function(a, b) {
        return Util.Data.getLerpThunk(a, b);
      }
    };
  }
};

decorate = function(types) {
  var k, type;
  for (k in types) {
    type = types[k];
    types[k] = (function(type) {
      return function() {
        var t;
        t = type.apply(type, arguments);
        if (t.validate == null) {
          t.validate = function(v) {
            return v != null;
          };
        }
        if (t.equals == null) {
          t.equals = function(a, b) {
            return a === b;
          };
        }
        if (t.clone == null) {
          t.clone = function(v) {
            var ref;
            return (ref = v != null ? typeof v.clone === "function" ? v.clone() : void 0 : void 0) != null ? ref : v;
          };
        }
        return t;
      };
    })(type);
  }
  return types;
};

module.exports = decorate(Types);
