var ALL, AUTO, CLASS, ID, Model, TRAIT, TYPE, cssauron, language,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

cssauron = require('cssauron');

ALL = '*';

ID = /^#([A-Za-z0-9_])$/;

CLASS = /^\.([A-Za-z0-9_]+)$/;

TRAIT = /^\[([A-Za-z0-9_]+)\]$/;

TYPE = /^[A-Za-z0-9_]+$/;

AUTO = /^<([0-9]+|<*)$/;

language = null;


/*

  Model that wraps a root node and its children.
  
  Monitors adds, removals and ID/class changes.
  Enables CSS selectors, both querying and watching.

  Watchers are primed differentially as changes come in,
  and fired with digest().
 */

Model = (function() {
  function Model(root) {
    var add, addClasses, addID, addNode, addTags, addTraits, addType, adopt, check, dispose, force, hashTags, prime, remove, removeClasses, removeID, removeNode, removeTags, removeTraits, removeType, unhashTags, update;
    this.root = root;
    this.root.model = this;
    this.root.root = this.root;
    this.ids = {};
    this.classes = {};
    this.traits = {};
    this.types = {};
    this.nodes = [];
    this.watchers = [];
    this.fire = false;
    this.lastNode = null;
    this.event = {
      type: 'update'
    };
    if (language == null) {
      language = cssauron({
        tag: 'type',
        id: 'id',
        "class": "classes.join(' ')",
        parent: 'parent',
        children: 'children',
        attr: 'traits.hash[attr]'
      });
    }
    add = (function(_this) {
      return function(event) {
        return adopt(event.node);
      };
    })(this);
    remove = (function(_this) {
      return function(event) {
        return dispose(event.node);
      };
    })(this);
    this.root.on('add', add);
    this.root.on('remove', remove);
    adopt = (function(_this) {
      return function(node) {
        addNode(node);
        addType(node);
        addTraits(node);
        node.on('change:node', update);
        update(null, node, true);
        return force(node);
      };
    })(this);
    dispose = (function(_this) {
      return function(node) {
        removeNode(node);
        removeType(node);
        removeTraits(node);
        removeID(node.id, node);
        removeClasses(node.classes, node);
        node.off('change:node', update);
        return force(node);
      };
    })(this);
    prime = (function(_this) {
      return function(node) {
        var i, len, ref, watcher;
        ref = _this.watchers;
        for (i = 0, len = ref.length; i < len; i++) {
          watcher = ref[i];
          watcher.match = watcher.matcher(node);
        }
        return null;
      };
    })(this);
    check = (function(_this) {
      return function(node) {
        var fire, i, len, ref, watcher;
        ref = _this.watchers;
        for (i = 0, len = ref.length; i < len; i++) {
          watcher = ref[i];
          fire = watcher.fire || (watcher.fire = watcher.match !== watcher.matcher(node));
          if (fire) {
            _this.lastNode = node;
          }
          _this.fire || (_this.fire = fire);
        }
        return null;
      };
    })(this);
    force = (function(_this) {
      return function(node) {
        var fire, i, len, ref, watcher;
        ref = _this.watchers;
        for (i = 0, len = ref.length; i < len; i++) {
          watcher = ref[i];
          fire = watcher.fire || (watcher.fire = watcher.matcher(node));
          if (fire) {
            _this.lastNode = node;
          }
          _this.fire || (_this.fire = fire);
        }
        return null;
      };
    })(this);
    this.digest = (function(_this) {
      return function() {
        var i, len, ref, watcher;
        if (!_this.fire) {
          return false;
        }
        ref = _this.watchers.slice();
        for (i = 0, len = ref.length; i < len; i++) {
          watcher = ref[i];
          if (!watcher.fire) {
            continue;
          }
          watcher.fire = false;
          watcher.handler();
        }
        _this.fire = false;
        return true;
      };
    })(this);
    update = (function(_this) {
      return function(event, node, init) {
        var _id, _klass, classes, id, klass, primed, ref, ref1;
        _id = init || event.changed['node.id'];
        _klass = init || event.changed['node.classes'];
        primed = false;
        if (_id) {
          id = node.get('node.id');
          if (id !== node.id) {
            if (!init) {
              prime(node);
            }
            primed = true;
            if (node.id != null) {
              removeID(node.id, node);
            }
            addID(id, node);
          }
        }
        if (_klass) {
          classes = (ref = node.get('node.classes')) != null ? ref : [];
          klass = classes.join(',');
          if (klass !== ((ref1 = node.classes) != null ? ref1.klass : void 0)) {
            classes = classes.slice();
            if (!(init || primed)) {
              prime(node);
            }
            primed = true;
            if (node.classes != null) {
              removeClasses(node.classes, node);
            }
            addClasses(classes, node);
            node.classes = classes;
            node.classes.klass = klass;
          }
        }
        if (!init && primed) {
          check(node);
        }
        return null;
      };
    })(this);
    addTags = function(sets, tags, node) {
      var i, k, len, list, ref;
      if (tags == null) {
        return;
      }
      for (i = 0, len = tags.length; i < len; i++) {
        k = tags[i];
        list = (ref = sets[k]) != null ? ref : [];
        list.push(node);
        sets[k] = list;
      }
      return null;
    };
    removeTags = function(sets, tags, node) {
      var i, index, k, len, list;
      if (tags == null) {
        return;
      }
      for (i = 0, len = tags.length; i < len; i++) {
        k = tags[i];
        list = sets[k];
        index = list.indexOf(node);
        if (index >= 0) {
          list.splice(index, 1);
        }
        if (list.length === 0) {
          delete sets[k];
        }
      }
      return null;
    };
    hashTags = function(array) {
      var hash, i, klass, len, results;
      if (!(array.length > 0)) {
        return;
      }
      hash = array.hash = {};
      results = [];
      for (i = 0, len = array.length; i < len; i++) {
        klass = array[i];
        results.push(hash[klass] = true);
      }
      return results;
    };
    unhashTags = function(array) {
      return delete array.hash;
    };
    addID = (function(_this) {
      return function(id, node) {
        if (_this.ids[id]) {
          throw new Error("Duplicate node id `" + id + "`");
        }
        if (id != null) {
          _this.ids[id] = [node];
        }
        return node.id = id != null ? id : node._id;
      };
    })(this);
    removeID = (function(_this) {
      return function(id, node) {
        if (id != null) {
          delete _this.ids[id];
        }
        return node.id = node._id;
      };
    })(this);
    addClasses = (function(_this) {
      return function(classes, node) {
        addTags(_this.classes, classes, node);
        if (classes != null) {
          return hashTags(classes);
        }
      };
    })(this);
    removeClasses = (function(_this) {
      return function(classes, node) {
        removeTags(_this.classes, classes, node);
        if (classes != null) {
          return unhashTags(classes);
        }
      };
    })(this);
    addNode = (function(_this) {
      return function(node) {
        return _this.nodes.push(node);
      };
    })(this);
    removeNode = (function(_this) {
      return function(node) {
        return _this.nodes.splice(_this.nodes.indexOf(node), 1);
      };
    })(this);
    addType = (function(_this) {
      return function(node) {
        return addTags(_this.types, [node.type], node);
      };
    })(this);
    removeType = (function(_this) {
      return function(node) {
        return removeTags(_this.types, [node.type], node);
      };
    })(this);
    addTraits = (function(_this) {
      return function(node) {
        addTags(_this.traits, node.traits, node);
        return hashTags(node.traits);
      };
    })(this);
    removeTraits = (function(_this) {
      return function(node) {
        removeTags(_this.traits, node.traits, node);
        return unhashTags(node.traits);
      };
    })(this);
    adopt(this.root);
    this.root.trigger({
      type: 'added'
    });
  }

  Model.prototype.filter = function(nodes, selector) {
    var i, len, matcher, node, results;
    matcher = this._matcher(selector);
    results = [];
    for (i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];
      if (matcher(node)) {
        results.push(node);
      }
    }
    return results;
  };

  Model.prototype.ancestry = function(nodes, parents) {
    var i, len, node, out, parent;
    out = [];
    for (i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];
      parent = node.parent;
      while (parent != null) {
        if (indexOf.call(parents, parent) >= 0) {
          out.push(node);
          break;
        }
        parent = parent.parent;
      }
    }
    return out;
  };

  Model.prototype.select = function(selector, parents) {
    var matches;
    matches = this._select(selector);
    if (parents != null) {
      matches = this.ancestry(matches, parents);
    }
    matches.sort(function(a, b) {
      return b.order - a.order;
    });
    return matches;
  };

  Model.prototype.watch = function(selector, handler) {
    var watcher;
    handler.unwatch = (function(_this) {
      return function() {
        return _this.unwatch(handler);
      };
    })(this);
    handler.watcher = watcher = {
      selector: selector,
      handler: handler,
      matcher: this._matcher(selector),
      match: false,
      fire: false
    };
    this.watchers.push(watcher);
    return this.select(selector);
  };

  Model.prototype.unwatch = function(handler) {
    var watcher;
    watcher = handler.watcher;
    if (watcher == null) {
      return;
    }
    this.watchers.splice(this.watchers.indexOf(watcher), 1);
    delete handler.unwatch;
    return delete handler.watcher;
  };

  Model.prototype._simplify = function(s) {
    var all, auto, found, id, klass, ref, ref1, ref2, ref3, ref4, trait, type;
    s = s.replace(/^\s+/, '');
    s = s.replace(/\s+$/, '');
    found = all = s === ALL;
    if (!found) {
      found = id = (ref = s.match(ID)) != null ? ref[1] : void 0;
    }
    if (!found) {
      found = klass = (ref1 = s.match(CLASS)) != null ? ref1[1] : void 0;
    }
    if (!found) {
      found = trait = (ref2 = s.match(TRAIT)) != null ? ref2[1] : void 0;
    }
    if (!found) {
      found = type = (ref3 = s.match(TYPE)) != null ? ref3[0] : void 0;
    }
    if (!found) {
      found = auto = (ref4 = s.match(AUTO)) != null ? ref4[0] : void 0;
    }
    return [all, id, klass, trait, type, auto];
  };

  Model.prototype._matcher = function(s) {
    var all, auto, id, klass, ref, trait, type;
    ref = this._simplify(s), all = ref[0], id = ref[1], klass = ref[2], trait = ref[3], type = ref[4], auto = ref[5];
    if (all) {
      return (function(node) {
        return true;
      });
    }
    if (id) {
      return (function(node) {
        return node.id === id;
      });
    }
    if (klass) {
      return (function(node) {
        var ref1, ref2;
        return (ref1 = node.classes) != null ? (ref2 = ref1.hash) != null ? ref2[klass] : void 0 : void 0;
      });
    }
    if (trait) {
      return (function(node) {
        var ref1, ref2;
        return (ref1 = node.traits) != null ? (ref2 = ref1.hash) != null ? ref2[trait] : void 0 : void 0;
      });
    }
    if (type) {
      return (function(node) {
        return node.type === type;
      });
    }
    if (auto) {
      throw "Auto-link matcher unsupported";
    }
    return language(s);
  };

  Model.prototype._select = function(s) {
    var all, id, klass, ref, ref1, ref2, ref3, ref4, trait, type;
    ref = this._simplify(s), all = ref[0], id = ref[1], klass = ref[2], trait = ref[3], type = ref[4];
    if (all) {
      return this.nodes;
    }
    if (id) {
      return (ref1 = this.ids[id]) != null ? ref1 : [];
    }
    if (klass) {
      return (ref2 = this.classes[klass]) != null ? ref2 : [];
    }
    if (trait) {
      return (ref3 = this.traits[trait]) != null ? ref3 : [];
    }
    if (type) {
      return (ref4 = this.types[type]) != null ? ref4 : [];
    }
    return this.filter(this.nodes, s);
  };

  Model.prototype.getRoot = function() {
    return this.root;
  };

  Model.prototype.getLastTrigger = function() {
    return this.lastNode.toString();
  };

  return Model;

})();

module.exports = Model;
