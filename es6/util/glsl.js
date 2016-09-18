var index, letters, parseOrder, toFloatString, toType,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

letters = 'xyzw'.split('');

index = {
  0: -1,
  x: 0,
  y: 1,
  z: 2,
  w: 3
};

parseOrder = function(order) {
  if (order === "" + order) {
    order = order.split('');
  }
  if (order === +order) {
    order = [order];
  }
  return order;
};

toType = function(type) {
  if (type === +type) {
    type = 'vec' + type;
  }
  if (type === 'vec1') {
    type = 'float';
  }
  return type;
};

toFloatString = function(value) {
  value = "" + value;
  if (value.indexOf('.') < 0) {
    return value += '.0';
  }
};

exports.mapByte2FloatOffset = function(stretch) {
  var factor;
  if (stretch == null) {
    stretch = 4;
  }
  factor = toFloatString(stretch);
  return "vec4 float2ByteIndex(vec4 xyzw, out float channelIndex) {\n  float relative = xyzw.w / " + factor + ";\n  float w = floor(relative);\n  channelIndex = (relative - w) * " + factor + ";\n  return vec4(xyzw.xyz, w);\n}";
};

exports.sample2DArray = function(textures) {
  var body, divide;
  divide = function(a, b) {
    var mid, out;
    if (a === b) {
      out = "return texture2D(dataTextures[" + a + "], uv);";
    } else {
      mid = Math.ceil(a + (b - a) / 2);
      out = "if (z < " + (mid - .5) + ") {\n  " + (divide(a, mid - 1)) + "\n}\nelse {\n  " + (divide(mid, b)) + "\n}";
    }
    return out = out.replace(/\n/g, "\n  ");
  };
  body = divide(0, textures - 1);
  return "uniform sampler2D dataTextures[" + textures + "];\n\nvec4 sample2DArray(vec2 uv, float z) {\n  " + body + "\n}";
};

exports.binaryOperator = function(type, op, curry) {
  type = toType(type);
  if (curry != null) {
    return type + " binaryOperator(" + type + " a) {\n  return a " + op + " " + curry + ";\n}";
  } else {
    return type + " binaryOperator(" + type + " a, " + type + " b) {\n  return a " + op + " b;\n}";
  }
};

exports.extendVec = function(from, to, value) {
  var ctor, diff, k, parts, results;
  if (value == null) {
    value = 0;
  }
  if (from > to) {
    return exports.truncateVec(from, to);
  }
  diff = to - from;
  from = toType(from);
  to = toType(to);
  value = toFloatString(value);
  parts = (function() {
    results = [];
    for (var k = 0; 0 <= diff ? k <= diff : k >= diff; 0 <= diff ? k++ : k--){ results.push(k); }
    return results;
  }).apply(this).map(function(x) {
    if (x) {
      return value;
    } else {
      return 'v';
    }
  });
  ctor = parts.join(',');
  return to + " extendVec(" + from + " v) { return " + to + "(" + ctor + "); }";
};

exports.truncateVec = function(from, to) {
  var swizzle;
  if (from < to) {
    return exports.extendVec(from, to);
  }
  swizzle = '.' + ('xyzw'.substr(0, to));
  from = toType(from);
  to = toType(to);
  return to + " truncateVec(" + from + " v) { return v" + swizzle + "; }";
};

exports.injectVec4 = function(order) {
  var args, channel, i, k, len, mask, swizzler;
  swizzler = ['0.0', '0.0', '0.0', '0.0'];
  order = parseOrder(order);
  order = order.map(function(v) {
    if (v === "" + v) {
      return index[v];
    } else {
      return v;
    }
  });
  for (i = k = 0, len = order.length; k < len; i = ++k) {
    channel = order[i];
    swizzler[channel] = ['a', 'b', 'c', 'd'][i];
  }
  mask = swizzler.slice(0, 4).join(', ');
  args = ['float a', 'float b', 'float c', 'float d'].slice(0, order.length);
  return "vec4 inject(" + args + ") {\n  return vec4(" + mask + ");\n}";
};

exports.swizzleVec4 = function(order, size) {
  var lookup, mask;
  if (size == null) {
    size = null;
  }
  lookup = ['0.0', 'xyzw.x', 'xyzw.y', 'xyzw.z', 'xyzw.w'];
  if (size == null) {
    size = order.length;
  }
  order = parseOrder(order);
  order = order.map(function(v) {
    var ref;
    if (ref = +v, indexOf.call([0, 1, 2, 3, 4], ref) >= 0) {
      v = +v;
    }
    if (v === "" + v) {
      v = index[v] + 1;
    }
    return lookup[v];
  });
  while (order.length < size) {
    order.push('0.0');
  }
  mask = order.join(', ');
  return ("vec" + size + " swizzle(vec4 xyzw) {\n  return vec" + size + "(" + mask + ");\n}").replace(/vec1/g, 'float');
};

exports.invertSwizzleVec4 = function(order) {
  var i, j, k, len, letter, mask, src, swizzler;
  swizzler = ['0.0', '0.0', '0.0', '0.0'];
  order = parseOrder(order);
  order = order.map(function(v) {
    if (v === +v) {
      return letters[v - 1];
    } else {
      return v;
    }
  });
  for (i = k = 0, len = order.length; k < len; i = ++k) {
    letter = order[i];
    src = letters[i];
    j = index[letter];
    swizzler[j] = "xyzw." + src;
  }
  mask = swizzler.join(', ');
  return "vec4 invertSwizzle(vec4 xyzw) {\n  return vec4(" + mask + ");\n}";
};

exports.identity = function(type) {
  var args;
  args = [].slice.call(arguments);
  if (args.length > 1) {
    args = args.map(function(t, i) {
      return ['inout', t, String.fromCharCode(97 + i)].join(' ');
    });
    args = args.join(', ');
    return "void identity(" + args + ") { }";
  } else {
    return type + " identity(" + type + " x) {\n  return x;\n}";
  }
};

exports.constant = function(type, value) {
  return type + " constant() {\n  return " + value + ";\n}";
};

exports.toType = toType;
