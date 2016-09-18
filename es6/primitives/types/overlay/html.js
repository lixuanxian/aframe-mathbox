var HTML, Util, Voxel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Voxel = require('../data/voxel');

Util = require('../../../util');

HTML = (function(superClass) {
  extend(HTML, superClass);

  function HTML() {
    return HTML.__super__.constructor.apply(this, arguments);
  }

  HTML.traits = ['node', 'buffer', 'active', 'data', 'voxel', 'html'];

  HTML.finals = {
    channels: 1
  };

  HTML.prototype.init = function() {
    HTML.__super__.init.apply(this, arguments);
    return this.storage = 'pushBuffer';
  };

  HTML.prototype.make = function() {
    var depth, height, items, ref, width;
    HTML.__super__.make.apply(this, arguments);
    ref = this.getDimensions(), items = ref.items, width = ref.width, height = ref.height, depth = ref.depth;
    this.dom = this._overlays.make('dom');
    return this.dom.hint(items * width * height * depth);
  };

  HTML.prototype.unmake = function() {
    HTML.__super__.unmake.apply(this, arguments);
    if (this.dom != null) {
      this.dom.dispose();
      return this.dom = null;
    }
  };

  HTML.prototype.update = function() {
    return HTML.__super__.update.apply(this, arguments);
  };

  HTML.prototype.change = function(changed, touched, init) {
    if (touched['html']) {
      return this.rebuild();
    }
    return HTML.__super__.change.call(this, changed, touched, init);
  };

  HTML.prototype.nodes = function() {
    return this.buffer.read();
  };

  HTML.prototype.callback = function(callback) {
    var el;
    el = this.dom.el;
    if (callback.length <= 6) {
      return function(emit, i, j, k, l) {
        return callback(emit, el, i, j, k, l);
      };
    } else {
      return (function(_this) {
        return function(emit, i, j, k, l) {
          return callback(emit, el, i, j, k, l, _this.bufferClock, _this.bufferStep);
        };
      })(this);
    }
  };

  return HTML;

})(Voxel);

module.exports = HTML;
