var Renderable;

Renderable = (function() {
  function Renderable(renderer, shaders) {
    this.renderer = renderer;
    this.shaders = shaders;
    this.gl = this.renderer.context;
    if (this.uniforms == null) {
      this.uniforms = {};
    }
  }

  Renderable.prototype.dispose = function() {
    return this.uniforms = null;
  };

  Renderable.prototype._adopt = function(uniforms) {
    var key, value;
    for (key in uniforms) {
      value = uniforms[key];
      this.uniforms[key] = value;
    }
  };

  Renderable.prototype._set = function(uniforms) {
    var key, value;
    for (key in uniforms) {
      value = uniforms[key];
      if (this.uniforms[key] != null) {
        this.uniforms[key].value = value;
      }
    }
  };

  return Renderable;

})();

module.exports = Renderable;
