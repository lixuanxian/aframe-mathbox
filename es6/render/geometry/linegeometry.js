var ClipGeometry, LineGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ClipGeometry = require('./clipgeometry');


/*
Line strips arranged in columns and rows

+----+ +----+ +----+ +----+

+----+ +----+ +----+ +----+

+----+ +----+ +----+ +----+
 */

LineGeometry = (function(superClass) {
  extend(LineGeometry, superClass);

  function LineGeometry(options) {
    var aa, ab, base, closed, detail, edge, edger, i, index, j, joint, joints, k, l, layers, line, lines, m, n, o, p, points, position, q, quads, r, ref, ref1, ref10, ref11, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ribbons, s, samples, segments, strip, strips, t, triangles, u, v, vertices, w, wrap, x, y, z;
    LineGeometry.__super__.constructor.call(this, options);
    this._clipUniforms();
    this.closed = closed = options.closed || false;
    this.samples = samples = (+options.samples || 2) + (closed ? 1 : 0);
    this.strips = strips = +options.strips || 1;
    this.ribbons = ribbons = +options.ribbons || 1;
    this.layers = layers = +options.layers || 1;
    this.detail = detail = +options.detail || 1;
    lines = samples - 1;
    this.joints = joints = detail - 1;
    this.vertices = vertices = (lines - 1) * joints + samples;
    this.segments = segments = (lines - 1) * joints + lines;
    wrap = samples - (closed ? 1 : 0);
    points = vertices * strips * ribbons * layers * 2;
    quads = segments * strips * ribbons * layers;
    triangles = quads * 2;
    this.setIndex(new THREE.BufferAttribute(new Uint16Array(triangles * 3), 1));
    this.addAttribute('position4', new THREE.BufferAttribute(new Float32Array(points * 4), 4));
    this.addAttribute('line', new THREE.BufferAttribute(new Float32Array(points * 2), 2));
    this.addAttribute('strip', new THREE.BufferAttribute(new Float32Array(points * 2), 2));
    if (detail > 1) {
      this.addAttribute('joint', new THREE.BufferAttribute(new Float32Array(points), 1));
    }
    this._autochunk();
    index = this._emitter('index');
    position = this._emitter('position4');
    line = this._emitter('line');
    strip = this._emitter('strip');
    if (detail > 1) {
      joint = this._emitter('joint');
    }
    base = 0;
    for (i = n = 0, ref = ribbons * layers; 0 <= ref ? n < ref : n > ref; i = 0 <= ref ? ++n : --n) {
      for (j = o = 0, ref1 = strips; 0 <= ref1 ? o < ref1 : o > ref1; j = 0 <= ref1 ? ++o : --o) {
        for (k = p = 0, ref2 = segments; 0 <= ref2 ? p < ref2 : p > ref2; k = 0 <= ref2 ? ++p : --p) {
          index(base);
          index(base + 1);
          index(base + 2);
          index(base + 2);
          index(base + 1);
          index(base + 3);
          base += 2;
        }
        base += 2;
      }
    }
    edger = closed ? function() {
      return 0;
    } : function(x) {
      if (x === 0) {
        return -1;
      } else if (x === samples - 1) {
        return 1;
      } else {
        return 0;
      }
    };
    if (detail > 1) {
      for (l = q = 0, ref3 = layers; 0 <= ref3 ? q < ref3 : q > ref3; l = 0 <= ref3 ? ++q : --q) {
        for (z = r = 0, ref4 = ribbons; 0 <= ref4 ? r < ref4 : r > ref4; z = 0 <= ref4 ? ++r : --r) {
          for (y = s = 0, ref5 = strips; 0 <= ref5 ? s < ref5 : s > ref5; y = 0 <= ref5 ? ++s : --s) {
            for (x = t = 0, ref6 = samples; 0 <= ref6 ? t < ref6 : t > ref6; x = 0 <= ref6 ? ++t : --t) {
              if (closed) {
                x = x % wrap;
              }
              edge = edger(x);
              if (edge !== 0) {
                position(x, y, z, l);
                position(x, y, z, l);
                line(edge, 1);
                line(edge, -1);
                strip(0, segments);
                strip(0, segments);
                joint(0.5);
                joint(0.5);
              } else {
                for (m = u = 0, ref7 = detail; 0 <= ref7 ? u < ref7 : u > ref7; m = 0 <= ref7 ? ++u : --u) {
                  position(x, y, z, l);
                  position(x, y, z, l);
                  line(edge, 1);
                  line(edge, -1);
                  strip(0, segments);
                  strip(0, segments);
                  joint(m / joints);
                  joint(m / joints);
                }
              }
            }
          }
        }
      }
    } else {
      for (l = v = 0, ref8 = layers; 0 <= ref8 ? v < ref8 : v > ref8; l = 0 <= ref8 ? ++v : --v) {
        for (z = w = 0, ref9 = ribbons; 0 <= ref9 ? w < ref9 : w > ref9; z = 0 <= ref9 ? ++w : --w) {
          for (y = aa = 0, ref10 = strips; 0 <= ref10 ? aa < ref10 : aa > ref10; y = 0 <= ref10 ? ++aa : --aa) {
            for (x = ab = 0, ref11 = samples; 0 <= ref11 ? ab < ref11 : ab > ref11; x = 0 <= ref11 ? ++ab : --ab) {
              if (closed) {
                x = x % wrap;
              }
              edge = edger(x);
              position(x, y, z, l);
              position(x, y, z, l);
              line(edge, 1);
              line(edge, -1);
              strip(0, segments);
              strip(0, segments);
            }
          }
        }
      }
    }
    this._finalize();
    this.clip();
    return;
  }

  LineGeometry.prototype.clip = function(samples, strips, ribbons, layers) {
    var segments, vertices;
    if (samples == null) {
      samples = this.samples - this.closed;
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
    segments = Math.max(0, samples - (this.closed ? 0 : 1));
    vertices = samples + (samples - 2) * this.joints;
    segments = vertices - 1;
    this._clipGeometry(vertices, strips, ribbons, layers);
    return this._clipOffsets(6, segments, strips, ribbons, layers, this.segments, this.strips, this.ribbons, this.layers);
  };

  return LineGeometry;

})(ClipGeometry);

module.exports = LineGeometry;
