var ClipGeometry, StripGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ClipGeometry = require('./clipgeometry');


/*
Triangle strips arranged in items, columns and rows

+--+--+--+  +--+--+--+  +--+--+--+  +--+--+--+  
| /| /| /   | /| /| /   | /| /| /   | /| /| / 
+--+--+/    +--+--+/    +--+--+/    +--+--+/  

+--+--+--+  +--+--+--+  +--+--+--+  +--+--+--+  
| /| /| /   | /| /| /   | /| /| /   | /| /| / 
+--+--+/    +--+--+/    +--+--+/    +--+--+/  

+--+--+--+  +--+--+--+  +--+--+--+  +--+--+--+  
| /| /| /   | /| /| /   | /| /| /   | /| /| / 
+--+--+/    +--+--+/    +--+--+/    +--+--+/
 */

StripGeometry = (function(superClass) {
  extend(StripGeometry, superClass);

  function StripGeometry(options) {
    var base, depth, f, height, i, index, items, j, k, l, last, m, n, o, p, points, position, q, r, ref, ref1, ref2, ref3, ref4, ref5, samples, sides, strip, triangles, width, x, y, z;
    StripGeometry.__super__.constructor.call(this, options);
    this._clipUniforms();
    this.items = items = +options.items || 2;
    this.width = width = +options.width || 1;
    this.height = height = +options.height || 1;
    this.depth = depth = +options.depth || 1;
    this.sides = sides = Math.max(0, items - 2);
    samples = width * height * depth;
    points = items * samples;
    triangles = sides * samples;
    this.addAttribute('index', new THREE.BufferAttribute(new Uint16Array(triangles * 3), 1));
    this.addAttribute('position4', new THREE.BufferAttribute(new Float32Array(points * 4), 4));
    this.addAttribute('strip', new THREE.BufferAttribute(new Float32Array(points * 3), 3));
    this._autochunk();
    index = this._emitter('index');
    position = this._emitter('position4');
    strip = this._emitter('strip');
    base = 0;
    for (i = k = 0, ref = samples; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      o = base;
      for (j = m = 0, ref1 = sides; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
        if (j & 1) {
          index(o + 1);
          index(o);
          index(o + 2);
        } else {
          index(o);
          index(o + 1);
          index(o + 2);
        }
        o++;
      }
      base += items;
    }
    last = items - 1;
    for (z = n = 0, ref2 = depth; 0 <= ref2 ? n < ref2 : n > ref2; z = 0 <= ref2 ? ++n : --n) {
      for (y = p = 0, ref3 = height; 0 <= ref3 ? p < ref3 : p > ref3; y = 0 <= ref3 ? ++p : --p) {
        for (x = q = 0, ref4 = width; 0 <= ref4 ? q < ref4 : q > ref4; x = 0 <= ref4 ? ++q : --q) {
          f = 1;
          position(x, y, z, 0);
          strip(1, 2, f);
          for (l = r = 1, ref5 = last; 1 <= ref5 ? r < ref5 : r > ref5; l = 1 <= ref5 ? ++r : --r) {
            position(x, y, z, l);
            strip(l - 1, l + 1, f = -f);
          }
          position(x, y, z, last);
          strip(last - 2, last - 1, -f);
        }
      }
    }
    this._finalize();
    this.clip();
    return;
  }

  StripGeometry.prototype.clip = function(width, height, depth, items) {
    var sides;
    if (width == null) {
      width = this.width;
    }
    if (height == null) {
      height = this.height;
    }
    if (depth == null) {
      depth = this.depth;
    }
    if (items == null) {
      items = this.items;
    }
    sides = Math.max(0, items - 2);
    this._clipGeometry(width, height, depth, items);
    return this._clipOffsets(3, width, height, depth, sides, this.width, this.height, this.depth, this.sides);
  };

  return StripGeometry;

})(ClipGeometry);

module.exports = StripGeometry;
