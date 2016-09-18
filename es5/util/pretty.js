var NUMBER_PRECISION, NUMBER_THRESHOLD, checkFactor, checkUnit, escapeHTML, formatFactors, formatFraction, formatMultiple, formatPrimes, prettyFormat, prettyJSXBind, prettyJSXPair, prettyJSXProp, prettyMarkup, prettyNumber, prettyPrint;

NUMBER_PRECISION = 5;

NUMBER_THRESHOLD = 0.0001;

checkFactor = function(v, f) {
  return Math.abs(v / f - Math.round(v / f)) < NUMBER_THRESHOLD;
};

checkUnit = function(v) {
  return checkFactor(v, 1);
};

formatMultiple = function(v, f, k, compact) {
  var d;
  d = Math.round(v / f);
  if (d === 1) {
    return "" + k;
  }
  if (d === -1) {
    return "-" + k;
  }
  if (k === '1') {
    return "" + d;
  }
  if (compact) {
    return "" + d + k;
  } else {
    return d + "*" + k;
  }
};

formatFraction = function(v, f, k, compact) {
  var d;
  d = Math.round(v * f);
  if (Math.abs(d) === 1) {
    d = d < 0 ? "-" : "";
    d += k;
  } else if (k !== '1') {
    d += compact ? "" + k : "*" + k;
  }
  return d + "/" + f;
};

formatFactors = [
  {
    1: 1
  }, {
    1: 1,
    τ: Math.PI * 2
  }, {
    1: 1,
    π: Math.PI
  }, {
    1: 1,
    τ: Math.PI * 2,
    π: Math.PI
  }, {
    1: 1,
    e: Math.E
  }, {
    1: 1,
    τ: Math.PI * 2,
    e: Math.E
  }, {
    1: 1,
    π: Math.PI,
    e: Math.E
  }, {
    1: 1,
    τ: Math.PI * 2,
    π: Math.PI,
    e: Math.E
  }
];

formatPrimes = [[2 * 2 * 3 * 5 * 7, [2, 3, 5, 7]], [2 * 2 * 2 * 3 * 3 * 5 * 5 * 7 * 7, [2, 3, 5, 7]], [2 * 2 * 3 * 5 * 7 * 11 * 13, [2, 3, 5, 7, 11, 13]], [2 * 2 * 17 * 19 * 23 * 29, [2, 17, 19, 23, 29]], [256 * 256, [2]], [1000000, [2, 5]]];

prettyNumber = function(options) {
  var cache, cacheIndex, compact, e, formatIndex, numberCache, pi, precision, tau, threshold;
  if (options) {
    cache = options.cache, compact = options.compact, tau = options.tau, pi = options.pi, e = options.e, threshold = options.threshold, precision = options.precision;
  }
  compact = +(!!(compact != null ? compact : true));
  tau = +(!!(tau != null ? tau : true));
  pi = +(!!(pi != null ? pi : true));
  e = +(!!(e != null ? e : true));
  cache = +(!!(cache != null ? cache : true));
  threshold = +(threshold != null ? threshold : NUMBER_THRESHOLD);
  precision = +(precision != null ? precision : NUMBER_PRECISION);
  formatIndex = tau + pi * 2 + e * 4;
  cacheIndex = formatIndex + threshold + precision;
  numberCache = cache ? {} : null;
  return function(v) {
    var best, cached, d, denom, f, i, j, k, len, len1, list, match, n, numer, out, p, ref, ref1;
    if (numberCache != null) {
      if ((cached = numberCache[v]) != null) {
        return cached;
      }
      if (v === Math.round(v)) {
        return numberCache[v] = "" + v;
      }
    }
    out = "" + v;
    best = out.length + out.indexOf('.') + 2;
    match = function(x) {
      var d;
      d = x.length;
      if (d <= best) {
        out = "" + x;
        return best = d;
      }
    };
    ref = formatFactors[formatIndex];
    for (k in ref) {
      f = ref[k];
      if (checkUnit(v / f)) {
        match("" + (formatMultiple(v / f, 1, k, compact)));
      } else {
        for (i = 0, len = formatPrimes.length; i < len; i++) {
          ref1 = formatPrimes[i], denom = ref1[0], list = ref1[1];
          numer = v / f * denom;
          if (checkUnit(numer)) {
            for (j = 0, len1 = list.length; j < len1; j++) {
              p = list[j];
              while (checkUnit(n = numer / p) && checkUnit(d = denom / p)) {
                numer = n;
                denom = d;
              }
            }
            match("" + (formatFraction(v / f, denom, k, compact)));
            break;
          }
        }
      }
    }
    if (("" + v).length > NUMBER_PRECISION) {
      match("" + (v.toPrecision(NUMBER_PRECISION)));
    }
    if (numberCache != null) {
      numberCache[v] = out;
    }
    return out;
  };
};

prettyPrint = function(markup, level) {
  if (level == null) {
    level = 'info';
  }
  markup = prettyMarkup(markup);
  return console[level].apply(console, markup);
};

prettyMarkup = function(markup) {
  var args, attr, nested, obj, quoted, str, tag, txt;
  tag = 'color:rgb(128,0,128)';
  attr = 'color:rgb(144,64,0)';
  str = 'color:rgb(0,0,192)';
  obj = 'color:rgb(0,70,156)';
  txt = 'color:inherit';
  quoted = false;
  nested = 0;
  args = [];
  markup = markup.replace(/(\\[<={}> "'])|(=>|[<={}> "'])/g, function(_, escape, char) {
    var res;
    if (escape != null ? escape.length : void 0) {
      return escape;
    }
    if (quoted && (char !== '"' && char !== "'")) {
      return char;
    }
    if (nested && (char !== '"' && char !== "'" && char !== '{' && char !== "}")) {
      return char;
    }
    return res = (function() {
      switch (char) {
        case '<':
          args.push(tag);
          return "%c<";
        case '>':
          args.push(tag);
          args.push(txt);
          return "%c>%c";
        case ' ':
          args.push(attr);
          return " %c";
        case '=':
        case '=>':
          args.push(tag);
          return "%c" + char;
        case '"':
        case "'":
          quoted = !quoted;
          if (quoted) {
            args.push(nested ? attr : str);
            return char + "%c";
          } else {
            args.push(nested ? obj : tag);
            return "%c" + char;
          }
          break;
        case '{':
          if (nested++ === 0) {
            args.push(obj);
            return "%c" + char;
          } else {
            return char;
          }
          break;
        case '}':
          if (--nested === 0) {
            args.push(tag);
            return char + "%c";
          } else {
            return char;
          }
          break;
        default:
          return char;
      }
    })();
  });
  return [markup].concat(args);
};

prettyJSXProp = function(k, v) {
  return prettyJSXPair(k, v, '=');
};

prettyJSXBind = function(k, v) {
  return prettyJSXPair(k, v, '=>');
};

prettyJSXPair = (function() {
  var formatNumber;
  formatNumber = prettyNumber({
    compact: false
  });
  return function(k, v, op) {
    var key, value, wrap;
    key = function(k) {
      if ((k === "" + +k) || k.match(/^[A-Za-z_][A-Za-z0-9]*$/)) {
        return k;
      } else {
        return JSON.stringify(k);
      }
    };
    wrap = function(v) {
      if (v.match('\n*"')) {
        return v;
      } else {
        return "{" + v + "}";
      }
    };
    value = function(v) {
      var kk, vv;
      if (v instanceof Array) {
        return "[" + (v.map(value).join(', ')) + "]";
      }
      switch (typeof v) {
        case 'string':
          if (v.match("\n")) {
            return "\"\n" + v + "\"\n";
          } else {
            return "\"" + v + "\"";
          }
          break;
        case 'function':
          v = "" + v;
          if (v.match("\n")) {
            "\n" + v + "\n";
          } else {
            "" + v;
          }
          v = v.replace(/^function (\([^)]+\))/, "$1 =>");
          return v = v.replace(/^(\([^)]+\)) =>\s*{\s*return\s*([^}]+)\s*;\s*}/, "$1 => $2");
        case 'number':
          return formatNumber(v);
        default:
          if ((v != null) && v !== !!v) {
            if (v._up != null) {
              return value(v.map(function(v) {
                return v;
              }));
            }
            if (v.toMarkup) {
              return v.toString();
            } else {
              return "{" + ((function() {
                var results;
                results = [];
                for (kk in v) {
                  vv = v[kk];
                  if (v.hasOwnProperty(kk)) {
                    results.push((key(kk)) + ": " + (value(vv)));
                  }
                }
                return results;
              })()).join(", ") + "}";
            }
          } else {
            return "" + (JSON.stringify(v));
          }
      }
    };
    return [k, op, wrap(value(v))].join('');
  };
})();

escapeHTML = function(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  return str = str.replace(/"/g, '&quot;');
};

prettyFormat = function(str) {
  var arg, args, i, len, out;
  args = [].slice.call(arguments);
  args.shift();
  out = "<span>";
  str = escapeHTML(str);
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    str = str.replace(/%([a-z])/, function(_, f) {
      var v;
      v = args.shift();
      switch (f) {
        case 'c':
          return "</span><span style=\"" + (escapeHTML(v)) + "\">";
        default:
          return escapeHTML(v);
      }
    });
  }
  out += str;
  return out += "</span>";
};

module.exports = {
  markup: prettyMarkup,
  number: prettyNumber,
  print: prettyPrint,
  format: prettyFormat,
  JSX: {
    prop: prettyJSXProp,
    bind: prettyJSXBind
  }
};


/*
for x in [1, 2, 1/2, 3, 1/3, Math.PI, Math.PI / 2, Math.PI * 2, Math.PI * 3, Math.PI * 4, Math.PI * 3 / 4, Math.E * 100, Math.E / 100]
  console.log prettyNumber({})(x)
 */
