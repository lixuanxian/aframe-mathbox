var DataTexture, Util;

Util = require('../../../Util');


/*
Manually allocated GL texture for data streaming.

Allows partial updates via subImage.
 */

DataTexture = (function() {
  function DataTexture(gl1, width, height, channels, options) {
    var gl, magFilter, minFilter, ref, ref1, ref2, type;
    this.gl = gl1;
    this.width = width;
    this.height = height;
    this.channels = channels;
    this.n = this.width * this.height * this.channels;
    gl = this.gl;
    minFilter = (ref = options.minFilter) != null ? ref : THREE.NearestFilter;
    magFilter = (ref1 = options.magFilter) != null ? ref1 : THREE.NearestFilter;
    type = (ref2 = options.type) != null ? ref2 : THREE.FloatType;
    this.minFilter = Util.Three.paramToGL(gl, minFilter);
    this.magFilter = Util.Three.paramToGL(gl, magFilter);
    this.type = Util.Three.paramToGL(gl, type);
    this.ctor = Util.Three.paramToArrayStorage(type);
    this.build(options);
  }

  DataTexture.prototype.getInternalFormat = function( glFormat, glType ) {

		var internalFormat = glFormat;
    var _gl = this.gl
		if ( glFormat === _gl.RED ) {

			if ( glType === _gl.FLOAT ) internalFormat = _gl.R32F;
			if ( glType === _gl.HALF_FLOAT ) internalFormat = _gl.R16F;
			if ( glType === _gl.UNSIGNED_BYTE ) internalFormat = _gl.R8;

		}

		if ( glFormat === _gl.RGB ) {

			if ( glType === _gl.FLOAT ) internalFormat = _gl.RGB32F;
			if ( glType === _gl.HALF_FLOAT ) internalFormat = _gl.RGB16F;
			if ( glType === _gl.UNSIGNED_BYTE ) internalFormat = _gl.RGB8;

		}

		if ( glFormat === _gl.RGBA ) {

			if ( glType === _gl.FLOAT ) internalFormat = _gl.RGBA32F;
			if ( glType === _gl.HALF_FLOAT ) internalFormat = _gl.RGBA16F;
			if ( glType === _gl.UNSIGNED_BYTE ) internalFormat = _gl.RGBA8;

		}

		if ( internalFormat === _gl.R16F || internalFormat === _gl.R32F ||
			internalFormat === _gl.RGBA16F || internalFormat === _gl.RGBA32F ) {

			// extensions.get( 'EXT_color_buffer_float' );

		} else if ( internalFormat === _gl.RGB16F || internalFormat === _gl.RGB32F ) {

			console.warn( 'THREE.WebGLRenderer: Floating point textures with RGB format not supported. Please use RGBA instead.' );

		}

		return internalFormat;

	}

  DataTexture.prototype.build = function(options) {
    var gl,state,internalFormat;
    gl = this.gl;
    state = gl._renderer.state
    this.texture = gl.createTexture();
    this.format = [null, gl.RED, gl.LUMINANCE_ALPHA, gl.RGB, gl.RGBA][this.channels];
    this.format3 = [null, THREE.LuminanceFormat, THREE.LuminanceAlphaFormat, THREE.RGBFormat, THREE.RGBAFormat][this.channels];
    internalFormat = this.getInternalFormat(this.format,this.type)
    state.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
    this.data = new this.ctor(this.n);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.texImage2D(gl.TEXTURE_2D,0,internalFormat, this.width, this.height, 0, this.format, this.type, this.data,0);
    this.textureObject = new THREE.Texture(new Image(), THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, options.minFilter, options.magFilter);

    this.textureProperties = gl._renderer.properties.get(this.textureObject)
    this.textureProperties.__webglInit = true
    this.textureProperties.__webglTexture  = this.texture

    this.textureObject.format = this.format3;
    this.textureObject.type = THREE.FloatType;
    this.textureObject.unpackAlignment = 1;
    this.textureObject.flipY = false;
    this.textureObject.generateMipmaps = false;
    return this.uniforms = {
      dataResolution: {
        type: 'v2',
        value: new THREE.Vector2(1 / this.width, 1 / this.height)
      },
      dataTexture: {
        type: 't',
        value: this.textureObject
      }
    };
  };

  DataTexture.prototype.write = function(data, x, y, w, h) {
    var gl,state;
    gl = this.gl;
    state = gl._renderer.state
    state.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    return gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, this.format, this.type, data);
  };

  DataTexture.prototype.dispose = function() {
    this.gl.deleteTexture(this.texture);
    this.textureProperties.__webglInit = false;
    this.textureProperties.__webglTexture = null;
    this.textureProperties = null
    return this.textureObject = this.texture = null;
  };

  return DataTexture;

})();

module.exports = DataTexture;
