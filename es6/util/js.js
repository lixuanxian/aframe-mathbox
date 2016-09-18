exports.merge = function() {
  var i, k, len, obj, v, x;
  x = {};
  for (i = 0, len = arguments.length; i < len; i++) {
    obj = arguments[i];
    for (k in obj) {
      v = obj[k];
      x[k] = v;
    }
  }
  return x;
};

exports.clone = function(o) {
  return JSON.parse(JSON.serialize(o));
};

exports.parseQuoted = function(str) {
  var accum, char, chunk, i, len, list, munch, quote, token, unescape;
  accum = "";
  unescape = function(str) {
    return str = str.replace(/\\/g, '');
  };
  munch = function(next) {
    if (accum.length) {
      list.push(unescape(accum));
    }
    return accum = next != null ? next : "";
  };
  str = str.split(/(?=(?:\\.|["' ,]))/g);
  quote = false;
  list = [];
  for (i = 0, len = str.length; i < len; i++) {
    chunk = str[i];
    char = chunk[0];
    token = chunk.slice(1);
    switch (char) {
      case '"':
      case "'":
        if (quote) {
          if (quote === char) {
            quote = false;
            munch(token);
          } else {
            accum += chunk;
          }
        } else {
          if (accum !== '') {
            throw new Error("ParseError: String `" + str + "` does not contain comma-separated quoted tokens.");
          }
          quote = char;
          accum += token;
        }
        break;
      case ' ':
      case ',':
        if (!quote) {
          munch(token);
        } else {
          accum += chunk;
        }
        break;
      default:
        accum += chunk;
    }
  }
  munch();
  return list;
};
