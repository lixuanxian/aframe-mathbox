var Binder, Model, Primitive,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Model = require('../model');

Primitive = (function() {
  Primitive.Node = Model.Node;

  Primitive.Group = Model.Group;

  Primitive.model = Primitive.Node;

  Primitive.defaults = null;

  Primitive.traits = null;

  Primitive.props = null;

  Primitive.finals = null;

  Primitive.freeform = false;

  function Primitive(node1, _context, helpers) {
    this.node = node1;
    this._context = _context;
    this._renderables = this._context.renderables;
    this._attributes = this._context.attributes;
    this._shaders = this._context.shaders;
    this._overlays = this._context.overlays;
    this._animator = this._context.animator;
    this._types = this._attributes.types;
    this.node.controller = this;
    this.node.on('added', (function(_this) {
      return function(event) {
        return _this._added();
      };
    })(this));
    this.node.on('removed', (function(_this) {
      return function(event) {
        return _this._removed();
      };
    })(this));
    this.node.on('change', (function(_this) {
      return function(event) {
        if (_this._root) {
          return _this.change(event.changed, event.touched);
        }
      };
    })(this));
    this.reconfigure();
    this._get = this.node.get.bind(this.node);
    this._helpers = helpers(this, this.node.traits);
    this._handlers = {
      inherit: {},
      listen: [],
      watch: [],
      compute: []
    };
    this._root = this._parent = null;
    this.init();
  }

  Primitive.prototype.is = function(trait) {
    return this.traits.hash[trait];
  };

  Primitive.prototype.init = function() {};

  Primitive.prototype.make = function() {};

  Primitive.prototype.made = function() {};

  Primitive.prototype.unmake = function(rebuild) {};

  Primitive.prototype.unmade = function() {};

  Primitive.prototype.change = function(changed, touched, init) {};

  Primitive.prototype.refresh = function() {
    return this.change({}, {}, true);
  };

  Primitive.prototype.rebuild = function() {
    if (this._root) {
      this._removed(true);
      return this._added();
    }
  };

  Primitive.prototype.reconfigure = function(config) {
    if (config != null) {
      this.node.configure(config, this._attributes);
    }
    this.traits = this.node.traits;
    return this.props = this.node.props;
  };

  Primitive.prototype._added = function() {
    var e, ref, ref1, ref2;
    this._parent = (ref = this.node.parent) != null ? ref.controller : void 0;
    this._root = (ref1 = this.node.root) != null ? ref1.controller : void 0;
    this.node.clock = (ref2 = this._inherit('clock')) != null ? ref2 : this._root;
    try {
      try {
        this.make();
        this.refresh();
        return this.made();
      } catch (_error) {
        e = _error;
        this.node.print('warn');
        console.error(e);
        throw e;
      }
    } catch (_error) {
      e = _error;
      try {
        return this._removed();
      } catch (_error) {}
    }
  };

  Primitive.prototype._removed = function(rebuild) {
    if (rebuild == null) {
      rebuild = false;
    }
    this.unmake(rebuild);
    this._unlisten();
    this._unattach();
    this._uncompute();
    this._root = null;
    this._parent = null;
    return this.unmade(rebuild);
  };

  Primitive.prototype._listen = function(object, type, method, self) {
    var i, len, o;
    if (self == null) {
      self = this;
    }
    if (object instanceof Array) {
      for (i = 0, len = object.length; i < len; i++) {
        o = object[i];
        return this.__listen(o, type, method, self);
      }
    }
    return this.__listen(object, type, method, self);
  };

  Primitive.prototype.__listen = function(object, type, method, self) {
    var handler;
    if (self == null) {
      self = this;
    }
    if (typeof object === 'string') {
      object = this._inherit(object);
    }
    if (object != null) {
      handler = method.bind(self);
      handler.node = this.node;
      object.on(type, handler);
      this._handlers.listen.push([object, type, handler]);
    }
    return object;
  };

  Primitive.prototype._unlisten = function() {
    var handler, i, len, object, ref, ref1, type;
    if (!this._handlers.listen.length) {
      return;
    }
    ref = this._handlers.listen;
    for (i = 0, len = ref.length; i < len; i++) {
      ref1 = ref[i], object = ref1[0], type = ref1[1], handler = ref1[2];
      object.off(type, handler);
    }
    return this._handlers.listen = [];
  };

  Primitive.prototype._inherit = function(trait) {
    var cached, ref;
    cached = this._handlers.inherit[trait];
    if (cached !== void 0) {
      return cached;
    }
    return this._handlers.inherit[trait] = (ref = this._parent) != null ? ref._find(trait != null ? trait : null) : void 0;
  };

  Primitive.prototype._find = function(trait) {
    var ref;
    if (this.is(trait)) {
      return this;
    }
    return (ref = this._parent) != null ? ref._find(trait) : void 0;
  };

  Primitive.prototype._uninherit = function() {
    return this._handlers.inherit = {};
  };

  Primitive.prototype._attach = function(selector, trait, method, self, start, optional, multiple) {
    var filter, flatten, map, nodes, resolve;
    if (self == null) {
      self = this;
    }
    if (start == null) {
      start = this;
    }
    if (optional == null) {
      optional = false;
    }
    if (multiple == null) {
      multiple = false;
    }
    filter = function(node) {
      if ((node != null) && indexOf.call(node.traits, trait) >= 0) {
        return node;
      }
    };
    map = function(node) {
      return node != null ? node.controller : void 0;
    };
    flatten = function(list) {
      var i, len, out, sub;
      if (list == null) {
        return list;
      }
      out = [];
      for (i = 0, len = list.length; i < len; i++) {
        sub = list[i];
        if (sub instanceof Array) {
          out = out.concat(sub);
        } else {
          out.push(sub);
        }
      }
      return out;
    };
    resolve = (function(_this) {
      return function(selector) {
        var discard, match, node, nodes, parent, previous, selection, watcher;
        if (typeof selector === 'object') {
          node = selector;
          if (node != null ? node._up : void 0) {
            selector = multiple ? node._targets : [node[0]];
            return selector;
          }
          if (node instanceof Array) {
            selector = multiple ? flatten(node.map(resolve)) : resolve(node[0]);
            return selector;
          }
          if (node instanceof Model.Node) {
            return [node];
          }
        } else if (typeof selector === 'string' && selector[0] === '<') {
          discard = 0;
          if (match = selector.match(/^<([0-9])+$/)) {
            discard = +match[1] - 1;
          }
          if (selector.match(/^<+$/)) {
            discard = +selector.length - 1;
          }
          nodes = [];
          previous = start.node;
          while (previous) {
            parent = previous.parent;
            if (!parent) {
              break;
            }
            previous = parent.children[previous.index - 1];
            if (!(previous || nodes.length)) {
              previous = parent;
            }
            node = null;
            if (filter(previous)) {
              node = previous;
            }
            if ((node != null) && discard-- <= 0) {
              nodes.push(node);
            }
            if (!multiple && nodes.length) {
              return nodes;
            }
          }
          if (multiple && nodes.length) {
            return nodes;
          }
        } else if (typeof selector === 'string') {
          watcher = method.bind(self);
          _this._handlers.watch.push(watcher);
          selection = _this._root.watch(selector, watcher);
          if (!multiple) {
            if (filter(selection[0])) {
              node = selection[0];
            }
            if (node != null) {
              return [node];
            }
          } else {
            nodes = selection.filter(filter);
            if (nodes.length) {
              return nodes;
            }
          }
        }
        if (!optional) {
          console.warn(_this.node.toMarkup());
          throw new Error((_this.node.toString()) + " - Could not find " + trait + " `" + selector + "`");
        }
        if (multiple) {
          return [];
        } else {
          return null;
        }
      };
    })(this);
    nodes = flatten(resolve(selector));
    if (multiple) {
      if (nodes != null) {
        return nodes.map(map);
      } else {
        return null;
      }
    } else {
      if (nodes != null) {
        return map(nodes[0]);
      } else {
        return null;
      }
    }
  };

  Primitive.prototype._unattach = function() {
    var i, len, ref, watcher;
    if (!this._handlers.watch.length) {
      return;
    }
    ref = this._handlers.watch;
    for (i = 0, len = ref.length; i < len; i++) {
      watcher = ref[i];
      if (watcher != null) {
        watcher.unwatch();
      }
    }
    return this._handlers.watch = [];
  };

  Primitive.prototype._compute = function(key, expr) {
    this._handlers.compute.push(key);
    return this.node.bind(key, expr, true);
  };

  Primitive.prototype._uncompute = function() {
    var i, key, len, ref;
    if (!this._handlers.compute.length) {
      return;
    }
    ref = this._handlers.compute;
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      this.node.unbind(key, true);
    }
    return this._handlers.compute = [];
  };

  return Primitive;

})();

Binder = require('../util/binder');

Binder.apply(Primitive.prototype);

module.exports = Primitive;
