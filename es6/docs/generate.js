var PrimitiveDefs, Primitives, TraitDefs, def, defaults, defs, description, docs, ex, examples, i, id, index, j, k, key, klass, l, len, len1, len2, len3, m, module, modules, ns, out, prop, props, ref, ref1, ref2, ref3, ref4, ref5, ref6, suffix, titleCase, trait, type, types, v, val;

require('../node');

TraitDefs = require('./traits');

PrimitiveDefs = require('./primitives');

Primitives = require('..//primitives');

defs = {};

titleCase = function(v) {
  return v.slice(0, 1).toUpperCase() + v.slice(1);
};

ref = Primitives.Types.Classes;
for (type in ref) {
  klass = ref[type];
  def = defs[type] = {};
  ref1 = klass.traits;
  for (i = 0, len = ref1.length; i < len; i++) {
    trait = ref1[i];
    ref2 = trait.split(':'), trait = ref2[0], ns = ref2[1];
    suffix = ns != null ? titleCase(ns) : '';
    ref3 = TraitDefs[trait];
    for (k in ref3) {
      v = ref3[k];
      if (TraitDefs[trait] != null) {
        def[k + suffix] = v;
      }
    }
  }
}

docs = {};

index = {};

for (type in defs) {
  def = defs[type];
  ref4 = PrimitiveDefs[type], module = ref4[0], description = ref4[1], examples = ref4[2], defaults = ref4[3];
  id = module + "/" + type;
  out = "####  <a name=\"" + id + "\"></a>`" + id + "`\n\n*" + description + "*\n\n";
  if (index[module] == null) {
    index[module] = [];
  }
  index[module].push(" * [" + type + "](#" + id + ") - " + description);
  props = Object.keys(def);
  props.sort();
  for (j = 0, len1 = props.length; j < len1; j++) {
    key = props[j];
    prop = def[key];
    ex = (ref5 = examples != null ? examples[key] : void 0) != null ? ref5 : prop[3];
    ex = ex ? ", e.g. `" + ex + "`" : "";
    val = (ref6 = defaults != null ? defaults[key] : void 0) != null ? ref6 : prop[2];
    out += " * *" + key + "* = `" + val + "` (" + prop[1] + ") - " + prop[0] + ex + "\n";
  }
  docs[type] = out;
}

console.log("## List of MathBox Primitives\n\n*Grouped by module.*\n");

types = Object.keys(docs);

types.sort();

modules = Object.keys(index);

modules.sort();

for (l = 0, len2 = modules.length; l < len2; l++) {
  module = modules[l];
  console.log("#### " + module + "\n\n");
  console.log(index[module].join("\n"));
  console.log("\n");
}

console.log("\n\n---\n\n### Reference\n\n");

for (m = 0, len3 = types.length; m < len3; m++) {
  type = types[m];
  console.log(docs[type]);
}
