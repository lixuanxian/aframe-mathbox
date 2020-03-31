var ClipGeometry, FaceGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ClipGeometry = require('./clipgeometry');


/*
(flat) Triangle fans arranged in items, columns and rows

+-+     +-+     +-+     +-+     
|\\\    |\\\    |\\\    |\\\    
+-+-+   +-+-+   +-+-+   +-+-+   

+-+     +-+     +-+     +-+     
|\\\    |\\\    |\\\    |\\\    
+-+-+   +-+-+   +-+-+   +-+-+   

+-+     +-+     +-+     +-+     
|\\\    |\\\    |\\\    |\\\    
+-+-+   +-+-+   +-+-+   +-+-+
 */

FaceGeometry = (function(superClass) {
  extend(FaceGeometry, superClass);

  function FaceGeometry(options) {
    var base, depth, height, i, index, items, j, k, l, m, n, o, p, points, position, q, ref, ref1, ref2, ref3, ref4, ref5, samples, sides, triangles, width, x, y, z;
    FaceGeometry.__super__.constructor.call(this, options);
    this._clipUniforms();
    this.items = items = +options.items || 2;
    this.width = width = +options.width || 1;
    this.height = height = +options.height || 1;
    this.depth = depth = +options.depth || 1;
    this.sides = sides = Math.max(0, items - 2);
    samples = width * height * depth;
    points = items * samples;
    triangles = sides * samples;
    this.setIndex(new THREE.BufferAttribute(new Uint16Array(triangles * 3), 1));
    this.addAttribute('position4', new THREE.BufferAttribute(new Float32Array(points * 4), 4));
    this._autochunk();
    index = this._emitter('index');
    position = this._emitter('position4');
    base = 0;
    for (i = k = 0, ref = samples; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      for (j = m = 0, ref1 = sides; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
        index(base);
        index(base + j + 1);
        index(base + j + 2);
      }
      base += items;
    }
    for (z = n = 0, ref2 = depth; 0 <= ref2 ? n < ref2 : n > ref2; z = 0 <= ref2 ? ++n : --n) {
      for (y = o = 0, ref3 = height; 0 <= ref3 ? o < ref3 : o > ref3; y = 0 <= ref3 ? ++o : --o) {
        for (x = p = 0, ref4 = width; 0 <= ref4 ? p < ref4 : p > ref4; x = 0 <= ref4 ? ++p : --p) {
          for (l = q = 0, ref5 = items; 0 <= ref5 ? q < ref5 : q > ref5; l = 0 <= ref5 ? ++q : --q) {
            position(x, y, z, l);
          }
        }
      }
    }
    this._finalize();
    this.clip();
    return;
  }

  FaceGeometry.prototype.clip = function(width, height, depth, items) {
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

  return FaceGeometry;

})(ClipGeometry);

module.exports = FaceGeometry;
