var Geometry, debug, tick,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

debug = false;

tick = function() {
  var now;
  now = +(new Date);
  return function(label) {
    var delta;
    delta = +new Date() - now;
    console.log(label, delta + " ms");
    return delta;
  };
};

Geometry = (function(superClass) {
  extend(Geometry, superClass);

  function Geometry() {
    THREE.BufferGeometry.call(this);
    if (this.uniforms == null) {
      this.uniforms = {};
    }
    if (this.offsets == null) {
      this.offsets = [];
    }
    if (debug) {
      this.tock = tick();
    }
    this.chunked = false;
    this.limit = 0xFFFF;
  }

  Geometry.prototype._reduce = function(dims, maxs) {
    var dim, i, j, len, max, multiple, quads;
    multiple = false;
    for (i = j = 0, len = dims.length; j < len; i = ++j) {
      dim = dims[i];
      max = maxs[i];
      if (multiple) {
        dims[i] = max;
      }
      if (dim > 1) {
        multiple = true;
      }
    }
    return quads = dims.reduce(function(a, b) {
      return a * b;
    });
  };

  Geometry.prototype._emitter = function(name) {
    var array, attribute, dimensions, four, offset, one, three, two;
    attribute = this.attributes[name] || this.index;
    dimensions = attribute.itemSize;
    array = attribute.array;
    offset = 0;
    one = function(a) {
      return array[offset++] = a;
    };
    two = function(a, b) {
      array[offset++] = a;
      return array[offset++] = b;
    };
    three = function(a, b, c) {
      array[offset++] = a;
      array[offset++] = b;
      return array[offset++] = c;
    };
    four = function(a, b, c, d) {
      array[offset++] = a;
      array[offset++] = b;
      array[offset++] = c;
      return array[offset++] = d;
    };
    return [null, one, two, three, four][dimensions];
  };

  Geometry.prototype._autochunk = function() {
    var array, attribute, indexed, name, numItems, ref;
    indexed = this.attributes.index;
    ref = this.attributes;
    for (name in ref) {
      attribute = ref[name];
      if (name !== 'index' && indexed) {
        numItems = attribute.array.length / attribute.itemSize;
        if (numItems > this.limit) {
          this.chunked = true;
        }
        break;
      }
    }
    if (this.chunked && !indexed.u16) {
      indexed.u16 = array = indexed.array;
      return indexed.array = new Uint32Array(array.length);
    }
  };

  Geometry.prototype._finalize = function() {
    var attrib;
    if (!this.chunked) {
      return;
    }
    attrib = this.attributes.index;
    this.chunks = this._chunks(attrib.array, this.limit);
    this._chunkify(attrib, this.chunks);
    if (debug) {
      return this.tock(this.constructor.name);
    }
  };

  Geometry.prototype._chunks = function(array, limit) {
    var a, b, chunks, end, i, j, j1, j2, j3, jmax, jmin, last, n, o, push, ref, start;
    chunks = [];
    last = 0;
    start = array[0];
    end = array[0];
    push = function(i) {
      var _count, _end, _start;
      _start = last * 3;
      _end = i * 3;
      _count = _end - _start;
      return chunks.push({
        index: start,
        start: _start,
        count: _count,
        end: _end
      });
    };
    n = Math.floor(array.length / 3);
    o = 0;
    for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      j1 = array[o++];
      j2 = array[o++];
      j3 = array[o++];
      jmin = Math.min(j1, j2, j3);
      jmax = Math.max(j1, j2, j3);
      a = Math.min(start, jmin);
      b = Math.max(end, jmax);
      if (b - a > limit) {
        push(i);
        a = jmin;
        b = jmax;
        last = i;
      }
      start = a;
      end = b;
    }
    push(n);
    return chunks;
  };

  Geometry.prototype._chunkify = function(attrib, chunks) {
    var chunk, from, i, j, k, len, offset, ref, ref1, to;
    if (!attrib.u16) {
      return;
    }
    from = attrib.array;
    to = attrib.u16;
    for (j = 0, len = chunks.length; j < len; j++) {
      chunk = chunks[j];
      offset = chunk.index;
      for (i = k = ref = chunk.start, ref1 = chunk.end; ref <= ref1 ? k < ref1 : k > ref1; i = ref <= ref1 ? ++k : --k) {
        to[i] = from[i] - offset;
      }
    }
    attrib.array = attrib.u16;
    return delete attrib.u16;
  };

  Geometry.prototype._offsets = function(offsets) {
    var _end, _start, chunk, chunks, end, j, k, len, len1, offset, out, start;
    if (!this.chunked) {
      this.offsets = offsets;
    } else {
      chunks = this.chunks;
      out = this.offsets;
      out.length = null;
      for (j = 0, len = offsets.length; j < len; j++) {
        offset = offsets[j];
        start = offset.start;
        end = offset.count - start;
        for (k = 0, len1 = chunks.length; k < len1; k++) {
          chunk = chunks[k];
          _start = chunk.start;
          _end = chunk.end;
          if (start <= _start && end > _start || start < _end && end >= _end || start > _start && end < _end) {
            _start = Math.max(start, _start);
            _end = Math.min(end, _end);
            out.push({
              index: chunk.index,
              start: _start,
              count: _end - _start
            });
          }
        }
      }
    }
    return null;
  };

  return Geometry;

})(THREE.BufferGeometry);

module.exports = Geometry;
