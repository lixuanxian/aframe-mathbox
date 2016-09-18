var RenderFactory;

RenderFactory = (function() {
  function RenderFactory(classes, renderer, shaders) {
    this.classes = classes;
    this.renderer = renderer;
    this.shaders = shaders;
  }

  RenderFactory.prototype.getTypes = function() {
    return Object.keys(this.classes);
  };

  RenderFactory.prototype.make = function(type, options) {
    return new this.classes[type](this.renderer, this.shaders, options);
  };

  return RenderFactory;

})();

module.exports = RenderFactory;