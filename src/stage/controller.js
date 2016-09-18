var Controller, Util;

Util = require('../util');

Controller = (function() {
  function Controller(model, primitives) {
    this.model = model;
    this.primitives = primitives;
  }

  Controller.prototype.getRoot = function() {
    return this.model.getRoot();
  };

  Controller.prototype.getTypes = function() {
    return this.primitives.getTypes();
  };

  Controller.prototype.make = function(type, options, binds) {
    return this.primitives.make(type, options, binds);
  };

  Controller.prototype.get = function(node, key) {
    return node.get(key);
  };

  Controller.prototype.set = function(node, key, value) {
    var e;
    try {
      return node.set(key, value);
    } catch (_error) {
      e = _error;
      node.print(null, 'warn');
      return console.error(e);
    }
  };

  Controller.prototype.bind = function(node, key, expr) {
    var e;
    try {
      return node.bind(key, expr);
    } catch (_error) {
      e = _error;
      node.print(null, 'warn');
      return console.error(e);
    }
  };

  Controller.prototype.unbind = function(node, key) {
    var e;
    try {
      return node.unbind(key);
    } catch (_error) {
      e = _error;
      node.print(null, 'warn');
      return console.error(e);
    }
  };

  Controller.prototype.add = function(node, target) {
    if (target == null) {
      target = this.model.getRoot();
    }
    return target.add(node);
  };

  Controller.prototype.remove = function(node) {
    var target;
    target = node.parent;
    if (target) {
      return target.remove(node);
    }
  };

  return Controller;

})();

module.exports = Controller;
