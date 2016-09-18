var Parent, Present, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parent = require('../base/parent');

Util = require('../../../util');

Present = (function(superClass) {
  extend(Present, superClass);

  function Present() {
    return Present.__super__.constructor.apply(this, arguments);
  }

  Present.traits = ['node', 'present'];

  Present.prototype.init = function() {};

  Present.prototype.make = function() {
    this.nodes = [];
    this.steps = [];
    this.length = 0;
    this.last = [];
    this.index = 0;
    this.dirty = [];
    this._listen('root', 'root.update', this.update);
    return this._compute('present.length', (function(_this) {
      return function() {
        return _this.length;
      };
    })(this));
  };

  Present.prototype.adopt = function(controller) {
    var node;
    node = controller.node;
    if (this.nodes.indexOf(controller) < 0) {
      this.nodes.push(node);
    }
    return this.dirty.push(controller);
  };

  Present.prototype.unadopt = function(controller) {
    var node;
    node = controller.node;
    this.nodes = this.nodes.filter(function(x) {
      return x !== controller;
    });
    return this.dirty.push(controller);
  };

  Present.prototype.update = function() {
    var controller, j, len, ref1, ref2;
    if (!this.dirty.length) {
      return;
    }
    ref1 = this.dirty;
    for (j = 0, len = ref1.length; j < len; j++) {
      controller = ref1[j];
      this.slideReset(controller);
    }
    ref2 = this.process(this.nodes), this.steps = ref2[0], this.indices = ref2[1];
    this.length = this.steps.length;
    this.index = null;
    this.go(this.props.index);
    return this.dirty = [];
  };

  Present.prototype.slideLatch = function(controller, enabled, step) {
    return controller.slideLatch(enabled, step);
  };

  Present.prototype.slideStep = function(controller, index, step) {
    return controller.slideStep(this.mapIndex(controller, index), step);
  };

  Present.prototype.slideRelease = function(controller, step) {
    return controller.slideRelease();
  };

  Present.prototype.slideReset = function(controller) {
    return controller.slideReset();
  };

  Present.prototype.mapIndex = function(controller, index) {
    return index - this.indices[controller.node._id];
  };

  Present.prototype.process = function(nodes) {
    var dedupe, expand, finalize, isSibling, isSlide, order, parents, paths, slides, split, steps, traverse;
    slides = function(nodes) {
      var el, j, len, results;
      results = [];
      for (j = 0, len = nodes.length; j < len; j++) {
        el = nodes[j];
        results.push(parents(el).filter(isSlide));
      }
      return results;
    };
    traverse = function(map) {
      return function(el) {
        var ref, ref1, results;
        results = [];
        while (el && (ref1 = [map(el), el], el = ref1[0], ref = ref1[1], ref1)) {
          results.push(ref);
        }
        return results;
      };
    };
    parents = traverse(function(el) {
      if (el.parent.traits.hash.present) {
        return null;
      } else {
        return el.parent;
      }
    });
    isSlide = function(el) {
      return nodes.indexOf(el) >= 0;
    };
    isSibling = function(a, b) {
      var c, d, e, i, j, ref1;
      c = a.length;
      d = b.length;
      e = c - d;
      if (e !== 0) {
        return false;
      }
      e = Math.min(c, d);
      for (i = j = ref1 = e - 1; ref1 <= 0 ? j < 0 : j > 0; i = ref1 <= 0 ? ++j : --j) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    };
    order = function(paths) {
      return paths.sort(function(a, b) {
        var c, d, e, f, g, i, j, nodeA, nodeB, ref1;
        c = a.length;
        d = b.length;
        e = Math.min(c, d);
        for (i = j = 1, ref1 = e; 1 <= ref1 ? j <= ref1 : j >= ref1; i = 1 <= ref1 ? ++j : --j) {
          nodeA = a[c - i];
          nodeB = b[d - i];
          f = nodeA.props.order;
          g = nodeB.props.order;
          if ((f != null) || (g != null)) {
            if ((f != null) && (g != null) && ((e = f - g) !== 0)) {
              return e;
            }
            if (f != null) {
              return -1;
            }
            if (g != null) {
              return 1;
            }
          }
          if (nodeB.order !== nodeA.order) {
            return nodeB.order - nodeA.order;
          }
        }
        e = c - d;
        if (e !== 0) {
          return e;
        }
        return 0;
      });
    };
    split = function(steps) {
      var absolute, j, len, node, relative, step;
      relative = [];
      absolute = [];
      for (j = 0, len = steps.length; j < len; j++) {
        step = steps[j];
        ((node = step[0]).props.steps != null ? relative : absolute).push(step);
      }
      return [relative, absolute];
    };
    expand = function(lists) {
      var absolute, i, indices, j, k, len, len1, limit, relative, slide, step, steps;
      relative = lists[0], absolute = lists[1];
      limit = 100;
      indices = {};
      steps = [];
      slide = function(step, index) {
        var childIndex, from, i, j, name, node, parent, parentIndex, props, ref1, ref2, to;
        props = (node = step[0]).props;
        parent = step[1];
        parentIndex = parent != null ? indices[parent._id] : 0;
        childIndex = index;
        from = props.from != null ? parentIndex + props.from : childIndex - props.early;
        to = props.to != null ? parentIndex + props.to : childIndex + props.steps + props.late;
        from = Math.max(0, from);
        to = Math.min(limit, to);
        if (indices[name = node._id] == null) {
          indices[name] = from;
        }
        for (i = j = ref1 = from, ref2 = to; ref1 <= ref2 ? j < ref2 : j > ref2; i = ref1 <= ref2 ? ++j : --j) {
          steps[i] = (steps[i] != null ? steps[i] : steps[i] = []).concat(step);
        }
        return props.steps;
      };
      i = 0;
      for (j = 0, len = relative.length; j < len; j++) {
        step = relative[j];
        i += slide(step, i);
      }
      for (k = 0, len1 = absolute.length; k < len1; k++) {
        step = absolute[k];
        slide(step, 0);
      }
      steps = (function() {
        var l, len2, results;
        results = [];
        for (l = 0, len2 = steps.length; l < len2; l++) {
          step = steps[l];
          results.push(finalize(dedupe(step)));
        }
        return results;
      })();
      return [steps, indices];
    };
    dedupe = function(step) {
      var i, j, len, node, results;
      if (step) {
        results = [];
        for (i = j = 0, len = step.length; j < len; i = ++j) {
          node = step[i];
          if (step.indexOf(node) === i) {
            results.push(node);
          }
        }
        return results;
      } else {
        return [];
      }
    };
    finalize = function(step) {
      return step.sort(function(a, b) {
        return a.order - b.order;
      });
    };
    paths = slides(nodes);
    steps = order(paths);
    return expand(split(steps));
  };

  Present.prototype.go = function(index) {
    var active, ascend, descend, enter, exit, j, k, l, last, len, len1, len2, len3, len4, len5, len6, len7, len8, m, n, node, o, p, q, r, ref1, ref2, ref3, ref4, ref5, ref6, ref7, stay, step, toStr;
    index = Math.max(0, Math.min(this.length + 1, +index || 0));
    last = this.last;
    active = (ref1 = this.steps[index - 1]) != null ? ref1 : [];
    step = this.props.directed ? index - this.index : 1;
    this.index = index;
    enter = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = active.length; j < len; j++) {
        node = active[j];
        if (this.last.indexOf(node) < 0) {
          results.push(node);
        }
      }
      return results;
    }).call(this);
    exit = (function() {
      var j, len, ref2, results;
      ref2 = this.last;
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        node = ref2[j];
        if (active.indexOf(node) < 0) {
          results.push(node);
        }
      }
      return results;
    }).call(this);
    stay = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = active.length; j < len; j++) {
        node = active[j];
        if (enter.indexOf(node) < 0 && exit.indexOf(node) < 0) {
          results.push(node);
        }
      }
      return results;
    })();
    ascend = function(nodes) {
      return nodes.sort(function(a, b) {
        return a.order - b.order;
      });
    };
    descend = function(nodes) {
      return nodes.sort(function(a, b) {
        return b.order - a.order;
      });
    };
    toStr = function(x) {
      return x.toString();
    };
    ref2 = ascend(enter);
    for (j = 0, len = ref2.length; j < len; j++) {
      node = ref2[j];
      this.slideLatch(node.controller, true, step);
    }
    ref3 = ascend(stay);
    for (k = 0, len1 = ref3.length; k < len1; k++) {
      node = ref3[k];
      this.slideLatch(node.controller, null, step);
    }
    ref4 = ascend(exit);
    for (l = 0, len2 = ref4.length; l < len2; l++) {
      node = ref4[l];
      this.slideLatch(node.controller, false, step);
    }
    for (m = 0, len3 = enter.length; m < len3; m++) {
      node = enter[m];
      this.slideStep(node.controller, index, step);
    }
    for (n = 0, len4 = stay.length; n < len4; n++) {
      node = stay[n];
      this.slideStep(node.controller, index, step);
    }
    for (o = 0, len5 = exit.length; o < len5; o++) {
      node = exit[o];
      this.slideStep(node.controller, index, step);
    }
    ref5 = descend(enter);
    for (p = 0, len6 = ref5.length; p < len6; p++) {
      node = ref5[p];
      this.slideRelease(node.controller);
    }
    ref6 = descend(stay);
    for (q = 0, len7 = ref6.length; q < len7; q++) {
      node = ref6[q];
      this.slideRelease(node.controller);
    }
    ref7 = descend(exit);
    for (r = 0, len8 = ref7.length; r < len8; r++) {
      node = ref7[r];
      this.slideRelease(node.controller);
    }
    this.last = active;
  };

  Present.prototype.change = function(changed, touched, init) {
    if (changed['present.index'] || init) {
      return this.go(this.props.index);
    }
  };

  return Present;

})(Parent);

module.exports = Present;
