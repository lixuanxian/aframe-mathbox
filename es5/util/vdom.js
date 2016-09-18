var HEAP, Types, apply, createClass, descriptor, element, hint, id, j, key, len, map, mount, prop, recycle, ref1, set, unmount, unset;

HEAP = [];

id = 0;

Types = {

  /*
   * el('example', props, children);
  example: MathBox.DOM.createClass({
    render: (el, props, children) ->
       * VDOM node
      return el('span', { className: "foo" }, "Hello World")
  })
   */
};

descriptor = function() {
  return {
    id: id++,
    type: null,
    props: null,
    children: null,
    rendered: null,
    instance: null
  };
};

hint = function(n) {
  var i, j, ref1, results;
  n *= 2;
  n = Math.max(0, HEAP.length - n);
  results = [];
  for (i = j = 0, ref1 = n; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
    results.push(HEAP.push(descriptor()));
  }
  return results;
};

element = function(type, props, children) {
  var el;
  el = HEAP.length ? HEAP.pop() : descriptor();
  el.type = type != null ? type : 'div';
  el.props = props != null ? props : null;
  el.children = children != null ? children : null;
  return el;
};

recycle = function(el) {
  var child, children, j, len;
  if (!el.type) {
    return;
  }
  children = el.children;
  el.type = el.props = el.children = el.instance = null;
  HEAP.push(el);
  if (children != null) {
    for (j = 0, len = children.length; j < len; j++) {
      child = children[j];
      recycle(child);
    }
  }
};

apply = function(el, last, node, parent, index) {
  var base, child, childNodes, children, comp, dirty, i, j, k, key, l, len, len1, nextChildren, nextProps, nextState, prevProps, prevState, props, ref, ref1, ref2, ref3, ref4, ref5, same, should, type, v, value;
  if (el != null) {
    if (last == null) {
      return mount(el, parent, index);
    } else {
      if (el instanceof Node) {
        same = el === last;
        if (same) {
          return;
        }
      } else {
        same = typeof el === typeof last && last !== null && el !== null && el.type === last.type;
      }
      if (!same) {
        unmount(last.instance, node);
        node.remove();
        return mount(el, parent, index);
      } else {
        el.instance = last.instance;
        type = ((ref1 = el.type) != null ? ref1.isComponentClass : void 0) ? el.type : Types[el.type];
        props = last != null ? last.props : void 0;
        nextProps = el.props;
        children = (ref2 = last != null ? last.children : void 0) != null ? ref2 : null;
        nextChildren = el.children;
        if (nextProps != null) {
          nextProps.children = nextChildren;
        }
        if (type != null) {
          dirty = node._COMPONENT_DIRTY;
          if ((props != null) !== (nextProps != null)) {
            dirty = true;
          }
          if (children !== nextChildren) {
            dirty = true;
          }
          if ((props != null) && (nextProps != null)) {
            if (!dirty) {
              for (key in props) {
                if (!nextProps.hasOwnProperty(key)) {
                  dirty = true;
                }
              }
            }
            if (!dirty) {
              for (key in nextProps) {
                value = nextProps[key];
                if ((ref = props[key]) !== value) {
                  dirty = true;
                }
              }
            }
          }
          if (dirty) {
            comp = last.instance;
            if (el.props == null) {
              el.props = {};
            }
            ref3 = comp.defaultProps;
            for (k in ref3) {
              v = ref3[k];
              if ((base = el.props)[k] == null) {
                base[k] = v;
              }
            }
            el.props.children = el.children;
            if (typeof comp.willReceiveProps === "function") {
              comp.willReceiveProps(el.props);
            }
            should = node._COMPONENT_FORCE || ((ref4 = typeof comp.shouldUpdate === "function" ? comp.shouldUpdate(el.props) : void 0) != null ? ref4 : true);
            if (should) {
              nextState = comp.getNextState();
              if (typeof comp.willUpdate === "function") {
                comp.willUpdate(el.props, nextState);
              }
            }
            prevProps = comp.props;
            prevState = comp.applyNextState();
            comp.props = el.props;
            comp.children = el.children;
            if (should) {
              el = el.rendered = typeof comp.render === "function" ? comp.render(element, el.props, el.children) : void 0;
              apply(el, last.rendered, node, parent, index);
              if (typeof comp.didUpdate === "function") {
                comp.didUpdate(prevProps, prevState);
              }
            }
          }
          return;
        } else {
          if (props != null) {
            for (key in props) {
              if (!nextProps.hasOwnProperty(key)) {
                unset(node, key, props[key]);
              }
            }
          }
          if (nextProps != null) {
            for (key in nextProps) {
              value = nextProps[key];
              if ((ref = props[key]) !== value && key !== 'children') {
                set(node, key, value, ref);
              }
            }
          }
          if (nextChildren != null) {
            if ((ref5 = typeof nextChildren) === 'string' || ref5 === 'number') {
              if (nextChildren !== children) {
                node.textContent = nextChildren;
              }
            } else {
              if (nextChildren.type != null) {
                apply(nextChildren, children, node.childNodes[0], node, 0);
              } else {
                childNodes = node.childNodes;
                if (children != null) {
                  for (i = j = 0, len = nextChildren.length; j < len; i = ++j) {
                    child = nextChildren[i];
                    apply(child, children[i], childNodes[i], node, i);
                  }
                } else {
                  for (i = l = 0, len1 = nextChildren.length; l < len1; i = ++l) {
                    child = nextChildren[i];
                    apply(child, null, childNodes[i], node, i);
                  }
                }
              }
            }
          } else if (children != null) {
            unmount(null, node);
            node.innerHTML = '';
          }
        }
        return;
      }
    }
  }
  if (last != null) {
    unmount(last.instance, node);
    return last.node.remove();
  }
};

mount = function(el, parent, index) {
  var base, child, children, comp, ctor, i, j, k, key, len, node, ref1, ref2, ref3, ref4, ref5, ref6, type, v, value;
  if (index == null) {
    index = 0;
  }
  type = ((ref1 = el.type) != null ? ref1.isComponentClass : void 0) ? el.type : Types[el.type];
  if (el instanceof Node) {
    node = el;
  } else {
    if (type != null) {
      ctor = ((ref2 = el.type) != null ? ref2.isComponentClass : void 0) ? el.type : Types[el.type];
      if (!ctor) {
        el = el.rendered = element('noscript');
        node = mount(el, parent, index);
        return node;
      }
      el.instance = comp = new ctor(parent);
      if (el.props == null) {
        el.props = {};
      }
      ref3 = comp.defaultProps;
      for (k in ref3) {
        v = ref3[k];
        if ((base = el.props)[k] == null) {
          base[k] = v;
        }
      }
      el.props.children = el.children;
      comp.props = el.props;
      comp.children = el.children;
      comp.setState(typeof comp.getInitialState === "function" ? comp.getInitialState() : void 0);
      if (typeof comp.willMount === "function") {
        comp.willMount();
      }
      el = el.rendered = typeof comp.render === "function" ? comp.render(element, el.props, el.children) : void 0;
      node = mount(el, parent, index);
      if (typeof comp.didMount === "function") {
        comp.didMount(el);
      }
      node._COMPONENT = comp;
      return node;
    } else if ((ref4 = typeof el) === 'string' || ref4 === 'number') {
      node = document.createTextNode(el);
    } else {
      node = document.createElement(el.type);
      ref5 = el.props;
      for (key in ref5) {
        value = ref5[key];
        set(node, key, value);
      }
    }
    children = el.children;
    if (children != null) {
      if ((ref6 = typeof children) === 'string' || ref6 === 'number') {
        node.textContent = children;
      } else {
        if (children.type != null) {
          mount(children, node, 0);
        } else {
          for (i = j = 0, len = children.length; j < len; i = ++j) {
            child = children[i];
            mount(child, node, i);
          }
        }
      }
    }
  }
  parent.insertBefore(node, parent.childNodes[index]);
  return node;
};

unmount = function(comp, node) {
  var child, j, k, len, ref1, results;
  if (comp) {
    if (typeof comp.willUnmount === "function") {
      comp.willUnmount();
    }
    for (k in comp) {
      delete comp[k];
    }
  }
  ref1 = node.childNodes;
  results = [];
  for (j = 0, len = ref1.length; j < len; j++) {
    child = ref1[j];
    unmount(child._COMPONENT, child);
    results.push(delete child._COMPONENT);
  }
  return results;
};

prop = function(key) {
  var j, len, prefix, prefixes;
  if (typeof document === 'undefined') {
    return true;
  }
  if (document.documentElement.style[key] != null) {
    return key;
  }
  key = key[0].toUpperCase() + key.slice(1);
  prefixes = ['webkit', 'moz', 'ms', 'o'];
  for (j = 0, len = prefixes.length; j < len; j++) {
    prefix = prefixes[j];
    if (document.documentElement.style[prefix + key] != null) {
      return prefix + key;
    }
  }
};

map = {};

ref1 = ['transform'];
for (j = 0, len = ref1.length; j < len; j++) {
  key = ref1[j];
  map[key] = prop(key);
}

set = function(node, key, value, orig) {
  var k, ref2, v;
  if (key === 'style') {
    for (k in value) {
      v = value[k];
      if ((orig != null ? orig[k] : void 0) !== v) {
        node.style[(ref2 = map[k]) != null ? ref2 : k] = v;
      }
    }
    return;
  }
  if (node[key] != null) {
    node[key] = value;
    return;
  }
  if (node instanceof Node) {
    node.setAttribute(key, value);
  }
};

unset = function(node, key, orig) {
  var k, ref2, v;
  if (key === 'style') {
    for (k in orig) {
      v = orig[k];
      node.style[(ref2 = map[k]) != null ? ref2 : k] = '';
    }
    return;
  }
  if (node[key] != null) {
    node[key] = void 0;
  }
  if (node instanceof Node) {
    node.removeAttribute(key);
  }
};

createClass = function(prototype) {
  var Component, a, aliases, b, ref2;
  aliases = {
    willMount: 'componentWillMount',
    didMount: 'componentDidMount',
    willReceiveProps: 'componentWillReceiveProps',
    shouldUpdate: 'shouldComponentUpdate',
    willUpdate: 'componentWillUpdate',
    didUpdate: 'componentDidUpdate',
    willUnmount: 'componentWillUnmount'
  };
  for (a in aliases) {
    b = aliases[a];
    if (prototype[a] == null) {
      prototype[a] = prototype[b];
    }
  }
  Component = (function() {
    function Component(node, props1, state1, children1) {
      var bind, k, nextState, v;
      this.props = props1 != null ? props1 : {};
      this.state = state1 != null ? state1 : null;
      this.children = children1 != null ? children1 : null;
      bind = function(f, self) {
        if (typeof f === 'function') {
          return f.bind(self);
        } else {
          return f;
        }
      };
      for (k in prototype) {
        v = prototype[k];
        this[k] = bind(v, this);
      }
      nextState = null;
      this.setState = function(state) {
        if (nextState == null) {
          nextState = state ? nextState != null ? nextState : {} : null;
        }
        for (k in state) {
          v = state[k];
          nextState[k] = v;
        }
        node._COMPONENT_DIRTY = true;
      };
      this.forceUpdate = function() {
        var el, results;
        node._COMPONENT_FORCE = node._COMPONENT_DIRTY = true;
        el = node;
        results = [];
        while (el = el.parentNode) {
          if (el._COMPONENT) {
            results.push(el._COMPONENT_FORCE = true);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      this.getNextState = function() {
        return nextState;
      };
      this.applyNextState = function() {
        var prevState, ref2;
        node._COMPONENT_FORCE = node._COMPONENT_DIRTY = false;
        prevState = this.state;
        ref2 = [null, nextState], nextState = ref2[0], this.state = ref2[1];
        return prevState;
      };
      return;
    }

    return Component;

  })();
  Component.isComponentClass = true;
  Component.prototype.defaultProps = (ref2 = typeof prototype.getDefaultProps === "function" ? prototype.getDefaultProps() : void 0) != null ? ref2 : {};
  return Component;
};

module.exports = {
  element: element,
  recycle: recycle,
  apply: apply,
  hint: hint,
  Types: Types,
  createClass: createClass
};
