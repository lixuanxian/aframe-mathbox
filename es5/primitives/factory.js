var PrimitiveFactory, Util;

Util = require('../util');

PrimitiveFactory = (function() {
  function PrimitiveFactory(definitions, context) {
    this.context = context;
    this.classes = definitions.Classes;
    this.helpers = definitions.Helpers;
  }

  PrimitiveFactory.prototype.getTypes = function() {
    return Object.keys(this.classes);
  };

  PrimitiveFactory.prototype.make = function(type, options, binds) {
    var klass, node, primitive;
    if (options == null) {
      options = {};
    }
    if (binds == null) {
      binds = null;
    }
    klass = this.classes[type];
    if (klass == null) {
      throw new Error("Unknown primitive class `" + type + "`");
    }
    node = new klass.model(type, klass.defaults, options, binds, klass, this.context.attributes);
    primitive = new klass(node, this.context, this.helpers);
    return node;
  };

  return PrimitiveFactory;

})();

module.exports = PrimitiveFactory;
