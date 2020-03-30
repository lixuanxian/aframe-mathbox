(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
  Graph of nodes with outlets
 */
var Graph;

Graph = (function() {
  Graph.index = 0;

  Graph.id = function(name) {
    return ++Graph.index;
  };

  Graph.IN = 0;

  Graph.OUT = 1;

  function Graph(nodes, parent) {
    this.parent = parent != null ? parent : null;
    this.id = Graph.id();
    this.nodes = [];
    nodes && this.add(nodes);
  }

  Graph.prototype.inputs = function() {
    var i, inputs, j, len, len1, node, outlet, ref, ref1;
    inputs = [];
    ref = this.nodes;
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      ref1 = node.inputs;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        outlet = ref1[j];
        if (outlet.input === null) {
          inputs.push(outlet);
        }
      }
    }
    return inputs;
  };

  Graph.prototype.outputs = function() {
    var i, j, len, len1, node, outlet, outputs, ref, ref1;
    outputs = [];
    ref = this.nodes;
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      ref1 = node.outputs;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        outlet = ref1[j];
        if (outlet.output.length === 0) {
          outputs.push(outlet);
        }
      }
    }
    return outputs;
  };

  Graph.prototype.getIn = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.inputs();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Graph.prototype.getOut = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.outputs();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Graph.prototype.add = function(node, ignore) {
    var _node, i, len;
    if (node.length) {
      for (i = 0, len = node.length; i < len; i++) {
        _node = node[i];
        this.add(_node);
      }
      return;
    }
    if (node.graph && !ignore) {
      throw new Error("Adding node to two graphs at once");
    }
    node.graph = this;
    return this.nodes.push(node);
  };

  Graph.prototype.remove = function(node, ignore) {
    var _node, i, len;
    if (node.length) {
      for (i = 0, len = node.length; i < len; i++) {
        _node = node[i];
        this.remove(_node);
      }
      return;
    }
    if (node.graph !== this) {
      throw new Error("Removing node from wrong graph.");
    }
    ignore || node.disconnect();
    this.nodes.splice(this.nodes.indexOf(node), 1);
    return node.graph = null;
  };

  Graph.prototype.adopt = function(node) {
    var _node, i, len;
    if (node.length) {
      for (i = 0, len = node.length; i < len; i++) {
        _node = node[i];
        this.adopt(_node);
      }
      return;
    }
    node.graph.remove(node, true);
    return this.add(node, true);
  };

  return Graph;

})();

module.exports = Graph;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9HcmFwaC9ncmFwaC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL0dyYXBoL2dyYXBoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztBQUFBLElBQUE7O0FBR007RUFDSixLQUFDLENBQUEsS0FBRCxHQUFROztFQUNSLEtBQUMsQ0FBQSxFQUFELEdBQUssU0FBQyxJQUFEO1dBQVUsRUFBRSxLQUFLLENBQUM7RUFBbEI7O0VBRUwsS0FBQyxDQUFBLEVBQUQsR0FBSzs7RUFDTCxLQUFDLENBQUEsR0FBRCxHQUFNOztFQUVPLGVBQUMsS0FBRCxFQUFRLE1BQVI7SUFBUSxJQUFDLENBQUEsMEJBQUQsU0FBVTtJQUM3QixJQUFDLENBQUEsRUFBRCxHQUFTLEtBQUssQ0FBQyxFQUFOLENBQUE7SUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsS0FBQSxJQUFTLElBQUMsQ0FBQSxHQUFELENBQUssS0FBTDtFQUhFOztrQkFLYixNQUFBLEdBQVEsU0FBQTtBQUNOLFFBQUE7SUFBQSxNQUFBLEdBQVM7QUFDVDtBQUFBLFNBQUEscUNBQUE7O0FBQ0U7QUFBQSxXQUFBLHdDQUFBOztZQUFtRCxNQUFNLENBQUMsS0FBUCxLQUFnQjtVQUFuRSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVo7O0FBQUE7QUFERjtBQUVBLFdBQU87RUFKRDs7a0JBTVIsT0FBQSxHQUFTLFNBQUE7QUFDUCxRQUFBO0lBQUEsT0FBQSxHQUFVO0FBQ1Y7QUFBQSxTQUFBLHFDQUFBOztBQUNFO0FBQUEsV0FBQSx3Q0FBQTs7WUFBcUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFkLEtBQXdCO1VBQTdFLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBYjs7QUFBQTtBQURGO0FBRUEsV0FBTztFQUpBOztrQkFNVCxLQUFBLEdBQVEsU0FBQyxJQUFEO0FBQVUsUUFBQTtXQUFBOztBQUFDO0FBQUE7V0FBQSxxQ0FBQTs7WUFBcUMsTUFBTSxDQUFDLElBQVAsS0FBZTt1QkFBcEQ7O0FBQUE7O2lCQUFELENBQTJELENBQUEsQ0FBQTtFQUFyRTs7a0JBQ1IsTUFBQSxHQUFRLFNBQUMsSUFBRDtBQUFVLFFBQUE7V0FBQTs7QUFBQztBQUFBO1dBQUEscUNBQUE7O1lBQXFDLE1BQU0sQ0FBQyxJQUFQLEtBQWU7dUJBQXBEOztBQUFBOztpQkFBRCxDQUEyRCxDQUFBLENBQUE7RUFBckU7O2tCQUVSLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxNQUFQO0FBRUgsUUFBQTtJQUFBLElBQUcsSUFBSSxDQUFDLE1BQVI7QUFDRSxXQUFBLHNDQUFBOztRQUFBLElBQUMsQ0FBQSxHQUFELENBQUssS0FBTDtBQUFBO0FBQ0EsYUFGRjs7SUFJQSxJQUF1RCxJQUFJLENBQUMsS0FBTCxJQUFlLENBQUMsTUFBdkU7QUFBQSxZQUFNLElBQUksS0FBSixDQUFVLG1DQUFWLEVBQU47O0lBRUEsSUFBSSxDQUFDLEtBQUwsR0FBYTtXQUNiLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVo7RUFURzs7a0JBV0wsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLE1BQVA7QUFDTixRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsTUFBUjtBQUNFLFdBQUEsc0NBQUE7O1FBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSO0FBQUE7QUFDQSxhQUZGOztJQUlBLElBQXFELElBQUksQ0FBQyxLQUFMLEtBQWMsSUFBbkU7QUFBQSxZQUFNLElBQUksS0FBSixDQUFVLGlDQUFWLEVBQU47O0lBRUEsTUFBQSxJQUFVLElBQUksQ0FBQyxVQUFMLENBQUE7SUFFVixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxJQUFmLENBQWQsRUFBb0MsQ0FBcEM7V0FDQSxJQUFJLENBQUMsS0FBTCxHQUFhO0VBVlA7O2tCQVlSLEtBQUEsR0FBTyxTQUFDLElBQUQ7QUFDTCxRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsTUFBUjtBQUNFLFdBQUEsc0NBQUE7O1FBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxLQUFQO0FBQUE7QUFDQSxhQUZGOztJQUlBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBWCxDQUFrQixJQUFsQixFQUF3QixJQUF4QjtXQUNBLElBQUMsQ0FBQyxHQUFGLENBQU0sSUFBTixFQUFZLElBQVo7RUFOSzs7Ozs7O0FBUVQsTUFBTSxDQUFDLE9BQVAsR0FBaUIifQ==

},{}],2:[function(require,module,exports){
exports.Graph = require('./graph');

exports.Node = require('./node');

exports.Outlet = require('./outlet');

exports.IN = exports.Graph.IN;

exports.OUT = exports.Graph.OUT;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9HcmFwaC9pbmRleC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL0dyYXBoL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsS0FBUixHQUFpQixPQUFBLENBQVEsU0FBUjs7QUFDakIsT0FBTyxDQUFDLElBQVIsR0FBaUIsT0FBQSxDQUFRLFFBQVI7O0FBQ2pCLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLE9BQUEsQ0FBUSxVQUFSOztBQUVqQixPQUFPLENBQUMsRUFBUixHQUFjLE9BQU8sQ0FBQyxLQUFLLENBQUM7O0FBQzVCLE9BQU8sQ0FBQyxHQUFSLEdBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyJ9

},{"./graph":1,"./node":3,"./outlet":4}],3:[function(require,module,exports){
var Graph, Node, Outlet;

Graph = require('./graph');

Outlet = require('./outlet');


/*
 Node in graph.
 */

Node = (function() {
  Node.index = 0;

  Node.id = function(name) {
    return ++Node.index;
  };

  function Node(owner, outlets) {
    this.owner = owner;
    this.graph = null;
    this.inputs = [];
    this.outputs = [];
    this.all = [];
    this.outlets = null;
    this.id = Node.id();
    this.setOutlets(outlets);
  }

  Node.prototype.getIn = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.inputs;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Node.prototype.getOut = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.outputs;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Node.prototype.get = function(name) {
    return this.getIn(name) || this.getOut(name);
  };

  Node.prototype.setOutlets = function(outlets) {
    var existing, hash, i, j, k, key, len, len1, len2, match, outlet, ref;
    if (outlets != null) {
      if (this.outlets == null) {
        this.outlets = {};
        for (i = 0, len = outlets.length; i < len; i++) {
          outlet = outlets[i];
          if (!(outlet instanceof Outlet)) {
            outlet = Outlet.make(outlet);
          }
          this._add(outlet);
        }
        return;
      }
      hash = function(outlet) {
        return [outlet.name, outlet.inout, outlet.type].join('-');
      };
      match = {};
      for (j = 0, len1 = outlets.length; j < len1; j++) {
        outlet = outlets[j];
        match[hash(outlet)] = true;
      }
      ref = this.outlets;
      for (key in ref) {
        outlet = ref[key];
        key = hash(outlet);
        if (match[key]) {
          match[key] = outlet;
        } else {
          this._remove(outlet);
        }
      }
      for (k = 0, len2 = outlets.length; k < len2; k++) {
        outlet = outlets[k];
        existing = match[hash(outlet)];
        if (existing instanceof Outlet) {
          this._morph(existing, outlet);
        } else {
          if (!(outlet instanceof Outlet)) {
            outlet = Outlet.make(outlet);
          }
          this._add(outlet);
        }
      }
      this;
    }
    return this.outlets;
  };

  Node.prototype.connect = function(node, empty, force) {
    var dest, dests, hint, hints, i, j, k, len, len1, len2, list, outlets, ref, ref1, ref2, source, sources, type, typeHint;
    outlets = {};
    hints = {};
    typeHint = function(outlet) {
      return type + '/' + outlet.hint;
    };
    ref = node.inputs;
    for (i = 0, len = ref.length; i < len; i++) {
      dest = ref[i];
      if (!force && dest.input) {
        continue;
      }
      type = dest.type;
      hint = typeHint(dest);
      if (!hints[hint]) {
        hints[hint] = dest;
      }
      outlets[type] = list = outlets[type] || [];
      list.push(dest);
    }
    sources = this.outputs;
    sources = sources.filter(function(outlet) {
      return !(empty && outlet.output.length);
    });
    ref1 = sources.slice();
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      source = ref1[j];
      type = source.type;
      hint = typeHint(source);
      dests = outlets[type];
      if (dest = hints[hint]) {
        source.connect(dest);
        delete hints[hint];
        dests.splice(dests.indexOf(dest), 1);
        sources.splice(sources.indexOf(source), 1);
      }
    }
    if (!sources.length) {
      return this;
    }
    ref2 = sources.slice();
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      source = ref2[k];
      type = source.type;
      dests = outlets[type];
      if (dests && dests.length) {
        source.connect(dests.shift());
      }
    }
    return this;
  };

  Node.prototype.disconnect = function(node) {
    var i, j, len, len1, outlet, ref, ref1;
    ref = this.inputs;
    for (i = 0, len = ref.length; i < len; i++) {
      outlet = ref[i];
      outlet.disconnect();
    }
    ref1 = this.outputs;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      outlet = ref1[j];
      outlet.disconnect();
    }
    return this;
  };

  Node.prototype._key = function(outlet) {
    return [outlet.name, outlet.inout].join('-');
  };

  Node.prototype._add = function(outlet) {
    var key;
    key = this._key(outlet);
    if (outlet.node) {
      throw new Error("Adding outlet to two nodes at once.");
    }
    if (this.outlets[key]) {
      throw new Error("Adding two identical outlets to same node. (" + key + ")");
    }
    outlet.node = this;
    if (outlet.inout === Graph.IN) {
      this.inputs.push(outlet);
    }
    if (outlet.inout === Graph.OUT) {
      this.outputs.push(outlet);
    }
    this.all.push(outlet);
    return this.outlets[key] = outlet;
  };

  Node.prototype._morph = function(existing, outlet) {
    var key;
    key = this._key(outlet);
    delete this.outlets[key];
    existing.morph(outlet);
    key = this._key(outlet);
    return this.outlets[key] = outlet;
  };

  Node.prototype._remove = function(outlet) {
    var inout, key;
    key = this._key(outlet);
    inout = outlet.inout;
    if (outlet.node !== this) {
      throw new Error("Removing outlet from wrong node.");
    }
    outlet.disconnect();
    outlet.node = null;
    delete this.outlets[key];
    if (outlet.inout === Graph.IN) {
      this.inputs.splice(this.inputs.indexOf(outlet), 1);
    }
    if (outlet.inout === Graph.OUT) {
      this.outputs.splice(this.outputs.indexOf(outlet), 1);
    }
    this.all.splice(this.all.indexOf(outlet), 1);
    return this;
  };

  return Node;

})();

module.exports = Node;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9HcmFwaC9ub2RlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvR3JhcGgvbm9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOzs7QUFFVDs7OztBQUdNO0VBQ0osSUFBQyxDQUFBLEtBQUQsR0FBUTs7RUFDUixJQUFDLENBQUEsRUFBRCxHQUFLLFNBQUMsSUFBRDtXQUFVLEVBQUUsSUFBSSxDQUFDO0VBQWpCOztFQUVRLGNBQUMsS0FBRCxFQUFTLE9BQVQ7SUFBQyxJQUFDLENBQUEsUUFBRDtJQUNaLElBQUMsQ0FBQSxLQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsTUFBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxHQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLEVBQUQsR0FBVyxJQUFJLENBQUMsRUFBTCxDQUFBO0lBRVgsSUFBQyxDQUFBLFVBQUQsQ0FBWSxPQUFaO0VBUlc7O2lCQVdiLEtBQUEsR0FBTyxTQUFDLElBQUQ7QUFDTCxRQUFBO1dBQUE7O0FBQUM7QUFBQTtXQUFBLHFDQUFBOztZQUFrQyxNQUFNLENBQUMsSUFBUCxLQUFlO3VCQUFqRDs7QUFBQTs7aUJBQUQsQ0FBd0QsQ0FBQSxDQUFBO0VBRG5EOztpQkFJUCxNQUFBLEdBQVEsU0FBQyxJQUFEO0FBQ04sUUFBQTtXQUFBOztBQUFDO0FBQUE7V0FBQSxxQ0FBQTs7WUFBbUMs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

},{"./graph":1,"./outlet":4}],4:[function(require,module,exports){
var Graph, Outlet;

Graph = require('./graph');


/*
  In/out outlet on node
 */

Outlet = (function() {
  Outlet.make = function(outlet, extra) {
    var key, meta, ref, value;
    if (extra == null) {
      extra = {};
    }
    meta = extra;
    if (outlet.meta != null) {
      ref = outlet.meta;
      for (key in ref) {
        value = ref[key];
        meta[key] = value;
      }
    }
    return new Outlet(outlet.inout, outlet.name, outlet.hint, outlet.type, meta);
  };

  Outlet.index = 0;

  Outlet.id = function(name) {
    return "_io_" + (++Outlet.index) + "_" + name;
  };

  Outlet.hint = function(name) {
    name = name.replace(/^_io_[0-9]+_/, '');
    name = name.replace(/_i_o$/, '');
    return name = name.replace(/(In|Out|Inout|InOut)$/, '');
  };

  function Outlet(inout, name1, hint, type, meta1, id) {
    this.inout = inout;
    this.name = name1;
    this.hint = hint;
    this.type = type;
    this.meta = meta1 != null ? meta1 : {};
    this.id = id;
    if (this.hint == null) {
      this.hint = Outlet.hint(this.name);
    }
    this.node = null;
    this.input = null;
    this.output = [];
    if (this.id == null) {
      this.id = Outlet.id(this.hint);
    }
  }

  Outlet.prototype.morph = function(outlet) {
    this.inout = outlet.inout;
    this.name = outlet.name;
    this.hint = outlet.hint;
    this.type = outlet.type;
    return this.meta = outlet.meta;
  };

  Outlet.prototype.dupe = function(name) {
    var outlet;
    if (name == null) {
      name = this.id;
    }
    outlet = Outlet.make(this);
    outlet.name = name;
    return outlet;
  };

  Outlet.prototype.connect = function(outlet) {
    if (this.inout === Graph.IN && outlet.inout === Graph.OUT) {
      return outlet.connect(this);
    }
    if (this.inout !== Graph.OUT || outlet.inout !== Graph.IN) {
      throw new Error("Can only connect out to in.");
    }
    if (outlet.input === this) {
      return;
    }
    outlet.disconnect();
    outlet.input = this;
    return this.output.push(outlet);
  };

  Outlet.prototype.disconnect = function(outlet) {
    var i, index, len, ref;
    if (this.input) {
      this.input.disconnect(this);
    }
    if (this.output.length) {
      if (outlet) {
        index = this.output.indexOf(outlet);
        if (index >= 0) {
          this.output.splice(index, 1);
          return outlet.input = null;
        }
      } else {
        ref = this.output;
        for (i = 0, len = ref.length; i < len; i++) {
          outlet = ref[i];
          outlet.input = null;
        }
        return this.output = [];
      }
    }
  };

  return Outlet;

})();

module.exports = Outlet;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9HcmFwaC9vdXRsZXQuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9HcmFwaC9vdXRsZXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOzs7QUFFUjs7OztBQUdNO0VBQ0osTUFBQyxDQUFBLElBQUQsR0FBUSxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQ04sUUFBQTs7TUFEZSxRQUFROztJQUN2QixJQUFBLEdBQU87SUFDUCxJQUFtRCxtQkFBbkQ7QUFBQTtBQUFBLFdBQUEsVUFBQTs7UUFBQSxJQUFLLENBQUEsR0FBQSxDQUFMLEdBQVk7QUFBWixPQUFBOztXQUNBLElBQUksTUFBSixDQUFXLE1BQU0sQ0FBQyxLQUFsQixFQUNXLE1BQU0sQ0FBQyxJQURsQixFQUVXLE1BQU0sQ0FBQyxJQUZsQixFQUdXLE1BQU0sQ0FBQyxJQUhsQixFQUlXLElBSlg7RUFITTs7RUFTUixNQUFDLENBQUEsS0FBRCxHQUFTOztFQUNULE1BQUMsQ0FBQSxFQUFELEdBQU0sU0FBQyxJQUFEO1dBQ0osTUFBQSxHQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBVixDQUFOLEdBQXNCLEdBQXRCLEdBQXlCO0VBRHJCOztFQUdOLE1BQUMsQ0FBQSxJQUFELEdBQVEsU0FBQyxJQUFEO0lBQ04sSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsY0FBYixFQUE2QixFQUE3QjtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsRUFBdEI7V0FDUCxJQUFBLEdBQU8sSUFBSSxD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

},{"./graph":1}],5:[function(require,module,exports){
var Block, Graph, Layout, OutletError, Program, debug;

Graph = require('../graph');

Program = require('../linker').Program;

Layout = require('../linker').Layout;

debug = false;

Block = (function() {
  Block.previous = function(outlet) {
    var ref;
    return (ref = outlet.input) != null ? ref.node.owner : void 0;
  };

  function Block() {
    var ref;
    if (this.namespace == null) {
      this.namespace = Program.entry();
    }
    this.node = new Graph.Node(this, (ref = typeof this.makeOutlets === "function" ? this.makeOutlets() : void 0) != null ? ref : {});
  }

  Block.prototype.refresh = function() {
    var ref;
    return this.node.setOutlets((ref = typeof this.makeOutlets === "function" ? this.makeOutlets() : void 0) != null ? ref : {});
  };

  Block.prototype.clone = function() {
    return new Block;
  };

  Block.prototype.compile = function(language, namespace) {
    var program;
    program = new Program(language, namespace != null ? namespace : Program.entry(), this.node.graph);
    this.call(program, 0);
    return program.assemble();
  };

  Block.prototype.link = function(language, namespace) {
    var layout, module;
    module = this.compile(language, namespace);
    layout = new Layout(language, this.node.graph);
    this._include(module, layout, 0);
    this["export"](layout, 0);
    return layout.link(module);
  };

  Block.prototype.call = function(program, depth) {};

  Block.prototype.callback = function(layout, depth, name, external, outlet) {};

  Block.prototype["export"] = function(layout, depth) {};

  Block.prototype._info = function(suffix) {
    var ref, ref1, string;
    string = (ref = (ref1 = this.node.owner.snippet) != null ? ref1._name : void 0) != null ? ref : this.node.owner.namespace;
    if (suffix != null) {
      return string += '.' + suffix;
    }
  };

  Block.prototype._outlet = function(def, props) {
    var outlet;
    outlet = Graph.Outlet.make(def, props);
    outlet.meta.def = def;
    return outlet;
  };

  Block.prototype._call = function(module, program, depth) {
    return program.call(this.node, module, depth);
  };

  Block.prototype._require = function(module, program) {
    return program.require(this.node, module);
  };

  Block.prototype._inputs = function(module, program, depth) {
    var arg, i, len, outlet, ref, ref1, results;
    ref = module.main.signature;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      arg = ref[i];
      outlet = this.node.get(arg.name);
      results.push((ref1 = Block.previous(outlet)) != null ? ref1.call(program, depth + 1) : void 0);
    }
    return results;
  };

  Block.prototype._callback = function(module, layout, depth, name, external, outlet) {
    return layout.callback(this.node, module, depth, name, external, outlet);
  };

  Block.prototype._include = function(module, layout, depth) {
    return layout.include(this.node, module, depth);
  };

  Block.prototype._link = function(module, layout, depth) {
    var block, ext, i, key, len, orig, outlet, parent, ref, ref1, ref2, results;
    debug && console.log('block::_link', this.toString(), module.namespace);
    ref = module.symbols;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      ext = module.externals[key];
      outlet = this.node.get(ext.name);
      if (!outlet) {
        throw new OutletError("External not found on " + (this._info(ext.name)));
      }
      if (outlet.meta.child != null) {
        continue;
      }
      ref1 = [outlet, outlet, null], orig = ref1[0], parent = ref1[1], block = ref1[2];
      while (!block && parent) {
        ref2 = [outlet.meta.parent, parent], parent = ref2[0], outlet = ref2[1];
      }
      block = Block.previous(outlet);
      if (!block) {
        throw new OutletError("Missing connection on " + (this._info(ext.name)));
      }
      debug && console.log('callback -> ', this.toString(), ext.name, outlet);
      block.callback(layout, depth + 1, key, ext, outlet.input);
      results.push(block != null ? block["export"](layout, depth + 1) : void 0);
    }
    return results;
  };

  Block.prototype._trace = function(module, layout, depth) {
    var arg, i, len, outlet, ref, ref1, results;
    debug && console.log('block::_trace', this.toString(), module.namespace);
    ref = module.main.signature;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      arg = ref[i];
      outlet = this.node.get(arg.name);
      results.push((ref1 = Block.previous(outlet)) != null ? ref1["export"](layout, depth + 1) : void 0);
    }
    return results;
  };

  return Block;

})();

OutletError = function(message) {
  var e;
  e = new Error(message);
  e.name = 'OutletError';
  return e;
};

OutletError.prototype = new Error;

module.exports = Block;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ibG9jay9ibG9jay5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2Jsb2NrL2Jsb2NrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLEtBQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7QUFDVixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FBb0IsQ0FBQzs7QUFDL0IsTUFBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQW9CLENBQUM7O0FBRS9CLEtBQUEsR0FBUTs7QUFFRjtFQUNKLEtBQUMsQ0FBQSxRQUFELEdBQVksU0FBQyxNQUFEO0FBQVksUUFBQTs2Q0FBWSxDQUFFLElBQUksQ0FBQztFQUEvQjs7RUFFQyxlQUFBO0FBQ1gsUUFBQTs7TUFBQSxJQUFDLENBQUEsWUFBYSxPQUFPLENBQUMsS0FBUixDQUFBOztJQUNkLElBQUMsQ0FBQSxJQUFELEdBQWMsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsK0ZBQW9DLEVBQXBDO0VBRkg7O2tCQUliLE9BQUEsR0FBUyxTQUFBO0FBQ1AsUUFBQTtXQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTiw4RkFBbUMsRUFBbkM7RUFETzs7a0JBR1QsS0FBQSxHQUFPLFNBQUE7V0FDTCxJQUFJO0VBREM7O2tCQUlQLE9BQUEsR0FBUyxTQUFDLFFBQUQsRUFBVyxTQUFYO0FBQ1AsUUFBQTtJQUFBLE9BQUEsR0FBVSxJQUFJLE9BQUosQ0FBWSxRQUFaLHNCQUFzQixZQUFZLE9BQU8sQ0FBQyxLQUFSLENBQUEsQ0FBbEMsRUFBbUQsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUF6RDtJ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

},{"../graph":25,"../linker":30}],6:[function(require,module,exports){
var Block, Call,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Block = require('./block');

Call = (function(superClass) {
  extend(Call, superClass);

  function Call(snippet) {
    this.snippet = snippet;
    this.namespace = this.snippet.namespace;
    Call.__super__.constructor.apply(this, arguments);
  }

  Call.prototype.clone = function() {
    return new Call(this.snippet);
  };

  Call.prototype.makeOutlets = function() {
    var callbacks, externals, key, main, outlet, params, symbols;
    main = this.snippet.main.signature;
    externals = this.snippet.externals;
    symbols = this.snippet.symbols;
    params = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = main.length; i < len; i++) {
        outlet = main[i];
        results.push(this._outlet(outlet, {
          callback: false
        }));
      }
      return results;
    }).call(this);
    callbacks = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = symbols.length; i < len; i++) {
        key = symbols[i];
        results.push(this._outlet(externals[key], {
          callback: true
        }));
      }
      return results;
    }).call(this);
    return params.concat(callbacks);
  };

  Call.prototype.call = function(program, depth) {
    this._call(this.snippet, program, depth);
    return this._inputs(this.snippet, program, depth);
  };

  Call.prototype["export"] = function(layout, depth) {
    if (!layout.visit(this.namespace, depth)) {
      return;
    }
    this._link(this.snippet, layout, depth);
    return this._trace(this.snippet, layout, depth);
  };

  return Call;

})(Block);

module.exports = Call;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ibG9jay9jYWxsLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvYmxvY2svY2FsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxXQUFBO0VBQUE7OztBQUFBLEtBQUEsR0FBVSxPQUFBLENBQVEsU0FBUjs7QUFFSjs7O0VBQ1MsY0FBQyxPQUFEO0lBQUMsSUFBQyxDQUFBLFVBQUQ7SUFDWixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUM7SUFDdEIsdUNBQUEsU0FBQTtFQUZXOztpQkFJYixLQUFBLEdBQU8sU0FBQTtXQUNMLElBQUksSUFBSixDQUFTLElBQUMsQ0FBQSxPQUFWO0VBREs7O2lCQUdQLFdBQUEsR0FBYSxTQUFBO0FBQ1gsUUFBQTtJQUFBLElBQUEsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMxQixTQUFBLEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQztJQUNyQixPQUFBLEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQztJQUVyQixNQUFBOztBQUFhO1dBQUEsc0NBQUE7O3FCQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsTUFBVCxFQUF5QjtVQUFBLFFBQUEsRUFBVSxLQUFWO1NBQXpCO0FBQUE7OztJQUNiLFNBQUE7O0FBQWE7V0FBQSx5Q0FBQTs7cUJBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFVLENBQUEsR0FBQSxDQUFuQixFQUF5QjtVQUFBLFFBQUEsRUFBVSxJQUFWO1NBQXpCO0FBQUE7OztXQUViLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtFQVJXOztpQkFVYixJQUFBLEdBQU0sU0FBQyxPQUFELEVBQVUsS0FBVjtJQUNKLElBQUMsQ0FBQSxLQUFELENBQVMsSUFBQyxDQUFBLE9BQVYsRUFBbUIsT0FBbkIsRUFBNEIsS0FBNUI7V0FDQSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQUMsQ0FBQSxPQUFWLEVBQW1CLE9BQW5CLEVBQTRCLEtBQTVCO0VBRkk7O2tCQUlOLFFBQUEsR0FBUSxTQUFDLE1BQUQsRUFBUyxLQUFUO0lBQ04sSUFBQSxDQUFjLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBQyxDQUFBLFNBQWQsRUFBeUIsS0FBekIsQ0FBZDtBQUFBLGFBQUE7O0lBRUEsSUFBQyxDQUFBLEtBQUQsQ0FBUyxJQUFDLENBQUEsT0FBVixFQUFtQixNQUFuQixFQUEyQixLQUEzQjtXQUNBLElBQUMsQ0FBQSxNQUFELENBQVMsSUFBQyxDQUFBLE9BQVYsRUFBbUIsTUFBbkIsRUFBMkIsS0FBM0I7RUFKTTs7OztHQXRCUzs7QUE0Qm5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{"./block":5}],7:[function(require,module,exports){
var Block, Callback, Graph,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Graph = require('../graph');

Block = require('./block');


/*
  Re-use a subgraph as a callback
 */

Callback = (function(superClass) {
  extend(Callback, superClass);

  function Callback(graph) {
    this.graph = graph;
    Callback.__super__.constructor.apply(this, arguments);
  }

  Callback.prototype.refresh = function() {
    Callback.__super__.refresh.apply(this, arguments);
    return delete this.subroutine;
  };

  Callback.prototype.clone = function() {
    return new Callback(this.graph);
  };

  Callback.prototype.makeOutlets = function() {
    var handle, i, ins, j, len, len1, outlet, outlets, outs, ref, ref1, type;
    this.make();
    outlets = [];
    ins = [];
    outs = [];
    handle = (function(_this) {
      return function(outlet, list) {
        var base, dupe;
        if (outlet.meta.callback) {
          if (outlet.inout === Graph.IN) {
            dupe = outlet.dupe();
            if ((base = dupe.meta).child == null) {
              base.child = outlet;
            }
            outlet.meta.parent = dupe;
            return outlets.push(dupe);
          }
        } else {
          return list.push(outlet.type);
        }
      };
    })(this);
    ref = this.graph.inputs();
    for (i = 0, len = ref.length; i < len; i++) {
      outlet = ref[i];
      handle(outlet, ins);
    }
    ref1 = this.graph.outputs();
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      outlet = ref1[j];
      handle(outlet, outs);
    }
    ins = ins.join(',');
    outs = outs.join(',');
    type = "(" + ins + ")(" + outs + ")";
    outlets.push({
      name: 'callback',
      type: type,
      inout: Graph.OUT,
      meta: {
        callback: true,
        def: this.subroutine.main
      }
    });
    return outlets;
  };

  Callback.prototype.make = function() {
    return this.subroutine = this.graph.compile(this.namespace);
  };

  Callback.prototype["export"] = function(layout, depth) {
    if (!layout.visit(this.namespace, depth)) {
      return;
    }
    this._link(this.subroutine, layout, depth);
    return this.graph["export"](layout, depth);
  };

  Callback.prototype.call = function(program, depth) {
    return this._require(this.subroutine, program, depth);
  };

  Callback.prototype.callback = function(layout, depth, name, external, outlet) {
    this._include(this.subroutine, layout, depth);
    return this._callback(this.subroutine, layout, depth, name, external, outlet);
  };

  return Callback;

})(Block);

module.exports = Callback;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ibG9jay9jYWxsYmFjay5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2Jsb2NrL2NhbGxiYWNrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLHNCQUFBO0VBQUE7OztBQUFBLEtBQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7QUFDVixLQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7OztBQUVWOzs7O0FBR007OztFQUNTLGtCQUFDLEtBQUQ7SUFBQyxJQUFDLENBQUEsUUFBRDtJQUNaLDJDQUFBLFNBQUE7RUFEVzs7cUJBR2IsT0FBQSxHQUFTLFNBQUE7SUFDUCx1Q0FBQSxTQUFBO1dBQ0EsT0FBTyxJQUFDLENBQUE7RUFGRDs7cUJBSVQsS0FBQSxHQUFPLFNBQUE7V0FDTCxJQUFJLFFBQUosQ0FBYSxJQUFDLENBQUEsS0FBZDtFQURLOztxQkFHUCxXQUFBLEdBQWEsU0FBQTtBQUNYLFFBQUE7SUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBO0lBRUEsT0FBQSxHQUFVO0lBQ1YsR0FBQSxHQUFVO0lBQ1YsSUFBQSxHQUFVO0lBSVYsTUFBQSxHQUFTLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxNQUFELEVBQVMsSUFBVDtBQUNQLFlBQUE7UUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBZjtVQUNFLElBQUcsTUFBTSxDQUFDLEtBQVAsS0FBZ0IsS0FBSyxDQUFDLEVBQXpCO1lBRUUsSUFBQSxHQUFPLE1BQU0sQ0FBQyxJQUFQLENBQUE7O2tCQUNJLENBQUMsUUFBUzs7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFaLEdBQXFCO21CQUVyQixPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsRUFORjtXQURGO1NBQUEsTUFBQTtpQkFTRSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQU0sQ0FBQyxJQUFqQixFQVRGOztNQURPO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtBQVlUO0FBQUEsU0FBQSxxQ0FBQTs7TUFBQSxNQUFBLENBQU8sTUFBUCxFQUFlLEdBQWY7QUFBQTtBQUNBO0FBQUEsU0FBQSx3Q0FBQTs7TUFBQSxNQUFBLENBQU8sTUFBUCxFQUFlLElBQWY7QUFBQTtJQUdBLEdBQUEsR0FBTyxHQUFHLENBQUMsSUFBSixDQUFVLEdBQVY7SUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWO0lBQ1AsSUFBQSxHQUFPLEdBQUEsR0FBSSxHQUFKLEdBQVEsSUFBUixHQUFZLElBQVosR0FBaUI7SUFFeEIsT0FBTyxDQUFDLElBQVIsQ0FDRTtNQUFBLElBQUEsRUFBTyxVQUFQO01BQ0EsSUFBQSxFQUFPLElBRFA7TUFFQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEdBRmI7TUFHQSxJQUFBLEVBQ0U7UUFBQSxRQUFBLEVBQVUsSUFBVjtRQUNBLEdBQUEsRUFBSyxJQUFDLENBQUEsVUFBVSxDQUFDLElBRGpCO09BSkY7S0FERjtXQVFBO0VBckNXOztxQkF1Q2IsSUFBQSxHQUFNLFNBQUE7V0FDSixJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLElBQUMsQ0FBQSxTQUFoQjtFQURWOztzQkFHTixRQUFBLEdBQVEsU0FBQyxNQUFELEVBQVMsS0FBVDtJQUNOLElBQUEsQ0FBYyxNQUFNLENBQUMsS0FBUCxDQUFhLElBQUMsQ0FBQSxTQUFkLEVBQXlCLEtBQXpCLENBQWQ7QUFBQSxhQUFBOztJQUVBLElBQUMsQ0FBQSxLQUFELENBQVcsSUFBQyxDQUFBLFVBQVosRUFBd0IsTUFBeEIsRUFBZ0MsS0FBaEM7V0FDQSxJQUFDLENBQUEsS0FBSyxFQUFDLE1BQUQsRUFBTixDQUFjLE1BQWQsRUFBc0IsS0FBdEI7RUFKTTs7cUJBTVIsSUFBQSxHQUFNLFNBQUMsT0FBRCxFQUFVLEtBQVY7V0FDSixJQUFDLENBQUEsUUFBRCxDQUFXLElBQUMsQ0FBQSxVQUFaLEVBQXdCLE9BQXhCLEVBQWlDLEtBQWpDO0VBREk7O3FCQUdOLFFBQUEsR0FBVSxTQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXNCLFFBQXRCLEVBQWdDLE1BQWhDO0lBQ1IsSUFBQyxDQUFBLFFBQUQsQ0FBVyxJQUFDLENBQUEsVUFBWixFQUF3QixNQUF4QixFQUFnQyxLQUFoQztXQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLFVBQVosRUFBd0IsTUFBeEIsRUFBZ0MsS0FBaEMsRUFBdUMsSUFBdkMsRUFBNkMsUUFBN0MsRUFBdUQsTUFBdkQ7RUFGUTs7OztHQTlEVzs7QUFrRXZCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{"../graph":25,"./block":5}],8:[function(require,module,exports){
exports.Block = require('./block');

exports.Call = require('./call');

exports.Callback = require('./callback');

exports.Isolate = require('./isolate');

exports.Join = require('./join');

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ibG9jay9pbmRleC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2Jsb2NrL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsS0FBUixHQUFtQixPQUFBLENBQVEsU0FBUjs7QUFDbkIsT0FBTyxDQUFDLElBQVIsR0FBbUIsT0FBQSxDQUFRLFFBQVI7O0FBQ25CLE9BQU8sQ0FBQyxRQUFSLEdBQW1CLE9BQUEsQ0FBUSxZQUFSOztBQUNuQixPQUFPLENBQUMsT0FBUixHQUFtQixPQUFBLENBQVEsV0FBUjs7QUFDbkIsT0FBTyxDQUFDLElBQVIsR0FBbUIsT0FBQSxDQUFRLFFBQVIifQ==

},{"./block":5,"./call":6,"./callback":7,"./isolate":9,"./join":10}],9:[function(require,module,exports){
var Block, Graph, Isolate,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Graph = require('../graph');

Block = require('./block');


/*
  Isolate a subgraph as a single node
 */

Isolate = (function(superClass) {
  extend(Isolate, superClass);

  function Isolate(graph) {
    this.graph = graph;
    Isolate.__super__.constructor.apply(this, arguments);
  }

  Isolate.prototype.refresh = function() {
    Isolate.__super__.refresh.apply(this, arguments);
    return delete this.subroutine;
  };

  Isolate.prototype.clone = function() {
    return new Isolate(this.graph);
  };

  Isolate.prototype.makeOutlets = function() {
    var base, done, dupe, i, j, len, len1, name, outlet, outlets, ref, ref1, ref2, seen, set;
    this.make();
    outlets = [];
    seen = {};
    done = {};
    ref = ['inputs', 'outputs'];
    for (i = 0, len = ref.length; i < len; i++) {
      set = ref[i];
      ref1 = this.graph[set]();
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        outlet = ref1[j];
        name = void 0;
        if (((ref2 = outlet.hint) === 'return' || ref2 === 'callback') && outlet.inout === Graph.OUT) {
          name = outlet.hint;
        }
        if (seen[name] != null) {
          name = void 0;
        }
        dupe = outlet.dupe(name);
        if ((base = dupe.meta).child == null) {
          base.child = outlet;
        }
        outlet.meta.parent = dupe;
        if (name != null) {
          seen[name] = true;
        }
        done[outlet.name] = dupe;
        outlets.push(dupe);
      }
    }
    return outlets;
  };

  Isolate.prototype.make = function() {
    return this.subroutine = this.graph.compile(this.namespace);
  };

  Isolate.prototype.call = function(program, depth) {
    this._call(this.subroutine, program, depth);
    return this._inputs(this.subroutine, program, depth);
  };

  Isolate.prototype["export"] = function(layout, depth) {
    if (!layout.visit(this.namespace, depth)) {
      return;
    }
    this._link(this.subroutine, layout, depth);
    this._trace(this.subroutine, layout, depth);
    return this.graph["export"](layout, depth);
  };

  Isolate.prototype.callback = function(layout, depth, name, external, outlet) {
    outlet = outlet.meta.child;
    return outlet.node.owner.callback(layout, depth, name, external, outlet);
  };

  return Isolate;

})(Block);

module.exports = Isolate;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ibG9jay9pc29sYXRlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvYmxvY2svaXNvbGF0ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxxQkFBQTtFQUFBOzs7QUFBQSxLQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0FBQ1YsS0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOzs7QUFFVjs7OztBQUdNOzs7RUFDUyxpQkFBQyxLQUFEO0lBQUMsSUFBQyxDQUFBLFFBQUQ7SUFDWiwwQ0FBQSxTQUFBO0VBRFc7O29CQUdiLE9BQUEsR0FBUyxTQUFBO0lBQ1Asc0NBQUEsU0FBQTtXQUNBLE9BQU8sSUFBQyxDQUFBO0VBRkQ7O29CQUlULEtBQUEsR0FBTyxTQUFBO1dBQ0wsSUFBSSxPQUFKLENBQVksSUFBQyxDQUFBLEtBQWI7RUFESzs7b0JBR1AsV0FBQSxHQUFhLFNBQUE7QUFDWCxRQUFBO0lBQUEsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUVBLE9BQUEsR0FBVTtJQUVWLElBQUEsR0FBTztJQUNQLElBQUEsR0FBTztBQUNQO0FBQUEsU0FBQSxxQ0FBQTs7QUFDRTtBQUFBLFdBQUEsd0NBQUE7O1FBRUUsSUFBQSxHQUFPO1FBQ1AsSUFBc0IsU0FBQSxNQUFNLENBQUMsS0FBUCxLQUFnQixRQUFoQixJQUFBLElBQUEsS0FBMEIsVUFBMUIsQ0FBQSxJQUNBLE1BQU0sQ0FBQyxLQUFQLEtBQWdCLEtBQUssQ0FBQyxHQUQ1QztVQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsS0FBZDs7UUFJQSxJQUFxQixrQkFBckI7VUFBQSxJQUFBLEdBQU8sT0FBUDs7UUFHQSxJQUFBLEdBQU8sTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaOztjQUNJLENBQUMsUUFBUzs7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFaLEdBQXFCO1FBQ3JCLElBQXFCLFlBQXJCO1VBQUEsSUFBSyxDQUFBLElBQUEsQ0FBTCxHQUFhLEtBQWI7O1FBQ0EsSUFBSyxDQUFBLE1BQU0sQ0FBQyxJQUFQLENBQUwsR0FBb0I7UUFFcEIsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiO0FBaEJGO0FBREY7V0FtQkE7RUExQlc7O29CQTRCYixJQUFBLEdBQU0sU0FBQTtXQUNKLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsSUFBQyxDQUFBLFNBQWhCO0VBRFY7O29CQUdOLElBQUEsR0FBTSxTQUFDLE9BQUQsRUFBVSxLQUFWO0lBQ0osSUFBQyxDQUFBLEtBQUQsQ0FBUyxJQUFDLENBQUEsVUFBVixFQUFzQixPQUF0QixFQUErQixLQUEvQjtXQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLFVBQVYsRUFBc0IsT0FBdEIsRUFBK0IsS0FBL0I7RUFGSTs7cUJBSU4sUUFBQSxHQUFRLFNBQUMsTUFBRCxFQUFTLEtBQVQ7SUFDTixJQUFBLENBQWMsTUFBTSxDQUFDLEtBQVAsQ0FBYSxJQUFDLENBQUEsU0FBZCxFQUF5QixLQUF6QixDQUFkO0FBQUEsYUFBQTs7SUFHQSxJQUFDLENBQUEsS0FBRCxDQUFTLElBQUMsQ0FBQSxVQUFWLEVBQXNCLE1BQXRCLEVBQThCLEtBQTlCO0lBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUyxJQUFDLENBQUEsVUFBVixFQUFzQixNQUF0QixFQUE4QixLQUE5QjtXQUdBLElBQUMsQ0FBQSxLQUFLLEVBQUMsTUFBRCxFQUFOLENBQWMsTUFBZCxFQUFzQixLQUF0QjtFQVJNOztvQkFVUixRQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixJQUFoQixFQUFzQixRQUF0QixFQUFnQyxNQUFoQztJQUNSLE1BQUEsR0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDO1dBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQWxCLENBQTJCLE1BQTNCLEVBQW1DLEtBQW5DLEVBQTBDLElBQTFDLEVBQWdELFFBQWhELEVBQTBELE1BQTFEO0VBRlE7Ozs7R0F4RFU7O0FBNER0QixNQUFNLENBQUMsT0FBUCxHQUFpQiJ9

},{"../graph":25,"./block":5}],10:[function(require,module,exports){
var Block, Join,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Block = require('./block');


/*
  Join multiple disconnected nodes
 */

Join = (function(superClass) {
  extend(Join, superClass);

  function Join(nodes) {
    this.nodes = nodes;
    Join.__super__.constructor.apply(this, arguments);
  }

  Join.prototype.clone = function() {
    return new Join(this.nodes);
  };

  Join.prototype.makeOutlets = function() {
    return [];
  };

  Join.prototype.call = function(program, depth) {
    var block, i, len, node, ref, results;
    ref = this.nodes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      block = node.owner;
      results.push(block.call(program, depth));
    }
    return results;
  };

  Join.prototype["export"] = function(layout, depth) {
    var block, i, len, node, ref, results;
    ref = this.nodes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      block = node.owner;
      results.push(block["export"](layout, depth));
    }
    return results;
  };

  return Join;

})(Block);

module.exports = Join;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ibG9jay9qb2luLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvYmxvY2svam9pbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxXQUFBO0VBQUE7OztBQUFBLEtBQUEsR0FBVSxPQUFBLENBQVEsU0FBUjs7O0FBRVY7Ozs7QUFHTTs7O0VBQ1MsY0FBQyxLQUFEO0lBQUMsSUFBQyxDQUFBLFFBQUQ7SUFDWix1Q0FBQSxTQUFBO0VBRFc7O2lCQUdiLEtBQUEsR0FBTyxTQUFBO1dBQ0wsSUFBSSxJQUFKLENBQVMsSUFBQyxDQUFBLEtBQVY7RUFESzs7aUJBR1AsV0FBQSxHQUFhLFNBQUE7V0FBTTtFQUFOOztpQkFFYixJQUFBLEdBQU0sU0FBQyxPQUFELEVBQVUsS0FBVjtBQUNKLFFBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7O01BQ0UsS0FBQSxHQUFRLElBQUksQ0FBQzttQkFDYixLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0IsS0FBcEI7QUFGRjs7RUFESTs7a0JBS04sUUFBQSxHQUFRLFNBQUMsTUFBRCxFQUFTLEtBQVQ7QUFDTixRQUFBO0FBQUE7QUFBQTtTQUFBLHFDQUFBOztNQUNFLEtBQUEsR0FBUSxJQUFJLENBQUM7bUJBQ2IsS0FBSyxFQUFDLE1BQUQsRUFBTCxDQUFhLE1BQWIsRUFBcUIsS0FBckI7QUFGRjs7RUFETTs7OztHQWRTOztBQW1CbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIifQ==

},{"./block":5}],11:[function(require,module,exports){

/*
  Cache decorator  
  Fetches snippets once, clones for reuse
  Inline code is hashed to avoid bloat
 */
var cache, hash, queue;

queue = require('./queue');

hash = require('./hash');

cache = function(fetch) {
  var cached, push;
  cached = {};
  push = queue(100);
  return function(name) {
    var expire, key;
    key = name.length > 32 ? '##' + hash(name).toString(16) : name;
    expire = push(key);
    if (expire != null) {
      delete cached[expire];
    }
    if (cached[key] == null) {
      cached[key] = fetch(name);
    }
    return cached[key].clone();
  };
};

module.exports = cache;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2NhY2hlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZmFjdG9yeS9jYWNoZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztBQUFBLElBQUE7O0FBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUNSLElBQUEsR0FBUSxPQUFBLENBQVEsUUFBUjs7QUFFUixLQUFBLEdBQVEsU0FBQyxLQUFEO0FBQ04sTUFBQTtFQUFBLE1BQUEsR0FBUztFQUNULElBQUEsR0FBUSxLQUFBLENBQU0sR0FBTjtTQUdSLFNBQUMsSUFBRDtBQUNFLFFBQUE7SUFBQSxHQUFBLEdBQVMsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUFqQixHQUF5QixJQUFBLEdBQU8sSUFBQSxDQUFLLElBQUwsQ0FBVSxDQUFDLFFBQVgsQ0FBb0IsRUFBcEIsQ0FBaEMsR0FBNkQ7SUFHbkUsTUFBQSxHQUFTLElBQUEsQ0FBSyxHQUFMO0lBQ1QsSUFBeUIsY0FBekI7TUFBQSxPQUFPLE1BQU8sQ0FBQSxNQUFBLEVBQWQ7O0lBR0EsSUFBNkIsbUJBQTdCO01BQUEsTUFBTyxDQUFBLEdBQUEsQ0FBUCxHQUFjLEtBQUEsQ0FBTSxJQUFOLEVBQWQ7O1dBQ0EsTUFBTyxDQUFBLEdBQUEsQ0FBSSxDQUFDLEtBQVosQ0FBQTtFQVRGO0FBTE07O0FBZ0JSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{"./hash":13,"./queue":17}],12:[function(require,module,exports){
var Block, Factory, Graph, State, Visualize;

Graph = require('../graph').Graph;

Block = require('../block');

Visualize = require('../visualize');


/*
  Chainable factory
  
  Exposes methods to build a graph incrementally
 */

Factory = (function() {
  function Factory(language, fetch, config) {
    this.language = language;
    this.fetch = fetch;
    this.config = config;
    this.graph();
  }

  Factory.prototype.pipe = function(name, uniforms, namespace, defines) {
    if (name instanceof Factory) {
      this._concat(name);
    } else if (name != null) {
      this._call(name, uniforms, namespace, defines);
    }
    return this;
  };

  Factory.prototype.call = function(name, uniforms, namespace, defines) {
    return this.pipe(name, uniforms, namespace, defines);
  };

  Factory.prototype.require = function(name, uniforms, namespace, defines) {
    if (name instanceof Factory) {
      this._import(name);
    } else if (name != null) {
      this.callback();
      this._call(name, uniforms, namespace, defines);
      this.end();
    }
    return this;
  };

  Factory.prototype["import"] = function(name, uniforms, namespace, defines) {
    return this.require(name, uniforms, namespace, defines);
  };

  Factory.prototype.split = function() {
    this._group('_combine', true);
    return this;
  };

  Factory.prototype.fan = function() {
    this._group('_combine', false);
    return this;
  };

  Factory.prototype.isolate = function() {
    this._group('_isolate');
    return this;
  };

  Factory.prototype.callback = function() {
    this._group('_callback');
    return this;
  };

  Factory.prototype.next = function() {
    this._next();
    return this;
  };

  Factory.prototype.pass = function() {
    var pass;
    pass = this._stack[2].end;
    this.end();
    this._state.end = this._state.end.concat(pass);
    return this;
  };

  Factory.prototype.end = function() {
    var main, op, ref, sub;
    ref = this._exit(), sub = ref[0], main = ref[1];
    op = sub.op;
    if (this[op]) {
      this[op](sub, main);
    }
    return this;
  };

  Factory.prototype.join = function() {
    return this.end();
  };

  Factory.prototype.graph = function() {
    var graph, ref;
    while (((ref = this._stack) != null ? ref.length : void 0) > 1) {
      this.end();
    }
    if (this._graph) {
      this._tail(this._state, this._graph);
    }
    graph = this._graph;
    this._graph = new Graph;
    this._state = new State;
    this._stack = [this._state];
    return graph;
  };

  Factory.prototype.compile = function(namespace) {
    if (namespace == null) {
      namespace = 'main';
    }
    return this.graph().compile(namespace);
  };

  Factory.prototype.link = function(namespace) {
    if (namespace == null) {
      namespace = 'main';
    }
    return this.graph().link(namespace);
  };

  Factory.prototype.serialize = function() {
    return Visualize.serialize(this._graph);
  };

  Factory.prototype.empty = function() {
    return this._graph.nodes.length === 0;
  };

  Factory.prototype._concat = function(factory) {
    var block, error;
    if (factory._state.nodes.length === 0) {
      return this;
    }
    this._tail(factory._state, factory._graph);
    try {
      block = new Block.Isolate(factory._graph);
    } catch (error1) {
      error = error1;
      if (this.config.autoInspect) {
        Visualize.inspect(error, this._graph, factory);
      }
      throw error;
    }
    this._auto(block);
    return this;
  };

  Factory.prototype._import = function(factory) {
    var block, error;
    if (factory._state.nodes.length === 0) {
      throw "Can't import empty callback";
    }
    this._tail(factory._state, factory._graph);
    try {
      block = new Block.Callback(factory._graph);
    } catch (error1) {
      error = error1;
      if (this.config.autoInspect) {
        Visualize.inspect(error, this._graph, factory);
      }
      throw error;
    }
    this._auto(block);
    return this;
  };

  Factory.prototype._combine = function(sub, main) {
    var from, j, k, len, len1, ref, ref1, to;
    ref = sub.start;
    for (j = 0, len = ref.length; j < len; j++) {
      to = ref[j];
      ref1 = main.end;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        from = ref1[k];
        from.connect(to, sub.multi);
      }
    }
    main.end = sub.end;
    return main.nodes = main.nodes.concat(sub.nodes);
  };

  Factory.prototype._isolate = function(sub, main) {
    var block, error, subgraph;
    if (sub.nodes.length) {
      subgraph = this._subgraph(sub);
      this._tail(sub, subgraph);
      try {
        block = new Block.Isolate(subgraph);
      } catch (error1) {
        error = error1;
        if (this.config.autoInspect) {
          Visualize.inspect(error, this._graph, subgraph);
        }
        throw error;
      }
      return this._auto(block);
    }
  };

  Factory.prototype._callback = function(sub, main) {
    var block, error, subgraph;
    if (sub.nodes.length) {
      subgraph = this._subgraph(sub);
      this._tail(sub, subgraph);
      try {
        block = new Block.Callback(subgraph);
      } catch (error1) {
        error = error1;
        if (this.config.autoInspect) {
          Visualize.inspect(error, this._graph, subgraph);
        }
        throw error;
      }
      return this._auto(block);
    }
  };

  Factory.prototype._call = function(name, uniforms, namespace, defines) {
    var block, snippet;
    snippet = this.fetch(name);
    snippet.bind(this.config, uniforms, namespace, defines);
    block = new Block.Call(snippet);
    return this._auto(block);
  };

  Factory.prototype._subgraph = function(sub) {
    var subgraph;
    subgraph = new Graph(null, this._graph);
    subgraph.adopt(sub.nodes);
    return subgraph;
  };

  Factory.prototype._tail = function(state, graph) {
    var tail;
    tail = state.end.concat(state.tail);
    tail = tail.filter(function(node, i) {
      return tail.indexOf(node) === i;
    });
    if (tail.length > 1) {
      tail = new Block.Join(tail);
      tail = [tail.node];
      this._graph.add(tail);
    }
    graph.tail = tail[0];
    state.end = tail;
    state.tail = [];
    if (!graph.tail) {
      throw new Error("Cannot finalize empty graph");
    }
    graph.compile = (function(_this) {
      return function(namespace) {
        var error;
        if (namespace == null) {
          namespace = 'main';
        }
        try {
          return graph.tail.owner.compile(_this.language, namespace);
        } catch (error1) {
          error = error1;
          if (_this.config.autoInspect) {
            graph.inspect(error);
          }
          throw error;
        }
      };
    })(this);
    graph.link = (function(_this) {
      return function(namespace) {
        var error;
        if (namespace == null) {
          namespace = 'main';
        }
        try {
          return graph.tail.owner.link(_this.language, namespace);
        } catch (error1) {
          error = error1;
          if (_this.config.autoInspect) {
            graph.inspect(error);
          }
          throw error;
        }
      };
    })(this);
    graph["export"] = (function(_this) {
      return function(layout, depth) {
        return graph.tail.owner["export"](layout, depth);
      };
    })(this);
    return graph.inspect = function(message) {
      if (message == null) {
        message = null;
      }
      return Visualize.inspect(message, graph);
    };
  };

  Factory.prototype._group = function(op, multi) {
    this._push(op, multi);
    this._push();
    return this;
  };

  Factory.prototype._next = function() {
    var sub;
    sub = this._pop();
    this._state.start = this._state.start.concat(sub.start);
    this._state.end = this._state.end.concat(sub.end);
    this._state.nodes = this._state.nodes.concat(sub.nodes);
    this._state.tail = this._state.tail.concat(sub.tail);
    return this._push();
  };

  Factory.prototype._exit = function() {
    this._next();
    this._pop();
    return [this._pop(), this._state];
  };

  Factory.prototype._push = function(op, multi) {
    this._stack.unshift(new State(op, multi));
    return this._state = this._stack[0];
  };

  Factory.prototype._pop = function() {
    var ref;
    this._state = this._stack[1];
    if (this._state == null) {
      this._state = new State;
    }
    return (ref = this._stack.shift()) != null ? ref : new State;
  };

  Factory.prototype._auto = function(block) {
    if (block.node.inputs.length) {
      return this._append(block);
    } else {
      return this._insert(block);
    }
  };

  Factory.prototype._append = function(block) {
    var end, j, len, node, ref;
    node = block.node;
    this._graph.add(node);
    ref = this._state.end;
    for (j = 0, len = ref.length; j < len; j++) {
      end = ref[j];
      end.connect(node);
    }
    if (!this._state.start.length) {
      this._state.start = [node];
    }
    this._state.end = [node];
    this._state.nodes.push(node);
    if (!node.outputs.length) {
      return this._state.tail.push(node);
    }
  };

  Factory.prototype._prepend = function(block) {
    var j, len, node, ref, start;
    node = block.node;
    this._graph.add(node);
    ref = this._state.start;
    for (j = 0, len = ref.length; j < len; j++) {
      start = ref[j];
      node.connect(start);
    }
    if (!this._state.end.length) {
      this._state.end = [node];
    }
    this._state.start = [node];
    this._state.nodes.push(node);
    if (!node.outputs.length) {
      return this._state.tail.push(node);
    }
  };

  Factory.prototype._insert = function(block) {
    var node;
    node = block.node;
    this._graph.add(node);
    this._state.start.push(node);
    this._state.end.push(node);
    this._state.nodes.push(node);
    if (!node.outputs.length) {
      return this._state.tail.push(node);
    }
  };

  return Factory;

})();

State = (function() {
  function State(op1, multi1, start1, end1, nodes, tail1) {
    this.op = op1 != null ? op1 : null;
    this.multi = multi1 != null ? multi1 : false;
    this.start = start1 != null ? start1 : [];
    this.end = end1 != null ? end1 : [];
    this.nodes = nodes != null ? nodes : [];
    this.tail = tail1 != null ? tail1 : [];
  }

  return State;

})();

module.exports = Factory;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2ZhY3RvcnkuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2ZhY3RvcnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsS0FBQSxHQUFZLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUM7O0FBQ2hDLEtBQUEsR0FBWSxPQUFBLENBQVEsVUFBUjs7QUFDWixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7OztBQUVaOzs7Ozs7QUFLTTtFQUNTLGlCQUFDLFFBQUQsRUFBWSxLQUFaLEVBQW9CLE1BQXBCO0lBQUMsSUFBQyxDQUFBLFdBQUQ7SUFBVyxJQUFDLENBQUEsUUFBRDtJQUFRLElBQUMsQ0FBQSxTQUFEO0lBQy9CLElBQUMsQ0FBQSxLQUFELENBQUE7RUFEVzs7b0JBSWIsSUFBQSxHQUFNLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsU0FBakIsRUFBNEIsT0FBNUI7SUFDSixJQUFHLElBQUEsWUFBZ0IsT0FBbkI7TUFDRSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFERjtLQUFBLE1BRUssSUFBRyxZQUFIO01BQ0gsSUFBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQUF1QixTQUF2QixFQUFrQyxPQUFsQyxFQURHOztXQUVMO0VBTEk7O29CQVFOLElBQUEsR0FBTSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLFNBQWpCLEVBQTRCLE9BQTVCO1dBQ0osSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFOLEVBQVksUUFBWixFQUFzQixTQUF0QixFQUFpQyxPQUFqQztFQURJOztvQkFJ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

},{"../block":8,"../graph":25,"../visualize":36}],13:[function(require,module,exports){
var c1, c2, c3, c4, c5, hash, imul, test;

c1 = 0xcc9e2d51;

c2 = 0x1b873593;

c3 = 0xe6546b64;

c4 = 0x85ebca6b;

c5 = 0xc2b2ae35;

imul = function(a, b) {
  var ah, al, bh, bl;
  ah = (a >>> 16) & 0xffff;
  al = a & 0xffff;
  bh = (b >>> 16) & 0xffff;
  bl = b & 0xffff;
  return (al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0;
};

if (Math.imul != null) {
  test = Math.imul(0xffffffff, 5);
  if (test === -5) {
    imul = Math.imul;
  }
}

hash = function(string) {
  var h, iterate, j, m, n, next;
  n = string.length;
  m = Math.floor(n / 2);
  j = h = 0;
  next = function() {
    return string.charCodeAt(j++);
  };
  iterate = function(a, b) {
    var k;
    k = a | (b << 16);
    k ^= k << 9;
    k = imul(k, c1);
    k = (k << 15) | (k >>> 17);
    k = imul(k, c2);
    h ^= k;
    h = (h << 13) | (h >>> 19);
    h = imul(h, 5);
    return h = (h + c3) | 0;
  };
  while (m--) {
    iterate(next(), next());
  }
  if (n & 1) {
    iterate(next(), 0);
  }
  h ^= n;
  h ^= h >>> 16;
  h = imul(h, c4);
  h ^= h >>> 13;
  h = imul(h, c5);
  return h ^= h >>> 16;
};

module.exports = hash;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2hhc2guY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2hhc2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLElBQUE7O0FBQUEsRUFBQSxHQUFLOztBQUNMLEVBQUEsR0FBSzs7QUFDTCxFQUFBLEdBQUs7O0FBQ0wsRUFBQSxHQUFLOztBQUNMLEVBQUEsR0FBSzs7QUFHTCxJQUFBLEdBQU8sU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNMLE1BQUE7RUFBQSxFQUFBLEdBQUssQ0FBQyxDQUFBLEtBQU0sRUFBUCxDQUFBLEdBQWE7RUFDbEIsRUFBQSxHQUFLLENBQUEsR0FBSTtFQUNULEVBQUEsR0FBSyxDQUFDLENBQUEsS0FBTSxFQUFQLENBQUEsR0FBYTtFQUNsQixFQUFBLEdBQUssQ0FBQSxHQUFJO1NBQ1QsQ0FBQyxFQUFBLEdBQUssRUFBTixDQUFBLEdBQVksQ0FBQyxDQUFDLENBQUMsRUFBQSxHQUFLLEVBQUwsR0FBVSxFQUFBLEdBQUssRUFBaEIsQ0FBQSxJQUF1QixFQUF4QixDQUFBLEtBQWdDLENBQWpDLENBQVosR0FBa0Q7QUFMN0M7O0FBT1AsSUFBRyxpQkFBSDtFQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsRUFBc0IsQ0FBdEI7RUFDUCxJQUFvQixJQUFBLEtBQVEsQ0FBQyxDQUE3QjtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBWjtHQUZGOzs7QUFLQSxJQUFBLEdBQU8sU0FBQyxNQUFEO0FBQ0wsTUFBQTtFQUFBLENBQUEsR0FBSSxNQUFNLENBQUM7RUFDWCxDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksQ0FBZjtFQUNKLENBQUEsR0FBSSxDQUFBLEdBQUk7RUFFUixJQUFBLEdBQU8sU0FBQTtXQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQUEsRUFBbEI7RUFBTjtFQUNQLE9BQUEsR0FBVSxTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ1IsUUFBQTtJQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksQ0FBQyxDQUFBLElBQUssRUFBTjtJQUNULENBQUEsSUFBTSxDQUFBLElBQUs7SUFFWCxDQUFBLEdBQUssSUFBQSxDQUFLLENBQUwsRUFBUSxFQUFSO0lBQ0wsQ0FBQSxHQUFLLENBQUMsQ0FBQSxJQUFLLEVBQU4sQ0FBQSxHQUFZLENBQUMsQ0FBQSxLQUFNLEVBQVA7SUFDakIsQ0FBQSxHQUFLLElBQUEsQ0FBSyxDQUFMLEVBQVEsRUFBUjtJQUVMLENBQUEsSUFBSztJQUVMLENBQUEsR0FBSyxDQUFDLENBQUEsSUFBSyxFQUFOLENBQUEsR0FBWSxDQUFDLENBQUEsS0FBTSxFQUFQO0lBQ2pCLENBQUEsR0FBSyxJQUFBLENBQUssQ0FBTCxFQUFRLENBQVI7V0FDTCxDQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksRUFBTCxDQUFBLEdBQVc7RUFaUjtBQWNhLFNBQU0sQ0FBQSxFQUFOO0lBQXZCLE9BQUEsQ0FBUSxJQUFBLENBQUEsQ0FBUixFQUFnQixJQUFBLENBQUEsQ0FBaEI7RUFBdUI7RUFDdkIsSUFBMEIsQ0FBQSxHQUFJLENBQTlCO0lBQUEsT0FBQSxDQUFRLElBQUEsQ0FBQSxDQUFSLEVBQWdCLENBQWhCLEVBQUE7O0VBRUEsQ0FBQSxJQUFLO0VBQ0wsQ0FBQSxJQUFLLENBQUEsS0FBTTtFQUNYLENBQUEsR0FBSyxJQUFBLENBQUssQ0FBTCxFQUFRLEVBQVI7RUFDTCxDQUFBLElBQUssQ0FBQSxLQUFNO0VBQ1gsQ0FBQSxHQUFLLElBQUEsQ0FBSyxDQUFMLEVBQVEsRUFBUjtTQUNMLENBQUEsSUFBSyxDQUFBLEtBQU07QUE1Qk47O0FBOEJQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{}],14:[function(require,module,exports){
exports.Factory = require('./factory');

exports.Material = require('./material');

exports.library = require('./library');

exports.cache = require('./cache');

exports.queue = require('./queue');

exports.hash = require('./hash');

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2luZGV4LmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZmFjdG9yeS9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE9BQVIsR0FBbUIsT0FBQSxDQUFRLFdBQVI7O0FBQ25CLE9BQU8sQ0FBQyxRQUFSLEdBQW1CLE9BQUEsQ0FBUSxZQUFSOztBQUVuQixPQUFPLENBQUMsT0FBUixHQUFvQixPQUFBLENBQVEsV0FBUjs7QUFDcEIsT0FBTyxDQUFDLEtBQVIsR0FBb0IsT0FBQSxDQUFRLFNBQVI7O0FBQ3BCLE9BQU8sQ0FBQyxLQUFSLEdBQW9CLE9BQUEsQ0FBUSxTQUFSOztBQUNwQixPQUFPLENBQUMsSUFBUixHQUFvQixPQUFBLENBQVEsUUFBUiJ9

},{"./cache":11,"./factory":12,"./hash":13,"./library":15,"./material":16,"./queue":17}],15:[function(require,module,exports){

/*
  Snippet library
  
  Takes:
    - Hash of snippets: named library
    - (name) -> getter: dynamic lookup
    - nothing:          no library, only pass in inline source code
  
  If 'name' contains any of "{;(#" it is assumed to be direct GLSL code.
 */
var library;

library = function(language, snippets, load) {
  var callback, fetch, inline, used;
  callback = null;
  used = {};
  if (snippets != null) {
    if (typeof snippets === 'function') {
      callback = function(name) {
        return load(language, name, snippets(name));
      };
    } else if (typeof snippets === 'object') {
      callback = function(name) {
        if (snippets[name] == null) {
          throw new Error("Unknown snippet `" + name + "`");
        }
        return load(language, name, snippets[name]);
      };
    }
  }
  inline = function(code) {
    return load(language, '', code);
  };
  if (callback == null) {
    return inline;
  }
  fetch = function(name) {
    if (name.match(/[{;]/)) {
      return inline(name);
    }
    used[name] = true;
    return callback(name);
  };
  fetch.used = function(_used) {
    if (_used == null) {
      _used = used;
    }
    return used = _used;
  };
  return fetch;
};

module.exports = library;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2xpYnJhcnkuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L2xpYnJhcnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBVUEsT0FBQSxHQUFVLFNBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsSUFBckI7QUFFUixNQUFBO0VBQUEsUUFBQSxHQUFXO0VBQ1gsSUFBQSxHQUFPO0VBRVAsSUFBRyxnQkFBSDtJQUNFLElBQUcsT0FBTyxRQUFQLEtBQW1CLFVBQXRCO01BQ0UsUUFBQSxHQUFXLFNBQUMsSUFBRDtlQUNULElBQUEsQ0FBSyxRQUFMLEVBQWUsSUFBZixFQUFxQixRQUFBLENBQVMsSUFBVCxDQUFyQjtNQURTLEVBRGI7S0FBQSxNQUdLLElBQUcsT0FBTyxRQUFQLEtBQW1CLFFBQXRCO01BQ0gsUUFBQSxHQUFXLFNBQUMsSUFBRDtRQUNULElBQWdELHNCQUFoRDtBQUFBLGdCQUFNLElBQUksS0FBSixDQUFVLG1CQUFBLEdBQW9CLElBQXBCLEdBQXlCLEdBQW5DLEVBQU47O2VBQ0EsSUFBQSxDQUFLLFFBQUwsRUFBZSxJQUFmLEVBQXFCLFFBQVMsQ0FBQSxJQUFBLENBQTlCO01BRlMsRUFEUjtLQUpQOztFQVNBLE1BQUEsR0FBUyxTQUFDLElBQUQ7V0FDUCxJQUFBLENBQUssUUFBTCxFQUFlLEVBQWYsRUFBbUIsSUFBbkI7RUFETztFQUdULElBQWtCLGdCQUFsQjtBQUFBLFdBQU8sT0FBUDs7RUFFQSxLQUFBLEdBQVEsU0FBQyxJQUFEO0lBQ04sSUFBc0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFYLENBQXRCO0FBQUEsYUFBTyxNQUFBLENBQU8sSUFBUCxFQUFQOztJQUNBLElBQUssQ0FBQSxJQUFBLENBQUwsR0FBYTtXQUNiLFFBQUEsQ0FBUyxJQUFUO0VBSE07RUFLUixLQUFLLENBQUMsSUFBTixHQUFhLFNBQUMsS0FBRDs7TUFBQyxRQUFROztXQUFTLElBQUEsR0FBTztFQUF6QjtTQUViO0FBMUJROztBQTZCVixNQUFNLENBQUMsT0FBUCxHQUFpQiJ9

},{}],16:[function(require,module,exports){
var Material, Visualize, debug, tick;

debug = false;

Visualize = require('../visualize');

tick = function() {
  var now;
  now = +(new Date);
  return function(label) {
    var delta;
    delta = +new Date() - now;
    console.log(label, delta + " ms");
    return delta;
  };
};

Material = (function() {
  function Material(vertex1, fragment1) {
    this.vertex = vertex1;
    this.fragment = fragment1;
    if (debug) {
      this.tock = tick();
    }
  }

  Material.prototype.build = function(options) {
    return this.link(options);
  };

  Material.prototype.link = function(options) {
    var attributes, fragment, i, key, len, ref, ref1, ref2, ref3, shader, uniforms, value, varyings, vertex;
    if (options == null) {
      options = {};
    }
    uniforms = {};
    varyings = {};
    attributes = {};
    vertex = this.vertex.link('main');
    fragment = this.fragment.link('main');
    ref = [vertex, fragment];
    for (i = 0, len = ref.length; i < len; i++) {
      shader = ref[i];
      ref1 = shader.uniforms;
      for (key in ref1) {
        value = ref1[key];
        uniforms[key] = value;
      }
      ref2 = shader.varyings;
      for (key in ref2) {
        value = ref2[key];
        varyings[key] = value;
      }
      ref3 = shader.attributes;
      for (key in ref3) {
        value = ref3[key];
        attributes[key] = value;
      }
    }
    options.vertexShader = vertex.code;
    options.vertexGraph = vertex.graph;
    options.fragmentShader = fragment.code;
    options.fragmentGraph = fragment.graph;
    options.attributes = attributes;
    options.uniforms = uniforms;
    options.varyings = varyings;
    options.inspect = function() {
      return Visualize.inspect('Vertex Shader', vertex, 'Fragment Shader', fragment.graph);
    };
    if (debug) {
      this.tock('Material build');
    }
    return options;
  };

  Material.prototype.inspect = function() {
    return Visualize.inspect('Vertex Shader', this.vertex, 'Fragment Shader', this.fragment.graph);
  };

  return Material;

})();

module.exports = Material;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L21hdGVyaWFsLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZmFjdG9yeS9tYXRlcmlhbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxLQUFBLEdBQVE7O0FBQ1IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztBQUVaLElBQUEsR0FBTyxTQUFBO0FBQ0wsTUFBQTtFQUFBLEdBQUEsR0FBTSxFQUFDLElBQUk7QUFDWCxTQUFPLFNBQUMsS0FBRDtBQUNMLFFBQUE7SUFBQSxLQUFBLEdBQVEsQ0FBQyxJQUFJLElBQUosQ0FBQSxDQUFELEdBQWM7SUFDdEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CLEtBQUEsR0FBUSxLQUEzQjtXQUNBO0VBSEs7QUFGRjs7QUFPRDtFQUNTLGtCQUFDLE9BQUQsRUFBVSxTQUFWO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFBUyxJQUFDLENBQUEsV0FBRDtJQUNyQixJQUFrQixLQUFsQjtNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQSxDQUFBLEVBQVI7O0VBRFc7O3FCQUdiLEtBQUEsR0FBTyxTQUFDLE9BQUQ7V0FBYSxJQUFDLENBQUEsSUFBRCxDQUFNLE9BQU47RUFBYjs7cUJBQ1AsSUFBQSxHQUFNLFNBQUMsT0FBRDtBQUNKLFFBQUE7O01BREssVUFBVTs7SUFDZixRQUFBLEdBQWE7SUFDYixRQUFBLEdBQWE7SUFDYixVQUFBLEdBQWE7SUFFYixNQUFBLEdBQVcsSUFBQyxDQUFBLE1BQVEsQ0FBQyxJQUFWLENBQWUsTUFBZjtJQUNYLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxNQUFmO0FBRVg7QUFBQSxTQUFBLHFDQUFBOztBQUNFO0FBQUEsV0FBQSxXQUFBOztRQUFDLFFBQVMsQ0FBQSxHQUFBLENBQVQsR0FBa0I7QUFBbkI7QUFDQTtBQUFBLFdBQUEsV0FBQTs7UUFBQyxRQUFTLENBQUEsR0FBQSxDQUFULEdBQWtCO0FBQW5CO0FBQ0E7QUFBQSxXQUFBLFdBQUE7O1FBQUMsVUFBVyxDQUFBLEdBQUEsQ0FBWCxHQUFrQjtBQUFuQjtBQUhGO0lBS0EsT0FBTyxDQUFDLFlBQVIsR0FBeUIsTUFBUSxDQUFDO0lBQ2xDLE9BQU8sQ0FBQyxXQUFSLEdBQXlCLE1BQVEsQ0FBQztJQUNsQyxPQUFPLENBQUMsY0FBUixHQUF5QixRQUFRLENBQUM7SUFDbEMsT0FBTyxDQUFDLGFBQVIsR0FBeUIsUUFBUSxDQUFDO0lBQ2xDLE9BQU8sQ0FBQyxVQUFSLEdBQXlCO0lBQ3pCLE9BQU8sQ0FBQyxRQUFSLEdBQXlCO0lBQ3pCLE9BQU8sQ0FBQyxRQUFSLEdBQXlCO0lBQ3pCLE9BQU8sQ0FBQyxPQUFSLEdBQXlCLFNBQUE7YUFDdkIsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsZUFBbEIsRUFBbUMsTUFBbkMsRUFBMkMsaUJBQTNDLEVBQThELFFBQVEsQ0FBQyxLQUF2RTtJQUR1QjtJQUd6QixJQUEwQixLQUExQjtNQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sZ0JBQU4sRUFBQTs7V0FFQTtFQXpCSTs7cUJBMkJOLE9BQUEsR0FBUyxTQUFBO1dBQ1AsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsZUFBbEIsRUFBbUMsSUFBQyxDQUFBLE1BQXBDLEVBQTRDLGlCQUE1QyxFQUErRCxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQXpFO0VBRE87Ozs7OztBQUdYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{"../visualize":36}],17:[function(require,module,exports){
var queue;

queue = function(limit) {
  var add, count, head, map, remove, tail;
  if (limit == null) {
    limit = 100;
  }
  map = {};
  head = null;
  tail = null;
  count = 0;
  add = function(item) {
    item.prev = null;
    item.next = head;
    if (head != null) {
      head.prev = item;
    }
    head = item;
    if (tail == null) {
      return tail = item;
    }
  };
  remove = function(item) {
    var next, prev;
    prev = item.prev;
    next = item.next;
    if (prev != null) {
      prev.next = next;
    }
    if (next != null) {
      next.prev = prev;
    }
    if (head === item) {
      head = next;
    }
    if (tail === item) {
      return tail = prev;
    }
  };
  return function(key) {
    var dead, item;
    if (item = map[key] && item !== head) {
      remove(item);
      add(item);
    } else {
      if (count === limit) {
        dead = tail.key;
        remove(tail);
        delete map[dead];
      } else {
        count++;
      }
      item = {
        next: head,
        prev: null,
        key: key
      };
      add(item);
      map[key] = item;
    }
    return dead;
  };
};

module.exports = queue;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9mYWN0b3J5L3F1ZXVlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZmFjdG9yeS9xdWV1ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBQTs7QUFBQSxLQUFBLEdBQVEsU0FBQyxLQUFEO0FBQ04sTUFBQTs7SUFETyxRQUFROztFQUNmLEdBQUEsR0FBTTtFQUVOLElBQUEsR0FBUTtFQUNSLElBQUEsR0FBUTtFQUNSLEtBQUEsR0FBUTtFQUdSLEdBQUEsR0FBTSxTQUFDLElBQUQ7SUFDSixJQUFJLENBQUMsSUFBTCxHQUFZO0lBQ1osSUFBSSxDQUFDLElBQUwsR0FBWTtJQUVaLElBQW9CLFlBQXBCO01BQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxLQUFaOztJQUVBLElBQUEsR0FBWTtJQUNaLElBQXFCLFlBQXJCO2FBQUEsSUFBQSxHQUFZLEtBQVo7O0VBUEk7RUFVTixNQUFBLEdBQVMsU0FBQyxJQUFEO0FBQ1AsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUM7SUFDWixJQUFBLEdBQU8sSUFBSSxDQUFDO0lBRVosSUFBb0IsWUFBcEI7TUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLEtBQVo7O0lBQ0EsSUFBb0IsWUFBcEI7TUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLEtBQVo7O0lBRUEsSUFBb0IsSUFBQSxLQUFRLElBQTVCO01BQUEsSUFBQSxHQUFPLEtBQVA7O0lBQ0EsSUFBb0IsSUFBQSxLQUFRLElBQTVCO2FBQUEsSUFBQSxHQUFPLEtBQVA7O0VBUk87U0FXVCxTQUFDLEdBQUQ7QUFDRSxRQUFBO0lBQUEsSUFBRyxJQUFBLEdBQU8sR0FBSSxDQUFBLEdBQUEsQ0FBSixJQUFhLElBQUEsS0FBUSxJQUEvQjtNQUVFLE1BQUEsQ0FBTyxJQUFQO01BQ0EsR0FBQSxDQUFPLElBQVAsRUFIRjtLQUFBLE1BQUE7TUFPRSxJQUFHLEtBQUEsS0FBUyxLQUFaO1FBRUUsSUFBQSxHQUFPLElBQUksQ0FBQztRQUNaLE1BQUEsQ0FBTyxJQUFQO1FBR0EsT0FBTyxHQUFJLENBQUEsSUFBQSxFQU5iO09BQUEsTUFBQTtRQVFFLEtBQUEsR0FSRjs7TUFXQSxJQUFBLEdBQU87UUFBQSxJQUFBLEVBQU0sSUFBTjtRQUFZLElBQUEsRUFBTSxJQUFsQjtRQUF3QixHQUFBLEVBQUssR0FBN0I7O01BQ1AsR0FBQSxDQUFJLElBQUo7TUFHQSxHQUFJLENBQUEsR0FBQSxDQUFKLEdBQVcsS0F0QmI7O1dBeUJBO0VBMUJGO0FBN0JNOztBQXlEUixNQUFNLENBQUMsT0FBUCxHQUFpQiJ9

},{}],18:[function(require,module,exports){

/*
  Compile snippet back into GLSL, but with certain symbols replaced by prefixes / placeholders
 */
var compile, replaced, string_compiler, tick;

compile = function(program) {
  var assembler, ast, code, placeholders, signatures;
  ast = program.ast, code = program.code, signatures = program.signatures;
  placeholders = replaced(signatures);
  assembler = string_compiler(code, placeholders);
  return [signatures, assembler];
};

tick = function() {
  var now;
  now = +(new Date);
  return function(label) {
    var delta;
    delta = +new Date() - now;
    console.log(label, delta + " ms");
    return delta;
  };
};

replaced = function(signatures) {
  var i, j, key, len, len1, out, ref, ref1, s, sig;
  out = {};
  s = function(sig) {
    return out[sig.name] = true;
  };
  s(signatures.main);
  ref = ['external', 'internal', 'varying', 'uniform', 'attribute'];
  for (i = 0, len = ref.length; i < len; i++) {
    key = ref[i];
    ref1 = signatures[key];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      sig = ref1[j];
      s(sig);
    }
  }
  return out;
};


/*
String-replacement based compiler
 */

string_compiler = function(code, placeholders) {
  var key, re;
  re = new RegExp('\\b(' + ((function() {
    var results;
    results = [];
    for (key in placeholders) {
      results.push(key);
    }
    return results;
  })()).join('|') + ')\\b', 'g');
  code = code.replace(/\/\/[^\n]*/g, '');
  code = code.replace(/\/\*([^*]|\*[^\/])*\*\//g, '');
  return function(prefix, exceptions, defines) {
    var compiled, defs, replace, value;
    if (prefix == null) {
      prefix = '';
    }
    if (exceptions == null) {
      exceptions = {};
    }
    if (defines == null) {
      defines = {};
    }
    replace = {};
    for (key in placeholders) {
      replace[key] = exceptions[key] != null ? key : prefix + key;
    }
    compiled = code.replace(re, function(key) {
      return replace[key];
    });
    defs = (function() {
      var results;
      results = [];
      for (key in defines) {
        value = defines[key];
        results.push("#define " + key + " " + value);
      }
      return results;
    })();
    if (defs.length) {
      defs.push('');
    }
    return defs.join("\n") + compiled;
  };
};

module.exports = compile;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL2NvbXBpbGUuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL2NvbXBpbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0FBQUEsSUFBQTs7QUFJQSxPQUFBLEdBQVUsU0FBQyxPQUFEO0FBQ1IsTUFBQTtFQUFDLGlCQUFELEVBQU0sbUJBQU4sRUFBWTtFQUdaLFlBQUEsR0FBZSxRQUFBLENBQVMsVUFBVDtFQUdmLFNBQUEsR0FBWSxlQUFBLENBQWdCLElBQWhCLEVBQXNCLFlBQXRCO1NBRVosQ0FBQyxVQUFELEVBQWEsU0FBYjtBQVRROztBQWFWLElBQUEsR0FBTyxTQUFBO0FBQ0wsTUFBQTtFQUFBLEdBQUEsR0FBTSxFQUFDLElBQUk7QUFDWCxTQUFPLFNBQUMsS0FBRDtBQUNMLFFBQUE7SUFBQSxLQUFBLEdBQVEsQ0FBQyxJQUFJLElBQUosQ0FBQSxDQUFELEdBQWM7SUFDdEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CLEtBQUEsR0FBUSxLQUEzQjtXQUNBO0VBSEs7QUFGRjs7QUFPUCxRQUFBLEdBQVcsU0FBQyxVQUFEO0FBQ1QsTUFBQTtFQUFBLEdBQUEsR0FBTTtFQUNOLENBQUEsR0FBSSxTQUFDLEdBQUQ7V0FBUyxHQUFJLENBQUEsR0FBRyxDQUFDLElBQUosQ0FBSixHQUFnQjtFQUF6QjtFQUVKLENBQUEsQ0FBRSxVQUFVLENBQUMsSUFBYjtBQUdBO0FBQUEsT0FBQSxxQ0FBQTs7QUFDRTtBQUFBLFNBQUEsd0NBQUE7O01BQUEsQ0FBQSxDQUFFLEdBQUY7QUFBQTtBQURGO1NBR0E7QUFWUzs7O0FBWVg7Ozs7QUFHQSxlQUFBLEdBQWtCLFNBQUMsSUFBRCxFQUFPLFlBQVA7QUFJaEIsTUFBQTtFQUFBLEVBQUEsR0FBSyxJQUFJLE1BQUosQ0FBVyxNQUFBLEdBQVM7O0FBQUM7U0FBQSxtQkFBQTttQkFBQTtBQUFBOztNQUFELENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsR0FBbkMsQ0FBVCxHQUFtRCxNQUE5RCxFQUFzRSxHQUF0RTtFQUdMLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLGFBQWIsRUFBNEIsRUFBNUI7RUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSwwQkFBYixFQUF5QyxFQUF6QztTQU9QLFNBQUMsTUFBRCxFQUFjLFVBQWQsRUFBK0IsT0FBL0I7QUFDRSxRQUFBOztNQURELFNBQVM7OztNQUFJLGFBQWE7OztNQUFJLFVBQVU7O0lBQ3ZDLE9BQUEsR0FBVTtBQUNWLFNBQUEsbUJBQUE7TUFDRSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWtCLHVCQUFILEdBQXlCLEdBQXpCLEdBQWtDLE1BQUEsR0FBUztBQUQ1RDtJQUdBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLEVBQWIsRUFBaUIsU0FBQyxHQUFEO2FBQVMsT0FBUSxDQUFBLEdBQUE7SUFBakIsQ0FBakI7SUFFWCxJQUFBOztBQUFRO1dBQUEsY0FBQTs7cUJBQUEsVUFBQSxHQUFXLEdBQVgsR0FBZSxHQUFmLEdBQWtCO0FBQWxCOzs7SUFDUixJQUFnQixJQUFJLENBQUMsTUFBckI7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQVYsRUFBQTs7V0FDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBQSxHQUFrQjtFQVRwQjtBQWZnQjs7QUEwQmxCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{}],19:[function(require,module,exports){
module.exports = {
  SHADOW_ARG: '_i_o',
  RETURN_ARG: 'return'
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL2NvbnN0YW50cy5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2dsc2wvY29uc3RhbnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsVUFBQSxFQUFZLE1BQVo7RUFDQSxVQUFBLEVBQVksUUFEWiJ9

},{}],20:[function(require,module,exports){
var Definition, decl, defaults, get, three, threejs, win;

module.exports = decl = {};

decl["in"] = 0;

decl.out = 1;

decl.inout = 2;

get = function(n) {
  return n.token.data;
};

decl.node = function(node) {
  var ref, ref1;
  if (((ref = node.children[5]) != null ? ref.type : void 0) === 'function') {
    return decl["function"](node);
  } else if (((ref1 = node.token) != null ? ref1.type : void 0) === 'keyword') {
    return decl.external(node);
  }
};

decl.external = function(node) {
  var c, i, ident, j, len, list, next, out, quant, ref, storage, struct, type;
  c = node.children;
  storage = get(c[1]);
  struct = get(c[3]);
  type = get(c[4]);
  list = c[5];
  if (storage !== 'attribute' && storage !== 'uniform' && storage !== 'varying') {
    storage = 'global';
  }
  out = [];
  ref = list.children;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    c = ref[i];
    if (c.type === 'ident') {
      ident = get(c);
      next = list.children[i + 1];
      quant = (next != null ? next.type : void 0) === 'quantifier';
      out.push({
        decl: 'external',
        storage: storage,
        type: type,
        ident: ident,
        quant: !!quant,
        count: quant
      });
    }
  }
  return out;
};

decl["function"] = function(node) {
  var args, body, c, child, decls, func, ident, storage, struct, type;
  c = node.children;
  storage = get(c[1]);
  struct = get(c[3]);
  type = get(c[4]);
  func = c[5];
  ident = get(func.children[0]);
  args = func.children[1];
  body = func.children[2];
  decls = (function() {
    var j, len, ref, results;
    ref = args.children;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      results.push(decl.argument(child));
    }
    return results;
  })();
  return [
    {
      decl: 'function',
      storage: storage,
      type: type,
      ident: ident,
      body: !!body,
      args: decls
    }
  ];
};

decl.argument = function(node) {
  var c, count, ident, inout, list, quant, storage, type;
  c = node.children;
  storage = get(c[1]);
  inout = get(c[2]);
  type = get(c[4]);
  list = c[5];
  ident = get(list.children[0]);
  quant = list.children[1];
  count = quant ? quant.children[0].token.data : void 0;
  return {
    decl: 'argument',
    storage: storage,
    inout: inout,
    type: type,
    ident: ident,
    quant: !!quant,
    count: count
  };
};

decl.param = function(dir, storage, spec, quant, count) {
  var f, prefix, suffix;
  prefix = [];
  if (storage != null) {
    prefix.push(storage);
  }
  if (spec != null) {
    prefix.push(spec);
  }
  prefix.push('');
  prefix = prefix.join(' ');
  suffix = quant ? '[' + count + ']' : '';
  if (dir !== '') {
    dir += ' ';
  }
  f = function(name, long) {
    return (long ? dir : '') + ("" + prefix + name + suffix);
  };
  f.split = function(dir) {
    return decl.param(dir, storage, spec, quant, count);
  };
  return f;
};

win = typeof window !== 'undefined';

threejs = win && !!window.THREE;

defaults = {
  int: 0,
  float: 0,
  vec2: threejs ? THREE.Vector2 : null,
  vec3: threejs ? THREE.Vector3 : null,
  vec4: threejs ? THREE.Vector4 : null,
  mat2: null,
  mat3: threejs ? THREE.Matrix3 : null,
  mat4: threejs ? THREE.Matrix4 : null,
  sampler2D: 0,
  samplerCube: 0
};

three = {
  int: 'i',
  float: 'f',
  vec2: 'v2',
  vec3: 'v3',
  vec4: 'v4',
  mat2: 'm2',
  mat3: 'm3',
  mat4: 'm4',
  sampler2D: 't',
  samplerCube: 't'
};

decl.type = function(name, spec, quant, count, dir, storage) {
  var dirs, inout, param, ref, storages, type, value;
  dirs = {
    "in": decl["in"],
    out: decl.out,
    inout: decl.inout
  };
  storages = {
    "const": 'const'
  };
  type = three[spec];
  if (quant) {
    type += 'v';
  }
  value = defaults[spec];
  if (value != null ? value.call : void 0) {
    value = new value;
  }
  if (quant) {
    value = [value];
  }
  inout = (ref = dirs[dir]) != null ? ref : dirs["in"];
  storage = storages[storage];
  param = decl.param(dir, storage, spec, quant, count);
  return new Definition(name, type, spec, param, value, inout);
};

Definition = (function() {
  function Definition(name1, type1, spec1, param1, value1, inout1, meta1) {
    this.name = name1;
    this.type = type1;
    this.spec = spec1;
    this.param = param1;
    this.value = value1;
    this.inout = inout1;
    this.meta = meta1;
  }

  Definition.prototype.split = function() {
    var dir, inout, isIn, param;
    isIn = this.meta.shadowed != null;
    dir = isIn ? 'in' : 'out';
    inout = isIn ? decl["in"] : decl.out;
    param = this.param.split(dir);
    return new Definition(this.name, this.type, this.spec, param, this.value, inout);
  };

  Definition.prototype.copy = function(name, meta) {
    var def;
    return def = new Definition(name != null ? name : this.name, this.type, this.spec, this.param, this.value, this.inout, meta);
  };

  return Definition;

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL2RlY2wuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL2RlY2wuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBQSxHQUFPOztBQUV4QixJQUFJLEVBQUMsRUFBRCxFQUFKLEdBQWE7O0FBQ2IsSUFBSSxDQUFDLEdBQUwsR0FBYTs7QUFDYixJQUFJLENBQUMsS0FBTCxHQUFhOztBQUViLEdBQUEsR0FBTSxTQUFDLENBQUQ7U0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQWY7O0FBRU4sSUFBSSxDQUFDLElBQUwsR0FBWSxTQUFDLElBQUQ7QUFFVixNQUFBO0VBQUEsMkNBQW1CLENBQUUsY0FBbEIsS0FBMEIsVUFBN0I7V0FDRSxJQUFJLEVBQUMsUUFBRCxFQUFKLENBQWMsSUFBZCxFQURGO0dBQUEsTUFHSyx1Q0FBYSxDQUFFLGNBQVosS0FBb0IsU0FBdkI7V0FDSCxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsRUFERzs7QUFMSzs7QUFRWixJQUFJLENBQUMsUUFBTCxHQUFnQixTQUFDLElBQUQ7QUFFZCxNQUFBO0VBQUEsQ0FBQSxHQUFJLElBQUksQ0FBQztFQUVULE9BQUEsR0FBVSxHQUFBLENBQUksQ0FBRSxDQUFBLENBQUEsQ0FBTjtFQUNWLE1BQUEsR0FBVSxHQUFBLENBQUksQ0FBRSxDQUFBLENBQUEsQ0FBTjtFQUNWLElBQUEsR0FBVSxHQUFBLENBQUksQ0FBRSxDQUFBLENBQUEsQ0FBTjtFQUNWLElBQUEsR0FBVSxDQUFFLENBQUEsQ0FBQTtFQUVaLElBQXNCLE9BQUEsS0FBYSxXQUFiLElBQUEsT0FBQSxLQUEwQixTQUExQixJQUFBLE9BQUEsS0FBcUMsU0FBM0Q7SUFBQSxPQUFBLEdBQVUsU0FBVjs7RUFFQSxHQUFBLEdBQU07QUFFTjtBQUFBLE9BQUEsNkNBQUE7O0lBQ0UsSUFBRyxDQUFDLENBQUMsSUFBRixLQUFVLE9BQWI7TUFDRSxLQUFBLEdBQVUsR0FBQSxDQUFJLENBQUo7TUFDVixJQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVMsQ0FBQSxDQUFBLEdBQUksQ0FBSjtNQUN4QixLQUFBLG1CQUFXLElBQUksQ0FBRSxjQUFOLEtBQWM7TUFFekIsR0FBRyxDQUFDLElBQUosQ0FDRTtRQUFBLElBQUEsRUFBTSxVQUFOO1FBQ0EsT0FBQSxFQUFTLE9BRFQ7UUFFQSxJQUFBLEVBQU0sSUFGTjtRQUdBLEtBQUEsRUFBTyxLQUhQO1FBSUEsS0FBQSxFQUFPLENBQUMsQ0FBQyxLQUpUO1FBS0EsS0FBQSxFQUFPLEtBTFA7T0FERixFQUxGOztBQURGO1NBY0E7QUEzQmM7O0FBNkJoQixJQUFJLEVBQUMsUUFBRCxFQUFKLEdBQWdCLFNBQUMsSUFBRDtBQUNkLE1BQUE7RUFBQSxDQUFBLEdBQUksSUFBSSxDQUFDO0VBSVQsT0FBQSxHQUFVLEdBQUEsQ0FBSSxDQUFFLENBQUEsQ0FBQSxDQUFOO0VBQ1YsTUFBQSxHQUFVLEdBQUEsQ0FBSSxDQUFFLENBQUEsQ0FBQSxDQUFOO0VBQ1YsSUFBQSxHQUFVLEdBQUEsQ0FBSSxDQUFFLENBQUEsQ0FBQSxDQUFOO0VBQ1YsSUFBQSxHQUFVLENBQUUsQ0FBQSxDQUFBO0VBQ1osS0FBQSxHQUFVLEdBQUEsQ0FBSSxJQUFJLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBbEI7RUFDVixJQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVMsQ0FBQSxDQUFBO0VBQ3hCLElBQUEsR0FBVSxJQUFJLENBQUMsUUFBUyxDQUFBLENBQUE7RUFFeEIsS0FBQTs7QUFBUztBQUFBO1NBQUEscUNBQUE7O21CQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZDtBQUFBOzs7U0FFVDtJQUNFO01BQUEsSUFBQSxFQUFNLFVBQU47TUFDQSxPQUFBLEVBQVMsT0FEVDtNQUVBLElBQUEsRUFBTSxJQUZOO01BR0EsS0FBQSxFQUFPLEtBSFA7TUFJQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLElBSlI7TUFLQSxJQUFBLEVBQU0sS0FMTjtLQURGOztBQWZjOztBQXdCaEIsSUFBSSxDQUFDLFFBQUwsR0FBZ0IsU0FBQyxJQUFEO0FBQ2QsTUFBQTtFQUFBLENBQUEsR0FBSSxJQUFJLENBQUM7RUFJVCxPQUFBLEdBQVUsR0FBQSxDQUFJLENBQUUsQ0FBQSxDQUFBLENBQU47RUFDVixLQUFBLEdBQVUsR0FBQSxDQUFJLENBQUUsQ0FBQSxDQUFBLENBQU47RUFDVixJQUFBLEdBQVUsR0FBQSxDQUFJLENBQUUsQ0FBQSxDQUFBLENBQU47RUFDVixJQUFBLEdBQVUsQ0FBRSxDQUFBLENBQUE7RUFDWixLQUFBLEdBQVUsR0FBQSxDQUFJLElBQUksQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFsQjtFQUNWLEtBQUEsR0FBVSxJQUFJLENBQUMsUUFBUyxDQUFBLENBQUE7RUFFeEIsS0FBQSxHQUFhLEtBQUgsR0FBYyxLQUFLLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxJQUF0QyxHQUFBO1NBRVY7SUFBQSxJQUFBLEVBQU0sVUFBTjtJQUNBLE9BQUEsRUFBUyxPQURUO0lBRUEsS0FBQSxFQUFPLEtBRlA7SUFHQSxJQUFBLEVBQU0sSUFITjtJQUlBLEtBQUEsRUFBTyxLQUpQO0lBS0EsS0FBQSxFQUFPLENBQUMsQ0FBQyxLQUxUO0lBTUEsS0FBQSxFQUFPLEtBTlA7O0FBZGM7O0FBc0JoQixJQUFJLENBQUMsS0FBTCxHQUFhLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxJQUFmLEVBQXFCLEtBQXJCLEVBQTRCLEtBQTVCO0FBQ1gsTUFBQTtFQUFBLE1BQUEsR0FBUztFQUNULElBQXVCLGVBQXZCO0lBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLEVBQUE7O0VBQ0EsSUFBb0IsWUFBcEI7SUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosRUFBQTs7RUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLEVBQVo7RUFFQSxNQUFBLEdBQVMsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaO0VBQ1QsTUFBQSxHQUFZLEtBQUgsR0FBYyxHQUFBLEdBQU0sS0FBTixHQUFjLEdBQTVCLEdBQXFDO0VBQzlDLElBQWMsR0FBQSxLQUFPLEVBQXJCO0lBQUEsR0FBQSxJQUFPLElBQVA7O0VBRUEsQ0FBQSxHQUFJLFNBQUMsSUFBRCxFQUFPLElBQVA7V0FBZ0IsQ0FBSSxJQUFILEdBQWEsR0FBYixHQUFzQixFQUF2QixDQUFBLEdBQTZCLENBQUEsRUFBQSxHQUFHLE1BQUgsR0FBWSxJQUFaLEdBQW1CLE1BQW5CO0VBQTdDO0VBQ0osQ0FBQyxDQUFDLEtBQUYsR0FBVSxTQUFDLEdBQUQ7V0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsRUFBZ0IsT0FBaEIsRUFBeUIsSUFBekIsRUFBK0IsS0FBL0IsRUFBc0MsS0FBdEM7RUFBVDtTQUVWO0FBYlc7O0FBZ0JiLEdBQUEsR0FBTSxPQUFPLE1BQVAsS0FBaUI7O0FBQ3ZCLE9BQUEsR0FBVSxHQUFBLElBQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFMUIsUUFBQSxHQUNFO0VBQUEsR0FBQSxFQUFhLENBQWI7RUFDQSxLQUFBLEVBQWEsQ0FEYjtFQUVBLElBQUEsRUFBZ0IsT0FBSCxHQUFnQixLQUFLLENBQUMsT0FBdEIsR0FBbUMsSUFGaEQ7RUFHQSxJQUFBLEVBQWdCLE9BQUgsR0FBZ0IsS0FBSyxDQUFDLE9BQXRCLEdBQW1DLElBSGhEO0VBSUEsSUFBQSxFQUFnQixPQUFILEdBQWdCLEtBQUssQ0FBQyxPQUF0QixHQUFtQyxJQUpoRDtFQUtBLElBQUEsRUFBYSxJQUxiO0VBTUEsSUFBQSxFQUFnQixPQUFILEdBQWdCLEtBQUssQ0FBQyxPQUF0QixHQUFtQyxJQU5oRDtFQU9BLElBQUEsRUFBZ0IsT0FBSCxHQUFnQixLQUFLLENBQUMsT0FBdEIsR0FBbUMsSUFQaEQ7RUFRQSxTQUFBLEVBQWEsQ0FSYjtFQVNBLFdBQUEsRUFBYSxDQVRiOzs7QUFXRixLQUFBLEdBQ0U7RUFBQSxHQUFBLEVBQWEsR0FBYjtFQUNBLEtBQUEsRUFBYSxHQURiO0VBRUEsSUFBQSxFQUFhLElBRmI7RUFHQSxJQUFBLEVBQWEsSUFIYjtFQUlBLElBQUEsRUFBYSxJQUpiO0VBS0EsSUFBQSxFQUFhLElBTGI7RUFNQSxJQUFBLEVBQWEsSUFOYjtFQU9BLElBQUEsRUFBYSxJQVBiO0VBUUEsU0FBQSxFQUFhLEdBUmI7RUFTQSxXQUFBLEVBQWEsR0FUYjs7O0FBV0YsSUFBSSxDQUFDLElBQUwsR0FBWSxTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsS0FBYixFQUFvQixLQUFwQixFQUEyQixHQUEzQixFQUFnQyxPQUFoQztBQUVWLE1BQUE7RUFBQSxJQUFBLEdBQ0U7SUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFPLElBQUksRUFBQyxFQUFELEVBQVg7SUFDQSxHQUFBLEVBQU8sSUFBSSxDQUFDLEdBRFo7SUFFQSxLQUFBLEVBQU8sSUFBSSxDQUFDLEtBRlo7O0VBSUYsUUFBQSxHQUNFO0lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQOztFQUVGLElBQUEsR0FBVSxLQUFNLENBQUEsSUFBQTtFQUNoQixJQUFpQixLQUFqQjtJQUFBLElBQUEsSUFBVSxJQUFWOztFQUVBLEtBQUEsR0FBVSxRQUFTLENBQUEsSUFBQTtFQUNuQixvQkFBdUIsS0FBSyxDQUFFLGFBQTlCO0lBQUEsS0FBQSxHQUFVLElBQUksTUFBZDs7RUFDQSxJQUF1QixLQUF2QjtJQUFBLEtBQUEsR0FBVSxDQUFDLEtBQUQsRUFBVjs7RUFFQSxLQUFBLHFDQUFzQixJQUFJLEVBQUMsRUFBRDtFQUMxQixPQUFBLEdBQVUsUUFBUyxDQUFBLE9BQUE7RUFFbkIsS0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxFQUFnQixPQUFoQixFQUF5QixJQUF6QixFQUErQixLQUEvQixFQUFzQyxLQUF0QztTQUNWLElBQUksVUFBSixDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsS0FBakMsRUFBd0MsS0FBeEMsRUFBK0MsS0FBL0M7QUFyQlU7O0FBdUJOO0VBQ1Msb0JBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxLQUFmLEVBQXNCLE1BQXRCLEVBQThCLE1BQTlCLEVBQXNDLE1BQXRDLEVBQThDLEtBQTlDO0lBQUMsSUFBQyxDQUFBLE9BQUQ7SUFBTyxJQUFDLENBQUEsT0FBRDtJQUFPLElBQUMsQ0FBQSxPQUFEO0lBQU8sSUFBQyxDQUFBLFFBQUQ7SUFBUSxJQUFDLENBQUEsUUFBRDtJQUFRLElBQUMsQ0FBQSxRQUFEO0lBQVEsSUFBQyxDQUFBLE9BQUQ7RUFBOUM7O3VCQUViLEtBQUEsR0FBTyxTQUFBO0FBRUwsUUFBQTtJQUFBLElBQUEsR0FBUTtJQUNSLEdBQUEsR0FBVyxJQUFILEdBQWEsSUFBYixHQUF1QjtJQUMvQixLQUFBLEdBQVcsSUFBSCxHQUFhLElBQUksRUFBQyxFQUFELEVBQWpCLEdBQTBCLElBQUksQ0FBQztJQUN2QyxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQWEsR0FBYjtXQUNSLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxJQUFoQixFQUFzQixJQUFDLENBQUEsSUFBdkIsRUFBNkIsSUFBQyxDQUFBLElBQTlCLEVBQW9DLEtBQXBDLEVBQTJDLElBQUMsQ0FBQSxLQUE1QyxFQUFtRCxLQUFuRDtFQU5LOzt1QkFRUCxJQUFBLEdBQU0sU0FBQyxJQUFELEVBQU8sSUFBUDtBQUNKLFFBQUE7V0FBQSxHQUFBLEdBQU0sSUFBSSxVQUFKLGdCQUFlLE9BQU8sSUFBQyxDQUFBLElBQXZCLEVBQTZCLElBQUMsQ0FBQSxJQUE5QixFQUFvQyxJQUFDLENBQUEsSUFBckMsRUFBMkMsSUFBQyxDQUFBLEtBQTVDLEVBQW1ELElBQUMsQ0FBQSxLQUFwRCxFQUEyRCxJQUFDLENBQUEsS0FBNUQsRUFBbUUsSUFBbkU7RUFERiJ9

},{}],21:[function(require,module,exports){
var $, Graph, _;

Graph = require('../graph');

$ = require('./constants');


/*
 GLSL code generator for compiler and linker stubs
 */

module.exports = _ = {
  unshadow: function(name) {
    var real;
    real = name.replace($.SHADOW_ARG, '');
    if (real !== name) {
      return real;
    } else {
      return null;
    }
  },
  lines: function(lines) {
    return lines.join('\n');
  },
  list: function(lines) {
    return lines.join(', ');
  },
  statements: function(lines) {
    return lines.join(';\n');
  },
  body: function(entry) {
    return {
      entry: entry,
      type: 'void',
      params: [],
      signature: [],
      "return": '',
      vars: {},
      calls: [],
      post: [],
      chain: {}
    };
  },
  define: function(a, b) {
    return "#define " + a + " " + b;
  },
  "function": function(type, entry, params, vars, calls) {
    return type + " " + entry + "(" + params + ") {\n" + vars + calls + "}";
  },
  invoke: function(ret, entry, args) {
    ret = ret ? ret + " = " : '';
    args = _.list(args);
    return "  " + ret + entry + "(" + args + ")";
  },
  same: function(a, b) {
    var A, B, i, k, len;
    for (i = k = 0, len = a.length; k < len; i = ++k) {
      A = a[i];
      B = b[i];
      if (!B) {
        return false;
      }
      if (A.type !== B.type) {
        return false;
      }
      if ((A.name === $.RETURN_ARG) !== (B.name === $.RETURN_ARG)) {
        return false;
      }
    }
    return true;
  },
  call: function(lookup, dangling, entry, signature, body) {
    var arg, args, copy, id, inout, isReturn, k, len, meta, name, omit, op, other, ref, ref1, ret, rets, shadow;
    args = [];
    ret = '';
    rets = 1;
    for (k = 0, len = signature.length; k < len; k++) {
      arg = signature[k];
      name = arg.name;
      copy = id = lookup(name);
      other = null;
      meta = null;
      omit = false;
      inout = arg.inout;
      isReturn = name === $.RETURN_ARG;
      if (shadow = (ref = arg.meta) != null ? ref.shadowed : void 0) {
        other = lookup(shadow);
        if (other) {
          body.vars[other] = "  " + arg.param(other);
          body.calls.push("  " + other + " = " + id);
          if (!dangling(shadow)) {
            arg = arg.split();
          } else {
            meta = {
              shadowed: other
            };
          }
        }
      }
      if (shadow = (ref1 = arg.meta) != null ? ref1.shadow : void 0) {
        other = lookup(shadow);
        if (other) {
          if (!dangling(shadow)) {
            arg = arg.split();
            omit = true;
          } else {
            meta = {
              shadow: other
            };
            continue;
          }
        }
      }
      if (isReturn) {
        ret = id;
      } else if (!omit) {
        args.push(other != null ? other : id);
      }
      if (dangling(name)) {
        op = 'push';
        if (isReturn) {
          if (body["return"] === '') {
            op = 'unshift';
            copy = name;
            body.type = arg.spec;
            body["return"] = "  return " + id;
            body.vars[id] = "  " + arg.param(id);
          } else {
            body.vars[id] = "  " + arg.param(id);
            body.params.push(arg.param(id, true));
          }
        } else {
          body.params.push(arg.param(id, true));
        }
        arg = arg.copy(copy, meta);
        body.signature[op](arg);
      } else {
        body.vars[id] = "  " + arg.param(id);
      }
    }
    return body.calls.push(_.invoke(ret, entry, args));
  },
  build: function(body, calls) {
    var a, b, code, decl, entry, params, post, ret, type, v, vars;
    entry = body.entry;
    code = null;
    if (calls && calls.length === 1 && entry !== 'main') {
      a = body;
      b = calls[0].module;
      if (_.same(body.signature, b.main.signature)) {
        code = _.define(entry, b.entry);
      }
    }
    if (code == null) {
      vars = (function() {
        var ref, results;
        ref = body.vars;
        results = [];
        for (v in ref) {
          decl = ref[v];
          results.push(decl);
        }
        return results;
      })();
      calls = body.calls;
      post = body.post;
      params = body.params;
      type = body.type;
      ret = body["return"];
      calls = calls.concat(post);
      if (ret !== '') {
        calls.push(ret);
      }
      calls.push('');
      if (vars.length) {
        vars.push('');
        vars = _.statements(vars) + '\n';
      } else {
        vars = '';
      }
      calls = _.statements(calls);
      params = _.list(params);
      code = _["function"](type, entry, params, vars, calls);
    }
    return {
      signature: body.signature,
      code: code,
      name: entry
    };
  },
  links: function(links) {
    var k, l, len, out;
    out = {
      defs: [],
      bodies: []
    };
    for (k = 0, len = links.length; k < len; k++) {
      l = links[k];
      _.link(l, out);
    }
    out.defs = _.lines(out.defs);
    out.bodies = _.statements(out.bodies);
    if (out.defs === '') {
      delete out.defs;
    }
    if (out.bodies === '') {
      delete out.bodies;
    }
    return out;
  },
  link: (function(_this) {
    return function(link, out) {
      var _dangling, _lookup, _name, arg, entry, external, inner, ins, k, len, len1, list, main, map, module, n, name, other, outer, outs, ref, ref1, returnVar, wrapper;
      module = link.module, name = link.name, external = link.external;
      main = module.main;
      entry = module.entry;
      if (_.same(main.signature, external.signature)) {
        return out.defs.push(_.define(name, entry));
      }
      ins = [];
      outs = [];
      map = {};
      returnVar = [module.namespace, $.RETURN_ARG].join('');
      ref = external.signature;
      for (k = 0, len = ref.length; k < len; k++) {
        arg = ref[k];
        list = arg.inout === Graph.IN ? ins : outs;
        list.push(arg);
      }
      ref1 = main.signature;
      for (n = 0, len1 = ref1.length; n < len1; n++) {
        arg = ref1[n];
        list = arg.inout === Graph.IN ? ins : outs;
        other = list.shift();
        _name = other.name;
        if (_name === $.RETURN_ARG) {
          _name = returnVar;
        }
        map[arg.name] = _name;
      }
      _lookup = function(name) {
        return map[name];
      };
      _dangling = function() {
        return true;
      };
      inner = _.body();
      _.call(_lookup, _dangling, entry, main.signature, inner);
      inner.entry = entry;
      map = {
        "return": returnVar
      };
      _lookup = function(name) {
        var ref2;
        return (ref2 = map[name]) != null ? ref2 : name;
      };
      outer = _.body();
      wrapper = _.call(_lookup, _dangling, entry, external.signature, outer);
      outer.calls = inner.calls;
      outer.entry = name;
      out.bodies.push(_.build(inner).code.split(' {')[0]);
      return out.bodies.push(_.build(outer).code);
    };
  })(this),
  defuse: function(code) {
    var b, blocks, hash, head, i, j, k, len, len1, level, line, n, re, rest, strip;
    re = /([A-Za-z0-9_]+\s+)?[A-Za-z0-9_]+\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*;\s*/mg;
    strip = function(code) {
      return code.replace(re, function(m) {
        return '';
      });
    };
    blocks = code.split(/(?=[{}])/g);
    level = 0;
    for (i = k = 0, len = blocks.length; k < len; i = ++k) {
      b = blocks[i];
      switch (b[0]) {
        case '{':
          level++;
          break;
        case '}':
          level--;
      }
      if (level === 0) {
        hash = b.split(/^[ \t]*#/m);
        for (j = n = 0, len1 = hash.length; n < len1; j = ++n) {
          line = hash[j];
          if (j > 0) {
            line = line.split(/\n/);
            head = line.shift();
            rest = line.join("\n");
            hash[j] = [head, strip(rest)].join('\n');
          } else {
            hash[j] = strip(line);
          }
        }
        blocks[i] = hash.join('#');
      }
    }
    return code = blocks.join('');
  },
  dedupe: function(code) {
    var map, re;
    map = {};
    re = /((attribute|uniform|varying)\s+)[A-Za-z0-9_]+\s+([A-Za-z0-9_]+)\s*(\[[^\]]*\]\s*)?;\s*/mg;
    return code.replace(re, function(m, qual, type, name, struct) {
      if (map[name]) {
        return '';
      }
      map[name] = true;
      return m;
    });
  },
  hoist: function(code) {
    var defs, k, len, line, lines, list, out, re;
    re = /^#define ([^ ]+ _pg_[0-9]+_|_pg_[0-9]+_ [^ ]+)$/;
    lines = code.split(/\n/g);
    defs = [];
    out = [];
    for (k = 0, len = lines.length; k < len; k++) {
      line = lines[k];
      list = line.match(re) ? defs : out;
      list.push(line);
    }
    return defs.concat(out).join("\n");
  }
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL2dlbmVyYXRlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZ2xzbC9nZW5lcmF0ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0FBQ1IsQ0FBQSxHQUFRLE9BQUEsQ0FBUSxhQUFSOzs7QUFFUjs7OztBQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQUEsR0FHZjtFQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQ7QUFDUixRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBQyxDQUFDLFVBQWYsRUFBMkIsRUFBM0I7SUFDUCxJQUFHLElBQUEsS0FBUSxJQUFYO2FBQXFCLEtBQXJCO0tBQUEsTUFBQTthQUErQixLQUEvQjs7RUFGUSxDQUFWO0VBS0EsS0FBQSxFQUFZLFNBQUMsS0FBRDtXQUFXLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWDtFQUFYLENBTFo7RUFNQSxJQUFBLEVBQVksU0FBQyxLQUFEO1dBQVcsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO0VBQVgsQ0FOWjtFQU9BLFVBQUEsRUFBWSxTQUFDLEtBQUQ7V0FBVyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQVg7RUFBWCxDQVBaO0VBVUEsSUFBQSxFQUFNLFNBQUMsS0FBRDtXQUNKO01BQUEsS0FBQSxFQUFXLEtBQVg7TUFDQSxJQUFBLEVBQVcsTUFEWDtNQUVBLE1BQUEsRUFBVyxFQUZYO01BR0EsU0FBQSxFQUFXLEVBSFg7TUFJQSxDQUFBLE1BQUEsQ0FBQSxFQUFXLEVBSlg7TUFL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

},{"../graph":25,"./constants":19}],22:[function(require,module,exports){
var i, k, len, ref, v;

exports.compile = require('./compile');

exports.parse = require('./parse');

exports.generate = require('./generate');

ref = require('./constants');
for (v = i = 0, len = ref.length; i < len; v = ++i) {
  k = ref[v];
  exports[k] = v;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL2luZGV4LmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZ2xzbC9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxPQUFPLENBQUMsT0FBUixHQUFtQixPQUFBLENBQVEsV0FBUjs7QUFDbkIsT0FBTyxDQUFDLEtBQVIsR0FBbUIsT0FBQSxDQUFRLFNBQVI7O0FBQ25CLE9BQU8sQ0FBQyxRQUFSLEdBQW1CLE9BQUEsQ0FBUSxZQUFSOztBQUVuQjtBQUFBLEtBQUEsNkNBQUE7O0VBQUEsT0FBUSxDQUFBLENBQUEsQ0FBUixHQUFhO0FBQWIifQ==

},{"./compile":18,"./constants":19,"./generate":21,"./parse":23}],23:[function(require,module,exports){
var $, collect, debug, decl, extractSignatures, mapSymbols, parse, parseGLSL, parser, processAST, sortSymbols, tick, tokenizer, walk;

tokenizer = require('../../vendor/glsl-tokenizer');

parser = require('../../vendor/glsl-parser');

decl = require('./decl');

$ = require('./constants');

debug = false;


/*
parse GLSL into AST
extract all global symbols and make type signatures
 */

parse = function(name, code) {
  var ast, program;
  ast = parseGLSL(name, code);
  return program = processAST(ast, code);
};

parseGLSL = function(name, code) {
  var ast, e, error, errors, fmt, j, len, ref, ref1, tock;
  if (debug) {
    tock = tick();
  }
  try {
    ref = tokenizer().process(parser(), code), (ref1 = ref[0], ast = ref1[0]), errors = ref[1];
  } catch (error1) {
    e = error1;
    errors = [
      {
        message: e
      }
    ];
  }
  if (debug) {
    tock('GLSL Tokenize & Parse');
  }
  fmt = function(code) {
    var max, pad;
    code = code.split("\n");
    max = ("" + code.length).length;
    pad = function(v) {
      if ((v = "" + v).length < max) {
        return ("       " + v).slice(-max);
      } else {
        return v;
      }
    };
    return code.map(function(line, i) {
      return (pad(i + 1)) + ": " + line;
    }).join("\n");
  };
  if (!ast || errors.length) {
    if (!name) {
      name = '(inline code)';
    }
    console.warn(fmt(code));
    for (j = 0, len = errors.length; j < len; j++) {
      error = errors[j];
      console.error(name + " -", error.message);
    }
    throw new Error("GLSL parse error");
  }
  return ast;
};

processAST = function(ast, code) {
  var externals, internals, main, ref, signatures, symbols, tock;
  if (debug) {
    tock = tick();
  }
  symbols = [];
  walk(mapSymbols, collect(symbols), ast, '');
  ref = sortSymbols(symbols), main = ref[0], internals = ref[1], externals = ref[2];
  signatures = extractSignatures(main, internals, externals);
  if (debug) {
    tock('GLSL AST');
  }
  return {
    ast: ast,
    code: code,
    signatures: signatures
  };
};

mapSymbols = function(node, collect) {
  switch (node.type) {
    case 'decl':
      collect(decl.node(node));
      return false;
  }
  return true;
};

collect = function(out) {
  return function(value) {
    var j, len, obj, results;
    if (value != null) {
      results = [];
      for (j = 0, len = value.length; j < len; j++) {
        obj = value[j];
        results.push(out.push(obj));
      }
      return results;
    }
  };
};

sortSymbols = function(symbols) {
  var e, externals, found, internals, j, len, main, maybe, s;
  main = null;
  internals = [];
  externals = [];
  maybe = {};
  found = false;
  for (j = 0, len = symbols.length; j < len; j++) {
    s = symbols[j];
    if (!s.body) {
      if (s.storage === 'global') {
        internals.push(s);
      } else {
        externals.push(s);
        maybe[s.ident] = true;
      }
    } else {
      if (maybe[s.ident]) {
        externals = (function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = externals.length; k < len1; k++) {
            e = externals[k];
            if (e.ident !== s.ident) {
              results.push(e);
            }
          }
          return results;
        })();
        delete maybe[s.ident];
      }
      internals.push(s);
      if (s.ident === 'main') {
        main = s;
        found = true;
      } else if (!found) {
        main = s;
      }
    }
  }
  return [main, internals, externals];
};

extractSignatures = function(main, internals, externals) {
  var def, defn, func, j, k, len, len1, sigs, symbol;
  sigs = {
    uniform: [],
    attribute: [],
    varying: [],
    external: [],
    internal: [],
    global: [],
    main: null
  };
  defn = function(symbol) {
    return decl.type(symbol.ident, symbol.type, symbol.quant, symbol.count, symbol.inout, symbol.storage);
  };
  func = function(symbol, inout) {
    var a, arg, b, d, def, inTypes, j, len, outTypes, signature, type;
    signature = (function() {
      var j, len, ref, results;
      ref = symbol.args;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        arg = ref[j];
        results.push(defn(arg));
      }
      return results;
    })();
    for (j = 0, len = signature.length; j < len; j++) {
      d = signature[j];
      if (!(d.inout === decl.inout)) {
        continue;
      }
      a = d;
      b = d.copy();
      a.inout = decl["in"];
      b.inout = decl.out;
      b.meta = {
        shadow: a.name
      };
      b.name += $.SHADOW_ARG;
      a.meta = {
        shadowed: b.name
      };
      signature.push(b);
    }
    if (symbol.type !== 'void') {
      signature.unshift(decl.type($.RETURN_ARG, symbol.type, false, '', 'out'));
    }
    inTypes = ((function() {
      var k, len1, results;
      results = [];
      for (k = 0, len1 = signature.length; k < len1; k++) {
        d = signature[k];
        if (d.inout === decl["in"]) {
          results.push(d.type);
        }
      }
      return results;
    })()).join(',');
    outTypes = ((function() {
      var k, len1, results;
      results = [];
      for (k = 0, len1 = signature.length; k < len1; k++) {
        d = signature[k];
        if (d.inout === decl.out) {
          results.push(d.type);
        }
      }
      return results;
    })()).join(',');
    type = "(" + inTypes + ")(" + outTypes + ")";
    return def = {
      name: symbol.ident,
      type: type,
      signature: signature,
      inout: inout,
      spec: symbol.type
    };
  };
  sigs.main = func(main, decl.out);
  for (j = 0, len = internals.length; j < len; j++) {
    symbol = internals[j];
    sigs.internal.push({
      name: symbol.ident
    });
  }
  for (k = 0, len1 = externals.length; k < len1; k++) {
    symbol = externals[k];
    switch (symbol.decl) {
      case 'external':
        def = defn(symbol);
        sigs[symbol.storage].push(def);
        break;
      case 'function':
        def = func(symbol, decl["in"]);
        sigs.external.push(def);
    }
  }
  return sigs;
};

debug = false;

walk = function(map, collect, node, indent) {
  var child, i, j, len, recurse, ref, ref1, ref2;
  debug && console.log(indent, node.type, (ref = node.token) != null ? ref.data : void 0, (ref1 = node.token) != null ? ref1.type : void 0);
  recurse = map(node, collect);
  if (recurse) {
    ref2 = node.children;
    for (i = j = 0, len = ref2.length; j < len; i = ++j) {
      child = ref2[i];
      walk(map, collect, child, indent + '  ', debug);
    }
  }
  return null;
};

tick = function() {
  var now;
  now = +(new Date);
  return function(label) {
    var delta;
    delta = +new Date() - now;
    console.log(label, delta + " ms");
    return delta;
  };
};

module.exports = walk;

module.exports = parse;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9nbHNsL3BhcnNlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZ2xzbC9wYXJzZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLDZCQUFSOztBQUNaLE1BQUEsR0FBWSxPQUFBLENBQVEsMEJBQVI7O0FBQ1osSUFBQSxHQUFZLE9BQUEsQ0FBUSxRQUFSOztBQUNaLENBQUEsR0FBWSxPQUFBLENBQVEsYUFBUjs7QUFFWixLQUFBLEdBQVE7OztBQUVSOzs7OztBQUtBLEtBQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxJQUFQO0FBQ04sTUFBQTtFQUFBLEdBQUEsR0FBYSxTQUFBLENBQVUsSUFBVixFQUFnQixJQUFoQjtTQUNiLE9BQUEsR0FBYSxVQUFBLENBQVcsR0FBWCxFQUFnQixJQUFoQjtBQUZQOztBQUtSLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxJQUFQO0FBRVYsTUFBQTtFQUFBLElBQWlCLEtBQWpCO0lBQUEsSUFBQSxHQUFPLElBQUEsQ0FBQSxFQUFQOztBQUdBO0lBQ0UsTUFBa0IsU0FBQSxDQUFBLENBQVcsQ0FBQyxPQUFaLENBQW9CLE1BQUEsQ0FBQSxDQUFwQixFQUE4QixJQUE5QixDQUFsQixrQkFBRSxjQUFGLEVBQVEsZ0JBRFY7R0FBQSxjQUFBO0lBRU07SUFDSixNQUFBLEdBQVM7TUFBQztRQUFDLE9BQUEsRUFBUSxDQUFUO09BQUQ7TUFIWDs7RUFLQSxJQUFnQyxLQUFoQztJQUFBLElBQUEsQ0FBSyx1QkFBTCxFQUFBOztFQUVBLEdBQUEsR0FBTSxTQUFDLElBQUQ7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

},{"../../vendor/glsl-parser":39,"../../vendor/glsl-tokenizer":43,"./constants":19,"./decl":20}],24:[function(require,module,exports){

/*
  Graph of nodes with outlets
 */
var Graph;

Graph = (function() {
  Graph.index = 0;

  Graph.id = function(name) {
    return ++Graph.index;
  };

  Graph.IN = 0;

  Graph.OUT = 1;

  function Graph(nodes, parent) {
    this.parent = parent != null ? parent : null;
    this.id = Graph.id();
    this.nodes = [];
    nodes && this.add(nodes);
  }

  Graph.prototype.inputs = function() {
    var i, inputs, j, len, len1, node, outlet, ref, ref1;
    inputs = [];
    ref = this.nodes;
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      ref1 = node.inputs;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        outlet = ref1[j];
        if (outlet.input === null) {
          inputs.push(outlet);
        }
      }
    }
    return inputs;
  };

  Graph.prototype.outputs = function() {
    var i, j, len, len1, node, outlet, outputs, ref, ref1;
    outputs = [];
    ref = this.nodes;
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      ref1 = node.outputs;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        outlet = ref1[j];
        if (outlet.output.length === 0) {
          outputs.push(outlet);
        }
      }
    }
    return outputs;
  };

  Graph.prototype.getIn = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.inputs();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Graph.prototype.getOut = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.outputs();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Graph.prototype.add = function(node, ignore) {
    var _node, i, len;
    if (node.length) {
      for (i = 0, len = node.length; i < len; i++) {
        _node = node[i];
        this.add(_node);
      }
      return;
    }
    if (node.graph && !ignore) {
      throw new Error("Adding node to two graphs at once");
    }
    node.graph = this;
    return this.nodes.push(node);
  };

  Graph.prototype.remove = function(node, ignore) {
    var _node, i, len;
    if (node.length) {
      for (i = 0, len = node.length; i < len; i++) {
        _node = node[i];
        this.remove(_node);
      }
      return;
    }
    if (node.graph !== this) {
      throw new Error("Removing node from wrong graph.");
    }
    ignore || node.disconnect();
    this.nodes.splice(this.nodes.indexOf(node), 1);
    return node.graph = null;
  };

  Graph.prototype.adopt = function(node) {
    var _node, i, len;
    if (node.length) {
      for (i = 0, len = node.length; i < len; i++) {
        _node = node[i];
        this.adopt(_node);
      }
      return;
    }
    node.graph.remove(node, true);
    return this.add(node, true);
  };

  return Graph;

})();

module.exports = Graph;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ncmFwaC9ncmFwaC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2dyYXBoL2dyYXBoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztBQUFBLElBQUE7O0FBR007RUFDSixLQUFDLENBQUEsS0FBRCxHQUFROztFQUNSLEtBQUMsQ0FBQSxFQUFELEdBQUssU0FBQyxJQUFEO1dBQVUsRUFBRSxLQUFLLENBQUM7RUFBbEI7O0VBRUwsS0FBQyxDQUFBLEVBQUQsR0FBSzs7RUFDTCxLQUFDLENBQUEsR0FBRCxHQUFNOztFQUVPLGVBQUMsS0FBRCxFQUFRLE1BQVI7SUFBUSxJQUFDLENBQUEsMEJBQUQsU0FBVTtJQUM3QixJQUFDLENBQUEsRUFBRCxHQUFTLEtBQUssQ0FBQyxFQUFOLENBQUE7SUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsS0FBQSxJQUFTLElBQUMsQ0FBQSxHQUFELENBQUssS0FBTDtFQUhFOztrQkFLYixNQUFBLEdBQVEsU0FBQTtBQUNOLFFBQUE7SUFBQSxNQUFBLEdBQVM7QUFDVDtBQUFBLFNBQUEscUNBQUE7O0FBQ0U7QUFBQSxXQUFBLHdDQUFBOztZQUFtRCxNQUFNLENBQUMsS0FBUCxLQUFnQjtVQUFuRSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVo7O0FBQUE7QUFERjtBQUVBLFdBQU87RUFKRDs7a0JBTVIsT0FBQSxHQUFTLFNBQUE7QUFDUCxRQUFBO0lBQUEsT0FBQSxHQUFVO0FBQ1Y7QUFBQSxTQUFBLHFDQUFBOztBQUNFO0FBQUEsV0FBQSx3Q0FBQTs7WUFBcUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFkLEtBQXdCO1VBQTdFLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBYjs7QUFBQTtBQURGO0FBRUEsV0FBTztFQUpBOztrQkFNVCxLQUFBLEdBQVEsU0FBQyxJQUFEO0FBQVUsUUFBQTtXQUFBOztBQUFDO0FBQUE7V0FBQSxxQ0FBQTs7WUFBcUMsTUFBTSxDQUFDLElBQVAsS0FBZTt1QkFBcEQ7O0FBQUE7O2lCQUFELENBQTJELENBQUEsQ0FBQTtFQUFyRTs7a0JBQ1IsTUFBQSxHQUFRLFNBQUMsSUFBRDtBQUFVLFFBQUE7V0FBQTs7QUFBQztBQUFBO1dBQUEscUNBQUE7O1lBQXFDLE1BQU0sQ0FBQyxJQUFQLEtBQWU7dUJBQXBEOztBQUFBOztpQkFBRCxDQUEyRCxDQUFBLENBQUE7RUFBckU7O2tCQUVSLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxNQUFQO0FBRUgsUUFBQTtJQUFBLElBQUcsSUFBSSxDQUFDLE1BQVI7QUFDRSxXQUFBLHNDQUFBOztRQUFBLElBQUMsQ0FBQSxHQUFELENBQUssS0FBTDtBQUFBO0FBQ0EsYUFGRjs7SUFJQSxJQUF1RCxJQUFJLENBQUMsS0FBTCxJQUFlLENBQUMsTUFBdkU7QUFBQSxZQUFNLElBQUksS0FBSixDQUFVLG1DQUFWLEVBQU47O0lBRUEsSUFBSSxDQUFDLEtBQUwsR0FBYTtXQUNiLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVo7RUFURzs7a0JBV0wsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLE1BQVA7QUFDTixRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsTUFBUjtBQUNFLFdBQUEsc0NBQUE7O1FBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSO0FBQUE7QUFDQSxhQUZGOztJQUlBLElBQXFELElBQUksQ0FBQyxLQUFMLEtBQWMsSUFBbkU7QUFBQSxZQUFNLElBQUksS0FBSixDQUFVLGlDQUFWLEVBQU47O0lBRUEsTUFBQSxJQUFVLElBQUksQ0FBQyxVQUFMLENBQUE7SUFFVixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxJQUFmLENBQWQsRUFBb0MsQ0FBcEM7V0FDQSxJQUFJLENBQUMsS0FBTCxHQUFhO0VBVlA7O2tCQVlSLEtBQUEsR0FBTyxTQUFDLElBQUQ7QUFDTCxRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsTUFBUjtBQUNFLFdBQUEsc0NBQUE7O1FBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxLQUFQO0FBQUE7QUFDQSxhQUZGOztJQUlBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBWCxDQUFrQixJQUFsQixFQUF3QixJQUF4QjtXQUNBLElBQUMsQ0FBQyxHQUFGLENBQU0sSUFBTixFQUFZLElBQVo7RUFOSzs7Ozs7O0FBUVQsTUFBTSxDQUFDLE9BQVAsR0FBaUIifQ==

},{}],25:[function(require,module,exports){
exports.Graph = require('./graph');

exports.Node = require('./node');

exports.Outlet = require('./outlet');

exports.IN = exports.Graph.IN;

exports.OUT = exports.Graph.OUT;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ncmFwaC9pbmRleC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2dyYXBoL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsS0FBUixHQUFpQixPQUFBLENBQVEsU0FBUjs7QUFDakIsT0FBTyxDQUFDLElBQVIsR0FBaUIsT0FBQSxDQUFRLFFBQVI7O0FBQ2pCLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLE9BQUEsQ0FBUSxVQUFSOztBQUVqQixPQUFPLENBQUMsRUFBUixHQUFjLE9BQU8sQ0FBQyxLQUFLLENBQUM7O0FBQzVCLE9BQU8sQ0FBQyxHQUFSLEdBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyJ9

},{"./graph":24,"./node":26,"./outlet":27}],26:[function(require,module,exports){
var Graph, Node, Outlet;

Graph = require('./graph');

Outlet = require('./outlet');


/*
 Node in graph.
 */

Node = (function() {
  Node.index = 0;

  Node.id = function(name) {
    return ++Node.index;
  };

  function Node(owner, outlets) {
    this.owner = owner;
    this.graph = null;
    this.inputs = [];
    this.outputs = [];
    this.all = [];
    this.outlets = null;
    this.id = Node.id();
    this.setOutlets(outlets);
  }

  Node.prototype.getIn = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.inputs;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Node.prototype.getOut = function(name) {
    var outlet;
    return ((function() {
      var i, len, ref, results;
      ref = this.outputs;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        outlet = ref[i];
        if (outlet.name === name) {
          results.push(outlet);
        }
      }
      return results;
    }).call(this))[0];
  };

  Node.prototype.get = function(name) {
    return this.getIn(name) || this.getOut(name);
  };

  Node.prototype.setOutlets = function(outlets) {
    var existing, hash, i, j, k, key, len, len1, len2, match, outlet, ref;
    if (outlets != null) {
      if (this.outlets == null) {
        this.outlets = {};
        for (i = 0, len = outlets.length; i < len; i++) {
          outlet = outlets[i];
          if (!(outlet instanceof Outlet)) {
            outlet = Outlet.make(outlet);
          }
          this._add(outlet);
        }
        return;
      }
      hash = function(outlet) {
        return [outlet.name, outlet.inout, outlet.type].join('-');
      };
      match = {};
      for (j = 0, len1 = outlets.length; j < len1; j++) {
        outlet = outlets[j];
        match[hash(outlet)] = true;
      }
      ref = this.outlets;
      for (key in ref) {
        outlet = ref[key];
        key = hash(outlet);
        if (match[key]) {
          match[key] = outlet;
        } else {
          this._remove(outlet);
        }
      }
      for (k = 0, len2 = outlets.length; k < len2; k++) {
        outlet = outlets[k];
        existing = match[hash(outlet)];
        if (existing instanceof Outlet) {
          this._morph(existing, outlet);
        } else {
          if (!(outlet instanceof Outlet)) {
            outlet = Outlet.make(outlet);
          }
          this._add(outlet);
        }
      }
      this;
    }
    return this.outlets;
  };

  Node.prototype.connect = function(node, empty, force) {
    var dest, dests, hint, hints, i, j, k, len, len1, len2, list, outlets, ref, ref1, ref2, source, sources, type, typeHint;
    outlets = {};
    hints = {};
    typeHint = function(outlet) {
      return type + '/' + outlet.hint;
    };
    ref = node.inputs;
    for (i = 0, len = ref.length; i < len; i++) {
      dest = ref[i];
      if (!force && dest.input) {
        continue;
      }
      type = dest.type;
      hint = typeHint(dest);
      if (!hints[hint]) {
        hints[hint] = dest;
      }
      outlets[type] = list = outlets[type] || [];
      list.push(dest);
    }
    sources = this.outputs;
    sources = sources.filter(function(outlet) {
      return !(empty && outlet.output.length);
    });
    ref1 = sources.slice();
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      source = ref1[j];
      type = source.type;
      hint = typeHint(source);
      dests = outlets[type];
      if (dest = hints[hint]) {
        source.connect(dest);
        delete hints[hint];
        dests.splice(dests.indexOf(dest), 1);
        sources.splice(sources.indexOf(source), 1);
      }
    }
    if (!sources.length) {
      return this;
    }
    ref2 = sources.slice();
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      source = ref2[k];
      type = source.type;
      dests = outlets[type];
      if (dests && dests.length) {
        source.connect(dests.shift());
      }
    }
    return this;
  };

  Node.prototype.disconnect = function(node) {
    var i, j, len, len1, outlet, ref, ref1;
    ref = this.inputs;
    for (i = 0, len = ref.length; i < len; i++) {
      outlet = ref[i];
      outlet.disconnect();
    }
    ref1 = this.outputs;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      outlet = ref1[j];
      outlet.disconnect();
    }
    return this;
  };

  Node.prototype._key = function(outlet) {
    return [outlet.name, outlet.inout].join('-');
  };

  Node.prototype._add = function(outlet) {
    var key;
    key = this._key(outlet);
    if (outlet.node) {
      throw new Error("Adding outlet to two nodes at once.");
    }
    if (this.outlets[key]) {
      throw new Error("Adding two identical outlets to same node. (" + key + ")");
    }
    outlet.node = this;
    if (outlet.inout === Graph.IN) {
      this.inputs.push(outlet);
    }
    if (outlet.inout === Graph.OUT) {
      this.outputs.push(outlet);
    }
    this.all.push(outlet);
    return this.outlets[key] = outlet;
  };

  Node.prototype._morph = function(existing, outlet) {
    var key;
    key = this._key(outlet);
    delete this.outlets[key];
    existing.morph(outlet);
    key = this._key(outlet);
    return this.outlets[key] = outlet;
  };

  Node.prototype._remove = function(outlet) {
    var inout, key;
    key = this._key(outlet);
    inout = outlet.inout;
    if (outlet.node !== this) {
      throw new Error("Removing outlet from wrong node.");
    }
    outlet.disconnect();
    outlet.node = null;
    delete this.outlets[key];
    if (outlet.inout === Graph.IN) {
      this.inputs.splice(this.inputs.indexOf(outlet), 1);
    }
    if (outlet.inout === Graph.OUT) {
      this.outputs.splice(this.outputs.indexOf(outlet), 1);
    }
    this.all.splice(this.all.indexOf(outlet), 1);
    return this;
  };

  return Node;

})();

module.exports = Node;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ncmFwaC9ub2RlLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvZ3JhcGgvbm9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOzs7QUFFVDs7OztBQUdNO0VBQ0osSUFBQyxDQUFBLEtBQUQsR0FBUTs7RUFDUixJQUFDLENBQUEsRUFBRCxHQUFLLFNBQUMsSUFBRDtXQUFVLEVBQUUsSUFBSSxDQUFDO0VBQWpCOztFQUVRLGNBQUMsS0FBRCxFQUFTLE9BQVQ7SUFBQyxJQUFDLENBQUEsUUFBRDtJQUNaLElBQUMsQ0FBQSxLQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsTUFBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxHQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLEVBQUQsR0FBVyxJQUFJLENBQUMsRUFBTCxDQUFBO0lBRVgsSUFBQyxDQUFBLFVBQUQsQ0FBWSxPQUFaO0VBUlc7O2lCQVdiLEtBQUEsR0FBTyxTQUFDLElBQUQ7QUFDTCxRQUFBO1dBQUE7O0FBQUM7QUFBQTtXQUFBLHFDQUFBOztZQUFrQyxNQUFNLENBQUMsSUFBUCxLQUFlO3VCQUFqRDs7QUFBQTs7aUJBQUQsQ0FBd0QsQ0FBQSxDQUFBO0VBRG5EOztpQkFJUCxNQUFBLEdBQVEsU0FBQyxJQUFEO0FBQ04sUUFBQTtXQUFBOztBQUFDO0FBQUE7V0FBQSxxQ0FBQTs7WUFBbUMs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

},{"./graph":24,"./outlet":27}],27:[function(require,module,exports){
var Graph, Outlet;

Graph = require('./graph');


/*
  In/out outlet on node
 */

Outlet = (function() {
  Outlet.make = function(outlet, extra) {
    var key, meta, ref, value;
    if (extra == null) {
      extra = {};
    }
    meta = extra;
    if (outlet.meta != null) {
      ref = outlet.meta;
      for (key in ref) {
        value = ref[key];
        meta[key] = value;
      }
    }
    return new Outlet(outlet.inout, outlet.name, outlet.hint, outlet.type, meta);
  };

  Outlet.index = 0;

  Outlet.id = function(name) {
    return "_io_" + (++Outlet.index) + "_" + name;
  };

  Outlet.hint = function(name) {
    name = name.replace(/^_io_[0-9]+_/, '');
    name = name.replace(/_i_o$/, '');
    return name = name.replace(/(In|Out|Inout|InOut)$/, '');
  };

  function Outlet(inout, name1, hint, type, meta1, id) {
    this.inout = inout;
    this.name = name1;
    this.hint = hint;
    this.type = type;
    this.meta = meta1 != null ? meta1 : {};
    this.id = id;
    if (this.hint == null) {
      this.hint = Outlet.hint(this.name);
    }
    this.node = null;
    this.input = null;
    this.output = [];
    if (this.id == null) {
      this.id = Outlet.id(this.hint);
    }
  }

  Outlet.prototype.morph = function(outlet) {
    this.inout = outlet.inout;
    this.name = outlet.name;
    this.hint = outlet.hint;
    this.type = outlet.type;
    return this.meta = outlet.meta;
  };

  Outlet.prototype.dupe = function(name) {
    var outlet;
    if (name == null) {
      name = this.id;
    }
    outlet = Outlet.make(this);
    outlet.name = name;
    return outlet;
  };

  Outlet.prototype.connect = function(outlet) {
    if (this.inout === Graph.IN && outlet.inout === Graph.OUT) {
      return outlet.connect(this);
    }
    if (this.inout !== Graph.OUT || outlet.inout !== Graph.IN) {
      throw new Error("Can only connect out to in.");
    }
    if (outlet.input === this) {
      return;
    }
    outlet.disconnect();
    outlet.input = this;
    return this.output.push(outlet);
  };

  Outlet.prototype.disconnect = function(outlet) {
    var i, index, len, ref;
    if (this.input) {
      this.input.disconnect(this);
    }
    if (this.output.length) {
      if (outlet) {
        index = this.output.indexOf(outlet);
        if (index >= 0) {
          this.output.splice(index, 1);
          return outlet.input = null;
        }
      } else {
        ref = this.output;
        for (i = 0, len = ref.length; i < len; i++) {
          outlet = ref[i];
          outlet.input = null;
        }
        return this.output = [];
      }
    }
  };

  return Outlet;

})();

module.exports = Outlet;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ncmFwaC9vdXRsZXQuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9ncmFwaC9vdXRsZXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOzs7QUFFUjs7OztBQUdNO0VBQ0osTUFBQyxDQUFBLElBQUQsR0FBUSxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQ04sUUFBQTs7TUFEZSxRQUFROztJQUN2QixJQUFBLEdBQU87SUFDUCxJQUFtRCxtQkFBbkQ7QUFBQTtBQUFBLFdBQUEsVUFBQTs7UUFBQSxJQUFLLENBQUEsR0FBQSxDQUFMLEdBQVk7QUFBWixPQUFBOztXQUNBLElBQUksTUFBSixDQUFXLE1BQU0sQ0FBQyxLQUFsQixFQUNXLE1BQU0sQ0FBQyxJQURsQixFQUVXLE1BQU0sQ0FBQyxJQUZsQixFQUdXLE1BQU0sQ0FBQyxJQUhsQixFQUlXLElBSlg7RUFITTs7RUFTUixNQUFDLENBQUEsS0FBRCxHQUFTOztFQUNULE1BQUMsQ0FBQSxFQUFELEdBQU0sU0FBQyxJQUFEO1dBQ0osTUFBQSxHQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBVixDQUFOLEdBQXNCLEdBQXRCLEdBQXlCO0VBRHJCOztFQUdOLE1BQUMsQ0FBQSxJQUFELEdBQVEsU0FBQyxJQUFEO0lBQ04sSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsY0FBYixFQUE2QixFQUE3QjtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsRUFBdEI7V0FDUCxJQUFBLEdBQU8sSUFBSSxD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

},{"./graph":24}],28:[function(require,module,exports){
var Block, Factory, GLSL, Graph, Linker, ShaderGraph, Snippet, Visualize, cache, inspect, library, merge, visualize;

Block = require('./block');

Factory = require('./factory');

GLSL = require('./glsl');

Graph = require('./graph');

Linker = require('./linker');

Visualize = require('./visualize');

library = Factory.library;

cache = Factory.cache;

visualize = Visualize.visualize;

inspect = Visualize.inspect;

Snippet = Linker.Snippet;

merge = function(a, b) {
  var key, out, ref, value;
  if (b == null) {
    b = {};
  }
  out = {};
  for (key in a) {
    value = a[key];
    out[key] = (ref = b[key]) != null ? ref : a[key];
  }
  return out;
};

ShaderGraph = (function() {
  function ShaderGraph(snippets, config) {
    var defaults;
    if (!(this instanceof ShaderGraph)) {
      return new ShaderGraph(snippets, config);
    }
    defaults = {
      globalUniforms: false,
      globalVaryings: true,
      globalAttributes: true,
      globals: [],
      autoInspect: false
    };
    this.config = merge(defaults, config);
    this.fetch = cache(library(GLSL, snippets, Snippet.load));
  }

  ShaderGraph.prototype.shader = function(config) {
    var _config;
    if (config == null) {
      config = {};
    }
    _config = merge(this.config, config);
    return new Factory.Factory(GLSL, this.fetch, _config);
  };

  ShaderGraph.prototype.material = function(config) {
    return new Factory.Material(this.shader(config), this.shader(config));
  };

  ShaderGraph.prototype.inspect = function(shader) {
    return ShaderGraph.inspect(shader);
  };

  ShaderGraph.prototype.visualize = function(shader) {
    return ShaderGraph.visualize(shader);
  };

  ShaderGraph.Block = Block;

  ShaderGraph.Factory = Factory;

  ShaderGraph.GLSL = GLSL;

  ShaderGraph.Graph = Graph;

  ShaderGraph.Linker = Linker;

  ShaderGraph.Visualize = Visualize;

  ShaderGraph.inspect = function(shader) {
    return inspect(shader);
  };

  ShaderGraph.visualize = function(shader) {
    return visualize(shader);
  };

  return ShaderGraph;

})();

module.exports = ShaderGraph;

if (typeof window !== 'undefined') {
  window.ShaderGraph = ShaderGraph;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9pbmRleC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLEtBQUEsR0FBWSxPQUFBLENBQVEsU0FBUjs7QUFDWixPQUFBLEdBQVksT0FBQSxDQUFRLFdBQVI7O0FBQ1osSUFBQSxHQUFZLE9BQUEsQ0FBUSxRQUFSOztBQUNaLEtBQUEsR0FBWSxPQUFBLENBQVEsU0FBUjs7QUFDWixNQUFBLEdBQVksT0FBQSxDQUFRLFVBQVI7O0FBQ1osU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSOztBQUVaLE9BQUEsR0FBWSxPQUFPLENBQUM7O0FBQ3BCLEtBQUEsR0FBWSxPQUFPLENBQUM7O0FBQ3BCLFNBQUEsR0FBWSxTQUFTLENBQUM7O0FBQ3RCLE9BQUEsR0FBWSxTQUFTLENBQUM7O0FBRXRCLE9BQUEsR0FBWSxNQUFNLENBQUM7O0FBRW5CLEtBQUEsR0FBUSxTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ04sTUFBQTs7SUFEVSxJQUFJOztFQUNkLEdBQUEsR0FBTTtBQUNOLE9BQUEsUUFBQTs7SUFBQSxHQUFJLENBQUEsR0FBQSxDQUFKLGtDQUFvQixDQUFFLENBQUEsR0FBQTtBQUF0QjtTQUNBO0FBSE07O0FBS0Y7RUFDUyxxQkFBQyxRQUFELEVBQVcsTUFBWDtBQUNYLFFBQUE7SUFBQSxJQUEyQyxDQUFBLENBQUEsSUFBQSxZQUFjLFdBQWQsQ0FBM0M7QUFBQSxhQUFPLElBQUksV0FBSixDQUFnQixRQUFoQixFQUEwQixNQUExQixFQUFQOztJQUVBLFFBQUEsR0FDRTtNQUFBLGNBQUEsRUFBa0IsS0FBbEI7TUFDQSxjQUFBLEVBQWtCLElBRGxCO01BRUEsZ0JBQUEsRUFBa0IsSUFGbEI7TUFHQSxPQUFBLEVBQWtCLEVBSGxCO01BSUEsV0FBQSxFQUFrQixLQUpsQjs7SUFNRixJQUFDLENBQUEsTUFBRCxHQUFVLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLE1BQWhCO0lBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBVSxLQUFBLENBQU0sT0FBQSxDQUFRLElBQVIsRUFBYyxRQUFkLEVBQXdCLE9BQU8sQ0FBQyxJQUFoQyxDQUFOO0VBWEM7O3dCQWFiLE1BQUEsR0FBUSxTQUFDLE1BQUQ7QUFDTixRQUFBOztNQURPLFNBQVM7O0lBQ2hCLE9BQUEsR0FBVSxLQUFBLENBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxNQUFmO1dBQ1YsSUFBSSxPQUFPLENBQUMsT0FBWixDQUFvQixJQUFwQixFQUEwQixJQUFDLENBQUEsS0FBM0IsRUFBa0MsT0FBbEM7RUFGTTs7d0JBSVIsUUFBQSxHQUFVLFNBQUMsTUFBRDtXQUNSLElBQUksT0FBTyxDQUFDLFFBQVosQ0FBcUIsSUFBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLENBQXJCLEVBQXNDLElBQUMsQ0FBQSxNQUFELENBQVEsTUFBUixDQUF0QztFQURROzt3QkFHVixPQUFBLEdBQVcsU0FBQyxNQUFEO1dBQVksV0FBVyxDQUFDLE9BQVosQ0FBc0IsTUFBdEI7RUFBWjs7d0JBQ1gsU0FBQSxHQUFXLFNBQUMsTUFBRDtXQUFZLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCO0VBQVo7O0VBR1gsV0FBQyxDQUFBLEtBQUQsR0FBWTs7RUFDWixXQUFDLENBQUEsT0FBRCxHQUFZOztFQUNaLFdBQUMsQ0FBQSxJQUFELEdBQVk7O0VBQ1osV0FBQyxDQUFBLEtBQUQsR0FBWTs7RUFDWixXQUFDLENBQUEsTUFBRCxHQUFZOztFQUNaLFdBQUMsQ0FBQSxTQUFELEdBQVk7O0VBR1osV0FBQyxDQUFBLE9BQUQsR0FBYSxTQUFDLE1BQUQ7V0FBWSxPQUFBLENBQVEsTUFBUjtFQUFaOztFQUNiLFdBQUMsQ0FBQSxTQUFELEdBQWEsU0FBQyxNQUFEO1dBQVksU0FBQSxDQUFVLE1BQVY7RUFBWjs7Ozs7O0FBRWYsTUFBTSxDQUFDLE9BQVAsR0FBaUI7O0FBQ2pCLElBQW9DLE9BQU8sTUFBUCxLQUFpQixXQUFyRDtFQUFBLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFlBQXJCIn0=

},{"./block":8,"./factory":14,"./glsl":22,"./graph":25,"./linker":30,"./visualize":36}],29:[function(require,module,exports){
var Graph, Priority, assemble;

Graph = require('../graph');

Priority = require('./priority');


/*
  Program assembler

  Builds composite program that can act as new module/snippet
  Unconnected input/outputs and undefined callbacks are exposed in the new global/main scope
  If there is only one call with an identical call signature, a #define is output instead.
 */

assemble = function(language, namespace, calls, requires) {
  var adopt, attributes, externals, generate, handle, include, isDangling, library, lookup, process, required, symbols, uniforms, varyings;
  generate = language.generate;
  externals = {};
  symbols = [];
  uniforms = {};
  varyings = {};
  attributes = {};
  library = {};
  process = function() {
    var body, code, includes, lib, main, ns, r, ref, sorted;
    for (ns in requires) {
      r = requires[ns];
      required(r.node, r.module);
    }
    ref = handle(calls), body = ref[0], calls = ref[1];
    if (namespace != null) {
      body.entry = namespace;
    }
    main = generate.build(body, calls);
    sorted = ((function() {
      var results;
      results = [];
      for (ns in library) {
        lib = library[ns];
        results.push(lib);
      }
      return results;
    })()).sort(function(a, b) {
      return Priority.compare(a.priority, b.priority);
    });
    includes = sorted.map(function(x) {
      return x.code;
    });
    includes.push(main.code);
    code = generate.lines(includes);
    return {
      namespace: main.name,
      library: library,
      body: main.code,
      code: code,
      main: main,
      entry: main.name,
      symbols: symbols,
      externals: externals,
      uniforms: uniforms,
      varyings: varyings,
      attributes: attributes
    };
  };
  handle = (function(_this) {
    return function(calls) {
      var body, c, call, i, len, ns;
      calls = (function() {
        var results;
        results = [];
        for (ns in calls) {
          c = calls[ns];
          results.push(c);
        }
        return results;
      })();
      calls.sort(function(a, b) {
        return b.priority - a.priority;
      });
      call = function(node, module, priority) {
        var _dangling, _lookup, entry, main;
        include(node, module, priority);
        main = module.main;
        entry = module.entry;
        _lookup = function(name) {
          return lookup(node, name);
        };
        _dangling = function(name) {
          return isDangling(node, name);
        };
        return generate.call(_lookup, _dangling, entry, main.signature, body);
      };
      body = generate.body();
      for (i = 0, len = calls.length; i < len; i++) {
        c = calls[i];
        call(c.node, c.module, c.priority);
      }
      return [body, calls];
    };
  })(this);
  adopt = function(namespace, code, priority) {
    var record;
    record = library[namespace];
    if (record != null) {
      return record.priority = Priority.max(record.priority, priority);
    } else {
      return library[namespace] = {
        code: code,
        priority: priority
      };
    }
  };
  include = function(node, module, priority) {
    var def, key, lib, ns, ref, ref1, ref2, ref3;
    priority = Priority.make(priority);
    ref = module.library;
    for (ns in ref) {
      lib = ref[ns];
      adopt(ns, lib.code, Priority.nest(priority, lib.priority));
    }
    adopt(module.namespace, module.body, priority);
    ref1 = module.uniforms;
    for (key in ref1) {
      def = ref1[key];
      uniforms[key] = def;
    }
    ref2 = module.varyings;
    for (key in ref2) {
      def = ref2[key];
      varyings[key] = def;
    }
    ref3 = module.attributes;
    for (key in ref3) {
      def = ref3[key];
      attributes[key] = def;
    }
    return required(node, module);
  };
  required = function(node, module) {
    var copy, ext, i, k, key, len, ref, results, v;
    ref = module.symbols;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      ext = module.externals[key];
      if (isDangling(node, ext.name)) {
        copy = {};
        for (k in ext) {
          v = ext[k];
          copy[k] = v;
        }
        copy.name = lookup(node, ext.name);
        externals[key] = copy;
        results.push(symbols.push(key));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  isDangling = function(node, name) {
    var outlet;
    outlet = node.get(name);
    if (outlet.inout === Graph.IN) {
      return outlet.input === null;
    } else if (outlet.inout === Graph.OUT) {
      return outlet.output.length === 0;
    }
  };
  lookup = function(node, name) {
    var outlet;
    outlet = node.get(name);
    if (!outlet) {
      return null;
    }
    if (outlet.input) {
      outlet = outlet.input;
    }
    name = outlet.name;
    return outlet.id;
  };
  return process();
};

module.exports = assemble;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvYXNzZW1ibGUuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvYXNzZW1ibGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsS0FBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSOztBQUNiLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7O0FBRWI7Ozs7Ozs7O0FBT0EsUUFBQSxHQUFXLFNBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsS0FBdEIsRUFBNkIsUUFBN0I7QUFFVCxNQUFBO0VBQUEsUUFBQSxHQUFXLFFBQVEsQ0FBQztFQUVwQixTQUFBLEdBQWE7RUFDYixPQUFBLEdBQWE7RUFDYixRQUFBLEdBQWE7RUFDYixRQUFBLEdBQWE7RUFDYixVQUFBLEdBQWE7RUFDYixPQUFBLEdBQWE7RUFFYixPQUFBLEdBQVUsU0FBQTtBQUVSLFFBQUE7QUFBQSxTQUFBLGNBQUE7O01BQUEsUUFBQSxDQUFTLENBQUMsQ0FBQyxJQUFYLEVBQWlCLENBQUMsQ0FBQyxNQUFuQjtBQUFBO0lBRUEsTUFBZ0IsTUFBQSxDQUFPLEtBQVAsQ0FBaEIsRUFBQyxhQUFELEVBQU87SUFDUCxJQUE2QixpQkFBN0I7TUFBQSxJQUFJLENBQUMsS0FBTCxHQUFnQixVQUFoQjs7SUFDQSxJQUFBLEdBQWdCLFFBQVEsQ0FBQyxLQUFULENBQWUsSUFBZixFQUFxQixLQUFyQjtJQUVoQixNQUFBLEdBQVc7O0FBQUM7V0FBQSxhQUFBOztxQkFBQTtBQUFBOztRQUFELENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsU0FBQyxDQUFELEVBQUksQ0FBSjth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

},{"../graph":25,"./priority":33}],30:[function(require,module,exports){
exports.Snippet = require('./snippet');

exports.Program = require('./program');

exports.Layout = require('./layout');

exports.assemble = require('./assemble');

exports.link = require('./link');

exports.priority = require('./priority');

exports.load = exports.Snippet.load;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvaW5kZXguY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQW1CLE9BQUEsQ0FBUSxXQUFSOztBQUNuQixPQUFPLENBQUMsT0FBUixHQUFtQixPQUFBLENBQVEsV0FBUjs7QUFDbkIsT0FBTyxDQUFDLE1BQVIsR0FBbUIsT0FBQSxDQUFRLFVBQVI7O0FBQ25CLE9BQU8sQ0FBQyxRQUFSLEdBQW1CLE9BQUEsQ0FBUSxZQUFSOztBQUNuQixPQUFPLENBQUMsSUFBUixHQUFtQixPQUFBLENBQVEsUUFBUjs7QUFDbkIsT0FBTyxDQUFDLFFBQVIsR0FBbUIsT0FBQSxDQUFRLFlBQVI7O0FBRW5CLE9BQU8sQ0FBQyxJQUFSLEdBQWUsT0FBTyxDQUFDLE9BQU8sQ0FBQyJ9

},{"./assemble":29,"./layout":31,"./link":32,"./priority":33,"./program":34,"./snippet":35}],31:[function(require,module,exports){
var Layout, Snippet, debug, link;

Snippet = require('./snippet');

link = require('./link');

debug = false;


/*
  Program linkage layout
  
  Entry points are added to its dependency graph
  Callbacks are linked either with a go-between function
  or a #define if the signatures are identical.
 */

Layout = (function() {
  function Layout(language, graph) {
    this.language = language;
    this.graph = graph;
    this.links = [];
    this.includes = [];
    this.modules = {};
    this.visits = {};
  }

  Layout.prototype.callback = function(node, module, priority, name, external) {
    return this.links.push({
      node: node,
      module: module,
      priority: priority,
      name: name,
      external: external
    });
  };

  Layout.prototype.include = function(node, module, priority) {
    var m;
    if ((m = this.modules[module.namespace]) != null) {
      return m.priority = Math.max(priority, m.priority);
    } else {
      this.modules[module.namespace] = true;
      return this.includes.push({
        node: node,
        module: module,
        priority: priority
      });
    }
  };

  Layout.prototype.visit = function(namespace) {
    debug && console.log('Visit', namespace, !this.visits[namespace]);
    if (this.visits[namespace]) {
      return false;
    }
    return this.visits[namespace] = true;
  };

  Layout.prototype.link = function(module) {
    var data, key, snippet;
    data = link(this.language, this.links, this.includes, module);
    snippet = new Snippet;
    for (key in data) {
      snippet[key] = data[key];
    }
    snippet.graph = this.graph;
    return snippet;
  };

  return Layout;

})();

module.exports = Layout;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvbGF5b3V0LmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvbGlua2VyL2xheW91dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxPQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUVYLEtBQUEsR0FBUTs7O0FBRVI7Ozs7Ozs7O0FBT007RUFFUyxnQkFBQyxRQUFELEVBQVksS0FBWjtJQUFDLElBQUMsQ0FBQSxXQUFEO0lBQVcsSUFBQyxDQUFBLFFBQUQ7SUFDdkIsSUFBQyxDQUFBLEtBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsT0FBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLE1BQUQsR0FBWTtFQUpEOzttQkFPYixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLFFBQWYsRUFBeUIsSUFBekIsRUFBK0IsUUFBL0I7V0FDUixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWTtNQUFDLE1BQUEsSUFBRDtNQUFPLFFBQUEsTUFBUDtNQUFlLFVBQUEsUUFBZjtNQUF5QixNQUFBLElBQXpCO01BQStCLFVBQUEsUUFBL0I7S0FBWjtFQURROzttQkFJVixPQUFBLEdBQVMsU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLFFBQWY7QUFDUCxRQUFBO0lBQUEsSUFBRyw0Q0FBSDthQUNFLENBQUMsQ0FBQyxRQUFGLEdBQWEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxRQUFULEVBQW1CLENBQUMsQ0FBQyxRQUFyQixFQURmO0tBQUEsTUFBQTtNQUdFLElBQUMsQ0FBQSxPQUFRLENBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBVCxHQUE2QjthQUM3QixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZTtRQUFDLE1BQUEsSUFBRDtRQUFPLFFBQUEsTUFBUDtRQUFlLFVBQUEsUUFBZjtPQUFmLEVBSkY7O0VBRE87O21CQVFULEtBQUEsR0FBTyxTQUFDLFNBQUQ7SUFDTCxLQUFBLElBQVMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLFNBQXJCLEVBQWdDLENBQUMsSUFBQyxDQUFBLE1BQU8sQ0FBQSxTQUFBLENBQXpDO0lBQ1QsSUFBZ0IsSUFBQyxDQUFBLE1BQU8sQ0FBQSxTQUFBLENBQXhCO0FBQUEsYUFBTyxNQUFQOztXQUNBLElBQUMsQ0FBQSxNQUFPLENBQUEsU0FBQSxDQUFSLEdBQXFCO0VBSGhCOzttQkFNUCxJQUFBLEdBQU0sU0FBQyxNQUFEO0FBQ0osUUFBQTtJQUFBLElBQUEsR0FBZ0IsSUFBQSxDQUFLLElBQUMsQ0FBQSxRQUFOLEVBQWdCLElBQUMsQ0FBQSxLQUFqQixFQUF3QixJQUFDLENBQUEsUUFBekIsRUFBbUMsTUFBbkM7SUFDaEIsT0FBQSxHQUFnQixJQUFJO0FBQ3BCLFNBQUEsV0FBQTtNQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZ0IsSUFBSyxDQUFBLEdBQUE7QUFBckI7SUFDQSxPQUFPLENBQUMsS0FBUixHQUFnQixJQUFDLENBQUE7V0FDakI7RUFMSTs7Ozs7O0FBUVIsTUFBTSxDQUFDLE9BQVAsR0FBaUIifQ==

},{"./link":32,"./snippet":35}],32:[function(require,module,exports){
var Graph, Priority, link;

Graph = require('../graph');

Priority = require('./priority');


/*
 Callback linker
 
 Imports given modules and generates linkages for registered callbacks.

 Builds composite program with single module as exported entry point
 */

link = function(language, links, modules, exported) {
  var adopt, attributes, externals, generate, include, includes, isDangling, library, process, symbols, uniforms, varyings;
  generate = language.generate;
  includes = [];
  symbols = [];
  externals = {};
  uniforms = {};
  attributes = {};
  varyings = {};
  library = {};
  process = function() {
    var code, e, exports, header, i, len, lib, m, ns, sorted;
    exports = generate.links(links);
    header = [];
    if (exports.defs != null) {
      header.push(exports.defs);
    }
    if (exports.bodies != null) {
      header.push(exports.bodies);
    }
    for (i = 0, len = modules.length; i < len; i++) {
      m = modules[i];
      include(m.node, m.module, m.priority);
    }
    sorted = ((function() {
      var results;
      results = [];
      for (ns in library) {
        lib = library[ns];
        results.push(lib);
      }
      return results;
    })()).sort(function(a, b) {
      return Priority.compare(a.priority, b.priority);
    });
    includes = sorted.map(function(x) {
      return x.code;
    });
    code = generate.lines(includes);
    code = generate.defuse(code);
    if (header.length) {
      code = [generate.lines(header), code].join("\n");
    }
    code = generate.hoist(code);
    code = generate.dedupe(code);
    e = exported;
    return {
      namespace: e.main.name,
      code: code,
      main: e.main,
      entry: e.main.name,
      externals: externals,
      uniforms: uniforms,
      attributes: attributes,
      varyings: varyings
    };
  };
  adopt = function(namespace, code, priority) {
    var record;
    record = library[namespace];
    if (record != null) {
      return record.priority = Priority.max(record.priority, priority);
    } else {
      return library[namespace] = {
        code: code,
        priority: priority
      };
    }
  };
  include = function(node, module, priority) {
    var def, ext, i, key, len, lib, ns, ref, ref1, ref2, ref3, ref4, results;
    priority = Priority.make(priority);
    ref = module.library;
    for (ns in ref) {
      lib = ref[ns];
      adopt(ns, lib.code, Priority.nest(priority, lib.priority));
    }
    adopt(module.namespace, module.body, priority);
    ref1 = module.uniforms;
    for (key in ref1) {
      def = ref1[key];
      uniforms[key] = def;
    }
    ref2 = module.varyings;
    for (key in ref2) {
      def = ref2[key];
      varyings[key] = def;
    }
    ref3 = module.attributes;
    for (key in ref3) {
      def = ref3[key];
      attributes[key] = def;
    }
    ref4 = module.symbols;
    results = [];
    for (i = 0, len = ref4.length; i < len; i++) {
      key = ref4[i];
      ext = module.externals[key];
      if (isDangling(node, ext.name)) {
        externals[key] = ext;
        results.push(symbols.push(key));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  isDangling = function(node, name) {
    var module, outlet, ref, ref1;
    outlet = node.get(name);
    if (!outlet) {
      module = (ref = (ref1 = node.owner.snippet) != null ? ref1._name : void 0) != null ? ref : node.owner.namespace;
      throw new Error("Unable to link program. Unlinked callback `" + name + "` on `" + module + "`");
    }
    if (outlet.inout === Graph.IN) {
      return outlet.input === null;
    } else if (outlet.inout === Graph.OUT) {
      return outlet.output.length === 0;
    }
  };
  return process();
};

module.exports = link;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvbGluay5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2xpbmtlci9saW5rLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLEtBQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixRQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7OztBQUViOzs7Ozs7OztBQVFBLElBQUEsR0FBTyxTQUFDLFFBQUQsRUFBVyxLQUFYLEVBQWtCLE9BQWxCLEVBQTJCLFFBQTNCO0FBRUwsTUFBQTtFQUFBLFFBQUEsR0FBVyxRQUFRLENBQUM7RUFDcEIsUUFBQSxHQUFhO0VBRWIsT0FBQSxHQUFhO0VBQ2IsU0FBQSxHQUFhO0VBQ2IsUUFBQSxHQUFhO0VBQ2IsVUFBQSxHQUFhO0VBQ2IsUUFBQSxHQUFhO0VBQ2IsT0FBQSxHQUFhO0VBRWIsT0FBQSxHQUFVLFNBQUE7QUFFUixRQUFBO0lBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxLQUFULENBQWUsS0FBZjtJQUVWLE1BQUEsR0FBUztJQUNULElBQThCLG9CQUE5QjtNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBTyxDQUFDLElBQXBCLEVBQUE7O0lBQ0EsSUFBOEIsc0JBQTlCO01BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFPLENBQUMsTUFBcEIsRUFBQTs7QUFFQSxTQUFBLHlDQUFBOztNQUFBLE9BQUEsQ0FBUSxDQUFDLENBQUMsSUFBVixFQUFnQixDQUFDLENBQUMsTUFBbEIsRUFBMEIsQ0FBQyxDQUFDLFFBQTVCO0FBQUE7SUFDQSxNQUFBLEdBQVc7O0FBQUM7V0FBQSxhQUFB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

},{"../graph":25,"./priority":33}],33:[function(require,module,exports){
exports.make = function(x) {
  var ref;
  if (x == null) {
    x = [];
  }
  if (!(x instanceof Array)) {
    x = [(ref = +x) != null ? ref : 0];
  }
  return x;
};

exports.nest = function(a, b) {
  return a.concat(b);
};

exports.compare = function(a, b) {
  var i, j, n, p, q, ref;
  n = Math.min(a.length, b.length);
  for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    p = a[i];
    q = b[i];
    if (p > q) {
      return -1;
    }
    if (p < q) {
      return 1;
    }
  }
  a = a.length;
  b = b.length;
  if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  } else {
    return 0;
  }
};

exports.max = function(a, b) {
  if (exports.compare(a, b) > 0) {
    return b;
  } else {
    return a;
  }
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvcHJpb3JpdHkuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvcHJpb3JpdHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxDQUFEO0FBQ2IsTUFBQTtFQUFBLElBQVksU0FBWjtJQUFBLENBQUEsR0FBSSxHQUFKOztFQUNBLElBQWdCLENBQUEsQ0FBQSxDQUFBLFlBQWMsS0FBZCxDQUFoQjtJQUFBLENBQUEsR0FBSSw0QkFBTSxDQUFOLEVBQUo7O1NBQ0E7QUFIYTs7QUFLZixPQUFPLENBQUMsSUFBUixHQUFlLFNBQUMsQ0FBRCxFQUFJLENBQUo7U0FDYixDQUFDLENBQUMsTUFBRixDQUFTLENBQVQ7QUFEYTs7QUFHZixPQUFPLENBQUMsT0FBUixHQUFrQixTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ2hCLE1BQUE7RUFBQSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQUMsTUFBWCxFQUFtQixDQUFDLENBQUMsTUFBckI7QUFDSixPQUFTLDBFQUFUO0lBQ0UsQ0FBQSxHQUFJLENBQUUsQ0FBQSxDQUFBO0lBQ04sQ0FBQSxHQUFJLENBQUUsQ0FBQSxDQUFBO0lBQ04sSUFBRyxDQUFBLEdBQUksQ0FBUDtBQUNFLGFBQU8sQ0FBQyxFQURWOztJQUVBLElBQUcsQ0FBQSxHQUFJLENBQVA7QUFDRSxhQUFPLEVBRFQ7O0FBTEY7RUFPQSxDQUFBLEdBQUksQ0FBQyxDQUFDO0VBQ04sQ0FBQSxHQUFJLENBQUMsQ0FBQztFQUNDLElBQUcsQ0FBQSxHQUFJLENBQVA7V0FBYyxDQUFDLEVBQWY7R0FBQSxNQUFzQixJQUFHLENBQUEsR0FBSSxDQUFQO1dBQWMsRUFBZDtHQUFBLE1BQUE7V0FBcUIsRUFBckI7O0FBWGI7O0FBYWxCLE9BQU8sQ0FBQyxHQUFSLEdBQWUsU0FBQyxDQUFELEVBQUksQ0FBSjtFQUNOLElBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBQSxHQUF3QixDQUEzQjtXQUFrQyxFQUFsQztHQUFBLE1BQUE7V0FBeUMsRUFBekM7O0FBRE0ifQ==

},{}],34:[function(require,module,exports){
var Program, Snippet, assemble;

Snippet = require('./snippet');

assemble = require('./assemble');


/*
  Program assembly model
  
  Snippets are added to its queue, registering calls and code includes.
  Calls are de-duped and scheduled at the earliest point required for correct data flow.
  
  When assemble() is called, it builds a main() function to
  execute all calls in final order.
  
  The result is a new instance of Snippet that acts as if it
  was parsed from the combined source of the component
  nodes.
 */

Program = (function() {
  Program.index = 0;

  Program.entry = function() {
    return "_pg_" + (++Program.index) + "_";
  };

  function Program(language, namespace, graph) {
    this.language = language;
    this.namespace = namespace;
    this.graph = graph;
    this.calls = {};
    this.requires = {};
  }

  Program.prototype.call = function(node, module, priority) {
    var exists, ns;
    ns = module.namespace;
    if (exists = this.calls[ns]) {
      exists.priority = Math.max(exists.priority, priority);
    } else {
      this.calls[ns] = {
        node: node,
        module: module,
        priority: priority
      };
    }
    return this;
  };

  Program.prototype.require = function(node, module) {
    var ns;
    ns = module.namespace;
    return this.requires[ns] = {
      node: node,
      module: module
    };
  };

  Program.prototype.assemble = function() {
    var data, key, ref, snippet;
    data = assemble(this.language, (ref = this.namespace) != null ? ref : Program.entry, this.calls, this.requires);
    snippet = new Snippet;
    for (key in data) {
      snippet[key] = data[key];
    }
    snippet.graph = this.graph;
    return snippet;
  };

  return Program;

})();

module.exports = Program;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvcHJvZ3JhbS5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2xpbmtlci9wcm9ncmFtLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLE9BQUEsR0FBVyxPQUFBLENBQVEsV0FBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7OztBQUVYOzs7Ozs7Ozs7Ozs7OztBQWFNO0VBQ0osT0FBQyxDQUFBLEtBQUQsR0FBUTs7RUFDUixPQUFDLENBQUEsS0FBRCxHQUFRLFNBQUE7V0FBTSxNQUFBLEdBQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFYLENBQU4sR0FBdUI7RUFBN0I7O0VBR0ssaUJBQUMsUUFBRCxFQUFZLFNBQVosRUFBd0IsS0FBeEI7SUFBQyxJQUFDLENBQUEsV0FBRDtJQUFXLElBQUMsQ0FBQSxZQUFEO0lBQVksSUFBQyxDQUFBLFFBQUQ7SUFDbkMsSUFBQyxDQUFBLEtBQUQsR0FBYztJQUNkLElBQUMsQ0FBQSxRQUFELEdBQWM7RUFGSDs7b0JBS2IsSUFBQSxHQUFNLFNBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxRQUFmO0FBQ0osUUFBQTtJQUFBLEVBQUEsR0FBSyxNQUFNLENBQUM7SUFHWixJQUFHLE1BQUEsR0FBUyxJQUFDLENBQUEsS0FBTSxDQUFBLEVBQUEsQ0FBbkI7TUFDRSxNQUFNLENBQUMsUUFBUCxHQUFrQixJQUFJLENBQUMsR0FBTCxDQUFTLE1BQU0sQ0FBQyxRQUFoQixFQUEwQixRQUExQixFQURwQjtLQUFBLE1BQUE7TUFHRSxJQUFDLENBQUEsS0FBTSxDQUFBLEVBQUEsQ0FBUCxHQUFhO1FBQUMsTUFBQSxJQUFEO1FBQU8sUUFBQSxNQUFQO1FBQWUsVUFBQSxRQUFmO1FBSGY7O1dBS0E7RUFUSTs7b0JBWU4sT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLE1BQVA7QUFDUCxRQUFBO0lBQUEsRUFBQSxHQUFLLE1BQU0sQ0FBQztXQUNaLElBQUMsQ0FBQSxRQUFTLENBQUEsRUFBQSxDQUFWLEdBQWdCO01BQUMsTUFBQSxJQUFEO01BQU8sUUFBQSxNQUFQOztFQUZUOztvQkFLVCxRQUFBLEdBQVUsU0FBQTtBQUNSLFFBQUE7SUFBQSxJQUFBLEdBQWdCLFFBQUEsQ0FBUyxJQUFDLENBQUEsUUFBVix5Q0FBaUMsT0FBTyxDQUFDLEtBQXpDLEVBQWdELElBQUMsQ0FBQSxLQUFqRCxFQUF3RCxJQUFDLENBQUEsUUFBekQ7SUFDaEIsT0FBQSxHQUFnQixJQUFJO0FBQ3BCLFNBQUEsV0FBQTtNQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZ0IsSUFBSyxDQUFBLEdBQUE7QUFBckI7SUFDQSxPQUFPLENBQUMsS0FBUixHQUFnQixJQUFDLENBQUE7V0FDakI7RUFMUTs7Ozs7O0FBT1osTUFBTSxDQUFDLE9BQVAsR0FBaUIifQ==

},{"./assemble":29,"./snippet":35}],35:[function(require,module,exports){
var Snippet;

Snippet = (function() {
  Snippet.index = 0;

  Snippet.namespace = function() {
    return "_sn_" + (++Snippet.index) + "_";
  };

  Snippet.load = function(language, name, code) {
    var compiler, program, ref, sigs;
    program = language.parse(name, code);
    ref = language.compile(program), sigs = ref[0], compiler = ref[1];
    return new Snippet(language, sigs, compiler, name, code);
  };

  function Snippet(language1, _signatures, _compiler, _name, _original) {
    var ref;
    this.language = language1;
    this._signatures = _signatures;
    this._compiler = _compiler;
    this._name = _name;
    this._original = _original;
    this.namespace = null;
    this.code = null;
    this.main = null;
    this.entry = null;
    this.uniforms = null;
    this.externals = null;
    this.symbols = null;
    this.attributes = null;
    this.varyings = null;
    if (!this.language) {
      delete this.language;
    }
    if (!this._signatures) {
      delete this._signatures;
    }
    if (!this._compiler) {
      delete this._compiler;
    }
    if (!this._original) {
      delete this._original;
    }
    if (!this._name) {
      this._name = (ref = this._signatures) != null ? ref.main.name : void 0;
    }
  }

  Snippet.prototype.clone = function() {
    return new Snippet(this.language, this._signatures, this._compiler, this._name, this._original);
  };

  Snippet.prototype.bind = function(config, uniforms, namespace, defines) {
    var _a, _e, _u, _v, a, def, defs, e, exceptions, exist, global, i, j, k, key, l, len, len1, len2, len3, len4, len5, local, m, n, name, o, redef, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, u, v, x;
    if (uniforms === '' + uniforms) {
      ref = [uniforms, namespace != null ? namespace : {}, defines != null ? defines : {}], namespace = ref[0], uniforms = ref[1], defines = ref[2];
    } else if (namespace !== '' + namespace) {
      ref1 = [namespace != null ? namespace : {}, void 0], defines = ref1[0], namespace = ref1[1];
    }
    this.main = this._signatures.main;
    this.namespace = (ref2 = namespace != null ? namespace : this.namespace) != null ? ref2 : Snippet.namespace();
    this.entry = this.namespace + this.main.name;
    this.uniforms = {};
    this.varyings = {};
    this.attributes = {};
    this.externals = {};
    this.symbols = [];
    exist = {};
    exceptions = {};
    global = function(name) {
      exceptions[name] = true;
      return name;
    };
    local = (function(_this) {
      return function(name) {
        return _this.namespace + name;
      };
    })(this);
    if (config.globals) {
      ref3 = config.globals;
      for (i = 0, len = ref3.length; i < len; i++) {
        key = ref3[i];
        global(key);
      }
    }
    _u = config.globalUniforms ? global : local;
    _v = config.globalVaryings ? global : local;
    _a = config.globalAttributes ? global : local;
    _e = local;
    x = (function(_this) {
      return function(def) {
        return exist[def.name] = true;
      };
    })(this);
    u = (function(_this) {
      return function(def, name) {
        return _this.uniforms[_u(name != null ? name : def.name)] = def;
      };
    })(this);
    v = (function(_this) {
      return function(def) {
        return _this.varyings[_v(def.name)] = def;
      };
    })(this);
    a = (function(_this) {
      return function(def) {
        return _this.attributes[_a(def.name)] = def;
      };
    })(this);
    e = (function(_this) {
      return function(def) {
        var name;
        name = _e(def.name);
        _this.externals[name] = def;
        return _this.symbols.push(name);
      };
    })(this);
    redef = function(def) {
      return {
        type: def.type,
        name: def.name,
        value: def.value
      };
    };
    ref4 = this._signatures.uniform;
    for (j = 0, len1 = ref4.length; j < len1; j++) {
      def = ref4[j];
      x(def);
    }
    ref5 = this._signatures.uniform;
    for (l = 0, len2 = ref5.length; l < len2; l++) {
      def = ref5[l];
      u(redef(def));
    }
    ref6 = this._signatures.varying;
    for (m = 0, len3 = ref6.length; m < len3; m++) {
      def = ref6[m];
      v(redef(def));
    }
    ref7 = this._signatures.external;
    for (n = 0, len4 = ref7.length; n < len4; n++) {
      def = ref7[n];
      e(def);
    }
    ref8 = this._signatures.attribute;
    for (o = 0, len5 = ref8.length; o < len5; o++) {
      def = ref8[o];
      a(redef(def));
    }
    for (name in uniforms) {
      def = uniforms[name];
      if (exist[name]) {
        u(def, name);
      }
    }
    this.body = this.code = this._compiler(this.namespace, exceptions, defines);
    if (defines) {
      defs = ((function() {
        var results;
        results = [];
        for (k in defines) {
          v = defines[k];
          results.push("#define " + k + " " + v);
        }
        return results;
      })()).join('\n');
      if (defs.length) {
        this._original = [defs, "//----------------------------------------", this._original].join("\n");
      }
    }
    return null;
  };

  return Snippet;

})();

module.exports = Snippet;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy9saW5rZXIvc25pcHBldC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvemhhbmdob25nYm8vbXlkb2N1bWVudC9kZW1vL25vZGVqcy9hZnJhbWUtbWF0aGJveC92ZW5kb3Ivc2hhZGVyZ3JhcGgvc3JjL2xpbmtlci9zbmlwcGV0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFNO0VBQ0osT0FBQyxDQUFBLEtBQUQsR0FBUTs7RUFDUixPQUFDLENBQUEsU0FBRCxHQUFZLFNBQUE7V0FBTSxNQUFBLEdBQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFYLENBQU4sR0FBdUI7RUFBN0I7O0VBRVosT0FBQyxDQUFBLElBQUQsR0FBTyxTQUFDLFFBQUQsRUFBVyxJQUFYLEVBQWlCLElBQWpCO0FBQ0wsUUFBQTtJQUFBLE9BQUEsR0FBbUIsUUFBUSxDQUFDLEtBQVQsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkI7SUFDbkIsTUFBbUIsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsT0FBakIsQ0FBbkIsRUFBQyxhQUFELEVBQU87V0FDUCxJQUFJLE9BQUosQ0FBWSxRQUFaLEVBQXNCLElBQXRCLEVBQTRCLFFBQTVCLEVBQXNDLElBQXRDLEVBQTRDLElBQTVDO0VBSEs7O0VBS00saUJBQUMsU0FBRCxFQUFZLFdBQVosRUFBMEIsU0FBMUIsRUFBc0MsS0FBdEMsRUFBOEMsU0FBOUM7QUFDWCxRQUFBO0lBRFksSUFBQyxDQUFBLFdBQUQ7SUFBVyxJQUFDLENBQUEsY0FBRDtJQUFjLElBQUMsQ0FBQSxZQUFEO0lBQVksSUFBQyxDQUFBLFFBQUQ7SUFBUSxJQUFDLENBQUEsWUFBRDtJQUN6RCxJQUFDLENBQUEsU0FBRCxHQUFjO0lBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztJQUVkLElB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

},{}],36:[function(require,module,exports){
var Graph, markup, merge, resolve, serialize, visualize;

Graph = require('../Graph').Graph;

exports.serialize = serialize = require('./serialize');

exports.markup = markup = require('./markup');

visualize = function(graph) {
  var data;
  if (!graph) {
    return;
  }
  if (!graph.nodes) {
    return graph;
  }
  data = serialize(graph);
  return markup.process(data);
};

resolve = function(arg) {
  if (arg == null) {
    return arg;
  }
  if (arg instanceof Array) {
    return arg.map(resolve);
  }
  if ((arg.vertex != null) && (arg.fragment != null)) {
    return [resolve(arg.vertex, resolve(arg.fragment))];
  }
  if (arg._graph != null) {
    return arg._graph;
  }
  if (arg.graph != null) {
    return arg.graph;
  }
  return arg;
};

merge = function(args) {
  var arg, i, len, out;
  out = [];
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (arg instanceof Array) {
      out = out.concat(merge(arg));
    } else if (arg != null) {
      out.push(arg);
    }
  }
  return out;
};

exports.visualize = function() {
  var graph, list;
  list = merge(resolve([].slice.call(arguments)));
  return markup.merge((function() {
    var i, len, results;
    results = [];
    for (i = 0, len = list.length; i < len; i++) {
      graph = list[i];
      if (graph) {
        results.push(visualize(graph));
      }
    }
    return results;
  })());
};

exports.inspect = function() {
  var contents, el, element, i, len, ref;
  contents = exports.visualize.apply(null, arguments);
  element = markup.overlay(contents);
  ref = document.querySelectorAll('.shadergraph-overlay');
  for (i = 0, len = ref.length; i < len; i++) {
    el = ref[i];
    el.remove();
  }
  document.body.appendChild(element);
  contents.update();
  return element;
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy92aXN1YWxpemUvaW5kZXguY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy92aXN1YWxpemUvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUM7O0FBRTVCLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLFNBQUEsR0FBWSxPQUFBLENBQVEsYUFBUjs7QUFDaEMsT0FBTyxDQUFDLE1BQVIsR0FBb0IsTUFBQSxHQUFZLE9BQUEsQ0FBUSxVQUFSOztBQUVoQyxTQUFBLEdBQVksU0FBQyxLQUFEO0FBQ1YsTUFBQTtFQUFBLElBQUEsQ0FBYyxLQUFkO0FBQUEsV0FBQTs7RUFDQSxJQUFnQixDQUFDLEtBQUssQ0FBQyxLQUF2QjtBQUFBLFdBQU8sTUFBUDs7RUFFQSxJQUFBLEdBQVMsU0FBQSxDQUFlLEtBQWY7U0FDVCxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWY7QUFMVTs7QUFPWixPQUFBLEdBQVUsU0FBQyxHQUFEO0VBQ1IsSUFBZSxXQUFmO0FBQUEsV0FBTyxJQUFQOztFQUNBLElBQTBCLEdBQUEsWUFBZSxLQUF6QztBQUFBLFdBQU8sR0FBRyxDQUFDLEdBQUosQ0FBUSxPQUFSLEVBQVA7O0VBQ0EsSUFBcUQsb0JBQUEsSUFBZSxzQkFBcEU7QUFBQSxXQUFPLENBQUMsT0FBQSxDQUFRLEdBQUcsQ0FBQyxNQUFaLEVBQW9CLE9BQUEsQ0FBUSxHQUFHLENBQUMsUUFBWixDQUFwQixDQUFELEVBQVA7O0VBQ0EsSUFBcUIsa0JBQXJCO0FBQUEsV0FBTyxHQUFHLENBQUMsT0FBWDs7RUFDQSxJQUFxQixpQkFBckI7QUFBQSxXQUFPLEdBQUcsQ0FBQyxNQUFYOztBQUNBLFNBQU87QUFOQzs7QUFRVixLQUFBLEdBQVEsU0FBQyxJQUFEO0FBQ04sTUFBQTtFQUFBLEdBQUEsR0FBTTtBQUNOLE9BQUEsc0NBQUE7O0lBQ0UsSUFBRyxHQUFBLFlBQWUsS0FBbEI7TUFDRSxHQUFBLEdBQU0sR0FBRyxDQUFDLE1BQUosQ0FBVyxLQUFBLENBQU0sR0FBTixDQUFYLEVBRFI7S0FBQSxNQUVLLElBQUcsV0FBSDtNQUNILEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVCxFQURHOztBQUhQO1NBS0E7QUFQTTs7QUFTUixPQUFPLENBQUMsU0FBUixHQUFvQixTQUFBO0FBQ2xCLE1BQUE7RUFBQSxJQUFBLEdBQU8sS0FBQSxDQUFNLE9BQUEsQ0FBUSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQVQsQ0FBYyxTQUFkLENBQVIsQ0FBTjtTQUNQLE1BQU0sQ0FBQyxLQUFQOztBQUFjO1NBQUEsc0NBQUE7O1VBQXVDO3FCQUF2QyxTQUFBLENBQVUsS0FBVjs7QUFBQTs7TUFBZDtBQUZrQjs7QUFJcEIsT0FBTyxDQUFDLE9BQVIsR0FBa0IsU0FBQTtBQUNoQixNQUFBO0VBQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBbEIsQ0FBd0IsSUFBeEIsRUFBOEIsU0FBOUI7RUFDWCxPQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFmO0FBRVg7QUFBQSxPQUFBLHFDQUFBOztJQUFBLEVBQUUsQ0FBQyxNQUFILENBQUE7QUFBQTtFQUNBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixPQUExQjtFQUNBLFFBQVEsQ0FBQyxNQUFULENBQUE7U0FFQTtBQVJnQiJ9

},{"../Graph":2,"./markup":37,"./serialize":38}],37:[function(require,module,exports){
var _activate, _markup, _order, connect, cssColor, escapeText, hash, hashColor, makeSVG, merge, overlay, path, process, sqr, trim, wrap;

hash = require('../factory/hash');

trim = function(string) {
  return ("" + string).replace(/^\s+|\s+$/g, '');
};

cssColor = function(r, g, b, alpha) {
  return 'rgba(' + [r, g, b, alpha].join(', ') + ')';
};

hashColor = function(string, alpha) {
  var b, color, g, max, min, norm, r;
  if (alpha == null) {
    alpha = 1;
  }
  color = hash(string) ^ 0x123456;
  r = color & 0xFF;
  g = (color >>> 8) & 0xFF;
  b = (color >>> 16) & 0xFF;
  max = Math.max(r, g, b);
  norm = 140 / max;
  min = Math.round(max / 3);
  r = Math.min(255, Math.round(norm * Math.max(r, min)));
  g = Math.min(255, Math.round(norm * Math.max(g, min)));
  b = Math.min(255, Math.round(norm * Math.max(b, min)));
  return cssColor(r, g, b, alpha);
};

escapeText = function(string) {
  string = string != null ? string : "";
  return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
};

process = function(data) {
  var el, links;
  links = [];
  el = _markup(data, links);
  el.update = function() {
    return connect(el, links);
  };
  _activate(el);
  return el;
};

_activate = function(el) {
  var code, codes, i, len, results;
  codes = el.querySelectorAll('.shadergraph-code');
  results = [];
  for (i = 0, len = codes.length; i < len; i++) {
    code = codes[i];
    results.push((function() {
      var popup;
      popup = code;
      popup.parentNode.classList.add('shadergraph-has-code');
      return popup.parentNode.addEventListener('click', function(event) {
        return popup.style.display = {
          block: 'none',
          none: 'block'
        }[popup.style.display || 'none'];
      });
    })());
  }
  return results;
};

_order = function(data) {
  var i, j, k, len, len1, len2, link, linkMap, name, node, nodeMap, recurse, ref1, ref2, ref3;
  nodeMap = {};
  linkMap = {};
  ref1 = data.nodes;
  for (i = 0, len = ref1.length; i < len; i++) {
    node = ref1[i];
    nodeMap[node.id] = node;
  }
  ref2 = data.links;
  for (j = 0, len1 = ref2.length; j < len1; j++) {
    link = ref2[j];
    if (linkMap[name = link.from] == null) {
      linkMap[name] = [];
    }
    linkMap[link.from].push(link);
  }
  recurse = function(node, depth) {
    var k, len2, next, ref3;
    if (depth == null) {
      depth = 0;
    }
    node.depth = Math.max((ref3 = node.depth) != null ? ref3 : 0, depth);
    if (next = linkMap[node.id]) {
      for (k = 0, len2 = next.length; k < len2; k++) {
        link = next[k];
        recurse(nodeMap[link.to], depth + 1);
      }
    }
    return null;
  };
  ref3 = data.nodes;
  for (k = 0, len2 = ref3.length; k < len2; k++) {
    node = ref3[k];
    if (node.depth == null) {
      recurse(node);
    }
  }
  return null;
};

_markup = function(data, links) {
  var addOutlet, block, clear, color, column, columns, div, i, j, k, l, len, len1, len2, len3, len4, link, m, node, outlet, outlets, ref1, ref2, ref3, ref4, wrapper;
  _order(data);
  wrapper = document.createElement('div');
  wrapper.classList.add('shadergraph-graph');
  columns = [];
  outlets = {};
  ref1 = data.nodes;
  for (i = 0, len = ref1.length; i < len; i++) {
    node = ref1[i];
    block = document.createElement('div');
    block.classList.add("shadergraph-node");
    block.classList.add("shadergraph-node-" + node.type);
    block.innerHTML = "<div class=\"shadergraph-header\">" + (escapeText(node.name)) + "</div>";
    addOutlet = function(outlet, inout) {
      var color, div;
      color = hashColor(outlet.type);
      div = document.createElement('div');
      div.classList.add('shadergraph-outlet');
      div.classList.add("shadergraph-outlet-" + inout);
      div.innerHTML = "<div class=\"shadergraph-point\" style=\"background: " + color + "\"></div>\n<div class=\"shadergraph-type\" style=\"color: " + color + "\">" + (escapeText(outlet.type)) + "</div>\n<div class=\"shadergraph-name\">" + (escapeText(outlet.name)) + "</div>";
      block.appendChild(div);
      return outlets[outlet.id] = div.querySelector('.shadergraph-point');
    };
    ref2 = node.inputs;
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      outlet = ref2[j];
      addOutlet(outlet, 'in');
    }
    ref3 = node.outputs;
    for (k = 0, len2 = ref3.length; k < len2; k++) {
      outlet = ref3[k];
      addOutlet(outlet, 'out');
    }
    if (node.graph != null) {
      block.appendChild(_markup(node.graph, links));
    } else {
      clear = document.createElement('div');
      clear.classList.add('shadergraph-clear');
      block.appendChild(clear);
    }
    if (node.code != null) {
      div = document.createElement('div');
      div.classList.add('shadergraph-code');
      div.innerHTML = escapeText(trim(node.code));
      block.appendChild(div);
    }
    column = columns[node.depth];
    if (column == null) {
      column = document.createElement('div');
      column.classList.add('shadergraph-column');
      columns[node.depth] = column;
    }
    column.appendChild(block);
  }
  for (l = 0, len3 = columns.length; l < len3; l++) {
    column = columns[l];
    if (column != null) {
      wrapper.appendChild(column);
    }
  }
  ref4 = data.links;
  for (m = 0, len4 = ref4.length; m < len4; m++) {
    link = ref4[m];
    color = hashColor(link.type);
    links.push({
      color: color,
      out: outlets[link.out],
      "in": outlets[link["in"]]
    });
  }
  return wrapper;
};

sqr = function(x) {
  return x * x;
};

path = function(x1, y1, x2, y2) {
  var d, dx, dy, f, h, mx, my, vert;
  dx = x2 - x1;
  dy = y2 - y1;
  d = Math.sqrt(sqr(dx) + sqr(dy));
  vert = Math.abs(dy) > Math.abs(dx);
  if (vert) {
    mx = (x1 + x2) / 2;
    my = (y1 + y2) / 2;
    f = dy > 0 ? .3 : -.3;
    h = Math.min(Math.abs(dx) / 2, 20 + d / 8);
    return ['M', x1, y1, 'C', x1 + h, y1 + ',', mx, my - d * f, mx, my, 'C', mx, my + d * f, x2 - h, y2 + ',', x2, y2].join(' ');
  } else {
    h = Math.min(Math.abs(dx) / 2.5, 20 + d / 4);
    return ['M', x1, y1, 'C', x1 + h, y1 + ',', x2 - h, y2 + ',', x2, y2].join(' ');
  }
};

makeSVG = function(tag) {
  if (tag == null) {
    tag = 'svg';
  }
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
};

connect = function(element, links) {
  var a, b, box, c, i, j, len, len1, line, link, ref, svg;
  if (element.parentNode == null) {
    return;
  }
  ref = element.getBoundingClientRect();
  for (i = 0, len = links.length; i < len; i++) {
    link = links[i];
    a = link.out.getBoundingClientRect();
    b = link["in"].getBoundingClientRect();
    link.coords = {
      x1: (a.left + a.right) / 2 - ref.left,
      y1: (a.top + a.bottom) / 2 - ref.top,
      x2: (b.left + b.right) / 2 - ref.left,
      y2: (b.top + b.bottom) / 2 - ref.top
    };
  }
  svg = element.querySelector('svg');
  if (svg != null) {
    element.removeChild(svg);
  }
  box = element;
  while (box.parentNode && box.offsetHeight === 0) {
    box = box.parentNode;
  }
  svg = makeSVG();
  svg.setAttribute('width', box.offsetWidth);
  svg.setAttribute('height', box.offsetHeight);
  for (j = 0, len1 = links.length; j < len1; j++) {
    link = links[j];
    c = link.coords;
    line = makeSVG('path');
    line.setAttribute('d', path(c.x1, c.y1, c.x2, c.y2));
    line.setAttribute('stroke', link.color);
    line.setAttribute('stroke-width', 3);
    line.setAttribute('fill', 'transparent');
    svg.appendChild(line);
  }
  return element.appendChild(svg);
};

overlay = function(contents) {
  var close, div, inside, view;
  div = document.createElement('div');
  div.setAttribute('class', 'shadergraph-overlay');
  close = document.createElement('div');
  close.setAttribute('class', 'shadergraph-close');
  close.innerHTML = '&times;';
  view = document.createElement('div');
  view.setAttribute('class', 'shadergraph-view');
  inside = document.createElement('div');
  inside.setAttribute('class', 'shadergraph-inside');
  inside.appendChild(contents);
  view.appendChild(inside);
  div.appendChild(view);
  div.appendChild(close);
  close.addEventListener('click', function() {
    return div.parentNode.removeChild(div);
  });
  return div;
};

wrap = function(markup) {
  var p;
  if (markup instanceof Node) {
    return markup;
  }
  p = document.createElement('span');
  p.innerText = markup != null ? markup : '';
  return p;
};

merge = function(markup) {
  var div, el, i, len;
  if (markup.length !== 1) {
    div = document.createElement('div');
    for (i = 0, len = markup.length; i < len; i++) {
      el = markup[i];
      div.appendChild(wrap(el));
    }
    div.update = function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = markup.length; j < len1; j++) {
        el = markup[j];
        results.push(typeof el.update === "function" ? el.update() : void 0);
      }
      return results;
    };
    return div;
  } else {
    return wrap(markup[0]);
  }
};

module.exports = {
  process: process,
  merge: merge,
  overlay: overlay
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy92aXN1YWxpemUvbWFya3VwLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvdmlzdWFsaXplL21hcmt1cC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGlCQUFSOztBQUVQLElBQUEsR0FBTyxTQUFDLE1BQUQ7U0FBWSxDQUFDLEVBQUEsR0FBSyxNQUFOLENBQWEsQ0FBQyxPQUFkLENBQXNCLFlBQXRCLEVBQW9DLEVBQXBDO0FBQVo7O0FBRVAsUUFBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsS0FBVjtTQUNULE9BQUEsR0FBVSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixJQUF0QixDQUFWLEdBQXdDO0FBRC9COztBQUdYLFNBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQ1YsTUFBQTs7SUFEbUIsUUFBUTs7RUFDM0IsS0FBQSxHQUFRLElBQUEsQ0FBSyxNQUFMLENBQUEsR0FBZTtFQUV2QixDQUFBLEdBQUssS0FBQSxHQUFRO0VBQ2IsQ0FBQSxHQUFJLENBQUMsS0FBQSxLQUFVLENBQVgsQ0FBQSxHQUFnQjtFQUNwQixDQUFBLEdBQUksQ0FBQyxLQUFBLEtBQVUsRUFBWCxDQUFBLEdBQWlCO0VBRXJCLEdBQUEsR0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZjtFQUNQLElBQUEsR0FBTyxHQUFBLEdBQU07RUFDYixHQUFBLEdBQU8sSUFB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

},{"../factory/hash":13}],38:[function(require,module,exports){
var Block, isCallback, serialize;

Block = require('../block');

isCallback = function(outlet) {
  return outlet.type[0] === '(';
};

serialize = function(graph) {
  var block, format, i, inputs, j, k, l, len, len1, len2, len3, links, node, nodes, other, outlet, outputs, record, ref, ref1, ref2, ref3, ref4;
  nodes = [];
  links = [];
  ref = graph.nodes;
  for (i = 0, len = ref.length; i < len; i++) {
    node = ref[i];
    record = {
      id: node.id,
      name: null,
      type: null,
      depth: null,
      graph: null,
      inputs: [],
      outputs: []
    };
    nodes.push(record);
    inputs = record.inputs;
    outputs = record.outputs;
    block = node.owner;
    if (block instanceof Block.Call) {
      record.name = block.snippet._name;
      record.type = 'call';
      record.code = block.snippet._original;
    } else if (block instanceof Block.Callback) {
      record.name = "Callback";
      record.type = 'callback';
      record.graph = serialize(block.graph);
    } else if (block instanceof Block.Isolate) {
      record.name = 'Isolate';
      record.type = 'isolate';
      record.graph = serialize(block.graph);
    } else if (block instanceof Block.Join) {
      record.name = 'Join';
      record.type = 'join';
    } else if (block != null) {
      if (record.name == null) {
        record.name = (ref1 = block.name) != null ? ref1 : block.type;
      }
      if (record.type == null) {
        record.type = block.type;
      }
      if (record.code == null) {
        record.code = block.code;
      }
      if (block.graph != null) {
        record.graph = serialize(block.graph);
      }
    }
    format = function(type) {
      type = type.replace(")(", ")→(");
      return type = type.replace("()", "");
    };
    ref2 = node.inputs;
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      outlet = ref2[j];
      inputs.push({
        id: outlet.id,
        name: outlet.name,
        type: format(outlet.type),
        open: outlet.input == null
      });
    }
    ref3 = node.outputs;
    for (k = 0, len2 = ref3.length; k < len2; k++) {
      outlet = ref3[k];
      outputs.push({
        id: outlet.id,
        name: outlet.name,
        type: format(outlet.type),
        open: !outlet.output.length
      });
      ref4 = outlet.output;
      for (l = 0, len3 = ref4.length; l < len3; l++) {
        other = ref4[l];
        links.push({
          from: node.id,
          out: outlet.id,
          to: other.node.id,
          "in": other.id,
          type: format(outlet.type)
        });
      }
    }
  }
  return {
    nodes: nodes,
    links: links
  };
};

module.exports = serialize;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3NyYy92aXN1YWxpemUvc2VyaWFsaXplLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC9zcmMvdmlzdWFsaXplL3NlcmlhbGl6ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0FBRVIsVUFBQSxHQUFhLFNBQUMsTUFBRDtTQUFZLE1BQU0sQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFaLEtBQWtCO0FBQTlCOztBQUViLFNBQUEsR0FBWSxTQUFDLEtBQUQ7QUFFVixNQUFBO0VBQUEsS0FBQSxHQUFRO0VBQ1IsS0FBQSxHQUFRO0FBRVI7QUFBQSxPQUFBLHFDQUFBOztJQUNFLE1BQUEsR0FFRTtNQUFBLEVBQUEsRUFBTyxJQUFJLENBQUMsRUFBWjtNQUNBLElBQUEsRUFBTyxJQURQO01BRUEsSUFBQSxFQUFPLElBRlA7TUFHQSxLQUFBLEVBQU8sSUFIUDtNQUlBLEtBQUEsRUFBTyxJQUpQO01BS0EsTUFBQSxFQUFTLEVBTFQ7TUFNQSxPQUFBLEVBQVMsRUFOVDs7SUFRRixLQUFLLENBQUMsSUFBTixDQUFXLE1BQVg7SUFFQSxNQUFBLEdBQVUsTUFBTSxDQUFDO0lBQ2pCLE9BQUEsR0FBVSxNQUFNLENBQUM7SUFFakIsS0FBQSxHQUFRLElBQUksQ0FBQztJQUViLElBQVEsS0FBQSxZQUFpQixLQUFLLENBQUMsSUFBL0I7TUFDRSxNQUFNLENBQUMsSUFBUCxHQUFlLEtBQUssQ0FBQyxPQUFPLENBQUM7TUFDN0IsTUFBTSxDQUFDLElBQVAsR0FBZTtNQUNmLE1BQU0sQ0FBQyxJQUFQLEdBQWUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUgvQjtLQUFBLE1BS0ssSUFBRyxLQUFBLFlBQWlCLEtBQUssQ0FBQyxRQUExQjtNQUNILE1BQU0sQ0FBQyxJQUFQLEdBQWU7TUFDZixNQUFNLENBQUMsSUFBUCxHQUFlO01BQ2YsTUFBTSxDQUFDLEtBQVAsR0FBZSxTQUFBLENBQVUsS0FBSyxDQUFDLEtBQWhCLEVBSFo7S0FBQSxNQUtBLElBQUcsS0FBQSxZQUFpQixLQUFLLENBQUMsT0FBMUI7TUFDSCxNQUFNLENBQUMsSUFBUCxHQUFlO01BQ2YsTUFBTSxDQUFDLElBQVAsR0FBZTtNQUNmLE1BQU0sQ0FBQyxLQUFQLEdBQWUsU0FBQSxDQUFVLEtBQUssQ0FBQyxLQUFoQixFQUhaO0tBQUEsTUFLQSxJQUFHLEtBQUEsWUFBaUIsS0FBSyxDQUFDLElBQTFCO01BQ0gsTUFBTSxDQUFDLElBQVAsR0FBZTtNQUNmLE1BQU0sQ0FBQyxJQUFQLEdBQWUsT0FGWjtLQUFBLE1BSUEsSUFBRyxhQUFIOztRQUNILE1BQU0sQ0FBQyw0Q0FBcUIsS0FBSyxDQUFDOzs7UUFDbEMsTUFBTSxDQUFDLE9BQVEsS0FBSyxDQUFDOzs7UUFDckIsTUFBTSxDQUFDLE9BQVEsS0FBSyxDQUFDOztNQUNyQixJQUF3QyxtQkFBeEM7UUFBQSxNQUFNLENBQUMsS0FBUCxHQUFlLFNBQUEsQ0FBVSxLQUFLLENBQUMsS0FBaEIsRUFBZjtPQUpHOztJQU1MLE1BQUEsR0FBUyxTQUFDLElBQUQ7TUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEtBQW5CO2FBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFtQixFQUFuQjtJQUZBO0FBSVQ7QUFBQSxTQUFBLHdDQUFBOztNQUNFLE1BQU0sQ0FBQyxJQUFQLENBQ0U7UUFBQSxFQUFBLEVBQU0sTUFBTSxDQUFDLEVBQWI7UUFDQSxJQUFBLEVBQU0sTUFBTSxDQUFDLElBRGI7UUFFQSxJQUFBLEVBQU0sTUFBQSxDQUFPLE1BQU0sQ0FBQyxJQUFkLENBRk47UUFHQSxJQUFBLEVBQU8sb0JBSFA7T0FERjtBQURGO0FBT0E7QUFBQSxTQUFBLHdDQUFBOztNQUNFLE9BQU8sQ0FBQyxJQUFSLENBQ0U7UUFBQSxFQUFBLEVBQU0sTUFBTSxDQUFDLEVBQWI7UUFDQSxJQUFBLEVBQU0sTUFBTSxDQUFDLElBRGI7UUFFQSxJQUFBLEVBQU0sTUFBQSxDQUFPLE1BQU0sQ0FBQyxJQUFkLENBRk47UUFHQSxJQUFBLEVBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BSHJCO09BREY7QUFNQTtBQUFBLFdBQUEsd0NBQUE7O1FBQ0UsS0FBSyxDQUFDLElBQU4sQ0FDRTtVQUFBLElBQUEsRUFBTSxJQUFJLENBQUMsRUFBWDtVQUNBLEdBQUEsRUFBTSxNQUFNLENBQUMsRUFEYjtVQUVBLEVBQUEsRUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBRmpCO1VBR0EsQ0FBQSxFQUFBLENBQUEsRUFBTSxLQUFLLENBQUMsRUFIWjtVQUlBLElBQUEsRUFBTSxNQUFBLENBQU8sTUFBTSxDQUFDLElBQWQsQ0FKTjtTQURGO0FBREY7QUFQRjtBQXRERjtTQXFFQTtJQUFDLE9BQUEsS0FBRDtJQUFRLE9BQUEsS0FBUjs7QUExRVU7O0FBNEVaLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{"../block":8}],39:[function(require,module,exports){
module.exports = require('./lib/index')

},{"./lib/index":41}],40:[function(require,module,exports){
var state
  , token
  , tokens
  , idx

var original_symbol = {
    nud: function() { return this.children && this.children.length ? this : fail('unexpected')() }
  , led: fail('missing operator')
}

var symbol_table = {}

function itself() {
  return this
}

symbol('(ident)').nud = itself
symbol('(keyword)').nud = itself
symbol('(builtin)').nud = itself
symbol('(literal)').nud = itself
symbol('(end)')

symbol(':')
symbol(';')
symbol(',')
symbol(')')
symbol(']')
symbol('}')

infixr('&&', 30)
infixr('||', 30)
infix('|', 43)
infix('^', 44)
infix('&', 45)
infix('==', 46)
infix('!=', 46)
infix('<', 47)
infix('<=', 47)
infix('>', 47)
infix('>=', 47)
infix('>>', 48)
infix('<<', 48)
infix('+', 50)
infix('-', 50)
infix('*', 60)
infix('/', 60)
infix('%', 60)
infix('?', 20, function(left) {
  this.children = [left, expression(0), (advance(':'), expression(0))]
  this.type = 'ternary'
  return this
})
infix('.', 80, function(left) {
  token.type = 'literal'
  state.fake(token)
  this.children = [left, token]
  advance()
  return this
})
infix('[', 80, function(left) {
  this.children = [left, expression(0)]
  this.type = 'binary'
  advance(']')
  return this
})
infix('(', 80, function(left) {
  this.children = [left]
  this.type = 'call'

  if(token.data !== ')') while(1) {
    this.children.push(expression(0))
    if(token.data !== ',') break
    advance(',')
  }
  advance(')')
  return this
})

prefix('-')
prefix('+')
prefix('!')
prefix('~')
prefix('defined')
prefix('(', function() {
  this.type = 'group'
  this.children = [expression(0)]
  advance(')')
  return this 
})
prefix('++')
prefix('--')
suffix('++')
suffix('--')

assignment('=')
assignment('+=')
assignment('-=')
assignment('*=')
assignment('/=')
assignment('%=')
assignment('&=')
assignment('|=')
assignment('^=')
assignment('>>=')
assignment('<<=')

module.exports = function(incoming_state, incoming_tokens) {
  state = incoming_state
  tokens = incoming_tokens
  idx = 0
  var result

  if(!tokens.length) return

  advance()
  result = expression(0)
  result.parent = state[0]
  emit(result)

  if(idx < tokens.length) {
    throw new Error('did not use all tokens')
  }

  result.parent.children = [result]

  function emit(node) {
    state.unshift(node, false)
    for(var i = 0, len = node.children.length; i < len; ++i) {
      emit(node.children[i])
    }
    state.shift()
  }

}

function symbol(id, binding_power) {
  var sym = symbol_table[id]
  binding_power = binding_power || 0
  if(sym) {
    if(binding_power > sym.lbp) {
      sym.lbp = binding_power
    }
  } else {
    sym = Object.create(original_symbol)
    sym.id = id 
    sym.lbp = binding_power
    symbol_table[id] = sym
  }
  return sym
}

function expression(rbp) {
  var left, t = token
  advance()

  left = t.nud()
  while(rbp < token.lbp) {
    t = token
    advance()
    left = t.led(left)
  }
  return left
}

function infix(id, bp, led) {
  var sym = symbol(id, bp)
  sym.led = led || function(left) {
    this.children = [left, expression(bp)]
    this.type = 'binary'
    return this
  }
}

function infixr(id, bp, led) {
  var sym = symbol(id, bp)
  sym.led = led || function(left) {
    this.children = [left, expression(bp - 1)]
    this.type = 'binary'
    return this
  }
  return sym
}

function prefix(id, nud) {
  var sym = symbol(id)
  sym.nud = nud || function() {
    this.children = [expression(70)]
    this.type = 'unary'
    return this
  }
  return sym
}

function suffix(id) {
  var sym = symbol(id, 150)
  sym.led = function(left) {
    this.children = [left]
    this.type = 'suffix'
    return this
  }
}

function assignment(id) {
  return infixr(id, 10, function(left) {
    this.children = [left, expression(9)]
    this.assignment = true
    this.type = 'assign'
    return this
  })
}

function advance(id) {
  var next
    , value
    , type
    , output

  if(id && token.data !== id) {
    return state.unexpected('expected `'+ id + '`, got `'+token.data+'`')
  }

  if(idx >= tokens.length) {
    token = symbol_table['(end)']
    return
  }

  next = tokens[idx++]
  value = next.data
  type = next.type

  if(type === 'ident') {
    output = state.scope.find(value) || state.create_node()
    type = output.type
  } else if(type === 'builtin') {
    output = symbol_table['(builtin)']
  } else if(type === 'keyword') {
    output = symbol_table['(keyword)']
  } else if(type === 'operator') {
    output = symbol_table[value]
    if(!output) {
      return state.unexpected('unknown operator `'+value+'`')
    }
  } else if(type === 'float' || type === 'integer') {
    type = 'literal'
    output = symbol_table['(literal)']
  } else {
    return state.unexpected('unexpected token.')
  }

  if(output) {
    if(!output.nud) { output.nud = itself }
    if(!output.children) { output.children = [] }
  }

  output = Object.create(output)
  output.token = next
  output.type = type
  if(!output.data) output.data = value

  return token = output
}

function fail(message) {
  return function() { return state.unexpected(message) }
}

},{}],41:[function(require,module,exports){
module.exports = parser

var through = require('../../through')
  , full_parse_expr = require('./expr')
  , Scope = require('./scope')

// singleton!
var Advance = new Object

var DEBUG = false

var _ = 0
  , IDENT = _++
  , STMT = _++
  , STMTLIST = _++
  , STRUCT = _++
  , FUNCTION = _++
  , FUNCTIONARGS = _++
  , DECL = _++
  , DECLLIST = _++
  , FORLOOP = _++
  , WHILELOOP = _++
  , IF = _++
  , EXPR = _++
  , PRECISION = _++
  , COMMENT = _++
  , PREPROCESSOR = _++
  , KEYWORD = _++
  , KEYWORD_OR_IDENT = _++
  , RETURN = _++
  , BREAK = _++
  , CONTINUE = _++
  , DISCARD = _++
  , DOWHILELOOP = _++
  , PLACEHOLDER = _++
  , QUANTIFIER = _++

var DECL_ALLOW_ASSIGN = 0x1
  , DECL_ALLOW_COMMA = 0x2
  , DECL_REQUIRE_NAME = 0x4
  , DECL_ALLOW_INVARIANT = 0x8
  , DECL_ALLOW_STORAGE = 0x10
  , DECL_NO_INOUT = 0x20
  , DECL_ALLOW_STRUCT = 0x40
  , DECL_STATEMENT = 0xFF
  , DECL_FUNCTION = DECL_STATEMENT & ~(DECL_ALLOW_ASSIGN | DECL_ALLOW_COMMA | DECL_NO_INOUT | DECL_ALLOW_INVARIANT | DECL_REQUIRE_NAME)
  , DECL_STRUCT = DECL_STATEMENT & ~(DECL_ALLOW_ASSIGN | DECL_ALLOW_INVARIANT | DECL_ALLOW_STORAGE | DECL_ALLOW_STRUCT)

var QUALIFIERS = ['const', 'attribute', 'uniform', 'varying']

var NO_ASSIGN_ALLOWED = false
  , NO_COMMA_ALLOWED = false

// map of tokens to stmt types
var token_map = {
    'block-comment': COMMENT
  , 'line-comment': COMMENT
  , 'preprocessor': PREPROCESSOR
}

// map of stmt types to human
var stmt_type = _ = [ 
    'ident'
  , 'stmt'
  , 'stmtlist'
  , 'struct'
  , 'function'
  , 'functionargs'
  , 'decl'
  , 'decllist'
  , 'forloop'
  , 'whileloop'
  , 'i'+'f'
  , 'expr'
  , 'precision'
  , 'comment'
  , 'preprocessor'
  , 'keyword'
  , 'keyword_or_ident'
  , 'return'
  , 'break'
  , 'continue'
  , 'discard'
  , 'do-while'
  , 'placeholder'
  , 'quantifier'
]

function parser() {
  var stmtlist = n(STMTLIST)
    , stmt = n(STMT)
    , decllist = n(DECLLIST)
    , precision = n(PRECISION)
    , ident = n(IDENT)
    , keyword_or_ident = n(KEYWORD_OR_IDENT)
    , fn = n(FUNCTION)
    , fnargs = n(FUNCTIONARGS)
    , forstmt = n(FORLOOP)
    , ifstmt = n(IF)
    , whilestmt = n(WHILELOOP)
    , returnstmt = n(RETURN)
    , dowhilestmt = n(DOWHILELOOP)
    , quantifier = n(QUANTIFIER)

  var parse_struct
    , parse_precision
    , parse_quantifier
    , parse_forloop
    , parse_if
    , parse_return
    , parse_whileloop
    , parse_dowhileloop
    , parse_function
    , parse_function_args

  var stream = through(write, end)
    , check = arguments.length ? [].slice.call(arguments) : []
    , depth = 0
    , state = []
    , tokens = []
    , whitespace = []
    , errored = false
    , program
    , token
    , node

  // setup state
  state.shift = special_shift
  state.unshift = special_unshift
  state.fake = special_fake
  state.unexpected = unexpected
  state.scope = new Scope(state)
  state.create_node = function() {
    var n = mknode(IDENT, token)
    n.parent = stream.program
    return n
  }

  setup_stative_parsers()

  // setup root node
  node = stmtlist()
  node.expecting = '(eof)'
  node.mode = STMTLIST
  node.token = {type: '(program)', data: '(program)'}
  program = node

  stream.program = program
  stream.scope = function(scope) {
    if(arguments.length === 1) {
      state.scope = scope
    }
    return state.scope
  }

  state.unshift(node)
  return stream

  // stream functions ---------------------------------------------

  function write(input) {
    if(input.type === 'whitespace' || input.type === 'line-comment' || input.type === 'block-comment') {

      whitespace.push(input)
      return
    }
    tokens.push(input)
    token = token || tokens[0]

    if(token && whitespace.length) {
      token.preceding = token.preceding || []
      token.preceding = token.preceding.concat(whitespace)
      whitespace = []
    }

    while(take()) switch(state[0].mode) {
      case STMT: parse_stmt(); break
      case STMTLIST: parse_stmtlist(); break
      case DECL: parse_decl(); break
      case DECLLIST: parse_decllist(); break
      case EXPR: parse_expr(); break
      case STRUCT: parse_struct(true, true); break
      case PRECISION: parse_precision(); break
      case IDENT: parse_ident(); break
      case KEYWORD: parse_keyword(); break
      case KEYWORD_OR_IDENT: parse_keyword_or_ident(); break
      case FUNCTION: parse_function(); break
      case FUNCTIONARGS: parse_function_args(); break
      case FORLOOP: parse_forloop(); break
      case WHILELOOP: parse_whileloop(); break
      case DOWHILELOOP: parse_dowhileloop(); break
      case RETURN: parse_return(); break
      case IF: parse_if(); break
      case QUANTIFIER: parse_quantifier(); break
    }
  }
  
  function end(tokens) {
    if(arguments.length) {
      write(tokens)
    }

    if(state.length > 1) {
      unexpected('unexpected EOF')
      return
    }

    stream.emit('end')
  }

  function take() {
    if(errored || !state.length)
      return false

    return (token = tokens[0]) && !stream.paused
  }

  // ----- state manipulation --------

  function special_fake(x) {
    state.unshift(x)
    state.shift()
  }

  function special_unshift(_node, add_child) {
    _node.parent = state[0]

    var ret = [].unshift.call(this, _node)

    add_child = add_child === undefined ? true : add_child

    if(DEBUG) {
      var pad = ''
      for(var i = 0, len = this.length - 1; i < len; ++i) {
        pad += ' |'
      }
      console.log(pad, '\\'+_node.type, _node.token.data)
    }

    if(add_child && node !== _node) node.children.push(_node)
    node = _node

    return ret
  }

  function special_shift() {
    var _node = [].shift.call(this)
      , okay = check[this.length]
      , emit = false

    if(DEBUG) {
      var pad = ''
      for(var i = 0, len = this.length; i < len; ++i) {
        pad += ' |'
      }
      console.log(pad, '/'+_node.type)
    }

    if(check.length) { 
      if(typeof check[0] === 'function') {
        emit = check[0](_node)
      } else if(okay !== undefined) {
        emit = okay.test ? okay.test(_node.type) : okay === _node.type
      }
    } else {
      emit = true
    }

    if(emit) stream.emit('data', _node) 
  
    node = _node.parent
    return _node
  }

  // parse states ---------------

  function parse_stmtlist() {
    // determine the type of the statement
    // and then start parsing
    return stative(
      function() { state.scope.enter(); return Advance }
    , normal_mode
    )()

    function normal_mode() {
      if(token.data === state[0].expecting) {
        return state.scope.exit(), state.shift()
      }
      switch(token.type) {
        case 'preprocessor':
          state.fake(adhoc())
          tokens.shift()
        return
        default:
          state.unshift(stmt())
        return 
      }
    }
  }

  function parse_stmt() {
    if(state[0].brace) {
      if(token.data !== '}') {
        return unexpected('expected `}`, got '+token.data)
      }
      state[0].brace = false
      return tokens.shift(), state.shift()
    }
    switch(token.type) {
      case 'eof': return state.shift()
      case 'keyword': 
        switch(token.data) {
          case 'for': return state.unshift(forstmt());
          case 'if': return state.unshift(ifstmt());
          case 'while': return state.unshift(whilestmt());
          case 'do': return state.unshift(dowhilestmt());
          case 'break': return state.fake(mknode(BREAK, token)), tokens.shift()
          case 'continue': return state.fake(mknode(CONTINUE, token)), tokens.shift()
          case 'discard': return state.fake(mknode(DISCARD, token)), tokens.shift()
          case 'return': return state.unshift(returnstmt());
          case 'precision': return state.unshift(precision());
        }
        return state.unshift(decl(DECL_STATEMENT))
      case 'ident':
        var lookup
        if(lookup = state.scope.find(token.data)) {
          if(lookup.parent.type === 'struct') {
            // this is strictly untrue, you could have an
            // expr that starts with a struct constructor.
            //      ... sigh
            return state.unshift(decl(DECL_STATEMENT))
          }
          return state.unshift(expr(';'))
        }
      case 'operator':
        if(token.data === '{') {
          state[0].brace = true
          var n = stmtlist()
          n.expecting = '}'
          return tokens.shift(), state.unshift(n)
        }
        if(token.data === ';') {
          return tokens.shift(), state.shift()
        }
      default: return state.unshift(expr(';'))
    }
  }

  function parse_decl() {
    var stmt = state[0]

    return stative(
      invariant_or_not,
      storage_or_not,
      parameter_or_not,
      precision_or_not,
      struct_or_type,
      maybe_name,
      maybe_lparen,     // lparen means we're a function
      is_decllist,
      done
    )()

    function invariant_or_not() {
      if(token.data === 'invariant') {
        if(stmt.flags & DECL_ALLOW_INVARIANT) {
          state.unshift(keyword())
          return Advance
        } else {
          return unexpected('`invariant` is not allowed here') 
        }
      } else {
        state.fake(mknode(PLACEHOLDER, {data: '', position: token.position}))
        return Advance
      }
    }

    function storage_or_not() {
      if(is_storage(token)) {
        if(stmt.flags & DECL_ALLOW_STORAGE) {
          state.unshift(keyword()) 
          return Advance
        } else {
          return unexpected('storage is not allowed here') 
        }
      } else {
        state.fake(mknode(PLACEHOLDER, {data: '', position: token.position}))
        return Advance
      }
    }

    function parameter_or_not() {
      if(is_parameter(token)) {
        if(!(stmt.flags & DECL_NO_INOUT)) {
          state.unshift(keyword()) 
          return Advance
        } else {
          return unexpected('parameter is not allowed here') 
        }
      } else {
        state.fake(mknode(PLACEHOLDER, {data: '', position: token.position}))
        return Advance
      }
    }

    function precision_or_not() {
      if(is_precision(token)) {
        state.unshift(keyword())
        return Advance
      } else {
        state.fake(mknode(PLACEHOLDER, {data: '', position: token.position}))
        return Advance
      }
    }

    function struct_or_type() {
      if(token.data === 'struct') {
        if(!(stmt.flags & DECL_ALLOW_STRUCT)) {
          return unexpected('cannot nest structs')
        }
        state.unshift(struct())
        return Advance
      }

      if(token.type === 'keyword') {
        state.unshift(keyword())
        return Advance
      }

      var lookup = state.scope.find(token.data)

      if(lookup) {
        state.fake(Object.create(lookup))
        tokens.shift()
        return Advance  
      }
      return unexpected('expected user defined type, struct or keyword, got '+token.data)
    }

    function maybe_name() {
      if(token.data === ',' && !(stmt.flags & DECL_ALLOW_COMMA)) {
        return state.shift()
      }

      if(token.data === '[') {
        // oh lord.
        state.unshift(quantifier())
        return
      }

      if(token.data === ')') return state.shift()

      if(token.data === ';') {
        return stmt.stage + 3
      }

      if(token.type !== 'ident') {
        console.log(token);
        return unexpected('expected identifier, got '+token.data)
      }

      stmt.collected_name = tokens.shift()
      return Advance      
    }

    function maybe_lparen() {
      if(token.data === '(') {
        tokens.unshift(stmt.collected_name)
        delete stmt.collected_name
        state.unshift(fn())
        return stmt.stage + 2 
      }
      return Advance
    }

    function is_decllist() {
      tokens.unshift(stmt.collected_name)
      delete stmt.collected_name
      state.unshift(decllist())
      return Advance
    }

    function done() {
      return state.shift()
    }
  }
  
  function parse_decllist() {
    // grab ident

    if(token.type === 'ident') {
      var name = token.data
      state.unshift(ident())
      state.scope.define(name)
      return
    }

    if(token.type === 'operator') {

      if(token.data === ',') {
        // multi-decl!
        if(!(state[1].flags & DECL_ALLOW_COMMA)) {
          return state.shift()
        }

        return tokens.shift()
      } else if(token.data === '=') {
        if(!(state[1].flags & DECL_ALLOW_ASSIGN)) return unexpected('`=` is not allowed here.')

        tokens.shift()

        state.unshift(expr(',', ';'))
        return
      } else if(token.data === '[') {
        state.unshift(quantifier())
        return
      }
    }
    return state.shift()
  }

  function parse_keyword_or_ident() {
    if(token.type === 'keyword') {
      state[0].type = 'keyword'
      state[0].mode = KEYWORD
      return
    }

    if(token.type === 'ident') {
      state[0].type = 'ident'
      state[0].mode = IDENT
      return
    }

    return unexpected('expected keyword or user-defined name, got '+token.data)
  }

  function parse_keyword() {
    if(token.type !== 'keyword') {
      return unexpected('expected keyword, got '+token.data)
    }

    return state.shift(), tokens.shift()
  }

  function parse_ident() {
    if(token.type !== 'ident') {
      return unexpected('expected user-defined name, got '+token.data)
    }

    state[0].data = token.data
    return state.shift(), tokens.shift()
  }


  function parse_expr() {
    var expecting = state[0].expecting

    state[0].tokens = state[0].tokens || []

    if(state[0].parenlevel === undefined) {
      state[0].parenlevel = 0
      state[0].bracelevel = 0
    }
    if(state[0].parenlevel < 1 && expecting.indexOf(token.data) > -1) {
      return parseexpr(state[0].tokens)
    }
    if(token.data === '(') {
      ++state[0].parenlevel
    } else if(token.data === ')') {
      --state[0].parenlevel
    }

    switch(token.data) {
      case '{': ++state[0].bracelevel; break
      case '}': --state[0].bracelevel; break
      case '(': ++state[0].parenlevel; break
      case ')': --state[0].parenlevel; break
    }

    if(state[0].parenlevel < 0) return unexpected('unexpected `)`')
    if(state[0].bracelevel < 0) return unexpected('unexpected `}`')

    state[0].tokens.push(tokens.shift())
    return

    function parseexpr(tokens) {
      return full_parse_expr(state, tokens), state.shift()
    }
  }

  // node types ---------------

  function n(type) {
    // this is a function factory that suffices for most kinds of expressions and statements
    return function() {
      return mknode(type, token)
    }
  }

  function adhoc() {
    return mknode(token_map[token.type], token, node)
  }

  function decl(flags) {
    var _ = mknode(DECL, token, node)
    _.flags = flags

    return _
  }

  function struct(allow_assign, allow_comma) {
    var _ = mknode(STRUCT, token, node)
    _.allow_assign = allow_assign === undefined ? true : allow_assign
    _.allow_comma = allow_comma === undefined ? true : allow_comma
    return _
  }

  function expr() {
    var n = mknode(EXPR, token, node)

    n.expecting = [].slice.call(arguments)
    return n
  }
  
  function keyword(default_value) {
    var t = token
    if(default_value) {
      t = {'type': '(implied)', data: '(default)', position: t.position} 
    }
    return mknode(KEYWORD, t, node)
  }

  // utils ----------------------------

  function unexpected(str) {
    errored = true
    stream.emit('error', new Error(
      (str || 'unexpected '+state) +
      ' at line '+state[0].token.line
    ))
  }

  function assert(type, data) {
    return 1,
      assert_null_string_or_array(type, token.type) && 
      assert_null_string_or_array(data, token.data)
  }

  function assert_null_string_or_array(x, y) {
    switch(typeof x) {
      case 'string': if(y !== x) {
        unexpected('expected `'+x+'`, got '+y+'\n'+token.data);
      } return !errored

      case 'object': if(x && x.indexOf(y) === -1) {
        unexpected('expected one of `'+x.join('`, `')+'`, got '+y);
      } return !errored
    }
    return true
  }

  // stative ----------------------------

  function stative() {
    var steps = [].slice.call(arguments)
      , step
      , result

    return function() {
      var current = state[0]

      current.stage || (current.stage = 0)

      step = steps[current.stage]
      if(!step) return unexpected('parser in undefined state!')

      result = step()

      if(result === Advance) return ++current.stage
      if(result === undefined) return
      current.stage = result
    } 
  }

  function advance(op, t) {
    t = t || 'operator'
    return function() {
      if(!assert(t, op)) return

      var last = tokens.shift()
        , children = state[0].children
        , last_node = children[children.length - 1]

      if(last_node && last_node.token && last.preceding) {
        last_node.token.succeeding = last_node.token.succeeding || []
        last_node.token.succeeding = last_node.token.succeeding.concat(last.preceding)
      }
      return Advance
    }
  }

  function advance_expr(until) {
    return function() { return state.unshift(expr(until)), Advance }
  }

  function advance_ident(declare) {
    return declare ? function() {
      var name = token.data
      return assert('ident') && (state.unshift(ident()), state.scope.define(name), Advance)
    } :  function() {
      if(!assert('ident')) return

      var s = Object.create(state.scope.find(token.data))
      s.token = token

      return (tokens.shift(), Advance)
    }
  }

  function advance_stmtlist() {
    return function() {
      var n = stmtlist()
      n.expecting = '}'
      return state.unshift(n), Advance
    }
  }

  function maybe_stmtlist(skip) {
    return function() {
      var current = state[0].stage
      if(token.data !== '{') { return state.unshift(stmt()), current + skip }
      return tokens.shift(), Advance
    }
  }

  function popstmt() {
    return function() { return state.shift(), state.shift() }
  }


  function setup_stative_parsers() {

    // could also be
    // struct { } decllist
    parse_struct =
        stative(
          advance('struct', 'keyword')
        , function() {
            if(token.data === '{') {
              state.fake(mknode(IDENT, {data:'', position: token.position, type:'ident'}))
              return Advance
            }

            return advance_ident(true)()
          }
        , function() { state.scope.enter(); return Advance }
        , advance('{')
        , function() {
            if(token.data === '}') {
              state.scope.exit()
              tokens.shift()
              return state.shift()
            }
            if(token.data === ';') { tokens.shift(); return }
            state.unshift(decl(DECL_STRUCT))
          }
        )

    parse_precision =
        stative(
          function() { return tokens.shift(), Advance }
        , function() { 
            return assert(
            'keyword', ['lowp', 'mediump', 'highp']
            ) && (state.unshift(keyword()), Advance) 
          }
        , function() { return (state.unshift(keyword()), Advance) }
        , function() { return state.shift() } 
        )

    parse_quantifier =
        stative(
          advance('[')
        , advance_expr(']')
        , advance(']')
        , function() { return state.shift() }
        )

    parse_forloop = 
        stative(
          advance('for', 'keyword')
        , advance('(')
        , function() {
            var lookup
            if(token.type === 'ident') {
              if(!(lookup = state.scope.find(token.data))) {
                lookup = state.create_node()
              }
             
              if(lookup.parent.type === 'struct') {
                return state.unshift(decl(DECL_STATEMENT)), Advance
              }
            } else if(token.type === 'builtin' || token.type === 'keyword') {
              return state.unshift(decl(DECL_STATEMENT)), Advance
            }
            return advance_expr(';')()
          }
        , advance(';')
        , advance_expr(';')
        , advance(';')
        , advance_expr(')')
        , advance(')')
        , maybe_stmtlist(3)
        , advance_stmtlist()
        , advance('}')
        , popstmt()
        )

    parse_if = 
        stative(
          advance('if', 'keyword')
        , advance('(')
        , advance_expr(')')
        , advance(')')
        , maybe_stmtlist(3)
        , advance_stmtlist()
        , advance('}')
        , function() {
            if(token.data === 'else') {
              return tokens.shift(), state.unshift(stmt()), Advance
            }
            return popstmt()()
          }
        , popstmt()
        )

    parse_return =
        stative(
          advance('return', 'keyword')
        , function() {
            if(token.data === ';') return Advance
            return state.unshift(expr(';')), Advance
          }
        , function() { tokens.shift(), popstmt()() } 
        )

    parse_whileloop =
        stative(
          advance('while', 'keyword')
        , advance('(')
        , advance_expr(')')
        , advance(')')
        , maybe_stmtlist(3)
        , advance_stmtlist()
        , advance('}')
        , popstmt()
        )

    parse_dowhileloop = 
      stative(
        advance('do', 'keyword')
      , maybe_stmtlist(3)
      , advance_stmtlist()
      , advance('}')
      , advance('while', 'keyword')
      , advance('(')
      , advance_expr(')')
      , advance(')')
      , popstmt()
      )

    parse_function =
      stative(
        function() {
          for(var i = 1, len = state.length; i < len; ++i) if(state[i].mode === FUNCTION) {
            return unexpected('function definition is not allowed within another function')
          }

          return Advance
        }
      , function() {
          if(!assert("ident")) return

          var name = token.data
            , lookup = state.scope.find(name)

          state.unshift(ident())
          state.scope.define(name)

          state.scope.enter(lookup ? lookup.scope : null)
          return Advance
        }
      , advance('(')
      , function() { return state.unshift(fnargs()), Advance }
      , advance(')')
      , function() { 
          // forward decl
          if(token.data === ';') {
            return state.scope.exit(), state.shift(), state.shift()
          }
          return Advance
        }
      , advance('{')
      , advance_stmtlist()
      , advance('}')
      , function() { state.scope.exit(); return Advance } 
      , function() { return state.shift(), state.shift(), state.shift() }
      )

    parse_function_args =
      stative(
        function() {
          if(token.data === 'void') { state.fake(keyword()); tokens.shift(); return Advance }
          if(token.data === ')') { state.shift(); return }
          if(token.data === 'struct') {
            state.unshift(struct(NO_ASSIGN_ALLOWED, NO_COMMA_ALLOWED))
            return Advance
          }
          state.unshift(decl(DECL_FUNCTION))
          return Advance
        }
      , function() {
          if(token.data === ',') { tokens.shift(); return 0 }
          if(token.data === ')') { state.shift(); return }
          unexpected('expected one of `,` or `)`, got '+token.data)
        }
      )
  }
}

function mknode(mode, sourcetoken) {
  return {
      mode: mode
    , token: sourcetoken
    , children: []
    , type: stmt_type[mode]
//    , id: (Math.random() * 0xFFFFFFFF).toString(16)
  }
}

function is_storage(token) {
  return token.data === 'const' ||
         token.data === 'attribute' ||
         token.data === 'uniform' ||
         token.data === 'varying'
}

function is_parameter(token) {
  return token.data === 'in' ||
         token.data === 'inout' ||
         token.data === 'out'
}

function is_precision(token) {
  return token.data === 'highp' ||
         token.data === 'mediump' ||
         token.data === 'lowp'
}

},{"../../through":47,"./expr":40,"./scope":42}],42:[function(require,module,exports){
module.exports = scope

function scope(state) {
  if(this.constructor !== scope)
    return new scope(state)

  this.state = state
  this.scopes = []
  this.current = null
}

var cons = scope
  , proto = cons.prototype

proto.enter = function(s) {
  this.scopes.push(
    this.current = this.state[0].scope = s || {}
  )
}

proto.exit = function() {
  this.scopes.pop()
  this.current = this.scopes[this.scopes.length - 1]
}

proto.define = function(str) {
  this.current[str] = this.state[0]
}

proto.find = function(name, fail) {
  for(var i = this.scopes.length - 1; i > -1; --i) {
    if(this.scopes[i].hasOwnProperty(name)) {
      return this.scopes[i][name]
    }
  }

  return null
}

},{}],43:[function(require,module,exports){
module.exports = tokenize

var through = require('../through')

var literals = require('./lib/literals')
  , operators = require('./lib/operators')
  , builtins = require('./lib/builtins')

var NORMAL = 999          // <-- never emitted
  , TOKEN = 9999          // <-- never emitted 
  , BLOCK_COMMENT = 0 
  , LINE_COMMENT = 1
  , PREPROCESSOR = 2
  , OPERATOR = 3
  , INTEGER = 4
  , FLOAT = 5
  , IDENT = 6
  , BUILTIN = 7
  , KEYWORD = 8
  , WHITESPACE = 9
  , EOF = 10 
  , HEX = 11

var map = [
    'block-comment'
  , 'line-comment'
  , 'preprocessor'
  , 'operator'
  , 'integer'
  , 'float'
  , 'ident'
  , 'builtin'
  , 'keyword'
  , 'whitespace'
  , 'eof'
  , 'integer'
]

function tokenize() {
  var stream = through(write, end)

  var i = 0
    , total = 0
    , mode = NORMAL 
    , c
    , last
    , content = []
    , token_idx = 0
    , token_offs = 0
    , line = 1
    , start = 0
    , isnum = false
    , isoperator = false
    , input = ''
    , len

  return stream

  function token(data) {
    if(data.length) {
      stream.queue({
        type: map[mode]
      , data: data
      , position: start
      , line: line
      })
    }
  }

  function write(chunk) {
    i = 0
    input += chunk.toString()
    len = input.length

    while(c = input[i], i < len) switch(mode) {
      case BLOCK_COMMENT: i = block_comment(); break
      case LINE_COMMENT: i = line_comment(); break
      case PREPROCESSOR: i = preprocessor(); break 
      case OPERATOR: i = operator(); break
      case INTEGER: i = integer(); break
      case HEX: i = hex(); break
      case FLOAT: i = decimal(); break
      case TOKEN: i = readtoken(); break
      case WHITESPACE: i = whitespace(); break
      case NORMAL: i = normal(); break
    }

    total += i
    input = input.slice(i)
  } 

  function end(chunk) {
    if(content.length) {
      token(content.join(''))
    }

    mode = EOF
    token('(eof)')

    stream.queue(null)
  }

  function normal() {
    content = content.length ? [] : content

    if(last === '/' && c === '*') {
      start = total + i - 1
      mode = BLOCK_COMMENT
      last = c
      return i + 1
    }

    if(last === '/' && c === '/') {
      start = total + i - 1
      mode = LINE_COMMENT
      last = c
      return i + 1
    }

    if(c === '#') {
      mode = PREPROCESSOR
      start = total + i
      return i
    }

    if(/\s/.test(c)) {
      mode = WHITESPACE
      start = total + i
      return i
    }

    isnum = /\d/.test(c)
    isoperator = /[^\w_]/.test(c)

    start = total + i
    mode = isnum ? INTEGER : isoperator ? OPERATOR : TOKEN
    return i
  }

  function whitespace() {
    if(c === '\n') ++line

    if(/[^\s]/g.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }

  function preprocessor() {
    if(c === '\n') ++line

    if(c === '\n' && last !== '\\') {
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }

  function line_comment() {
    return preprocessor()
  }

  function block_comment() {
    if(c === '/' && last === '*') {
      content.push(c)
      token(content.join(''))
      mode = NORMAL
      return i + 1
    }

    if(c === '\n') ++line

    content.push(c)
    last = c
    return i + 1
  }

  function operator() {
    if(last === '.' && /\d/.test(c)) {
      mode = FLOAT
      return i
    }

    if(last === '/' && c === '*') {
      mode = BLOCK_COMMENT
      return i
    }

    if(last === '/' && c === '/') {
      mode = LINE_COMMENT
      return i
    }

    if(c === '.' && content.length) {
      while(determine_operator(content));
      
      mode = FLOAT
      return i
    }

    if(c === ';') {
      if(content.length) while(determine_operator(content));
      token(c)
      mode = NORMAL
      return i + 1
    }

    var is_composite_operator = content.length === 2 && c !== '='
    if(/[\w_\d\s]/.test(c) || is_composite_operator) {
      while(determine_operator(content));
      mode = NORMAL
      return i
    }

    content.push(c)
    last = c
    return i + 1
  }

  function determine_operator(buf) {
    var j = 0
      , k = buf.length
      , idx

    do {
      idx = operators.indexOf(buf.slice(0, buf.length + j).join(''))
      if(idx === -1) { 
        j -= 1
        k -= 1
        if (k < 0) return 0
        continue
      }
      
      token(operators[idx])

      start += operators[idx].length
      content = content.slice(operators[idx].length)
      return content.length
    } while(1)
  }

  function hex() {
    if(/[^a-fA-F0-9]/.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }

    content.push(c)
    last = c
    return i + 1    
  }

  function integer() {
    if(c === '.') {
      content.push(c)
      mode = FLOAT
      last = c
      return i + 1
    }

    if(/[eE]/.test(c)) {
      content.push(c)
      mode = FLOAT
      last = c
      return i + 1
    }

    if(c === 'x' && content.length === 1 && content[0] === '0') {
      mode = HEX
      content.push(c)
      last = c
      return i + 1
    }

    if(/[^\d]/.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }

    content.push(c)
    last = c
    return i + 1
  }

  function decimal() {
    if(c === 'f') {
      content.push(c)
      last = c
      i += 1
    }

    if(/[eE]/.test(c)) {
      content.push(c)
      last = c
      return i + 1
    }

    if(/[^\d]/.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }

  function readtoken() {
    if(/[^\d\w_]/.test(c)) {
      var contentstr = content.join('')
      if(literals.indexOf(contentstr) > -1) {
        mode = KEYWORD
      } else if(builtins.indexOf(contentstr) > -1) {
        mode = BUILTIN
      } else {
        mode = IDENT
      }
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }
}

},{"../through":47,"./lib/builtins":44,"./lib/literals":45,"./lib/operators":46}],44:[function(require,module,exports){
module.exports = [
    'gl_Position'
  , 'gl_PointSize'
  , 'gl_ClipVertex'
  , 'gl_FragCoord'
  , 'gl_FrontFacing'
  , 'gl_FragColor'
  , 'gl_FragData'
  , 'gl_FragDepth'
  , 'gl_Color'
  , 'gl_SecondaryColor'
  , 'gl_Normal'
  , 'gl_Vertex'
  , 'gl_MultiTexCoord0'
  , 'gl_MultiTexCoord1'
  , 'gl_MultiTexCoord2'
  , 'gl_MultiTexCoord3'
  , 'gl_MultiTexCoord4'
  , 'gl_MultiTexCoord5'
  , 'gl_MultiTexCoord6'
  , 'gl_MultiTexCoord7'
  , 'gl_FogCoord'
  , 'gl_MaxLights'
  , 'gl_MaxClipPlanes'
  , 'gl_MaxTextureUnits'
  , 'gl_MaxTextureCoords'
  , 'gl_MaxVertexAttribs'
  , 'gl_MaxVertexUniformComponents'
  , 'gl_MaxVaryingFloats'
  , 'gl_MaxVertexTextureImageUnits'
  , 'gl_MaxCombinedTextureImageUnits'
  , 'gl_MaxTextureImageUnits'
  , 'gl_MaxFragmentUniformComponents'
  , 'gl_MaxDrawBuffers'
  , 'gl_ModelViewMatrix'
  , 'gl_ProjectionMatrix'
  , 'gl_ModelViewProjectionMatrix'
  , 'gl_TextureMatrix'
  , 'gl_NormalMatrix'
  , 'gl_ModelViewMatrixInverse'
  , 'gl_ProjectionMatrixInverse'
  , 'gl_ModelViewProjectionMatrixInverse'
  , 'gl_TextureMatrixInverse'
  , 'gl_ModelViewMatrixTranspose'
  , 'gl_ProjectionMatrixTranspose'
  , 'gl_ModelViewProjectionMatrixTranspose'
  , 'gl_TextureMatrixTranspose'
  , 'gl_ModelViewMatrixInverseTranspose'
  , 'gl_ProjectionMatrixInverseTranspose'
  , 'gl_ModelViewProjectionMatrixInverseTranspose'
  , 'gl_TextureMatrixInverseTranspose'
  , 'gl_NormalScale'
  , 'gl_DepthRangeParameters'
  , 'gl_DepthRange'
  , 'gl_ClipPlane'
  , 'gl_PointParameters'
  , 'gl_Point'
  , 'gl_MaterialParameters'
  , 'gl_FrontMaterial'
  , 'gl_BackMaterial'
  , 'gl_LightSourceParameters'
  , 'gl_LightSource'
  , 'gl_LightModelParameters'
  , 'gl_LightModel'
  , 'gl_LightModelProducts'
  , 'gl_FrontLightModelProduct'
  , 'gl_BackLightModelProduct'
  , 'gl_LightProducts'
  , 'gl_FrontLightProduct'
  , 'gl_BackLightProduct'
  , 'gl_FogParameters'
  , 'gl_Fog'
  , 'gl_TextureEnvColor'
  , 'gl_EyePlaneS'
  , 'gl_EyePlaneT'
  , 'gl_EyePlaneR'
  , 'gl_EyePlaneQ'
  , 'gl_ObjectPlaneS'
  , 'gl_ObjectPlaneT'
  , 'gl_ObjectPlaneR'
  , 'gl_ObjectPlaneQ'
  , 'gl_FrontColor'
  , 'gl_BackColor'
  , 'gl_FrontSecondaryColor'
  , 'gl_BackSecondaryColor'
  , 'gl_TexCoord'
  , 'gl_FogFragCoord'
  , 'gl_Color'
  , 'gl_SecondaryColor'
  , 'gl_TexCoord'
  , 'gl_FogFragCoord'
  , 'gl_PointCoord'
  , 'radians'
  , 'degrees'
  , 'sin'
  , 'cos'
  , 'tan'
  , 'asin'
  , 'acos'
  , 'atan'
  , 'pow'
  , 'exp'
  , 'log'
  , 'exp2'
  , 'log2'
  , 'sqrt'
  , 'inversesqrt'
  , 'abs'
  , 'sign'
  , 'floor'
  , 'ceil'
  , 'fract'
  , 'mod'
  , 'min'
  , 'max'
  , 'clamp'
  , 'mix'
  , 'step'
  , 'smoothstep'
  , 'length'
  , 'distance'
  , 'dot'
  , 'cross'
  , 'normalize'
  , 'faceforward'
  , 'reflect'
  , 'refract'
  , 'matrixCompMult'
  , 'lessThan'
  , 'lessThanEqual'
  , 'greaterThan'
  , 'greaterThanEqual'
  , 'equal'
  , 'notEqual'
  , 'any'
  , 'all'
  , 'not'
  , 'texture2D'
  , 'texture2DProj'
  , 'texture2DLod'
  , 'texture2DProjLod'
  , 'textureCube'
  , 'textureCubeLod'
]

},{}],45:[function(require,module,exports){
module.exports = [
  // current
    'precision'
  , 'highp'
  , 'mediump'
  , 'lowp'
  , 'attribute'
  , 'const'
  , 'uniform'
  , 'varying'
  , 'break'
  , 'continue'
  , 'do'
  , 'fo'+'r'
  , 'whi'+'le'
  , 'i'+'f'
  , 'else'
  , 'in'
  , 'out'
  , 'inout'
  , 'float'
  , 'int'
  , 'void'
  , 'bool'
  , 'true'
  , 'false'
  , 'discard'
  , 'return'
  , 'mat2'
  , 'mat3'
  , 'mat4'
  , 'vec2'
  , 'vec3'
  , 'vec4'
  , 'ivec2'
  , 'ivec3'
  , 'ivec4'
  , 'bvec2'
  , 'bvec3'
  , 'bvec4'
  , 'sampler1D'
  , 'sampler2D'
  , 'sampler3D'
  , 'samplerCube'
  , 'sampler1DShadow'
  , 'sampler2DShadow'
  , 'struct'

  // future
  , 'asm'
  , 'class'
  , 'union'
  , 'enum'
  , 'typedef'
  , 'template'
  , 'this'
  , 'packed'
  , 'goto'
  , 'switch'
  , 'default'
  , 'inline'
  , 'noinline'
  , 'volatile'
  , 'public'
  , 'static'
  , 'extern'
  , 'external'
  , 'interface'
  , 'long'
  , 'short'
  , 'double'
  , 'half'
  , 'fixed'
  , 'unsigned'
  , 'input'
  , 'output'
  , 'hvec2'
  , 'hvec3'
  , 'hvec4'
  , 'dvec2'
  , 'dvec3'
  , 'dvec4'
  , 'fvec2'
  , 'fvec3'
  , 'fvec4'
  , 'sampler2DRect'
  , 'sampler3DRect'
  , 'sampler2DRectShadow'
  , 'sizeof'
  , 'cast'
  , 'namespace'
  , 'using'
]

},{}],46:[function(require,module,exports){
module.exports = [
    '<<='
  , '>>='
  , '++'
  , '--'
  , '<<'
  , '>>'
  , '<='
  , '>='
  , '=='
  , '!='
  , '&&'
  , '||'
  , '+='
  , '-='
  , '*='
  , '/='
  , '%='
  , '&='
  , '^='
  , '|='
  , '('
  , ')'
  , '['
  , ']'
  , '.'
  , '!'
  , '~'
  , '*'
  , '/'
  , '%'
  , '+'
  , '-'
  , '<'
  , '>'
  , '&'
  , '^'
  , '|'
  , '?'
  , ':'
  , '='
  , ','
  , ';'
  , '{'
  , '}'
]

},{}],47:[function(require,module,exports){
var through;

through = function(write, end) {
  var errors, output;
  output = [];
  errors = [];
  return {
    output: output,
    parser: null,
    write: write,
    end: end,
    process: function(parser, data) {
      this.parser = parser;
      write(data);
      this.flush();
      return this.parser.flush();
    },
    flush: function() {
      end();
      return [output, errors];
    },
    queue: function(obj) {
      var ref;
      if (obj != null) {
        return (ref = this.parser) != null ? ref.write(obj) : void 0;
      }
    },
    emit: function(type, node) {
      if (type === 'data') {
        if (node.parent == null) {
          output.push(node);
        }
      }
      if (type === 'error') {
        return errors.push(node);
      }
    }
  };
};

module.exports = through;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3poYW5naG9uZ2JvL215ZG9jdW1lbnQvZGVtby9ub2RlanMvYWZyYW1lLW1hdGhib3gvdmVuZG9yL3NoYWRlcmdyYXBoL3ZlbmRvci90aHJvdWdoLmNvZmZlZSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ2hvbmdiby9teWRvY3VtZW50L2RlbW8vbm9kZWpzL2FmcmFtZS1tYXRoYm94L3ZlbmRvci9zaGFkZXJncmFwaC92ZW5kb3IvdGhyb3VnaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBQTs7QUFBQSxPQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsR0FBUjtBQUNSLE1BQUE7RUFBQSxNQUFBLEdBQVM7RUFDVCxNQUFBLEdBQVM7U0FFVDtJQUFBLE1BQUEsRUFBUSxNQUFSO0lBQ0EsTUFBQSxFQUFRLElBRFI7SUFFQSxLQUFBLEVBQU8sS0FGUDtJQUdBLEdBQUEsRUFBSyxHQUhMO0lBS0EsT0FBQSxFQUFTLFNBQUMsTUFBRCxFQUFVLElBQVY7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUNSLEtBQUEsQ0FBTSxJQUFOO01BQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFBO0lBSE8sQ0FMVDtJQVVBLEtBQUEsRUFBTyxTQUFBO01BQ0wsR0FBQSxDQUFBO2FBQ0EsQ0FBQyxNQUFELEVBQVMsTUFBVDtJQUZLLENBVlA7SUFlQSxLQUFBLEVBQU8sU0FBQyxHQUFEO0FBQ0wsVUFBQTtNQUFBLElBQXNCLFdBQXRCO2dEQUFPLENBQUUsS0FBVCxDQUFlLEdBQWYsV0FBQTs7SUFESyxDQWZQO0lBbUJBLElBQUEsRUFBTSxTQUFDLElBQUQsRUFBTyxJQUFQO01BQ0osSUFBRyxJQUFBLEtBQVEsTUFBWDtRQUNFLElBQUksbUJBQUo7VUFDRSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosRUFERjtTQURGOztNQUdBLElBQUcsSUFBQSxLQUFRLE9BQVg7ZUFDRSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosRUFERjs7SUFKSSxDQW5CTjs7QUFKUTs7QUE4QlYsTUFBTSxDQUFDLE9BQVAsR0FBaUIifQ==

},{}]},{},[28])