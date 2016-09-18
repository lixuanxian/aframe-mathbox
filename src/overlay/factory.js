var OverlayFactory;

OverlayFactory = (function() {
  function OverlayFactory(classes, canvas) {
    var div;
    this.classes = classes;
    this.canvas = canvas;
    div = document.createElement('div');
    div.classList.add('mathbox-overlays');
    this.div = div;
  }

  OverlayFactory.prototype.inject = function() {
    var element;
    element = this.canvas.parentNode;
    if (!element) {
      throw new Error("Canvas not inserted into document.");
    }
    return element.insertBefore(this.div, this.canvas);
  };

  OverlayFactory.prototype.unject = function() {
    var element;
    element = this.div.parentNode;
    return element.removeChild(this.div);
  };

  OverlayFactory.prototype.getTypes = function() {
    return Object.keys(this.classes);
  };

  OverlayFactory.prototype.make = function(type, options) {
    return new this.classes[type](this.div, options);
  };

  return OverlayFactory;

})();

module.exports = OverlayFactory;
