var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

exports.setOrigin = function(vec, dimensions, origin) {
  var w, x, y, z;
  if (+dimensions === dimensions) {
    dimensions = [dimensions];
  }
  x = indexOf.call(dimensions, 1) >= 0 ? 0 : origin.x;
  y = indexOf.call(dimensions, 2) >= 0 ? 0 : origin.y;
  z = indexOf.call(dimensions, 3) >= 0 ? 0 : origin.z;
  w = indexOf.call(dimensions, 4) >= 0 ? 0 : origin.w;
  return vec.set(x, y, z, w);
};

exports.addOrigin = (function() {
  var v;
  v = new THREE.Vector4;
  return function(vec, dimension, origin) {
    exports.setOrigin(v, dimension, origin);
    return vec.add(v);
  };
})();

exports.setDimension = function(vec, dimension) {
  var w, x, y, z;
  x = dimension === 1 ? 1 : 0;
  y = dimension === 2 ? 1 : 0;
  z = dimension === 3 ? 1 : 0;
  w = dimension === 4 ? 1 : 0;
  return vec.set(x, y, z, w);
};

exports.setDimensionNormal = function(vec, dimension) {
  var w, x, y, z;
  x = dimension === 1 ? 1 : 0;
  y = dimension === 2 ? 1 : 0;
  z = dimension === 3 ? 1 : 0;
  w = dimension === 4 ? 1 : 0;
  return vec.set(y, z + x, w, 0);
};

exports.recenterAxis = (function() {
  var axis;
  axis = [0, 0];
  return function(x, dx, bend, f) {
    var abs, fabs, max, min, x1, x2;
    if (f == null) {
      f = 0;
    }
    if (bend > 0) {
      x1 = x;
      x2 = x + dx;
      abs = Math.max(Math.abs(x1), Math.abs(x2));
      fabs = abs * f;
      min = Math.min(x1, x2);
      max = Math.max(x1, x2);
      x = min + (-abs + fabs - min) * bend;
      dx = max + (abs + fabs - max) * bend - x;
    }
    axis[0] = x;
    axis[1] = dx;
    return axis;
  };
})();
