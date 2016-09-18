var Operator, Swizzle, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Operator = require('./operator');

Util = require('../../../util');

Swizzle = (function(superClass) {
  extend(Swizzle, superClass);

  function Swizzle() {
    return Swizzle.__super__.constructor.apply(this, arguments);
  }

  Swizzle.traits = ['node', 'bind', 'operator', 'source', 'index', 'swizzle'];

  Swizzle.prototype.sourceShader = function(shader) {
    shader = Swizzle.__super__.sourceShader.call(this, shader);
    if (this.swizzler) {
      shader.pipe(this.swizzler);
    }
    return shader;
  };

  Swizzle.prototype.make = function() {
    var order;
    Swizzle.__super__.make.apply(this, arguments);
    if (this.bind.source == null) {
      return;
    }
    order = this.props.order;
    if (order.join() !== '1234') {
      return this.swizzler = Util.GLSL.swizzleVec4(order, 4);
    }
  };

  Swizzle.prototype.unmake = function() {
    Swizzle.__super__.unmake.apply(this, arguments);
    return this.swizzler = null;
  };

  Swizzle.prototype.change = function(changed, touched, init) {
    if (touched['swizzle'] || touched['operator']) {
      return this.rebuild();
    }
  };

  return Swizzle;

})(Operator);

module.exports = Swizzle;
