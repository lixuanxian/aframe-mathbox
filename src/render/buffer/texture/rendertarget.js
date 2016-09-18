/*
Virtual RenderTarget that cycles through multiple frames
Provides easy access to past rendered frames
@reads[] and @write contain WebGLRenderTargets whose internal pointers are rotated automatically
 */
var RenderTarget;

RenderTarget = (function() {
  function RenderTarget(gl, width, height, frames, options) {
    this.gl = gl;
    if (options == null) {
      options = {};
    }
    if (options.minFilter == null) {
      options.minFilter = THREE.NearestFilter;
    }
    if (options.magFilter == null) {
      options.magFilter = THREE.NearestFilter;
    }
    if (options.format == null) {
      options.format = THREE.RGBAFormat;
    }
    if (options.type == null) {
      options.type = THREE.UnsignedByteType;
    }
    this.options = options;
    this.width = width || 1;
    this.height = height || 1;
    this.frames = frames || 1;
    this.buffers = this.frames + 1;
    this.build();
  }

  RenderTarget.prototype.build = function() {
    var i, make;
    make = (function(_this) {
      return function() {
        return new THREE.WebGLRenderTarget(_this.width, _this.height, _this.options);
      };
    })(this);
    this.targets = (function() {
      var k, ref, results;
      results = [];
      for (i = k = 0, ref = this.buffers; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        results.push(make());
      }
      return results;
    }).call(this);
    this.reads = (function() {
      var k, ref, results;
      results = [];
      for (i = k = 0, ref = this.buffers; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        results.push(make());
      }
      return results;
    }).call(this);
    this.write = make();
    this.index = 0;
    return this.uniforms = {
      dataResolution: {
        type: 'v2',
        value: new THREE.Vector2(1 / this.width, 1 / this.height)
      },
      dataTexture: {
        type: 't',
        value: this.reads[0]
      },
      dataTextures: {
        type: 'tv',
        value: this.reads
      }
    };
  };

  RenderTarget.prototype.cycle = function() {
    var add, buffers, copy, i, k, keys, len, read, ref;
    keys = ['__webglTexture', '__webglFramebuffer', '__webglRenderbuffer'];
    buffers = this.buffers;
    copy = function(a, b) {
      var k, key, len;
      for (k = 0, len = keys.length; k < len; k++) {
        key = keys[k];
        b[key] = a[key];
      }
      return null;
    };
    add = function(i, j) {
      return (i + j + buffers * 2) % buffers;
    };
    copy(this.write, this.targets[this.index]);
    ref = this.reads;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      read = ref[i];
      copy(this.targets[add(this.index, -i)], read);
    }
    this.index = add(this.index, 1);
    return copy(this.targets[this.index], this.write);
  };

  RenderTarget.prototype.warmup = function(callback) {
    var i, k, ref, results;
    results = [];
    for (i = k = 0, ref = this.buffers; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      callback(this.write);
      results.push(this.cycle());
    }
    return results;
  };

  RenderTarget.prototype.dispose = function() {
    var k, len, ref, target;
    ref = this.targets;
    for (k = 0, len = ref.length; k < len; k++) {
      target = ref[k];
      target.dispose();
    }
    return this.targets = this.reads = this.write = null;
  };

  return RenderTarget;

})();

module.exports = RenderTarget;
