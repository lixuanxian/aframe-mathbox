var Overlay;

Overlay = (function() {
  function Overlay(element, options) {
    this.element = element;
    if (typeof this.init === "function") {
      this.init(options);
    }
  }

  Overlay.prototype.dispose = function() {};

  return Overlay;

})();

module.exports = Overlay;
