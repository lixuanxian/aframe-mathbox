var Buffer, Memo, MemoScreen, Readback, Renderable, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Renderable = require('../renderable');
Buffer = require('./buffer');
Memo = require('./memo');
MemoScreen = require('../meshes/memoscreen');
Util = require('../../util');


/*
 * Readback up to 4D array of up to 4D data from GL
 */

Readback = (function(superClass) {
  extend(Readback, superClass);

  function Readback(renderer, shaders, options) {
    if (this.items == null) {
      this.items = options.items || 1;
    }
    if (this.channels == null) {
      this.channels = options.channels || 4;
    }
    if (this.width == null) {
      this.width = options.width || 1;
    }
    if (this.height == null) {
      this.height = options.height || 1;
    }
    if (this.depth == null) {
      this.depth = options.depth || 1;
    }
    if (this.type == null) {
      this.type = options.type || THREE.FloatType;
    }
    if (this.stpq == null) {
      this.stpq = options.stpq || false;
    }
    this.isFloat = this.type === THREE.FloatType;
    this.active = this.sampled = this.rect = this.pad = null;
    Readback.__super__.constructor.call(this, renderer, shaders);
    this.build(options);

    /*
     * log precision
    gl = @gl
    for name, pass of {Vertex: gl.VERTEX_SHADER, Fragment: gl.FRAGMENT_SHADER}
      bits = for prec in [gl.LOW_FLOAT, gl.MEDIUM_FLOAT, gl.HIGH_FLOAT]
        gl.getShaderPrecisionFormat(pass, prec).precision
      console.log name, 'shader precision',  bits
     */
  }

  Readback.prototype.build = function(options) {
    var channels, depth, encoder, h, height, indexer, isIndexed, items, map, sampler, stpq, stretch, w, width;
    map = options.map;
    indexer = options.indexer;
    isIndexed = (indexer != null) && !indexer.empty();
    items = this.items, width = this.width, height = this.height, depth = this.depth, stpq = this.stpq;
    sampler = map;
    if (isIndexed) {
      this._adopt({
        indexModulus: {
          type: 'v4',
          value: new THREE.Vector4(items, items * width, items * width * height, 1)
        }
      });
      sampler = this.shaders.shader();
      sampler.require(map);
      sampler.require(indexer);
      sampler.pipe('float.index.pack', this.uniforms);
    }
    if (this.isFloat && this.channels > 1) {
      this.floatMemo = new Memo(this.renderer, this.shaders, {
        items: items,
        channels: 4,
        width: width,
        height: height,
        depth: depth,
        history: 0,
        type: THREE.FloatType
      });
      this.floatCompose = new MemoScreen(this.renderer, this.shaders, {
        map: sampler,
        items: items,
        width: width,
        height: height,
        depth: depth,
        stpq: stpq
      });
      this.floatMemo.adopt(this.floatCompose);
      stpq = false;
      sampler = this.shaders.shader();
      this.floatMemo.shaderAbsolute(sampler);
    }
    if (this.isFloat) {
      stretch = this.channels;
      channels = 4;
    } else {
      stretch = 1;
      channels = this.channels;
    }
    if (stretch > 1) {
      encoder = this.shaders.shader();
      encoder.pipe(Util.GLSL.mapByte2FloatOffset(stretch));
      encoder.require(sampler);
      encoder.pipe('float.stretch');
      encoder.pipe('float.encode');
      sampler = encoder;
    } else if (this.isFloat) {
      encoder = this.shaders.shader();
      encoder.pipe(sampler);
      encoder.pipe(Util.GLSL.truncateVec4(4, 1));
      encoder.pipe('float.encode');
      sampler = encoder;
    }
    this.byteMemo = new Memo(this.renderer, this.shaders, {
      items: items * stretch,
      channels: 4,
      width: width,
      height: height,
      depth: depth,
      history: 0,
      type: THREE.UnsignedByteType
    });
    this.byteCompose = new MemoScreen(this.renderer, this.shaders, {
      map: sampler,
      items: items * stretch,
      width: width,
      height: height,
      depth: depth,
      stpq: stpq
    });
    this.byteMemo.adopt(this.byteCompose);
    w = items * width * stretch;
    h = height * depth;
    this.samples = this.width * this.height * this.depth;
    this.bytes = new Uint8Array(w * h * 4);
    if (this.isFloat) {
      this.floats = new Float32Array(this.bytes.buffer);
    }
    this.data = this.isFloat ? this.floats : this.bytes;
    this.streamer = this.generate(this.data);
    this.active = {
      items: 0,
      width: 0,
      height: 0,
      depth: 0
    };
    this.sampled = {
      items: 0,
      width: 0,
      height: 0,
      depth: 0
    };
    this.rect = {
      w: 0,
      h: 0
    };
    this.pad = {
      x: 0,
      y: 0,
      z: 0,
      w: 0
    };
    this.stretch = stretch;
    this.isIndexed = isIndexed;
    return this.setActive(items, width, height, depth);
  };

  Readback.prototype.generate = function(data) {
    return Util.Data.getStreamer(data, this.samples, 4, this.items);
  };

  Readback.prototype.setActive = function(items, width, height, depth) {
    var h, ref, ref1, ref2, ref3, ref4, ref5, w;
    if (!(items !== this.active.items || width !== this.active.width || height !== this.active.height || depth !== this.active.depth)) {
      return;
    }
    ref = [items, width, height, depth], this.active.items = ref[0], this.active.width = ref[1], this.active.height = ref[2], this.active.depth = ref[3];
    if ((ref1 = this.floatCompose) != null) {
      ref1.cover(width, height, depth);
    }
    if ((ref2 = this.byteCompose) != null) {
      ref2.cover(width * this.stretch, height, depth);
    }
    items = this.items;
    width = this.active.width;
    height = this.depth === 1 ? this.active.height : this.height;
    depth = this.active.depth;
    w = items * width * this.stretch;
    h = height * depth;
    ref3 = [items, width, height, depth], this.sampled.items = ref3[0], this.sampled.width = ref3[1], this.sampled.height = ref3[2], this.sampled.depth = ref3[3];
    ref4 = [w, h], this.rect.w = ref4[0], this.rect.h = ref4[1];
    return ref5 = [this.sampled.width - this.active.width, this.sampled.height - this.active.height, this.sampled.depth - this.active.depth, this.sampled.items - this.active.items], this.pad.x = ref5[0], this.pad.y = ref5[1], this.pad.z = ref5[2], this.pad.w = ref5[3], ref5;
  };

  Readback.prototype.update = function(camera) {
    var ref, ref1;
    if ((ref = this.floatMemo) != null) {
      ref.render(camera);
    }
    return (ref1 = this.byteMemo) != null ? ref1.render(camera) : void 0;
  };

  Readback.prototype.post = function() {
    this.renderer.setRenderTarget(this.byteMemo.target.write);
    return this.gl.readPixels(0, 0, this.rect.w, this.rect.h, gl.RGBA, gl.UNSIGNED_BYTE, this.bytes);
  };

  Readback.prototype.readFloat = function(n) {
    var ref;
    return (ref = this.floatMemo) != null ? ref.read(n) : void 0;
  };

  Readback.prototype.readByte = function(n) {
    var ref;
    return (ref = this.byteMemo) != null ? ref.read(n) : void 0;
  };

  Readback.prototype.setCallback = function(callback) {
    return this.emitter = this.callback(callback);
  };

  Readback.prototype.callback = function(callback) {
    var f, m, n, o, p;
    if (!this.isIndexed) {
      return callback;
    }
    n = this.width;
    m = this.height;
    o = this.depth;
    p = this.items;
    f = function(x, y, z, w) {
      var idx, ii, jj, kk, ll;
      idx = w;
      ll = idx % p;
      idx = (idx - ll) / p;
      ii = idx % n;
      idx = (idx - ii) / n;
      jj = idx % m;
      idx = (idx - jj) / m;
      kk = idx;
      return callback(x, y, z, w, ii, jj, kk, ll);
    };
    f.reset = function() {
      return typeof callback.reset === "function" ? callback.reset() : void 0;
    };
    return f;
  };

  Readback.prototype.iterate = function() {
    var callback, consume, count, done, emit, i, j, k, l, limit, m, n, o, p, padW, padX, padY, padZ, ref, repeat, reset, skip;
    emit = this.emitter;
    if (typeof emit.reset === "function") {
      emit.reset();
    }
    ref = this.streamer, consume = ref.consume, skip = ref.skip, count = ref.count, done = ref.done, reset = ref.reset;
    reset();
    n = this.sampled.width | 0;
    m = this.sampled.height | 0;
    o = this.sampled.depth | 0;
    p = this.sampled.items | 0;
    padX = this.pad.x | 0;
    padY = this.pad.y | 0;
    padZ = this.pad.z | 0;
    padW = this.pad.w | 0;
    limit = n * m * p * (o - padZ);
    if (!this.isIndexed) {
      callback = emit;
      emit = function(x, y, z, w) {
        return callback(x, y, z, w, i, j, k, l);
      };
    }
    i = j = k = l = m = 0;
    while (!done() && m < limit) {
      m++;
      repeat = consume(emit);
      if (++l === p - padW) {
        skip(padX);
        l = 0;
        if (++i === n - padX) {
          skip(p * padX);
          i = 0;
          if (++j === m - padY) {
            skip(p * n * padY);
            j = 0;
            k++;
          }
        }
      }
      if (repeat === false) {
        break;
      }
    }
    return Math.floor(count() / p);
  };

  Readback.prototype.dispose = function() {
    var ref, ref1, ref2, ref3, ref4, ref5;
    if ((ref = this.floatMemo) != null) {
      ref.unadopt(this.floatCompose);
    }
    if ((ref1 = this.floatMemo) != null) {
      ref1.dispose();
    }
    if ((ref2 = this.floatCompose) != null) {
      ref2.dispose();
    }
    if ((ref3 = this.byteMemo) != null) {
      ref3.unadopt(this.byteCompose);
    }
    if ((ref4 = this.byteMemo) != null) {
      ref4.dispose();
    }
    if ((ref5 = this.byteCompose) != null) {
      ref5.dispose();
    }
    return this.floatMemo = this.byteMemo = this.floatCompose = this.byteCompose = null;
  };

  return Readback;

})(Renderable);

module.exports = Readback;
