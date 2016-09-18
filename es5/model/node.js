var Binder, Node, Util, nodeIndex;

Util = require('../util');

nodeIndex = 0;

Node = (function() {
  function Node(type, defaults, options, binds, config, attributes) {
    this.type = type;
    this._id = (++nodeIndex).toString();
    this.configure(config, attributes);
    this.parent = this.root = this.path = this.index = null;
    this.set(defaults, true, true);
    this.set(options, false, true);
    this.bind(binds, false);
  }

  Node.prototype.configure = function(config, attributes) {
    var finals, freeform, props, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, traits;
    traits = config.traits, props = config.props, finals = config.finals, freeform = config.freeform;
    if (traits == null) {
      traits = (ref = (ref1 = this._config) != null ? ref1.traits : void 0) != null ? ref : [];
    }
    if (props == null) {
      props = (ref2 = (ref3 = this._config) != null ? ref3.props : void 0) != null ? ref2 : {};
    }
    if (finals == null) {
      finals = (ref4 = (ref5 = this._config) != null ? ref5.finals : void 0) != null ? ref4 : {};
    }
    if (freeform == null) {
      freeform = (ref6 = (ref7 = this._config) != null ? ref7.freeform : void 0) != null ? ref6 : false;
    }
    this._config = {
      traits: traits,
      props: props,
      finals: finals,
      freeform: freeform
    };
    return this.attributes = attributes.apply(this, this._config);
  };

  Node.prototype.dispose = function() {
    this.attributes.dispose();
    return this.attributes = null;
  };

  Node.prototype._added = function(parent) {
    var event;
    this.parent = parent;
    this.root = parent.root;
    event = {
      type: 'add',
      node: this,
      parent: this.parent
    };
    if (this.root) {
      this.root.trigger(event);
    }
    event.type = 'added';
    return this.trigger(event);
  };

  Node.prototype._removed = function() {
    var event;
    event = {
      type: 'remove',
      node: this
    };
    if (this.root) {
      this.root.trigger(event);
    }
    event.type = 'removed';
    this.trigger(event);
    return this.root = this.parent = null;
  };

  Node.prototype._index = function(index, parent) {
    var path, ref;
    if (parent == null) {
      parent = this.parent;
    }
    this.index = index;
    this.path = path = index != null ? ((ref = parent != null ? parent.path : void 0) != null ? ref : []).concat([index]) : null;
    this.order = path != null ? this._encode(path) : Infinity;
    if (this.root != null) {
      return this.trigger({
        type: 'reindex'
      });
    }
  };

  Node.prototype._encode = function(path) {
    var a, b, f, g, i, index, k, len, lerp, map, ref;
    k = 3;
    map = function(x) {
      return k / (x + k);
    };
    lerp = function(t) {
      return b + (a - b) * t;
    };
    a = 1 + 1 / k;
    b = 0;
    for (i = 0, len = path.length; i < len; i++) {
      index = path[i];
      f = map(index + 1);
      g = map(index + 2);
      ref = [lerp(f), lerp(g)], a = ref[0], b = ref[1];
    }
    return a;
  };

  Node.prototype.toString = function() {
    var _id, count, id, ref, ref1, ref2, tag;
    _id = (ref = this.id) != null ? ref : this._id;
    tag = (ref1 = this.type) != null ? ref1 : 'node';
    id = tag;
    id += "#" + _id;
    if ((ref2 = this.classes) != null ? ref2.length : void 0) {
      id += "." + (this.classes.join('.'));
    }
    if (this.children != null) {
      if (count = this.children.length) {
        return "<" + id + ">…(" + count + ")…</" + tag + ">";
      } else {
        return "<" + id + "></" + tag + ">";
      }
    } else {
      return "<" + id + " />";
    }
  };

  Node.prototype.toMarkup = function(selector, indent) {
    var attr, child, children, close, expr, k, open, orig, props, recurse, ref, ref1, ref2, ref3, tag, v;
    if (selector == null) {
      selector = null;
    }
    if (indent == null) {
      indent = '';
    }
    if (selector && typeof selector !== 'function') {
      selector = (ref = (ref1 = this.root) != null ? ref1.model._matcher(selector) : void 0) != null ? ref : function() {
        return true;
      };
    }
    tag = (ref2 = this.type) != null ? ref2 : 'node';
    expr = this.expr;
    orig = {
      id: this._id
    };
    ref3 = typeof this.orig === "function" ? this.orig() : void 0;
    for (k in ref3) {
      v = ref3[k];
      orig[k] = v;
    }
    props = (function() {
      var results;
      results = [];
      for (k in orig) {
        v = orig[k];
        if (!this.expr[k]) {
          results.push(Util.Pretty.JSX.prop(k, v));
        }
      }
      return results;
    }).call(this);
    expr = (function() {
      var results;
      results = [];
      for (k in expr) {
        v = expr[k];
        results.push(Util.Pretty.JSX.bind(k, v));
      }
      return results;
    })();
    attr = [''];
    if (props.length) {
      attr = attr.concat(props);
    }
    if (expr.length) {
      attr = attr.concat(expr);
    }
    attr = attr.join(' ');
    child = indent;
    recurse = (function(_this) {
      return function() {
        var children, ref4;
        if (!((ref4 = _this.children) != null ? ref4.length : void 0)) {
          return '';
        }
        return children = _this.children.map(function(x) {
          return x.toMarkup(selector, child);
        }).filter(function(x) {
          return (x != null) && x.length;
        }).join("\n");
      };
    })(this);
    if (selector && !selector(this)) {
      return recurse();
    }
    if (this.children != null) {
      open = "<" + tag + attr + ">";
      close = "</" + tag + ">";
      child = indent + '  ';
      children = recurse();
      if (children.length) {
        children = "\n" + children + "\n" + indent;
      }
      if (children == null) {
        children = '';
      }
      return indent + open + children + close;
    } else {
      return indent + "<" + tag + attr + " />";
    }
  };

  Node.prototype.print = function(selector, level) {
    return Util.Pretty.print(this.toMarkup(selector), level);
  };

  return Node;

})();

Binder = require('../util/binder');

Binder.apply(Node.prototype);

module.exports = Node;
