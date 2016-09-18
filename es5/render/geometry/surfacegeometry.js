var ClipGeometry, SurfaceGeometry,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ClipGeometry = require('./clipgeometry');


/*
Grid Surface

+----+----+----+----+
|    |    |    |    |
+----+----+----+----+
|    |    |    |    |
+----+----+----+----+

+----+----+----+----+
|    |    |    |    |
+----+----+----+----+
|    |    |    |    |
+----+----+----+----+
 */

SurfaceGeometry = (function(superClass) {
  extend(SurfaceGeometry, superClass);

  function SurfaceGeometry(options) {
    var base, closedX, closedY, edgeX, edgeY, edgerX, edgerY, height, i, index, j, k, l, layers, m, n, o, p, points, position, q, quads, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, s, segmentsX, segmentsY, surface, surfaces, triangles, width, wrapX, wrapY, x, y, z;
    SurfaceGeometry.__super__.constructor.call(this, options);
    this._clipUniforms();
    this.closedX = closedX = options.closedX || false;
    this.closedY = closedY = options.closedY || false;
    this.width = width = (+options.width || 2) + (closedX ? 1 : 0);
    this.height = height = (+options.height || 2) + (closedY ? 1 : 0);
    this.surfaces = surfaces = +options.surfaces || 1;
    this.layers = layers = +options.layers || 1;
    wrapX = width - (closedX ? 1 : 0);
    wrapY = height - (closedY ? 1 : 0);
    this.segmentsX = segmentsX = Math.max(0, width - 1);
    this.segmentsY = segmentsY = Math.max(0, height - 1);
    points = width * height * surfaces * layers;
    quads = segmentsX * segmentsY * surfaces * layers;
    triangles = quads * 2;
    this.addAttribute('index', new THREE.BufferAttribute(new Uint16Array(triangles * 3), 1));
    this.addAttribute('position4', new THREE.BufferAttribute(new Float32Array(points * 4), 4));
    this.addAttribute('surface', new THREE.BufferAttribute(new Float32Array(points * 2), 2));
    this._autochunk();
    index = this._emitter('index');
    position = this._emitter('position4');
    surface = this._emitter('surface');
    base = 0;
    for (i = m = 0, ref = surfaces * layers; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
      for (j = n = 0, ref1 = segmentsY; 0 <= ref1 ? n < ref1 : n > ref1; j = 0 <= ref1 ? ++n : --n) {
        for (k = o = 0, ref2 = segmentsX; 0 <= ref2 ? o < ref2 : o > ref2; k = 0 <= ref2 ? ++o : --o) {
          index(base);
          index(base + 1);
          index(base + width);
          index(base + width);
          index(base + 1);
          index(base + width + 1);
          base++;
        }
        base++;
      }
      base += width;
    }
    edgerX = closedX ? function() {
      return 0;
    } : function(x) {
      if (x === 0) {
        return -1;
      } else if (x === segmentsX) {
        return 1;
      } else {
        return 0;
      }
    };
    edgerY = closedY ? function() {
      return 0;
    } : function(y) {
      if (y === 0) {
        return -1;
      } else if (y === segmentsY) {
        return 1;
      } else {
        return 0;
      }
    };
    for (l = p = 0, ref3 = layers; 0 <= ref3 ? p < ref3 : p > ref3; l = 0 <= ref3 ? ++p : --p) {
      for (z = q = 0, ref4 = surfaces; 0 <= ref4 ? q < ref4 : q > ref4; z = 0 <= ref4 ? ++q : --q) {
        for (y = r = 0, ref5 = height; 0 <= ref5 ? r < ref5 : r > ref5; y = 0 <= ref5 ? ++r : --r) {
          if (closedY) {
            y = y % wrapY;
          }
          edgeY = edgerY(y);
          for (x = s = 0, ref6 = width; 0 <= ref6 ? s < ref6 : s > ref6; x = 0 <= ref6 ? ++s : --s) {
            if (closedX) {
              x = x % wrapX;
            }
            edgeX = edgerX(x);
            position(x, y, z, l);
            surface(edgeX, edgeY);
          }
        }
      }
    }
    this._finalize();
    this.clip();
    return;
  }

  SurfaceGeometry.prototype.clip = function(width, height, surfaces, layers) {
    var segmentsX, segmentsY;
    if (width == null) {
      width = this.width;
    }
    if (height == null) {
      height = this.height;
    }
    if (surfaces == null) {
      surfaces = this.surfaces;
    }
    if (layers == null) {
      layers = this.layers;
    }
    segmentsX = Math.max(0, width - 1);
    segmentsY = Math.max(0, height - 1);
    this._clipGeometry(width, height, surfaces, layers);
    return this._clipOffsets(6, segmentsX, segmentsY, surfaces, layers, this.segmentsX, this.segmentsY, this.surfaces, this.layers);
  };

  SurfaceGeometry.prototype.map = function(width, height, surfaces, layers) {
    if (width == null) {
      width = this.width;
    }
    if (height == null) {
      height = this.height;
    }
    if (surfaces == null) {
      surfaces = this.surfaces;
    }
    if (layers == null) {
      layers = this.layers;
    }
    return this._clipMap(width, height, surfaces, layers);
  };

  return SurfaceGeometry;

})(ClipGeometry);

module.exports = SurfaceGeometry;
