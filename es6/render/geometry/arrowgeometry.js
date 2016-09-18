var ArrowGeometry, ClipGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ClipGeometry = require('./clipgeometry');


/*
Cones to attach as arrowheads on line strips

.....> .....> .....> .....>

.....> .....> .....> .....>

.....> .....> .....> .....>
 */

ArrowGeometry = (function(superClass) {
  extend(ArrowGeometry, superClass);

  function ArrowGeometry(options) {
    var a, anchor, angle, arrow, arrows, attach, b, back, base, c, circle, far, flip, i, index, j, k, l, layers, m, n, near, o, p, points, position, q, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ribbons, samples, sides, step, strips, tip, triangles, x, y, z;
    ArrowGeometry.__super__.constructor.call(this, options);
    this._clipUniforms();
    this.sides = sides = +options.sides || 12;
    this.samples = samples = +options.samples || 2;
    this.strips = strips = +options.strips || 1;
    this.ribbons = ribbons = +options.ribbons || 1;
    this.layers = layers = +options.layers || 1;
    this.flip = flip = (ref = options.flip) != null ? ref : false;
    this.anchor = anchor = (ref1 = options.anchor) != null ? ref1 : flip ? 0 : samples - 1;
    arrows = strips * ribbons * layers;
    points = (sides + 2) * arrows;
    triangles = (sides * 2) * arrows;
    this.addAttribute('index', new THREE.BufferAttribute(new Uint16Array(triangles * 3), 1));
    this.addAttribute('position4', new THREE.BufferAttribute(new Float32Array(points * 4), 4));
    this.addAttribute('arrow', new THREE.BufferAttribute(new Float32Array(points * 3), 3));
    this.addAttribute('attach', new THREE.BufferAttribute(new Float32Array(points * 2), 2));
    this._autochunk();
    index = this._emitter('index');
    position = this._emitter('position4');
    arrow = this._emitter('arrow');
    attach = this._emitter('attach');
    circle = [];
    for (k = j = 0, ref2 = sides; 0 <= ref2 ? j < ref2 : j > ref2; k = 0 <= ref2 ? ++j : --j) {
      angle = k / sides * τ;
      circle.push([Math.cos(angle), Math.sin(angle), 1]);
    }
    base = 0;
    for (i = m = 0, ref3 = arrows; 0 <= ref3 ? m < ref3 : m > ref3; i = 0 <= ref3 ? ++m : --m) {
      tip = base++;
      back = tip + sides + 1;
      for (k = n = 0, ref4 = sides; 0 <= ref4 ? n < ref4 : n > ref4; k = 0 <= ref4 ? ++n : --n) {
        a = base + k % sides;
        b = base + (k + 1) % sides;
        index(tip);
        index(a);
        index(b);
        index(b);
        index(a);
        index(back);
      }
      base += sides + 1;
    }
    step = flip ? 1 : -1;
    far = flip ? samples - 1 : 0;
    near = anchor + step;
    x = anchor;
    for (l = o = 0, ref5 = layers; 0 <= ref5 ? o < ref5 : o > ref5; l = 0 <= ref5 ? ++o : --o) {
      for (z = p = 0, ref6 = ribbons; 0 <= ref6 ? p < ref6 : p > ref6; z = 0 <= ref6 ? ++p : --p) {
        for (y = q = 0, ref7 = strips; 0 <= ref7 ? q < ref7 : q > ref7; y = 0 <= ref7 ? ++q : --q) {
          position(x, y, z, l);
          arrow(0, 0, 0);
          attach(near, far);
          for (k = r = 0, ref8 = sides; 0 <= ref8 ? r < ref8 : r > ref8; k = 0 <= ref8 ? ++r : --r) {
            position(x, y, z, l);
            c = circle[k];
            arrow(c[0], c[1], c[2]);
            attach(near, far);
          }
          position(x, y, z, l);
          arrow(0, 0, 1);
          attach(near, far);
        }
      }
    }
    this._finalize();
    this.clip();
    return;
  }

  ArrowGeometry.prototype.clip = function(samples, strips, ribbons, layers) {
    var dims, maxs, quads, segments;
    if (samples == null) {
      samples = this.samples;
    }
    if (strips == null) {
      strips = this.strips;
    }
    if (ribbons == null) {
      ribbons = this.ribbons;
    }
    if (layers == null) {
      layers = this.layers;
    }
    segments = Math.max(0, samples - 1);
    this._clipGeometry(samples, strips, ribbons, layers);
    if (samples > this.anchor) {
      dims = [layers, ribbons, strips];
      maxs = [this.layers, this.ribbons, this.strips];
      quads = this.sides * this._reduce(dims, maxs);
    } else {
      quads = 0;
    }
    return this._offsets([
      {
        start: 0,
        count: quads * 6
      }
    ]);
  };

  return ArrowGeometry;

})(ClipGeometry);

module.exports = ArrowGeometry;
