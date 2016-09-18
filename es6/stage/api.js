var API, Util;

Util = require('../util');

API = (function() {
  API.prototype.v2 = function() {
    return this;
  };

  function API(_context, _up, _targets) {
    var i, j, l, len, len1, ref, ref1, root, t, type;
    this._context = _context;
    this._up = _up;
    this._targets = _targets;
    root = this._context.controller.getRoot();
    if (this._targets == null) {
      this._targets = [root];
    }
    this.isRoot = this._targets.length === 1 && this._targets[0] === root;
    this.isLeaf = this._targets.length === 1 && (this._targets[0].children == null);
    ref = this._targets;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      t = ref[i];
      this[i] = t;
    }
    this.length = this._targets.length;
    ref1 = this._context.controller.getTypes();
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      type = ref1[l];
      if (type !== 'root') {
        (function(_this) {
          return (function(type) {
            return _this[type] = function(options, binds) {
              return _this.add(type, options, binds);
            };
          });
        })(this)(type);
      }
    }
  }

  API.prototype.select = function(selector) {
    var targets;
    targets = this._context.model.select(selector, !this.isRoot ? this._targets : null);
    return this._push(targets);
  };

  API.prototype.eq = function(index) {
    if (this._targets.length > index) {
      return this._push([this._targets[index]]);
    }
    return this._push([]);
  };

  API.prototype.filter = function(callback) {
    var matcher;
    if (typeof callback === 'string') {
      matcher = this._context.model._matcher(callback);
      callback = function(x) {
        return matcher(x);
      };
    }
    return this._push(this._targets.filter(callback));
  };

  API.prototype.map = function(callback) {
    var i, j, ref, results;
    results = [];
    for (i = j = 0, ref = this.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      results.push(callback(this[i], i, this));
    }
    return results;
  };

  API.prototype.each = function(callback) {
    var i, j, ref;
    for (i = j = 0, ref = this.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      callback(this[i], i, this);
    }
    return this;
  };

  API.prototype.add = function(type, options, binds) {
    var controller, j, len, node, nodes, ref, target;
    controller = this._context.controller;
    if (this.isLeaf) {
      return this._pop().add(type, options, binds);
    }
    nodes = [];
    ref = this._targets;
    for (j = 0, len = ref.length; j < len; j++) {
      target = ref[j];
      node = controller.make(type, options, binds);
      controller.add(node, target);
      nodes.push(node);
    }
    return this._push(nodes);
  };

  API.prototype.remove = function(selector) {
    var j, len, ref, target;
    if (selector) {
      return this.select(selector).remove();
    }
    ref = this._targets.slice().reverse();
    for (j = 0, len = ref.length; j < len; j++) {
      target = ref[j];
      this._context.controller.remove(target);
    }
    return this._pop();
  };

  API.prototype.set = function(key, value) {
    var j, len, ref, target;
    ref = this._targets;
    for (j = 0, len = ref.length; j < len; j++) {
      target = ref[j];
      this._context.controller.set(target, key, value);
    }
    return this;
  };

  API.prototype.getAll = function(key) {
    var j, len, ref, results, target;
    ref = this._targets;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      target = ref[j];
      results.push(this._context.controller.get(target, key));
    }
    return results;
  };

  API.prototype.get = function(key) {
    var ref;
    return (ref = this._targets[0]) != null ? ref.get(key) : void 0;
  };

  API.prototype.evaluate = function(key, time) {
    var ref;
    return (ref = this._targets[0]) != null ? ref.evaluate(key, time) : void 0;
  };

  API.prototype.bind = function(key, value) {
    var j, len, ref, target;
    ref = this._targets;
    for (j = 0, len = ref.length; j < len; j++) {
      target = ref[j];
      this._context.controller.bind(target, key, value);
    }
    return this;
  };

  API.prototype.unbind = function(key) {
    var j, len, ref, target;
    ref = this._targets;
    for (j = 0, len = ref.length; j < len; j++) {
      target = ref[j];
      this._context.controller.unbind(target, key);
    }
    return this;
  };

  API.prototype.end = function() {
    return (this.isLeaf ? this._pop() : this)._pop();
  };

  API.prototype._push = function(targets) {
    return new API(this._context, this, targets);
  };

  API.prototype._pop = function() {
    var ref;
    return (ref = this._up) != null ? ref : this;
  };

  API.prototype._reset = function() {
    var ref, ref1;
    return (ref = (ref1 = this._up) != null ? ref1.reset() : void 0) != null ? ref : this;
  };

  API.prototype.map = function(callback) {
    return this._targets.map(callback);
  };

  API.prototype["on"] = function() {
    var args;
    args = arguments;
    this._targets.map(function(x) {
      return x.on.apply(x, args);
    });
    return this;
  };

  API.prototype["off"] = function() {
    var args;
    args = arguments;
    this._targets.map(function(x) {
      return x.on.apply(x, args);
    });
    return this;
  };

  API.prototype.toString = function() {
    var tags;
    tags = this._targets.map(function(x) {
      return x.toString();
    });
    if (this._targets.length > 1) {
      return "[" + (tags.join(", ")) + "]";
    } else {
      return tags[0];
    }
  };

  API.prototype.toMarkup = function() {
    var tags;
    tags = this._targets.map(function(x) {
      return x.toMarkup();
    });
    return tags.join("\n\n");
  };

  API.prototype.print = function() {
    Util.Pretty.print(this._targets.map(function(x) {
      return x.toMarkup();
    }).join("\n\n"));
    return this;
  };

  API.prototype.debug = function() {
    var getName, info, j, len, name, ref, shader, shaders;
    info = this.inspect();
    console.log('Renderables: ', info.renderables);
    console.log('Renders: ', info.renders);
    console.log('Shaders: ', info.shaders);
    getName = function(owner) {
      return owner.constructor.toString().match('function +([^(]*)')[1];
    };
    shaders = [];
    ref = info.shaders;
    for (j = 0, len = ref.length; j < len; j++) {
      shader = ref[j];
      name = getName(shader.owner);
      shaders.push(name + " - Vertex");
      shaders.push(shader.vertex);
      shaders.push(name + " - Fragment");
      shaders.push(shader.fragment);
    }
    return ShaderGraph.inspect(shaders);
  };

  API.prototype.inspect = function(selector, trait, print) {
    var _info, flatten, info, j, k, len, make, map, recurse, ref, renderables, self, target;
    if (typeof trait === 'boolean') {
      print = trait;
      trait = null;
    }
    if (print == null) {
      print = true;
    }
    map = function(node) {
      var ref, ref1;
      return (ref = (ref1 = node.controller) != null ? ref1.objects : void 0) != null ? ref : [];
    };
    recurse = self = function(node, list) {
      var child, j, len, ref;
      if (list == null) {
        list = [];
      }
      if (!trait || node.traits.hash[trait]) {
        list.push(map(node));
      }
      if (node.children != null) {
        ref = node.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          self(child, list);
        }
      }
      return list;
    };
    flatten = function(list) {
      list = list.reduce((function(a, b) {
        return a.concat(b);
      }), []);
      return list = list.filter(function(x, i) {
        return (x != null) && list.indexOf(x) === i;
      });
    };
    make = function(renderable, render) {
      var d;
      d = {};
      d.owner = renderable;
      d.geometry = render.geometry;
      d.material = render.material;
      d.vertex = render.material.vertexGraph;
      d.fragment = render.material.fragmentGraph;
      return d;
    };
    info = {
      nodes: this._targets.slice(),
      renderables: [],
      renders: [],
      shaders: []
    };
    ref = this._targets;
    for (j = 0, len = ref.length; j < len; j++) {
      target = ref[j];
      if (print) {
        target.print(selector, 'info');
      }
      _info = {
        renderables: renderables = flatten(recurse(target)),
        renders: flatten(renderables.map(function(x) {
          return x.renders;
        })),
        shaders: flatten(renderables.map(function(x) {
          var ref1;
          return (ref1 = x.renders) != null ? ref1.map(function(r) {
            return make(x, r);
          }) : void 0;
        }))
      };
      for (k in _info) {
        info[k] = info[k].concat(_info[k]);
      }
    }
    return info;
  };

  return API;

})();

module.exports = API;
