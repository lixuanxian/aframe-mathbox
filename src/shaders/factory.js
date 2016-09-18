var Factory, ShaderGraph;

ShaderGraph = require('../../vendor/shadergraph/src');

Factory = function(snippets) {
  var fetch;
  fetch = function(name) {
    var element, ref, ref1, s, sel;
    s = snippets[name];
    if (s != null) {
      return s;
    }
    ref = (ref1 = name[0]) === '#' || ref1 === '.' || ref1 === ':' || ref1 === '[';
    sel = ref ? name : "#" + name;
    element = document.querySelector(sel);
    if ((element != null) && element.tagName === 'SCRIPT') {
      return element.textContent || element.innerText;
    }
    throw new Error("Unknown shader `" + name + "`");
  };
  return new ShaderGraph(fetch, {
    autoInspect: true
  });
};

module.exports = Factory;
