var Buffer, DataBuffer, DataTexture, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Buffer = require('./buffer');

DataTexture = require('./texture/datatexture');

Util = require('../../util');


/*
 * Data buffer on the GPU
 * - Stores samples (1-n) x items (1-n) x channels (1-4)
 * - Provides generic sampler shader
 * - Provides generic copy/write handler
 * => specialized into Array/Matrix/VoxelBuffer
 */

DataBuffer = (function(superClass) {
  extend(DataBuffer, superClass);

  function DataBuffer(renderer, shaders, options) {
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.depth = options.depth || 1;
    if (this.samples == null) {
      this.samples = this.width * this.height * this.depth;
    }
    DataBuffer.__super__.constructor.call(this, renderer, shaders, options);
    this.build(options);
  }

  DataBuffer.prototype.shader = function(shader, indices) {
    var wrap;
    if (indices == null) {
      indices = 4;
    }
    if (this.items > 1 || this.depth > 1) {
      if (indices !== 4) {
        shader.pipe(Util.GLSL.extendVec(indices, 4));
      }
      shader.pipe('map.xyzw.texture', this.uniforms);
    } else {
      if (indices !== 2) {
        shader.pipe(Util.GLSL.truncateVec(indices, 2));
      }
    }
    wrap = this.wrap ? '.wrap' : '';
    shader.pipe("map.2d.data" + wrap, this.uniforms);
    shader.pipe("sample.2d", this.uniforms);
    if (this.channels < 4) {
      shader.pipe(Util.GLSL.swizzleVec4(['0000', 'x000', 'xw00', 'xyz0'][this.channels]));
    }
    return shader;
  };

  DataBuffer.prototype.build = function(options) {
    this.data = new Float32Array(this.samples * this.channels * this.items);
    this.texture = new DataTexture(this.gl, this.items * this.width, this.height * this.depth, this.channels, options);
    this.filled = 0;
    this.used = 0;
    this._adopt(this.texture.uniforms);
    this._adopt({
      dataPointer: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      textureItems: {
        type: 'f',
        value: this.items
      },
      textureHeight: {
        type: 'f',
        value: this.height
      }
    });
    this.dataPointer = this.uniforms.dataPointer.value;
    return this.streamer = this.generate(this.data);
  };

  DataBuffer.prototype.dispose = function() {
    this.data = null;
    this.texture.dispose();
    return DataBuffer.__super__.dispose.apply(this, arguments);
  };

  DataBuffer.prototype.getFilled = function() {
    return this.filled;
  };

  DataBuffer.prototype.setCallback = function(callback1) {
    this.callback = callback1;
    return this.filled = 0;
  };

  DataBuffer.prototype.copy = function(data) {
    var d, i, j, n, ref;
    n = Math.min(data.length, this.samples * this.channels * this.items);
    d = this.data;
    for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      d[i] = data[i];
    }
    return this.write(Math.ceil(n / this.channels / this.items));
  };

  DataBuffer.prototype.write = function(n) {
    var height, width;
    if (n == null) {
      n = this.samples;
    }
    height = n / this.width;
    n *= this.items;
    width = height < 1 ? n : this.items * this.width;
    height = Math.ceil(height);
    this.texture.write(this.data, 0, 0, width, height);
    this.dataPointer.set(.5, .5);
    this.filled = 1;
    return this.used = n;
  };

  DataBuffer.prototype.through = function(callback, target) {
    var consume, done, dst, emit, i, pipe, ref, src;
    ref = src = this.streamer, consume = ref.consume, done = ref.done;
    emit = (dst = target.streamer).emit;
    i = 0;
    pipe = function() {
      return consume(function(x, y, z, w) {
        return callback(emit, x, y, z, w, i);
      });
    };
    pipe = Util.Data.repeatCall(pipe, this.items);
    return (function(_this) {
      return function() {
        var limit;
        src.reset();
        dst.reset();
        limit = _this.used;
        i = 0;
        while (!done() && i < limit) {
          pipe();
          i++;
        }
        return src.count();
      };
    })(this);
  };

  return DataBuffer;

})(Buffer);

module.exports = DataBuffer;
