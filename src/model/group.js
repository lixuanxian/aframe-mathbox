var Group, Node,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require('./node');

Group = (function(superClass) {
  extend(Group, superClass);

  function Group(type, defaults, options, binds, config, attributes) {
    Group.__super__.constructor.call(this, type, defaults, options, binds, config, attributes);
    this.children = [];
    this.on('reindex', (function(_this) {
      return function(event) {
        var child, j, len, ref, results;
        ref = _this.children;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          results.push(child.trigger(event));
        }
        return results;
      };
    })(this));
  }

  Group.prototype.add = function(node) {
    var ref;
    if ((ref = node.parent) != null) {
      ref.remove(node);
    }
    node._index(this.children.length, this);
    this.children.push(node);
    return node._added(this);
  };

  Group.prototype.remove = function(node) {
    var i, index, j, len, ref, ref1;
    if ((ref = node.children) != null ? ref.length : void 0) {
      node.empty();
    }
    index = this.children.indexOf(node);
    if (index === -1) {
      return;
    }
    this.children.splice(index, 1);
    node._index(null);
    node._removed(this);
    ref1 = this.children;
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      node = ref1[i];
      if (i >= index) {
        node._index(i);
      }
    }
  };

  Group.prototype.empty = function() {
    var children, j, len, node;
    children = this.children.slice().reverse();
    for (j = 0, len = children.length; j < len; j++) {
      node = children[j];
      this.remove(node);
    }
  };

  return Group;

})(Node);

module.exports = Group;
