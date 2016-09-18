var getSizes;

exports.getSizes = getSizes = function(data) {
  var array, sizes;
  sizes = [];
  array = data;
  while (typeof array !== 'string' && ((array != null ? array.length : void 0) != null)) {
    sizes.push(array.length);
    array = array[0];
  }
  return sizes;
};

exports.getDimensions = function(data, spec) {
  var channels, depth, dims, height, items, levels, n, nesting, ref, ref1, ref2, ref3, ref4, sizes, width;
  if (spec == null) {
    spec = {};
  }
  items = spec.items, channels = spec.channels, width = spec.width, height = spec.height, depth = spec.depth;
  dims = {};
  if (!data || !data.length) {
    return {
      items: items,
      channels: channels,
      width: width != null ? width : 0,
      height: height != null ? height : 0,
      depth: depth != null ? depth : 0
    };
  }
  sizes = getSizes(data);
  nesting = sizes.length;
  dims.channels = channels !== 1 && sizes.length > 1 ? sizes.pop() : channels;
  dims.items = items !== 1 && sizes.length > 1 ? sizes.pop() : items;
  dims.width = width !== 1 && sizes.length > 1 ? sizes.pop() : width;
  dims.height = height !== 1 && sizes.length > 1 ? sizes.pop() : height;
  dims.depth = depth !== 1 && sizes.length > 1 ? sizes.pop() : depth;
  levels = nesting;
  if (channels === 1) {
    levels++;
  }
  if (items === 1 && levels > 1) {
    levels++;
  }
  if (width === 1 && levels > 2) {
    levels++;
  }
  if (height === 1 && levels > 3) {
    levels++;
  }
  n = (ref = sizes.pop()) != null ? ref : 1;
  if (levels <= 1) {
    n /= (ref1 = dims.channels) != null ? ref1 : 1;
  }
  if (levels <= 2) {
    n /= (ref2 = dims.items) != null ? ref2 : 1;
  }
  if (levels <= 3) {
    n /= (ref3 = dims.width) != null ? ref3 : 1;
  }
  if (levels <= 4) {
    n /= (ref4 = dims.height) != null ? ref4 : 1;
  }
  n = Math.floor(n);
  if (dims.width == null) {
    dims.width = n;
    n = 1;
  }
  if (dims.height == null) {
    dims.height = n;
    n = 1;
  }
  if (dims.depth == null) {
    dims.depth = n;
    n = 1;
  }
  return dims;
};

exports.repeatCall = function(call, times) {
  switch (times) {
    case 0:
      return function() {
        return true;
      };
    case 1:
      return function() {
        return call();
      };
    case 2:
      return function() {
        call();
        return call();
      };
    case 3:
      return function() {
        call();
        call();
        call();
        return call();
      };
    case 4:
      return function() {
        call();
        call();
        call();
        return call();
      };
    case 6:
      return function() {
        call();
        call();
        call();
        call();
        call();
        return call();
      };
    case 8:
      return function() {
        call();
        call();
        call();
        call();
        call();
        return call();
      };
  }
};

exports.makeEmitter = function(thunk, items, channels) {
  var inner, n, next, outer;
  inner = (function() {
    switch (channels) {
      case 0:
        return function() {
          return true;
        };
      case 1:
        return function(emit) {
          return emit(thunk());
        };
      case 2:
        return function(emit) {
          return emit(thunk(), thunk());
        };
      case 3:
        return function(emit) {
          return emit(thunk(), thunk(), thunk());
        };
      case 4:
        return function(emit) {
          return emit(thunk(), thunk(), thunk(), thunk());
        };
      case 6:
        return function(emit) {
          return emit(thunk(), thunk(), thunk(), thunk(), thunk(), thunk());
        };
      case 8:
        return function(emit) {
          return emit(thunk(), thunk(), thunk(), thunk(), thunk(), thunk(), thunk(), thunk());
        };
    }
  })();
  next = null;
  while (items > 0) {
    n = Math.min(items, 8);
    outer = (function() {
      switch (n) {
        case 1:
          return function(emit) {
            return inner(emit);
          };
        case 2:
          return function(emit) {
            inner(emit);
            return inner(emit);
          };
        case 3:
          return function(emit) {
            inner(emit);
            inner(emit);
            return inner(emit);
          };
        case 4:
          return function(emit) {
            inner(emit);
            inner(emit);
            inner(emit);
            return inner(emit);
          };
        case 5:
          return function(emit) {
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            return inner(emit);
          };
        case 6:
          return function(emit) {
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            return inner(emit);
          };
        case 7:
          return function(emit) {
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            return inner(emit);
          };
        case 8:
          return function(emit) {
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            inner(emit);
            return inner(emit);
          };
      }
    })();
    if (next != null) {
      next = (function(outer, next) {
        return function(emit) {
          outer(emit);
          return next(emit);
        };
      })(outer, next);
    } else {
      next = outer;
    }
    items -= n;
  }
  outer = next != null ? next : function() {
    return true;
  };
  outer.reset = thunk.reset;
  outer.rebind = thunk.rebind;
  return outer;
};

exports.getThunk = function(data) {
  var a, b, c, d, done, first, fourth, i, j, k, l, m, nesting, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, second, sizes, third, thunk;
  sizes = getSizes(data);
  nesting = sizes.length;
  a = sizes.pop();
  b = sizes.pop();
  c = sizes.pop();
  d = sizes.pop();
  done = false;
  switch (nesting) {
    case 0:
      thunk = function() {
        return 0;
      };
      thunk.reset = function() {};
      break;
    case 1:
      i = 0;
      thunk = function() {
        return data[i++];
      };
      thunk.reset = function() {
        return i = 0;
      };
      break;
    case 2:
      i = j = 0;
      first = (ref = data[j]) != null ? ref : [];
      thunk = function() {
        var ref1, x;
        x = first[i++];
        if (i === a) {
          i = 0;
          j++;
          first = (ref1 = data[j]) != null ? ref1 : [];
        }
        return x;
      };
      thunk.reset = function() {
        var ref1;
        i = j = 0;
        first = (ref1 = data[j]) != null ? ref1 : [];
      };
      break;
    case 3:
      i = j = k = 0;
      second = (ref1 = data[k]) != null ? ref1 : [];
      first = (ref2 = second[j]) != null ? ref2 : [];
      thunk = function() {
        var ref3, ref4, x;
        x = first[i++];
        if (i === a) {
          i = 0;
          j++;
          if (j === b) {
            j = 0;
            k++;
            second = (ref3 = data[k]) != null ? ref3 : [];
          }
          first = (ref4 = second[j]) != null ? ref4 : [];
        }
        return x;
      };
      thunk.reset = function() {
        var ref3, ref4;
        i = j = k = 0;
        second = (ref3 = data[k]) != null ? ref3 : [];
        first = (ref4 = second[j]) != null ? ref4 : [];
      };
      break;
    case 4:
      i = j = k = l = 0;
      third = (ref3 = data[l]) != null ? ref3 : [];
      second = (ref4 = third[k]) != null ? ref4 : [];
      first = (ref5 = second[j]) != null ? ref5 : [];
      thunk = function() {
        var ref6, ref7, ref8, x;
        x = first[i++];
        if (i === a) {
          i = 0;
          j++;
          if (j === b) {
            j = 0;
            k++;
            if (k === c) {
              k = 0;
              l++;
              third = (ref6 = data[l]) != null ? ref6 : [];
            }
            second = (ref7 = third[k]) != null ? ref7 : [];
          }
          first = (ref8 = second[j]) != null ? ref8 : [];
        }
        return x;
      };
      thunk.reset = function() {
        var ref6, ref7, ref8;
        i = j = k = l = 0;
        third = (ref6 = data[l]) != null ? ref6 : [];
        second = (ref7 = third[k]) != null ? ref7 : [];
        first = (ref8 = second[j]) != null ? ref8 : [];
      };
      break;
    case 5:
      i = j = k = l = m = 0;
      fourth = (ref6 = data[m]) != null ? ref6 : [];
      third = (ref7 = fourth[l]) != null ? ref7 : [];
      second = (ref8 = third[k]) != null ? ref8 : [];
      first = (ref9 = second[j]) != null ? ref9 : [];
      thunk = function() {
        var ref10, ref11, ref12, ref13, x;
        x = first[i++];
        if (i === a) {
          i = 0;
          j++;
          if (j === b) {
            j = 0;
            k++;
            if (k === c) {
              k = 0;
              l++;
              if (l === d) {
                l = 0;
                m++;
                fourth = (ref10 = data[m]) != null ? ref10 : [];
              }
              third = (ref11 = fourth[l]) != null ? ref11 : [];
            }
            second = (ref12 = third[k]) != null ? ref12 : [];
          }
          first = (ref13 = second[j]) != null ? ref13 : [];
        }
        return x;
      };
      thunk.reset = function() {
        var ref10, ref11, ref12, ref13;
        i = j = k = l = m = 0;
        fourth = (ref10 = data[m]) != null ? ref10 : [];
        third = (ref11 = fourth[l]) != null ? ref11 : [];
        second = (ref12 = third[k]) != null ? ref12 : [];
        first = (ref13 = second[j]) != null ? ref13 : [];
      };
  }
  thunk.rebind = function(d) {
    data = d;
    sizes = getSizes(data);
    if (sizes.length) {
      a = sizes.pop();
    }
    if (sizes.length) {
      b = sizes.pop();
    }
    if (sizes.length) {
      c = sizes.pop();
    }
    if (sizes.length) {
      return d = sizes.pop();
    }
  };
  return thunk;
};

exports.getStreamer = function(array, samples, channels, items) {
  var consume, count, done, emit, i, j, limit, reset, skip;
  limit = i = j = 0;
  reset = function() {
    limit = samples * channels * items;
    return i = j = 0;
  };
  count = function() {
    return j;
  };
  done = function() {
    return limit - i <= 0;
  };
  skip = (function() {
    switch (channels) {
      case 1:
        return function(n) {
          i += n;
          j += n;
        };
      case 2:
        return function(n) {
          i += n * 2;
          j += n;
        };
      case 3:
        return function(n) {
          i += n * 3;
          j += n;
        };
      case 4:
        return function(n) {
          i += n * 4;
          j += n;
        };
    }
  })();
  consume = (function() {
    switch (channels) {
      case 1:
        return function(emit) {
          emit(array[i++]);
          ++j;
        };
      case 2:
        return function(emit) {
          emit(array[i++], array[i++]);
          ++j;
        };
      case 3:
        return function(emit) {
          emit(array[i++], array[i++], array[i++]);
          ++j;
        };
      case 4:
        return function(emit) {
          emit(array[i++], array[i++], array[i++], array[i++]);
          ++j;
        };
    }
  })();
  emit = (function() {
    switch (channels) {
      case 1:
        return function(x) {
          array[i++] = x;
          ++j;
        };
      case 2:
        return function(x, y) {
          array[i++] = x;
          array[i++] = y;
          ++j;
        };
      case 3:
        return function(x, y, z) {
          array[i++] = x;
          array[i++] = y;
          array[i++] = z;
          ++j;
        };
      case 4:
        return function(x, y, z, w) {
          array[i++] = x;
          array[i++] = y;
          array[i++] = z;
          array[i++] = w;
          ++j;
        };
    }
  })();
  consume.reset = reset;
  emit.reset = reset;
  reset();
  return {
    emit: emit,
    consume: consume,
    skip: skip,
    count: count,
    done: done,
    reset: reset
  };
};

exports.getLerpEmitter = function(expr1, expr2) {
  var args, emit1, emit2, emitter, lerp1, lerp2, p, q, r, s, scratch;
  scratch = new Float32Array(4096);
  lerp1 = lerp2 = 0.5;
  p = q = r = s = 0;
  emit1 = function(x, y, z, w) {
    r++;
    scratch[p++] = x * lerp1;
    scratch[p++] = y * lerp1;
    scratch[p++] = z * lerp1;
    return scratch[p++] = w * lerp1;
  };
  emit2 = function(x, y, z, w) {
    s++;
    scratch[q++] += x * lerp2;
    scratch[q++] += y * lerp2;
    scratch[q++] += z * lerp2;
    return scratch[q++] += w * lerp2;
  };
  args = Math.max(expr1.length, expr2.length);
  if (args <= 3) {
    emitter = function(emit, x, i) {
      var k, l, n, o, ref, results;
      p = q = r = s = 0;
      expr1(emit1, x, i);
      expr2(emit2, x, i);
      n = Math.min(r, s);
      l = 0;
      results = [];
      for (k = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; k = 0 <= ref ? ++o : --o) {
        results.push(emit(scratch[l++], scratch[l++], scratch[l++], scratch[l++]));
      }
      return results;
    };
  } else if (args <= 5) {
    emitter = function(emit, x, y, i, j) {
      var k, l, n, o, ref, results;
      p = q = r = s = 0;
      expr1(emit1, x, y, i, j);
      expr2(emit2, x, y, i, j);
      n = Math.min(r, s);
      l = 0;
      results = [];
      for (k = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; k = 0 <= ref ? ++o : --o) {
        results.push(emit(scratch[l++], scratch[l++], scratch[l++], scratch[l++]));
      }
      return results;
    };
  } else if (args <= 7) {
    emitter = function(emit, x, y, z, i, j, k) {
      var l, n, o, ref, results;
      p = q = r = s = 0;
      expr1(emit1, x, y, z, i, j, k);
      expr2(emit2, x, y, z, i, j, k);
      n = Math.min(r, s);
      l = 0;
      results = [];
      for (k = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; k = 0 <= ref ? ++o : --o) {
        results.push(emit(scratch[l++], scratch[l++], scratch[l++], scratch[l++]));
      }
      return results;
    };
  } else if (args <= 9) {
    emitter = function(emit, x, y, z, w, i, j, k, l) {
      var n, o, ref, results;
      p = q = r = s = 0;
      expr1(emit1, x, y, z, w, i, j, k, l);
      expr2(emit2, x, y, z, w, i, j, k, l);
      n = Math.min(r, s);
      l = 0;
      results = [];
      for (k = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; k = 0 <= ref ? ++o : --o) {
        results.push(emit(scratch[l++], scratch[l++], scratch[l++], scratch[l++]));
      }
      return results;
    };
  } else {
    emitter = function(emit, x, y, z, w, i, j, k, l, d, t) {
      var n, o, ref, results;
      p = q = 0;
      expr1(emit1, x, y, z, w, i, j, k, l, d, t);
      expr2(emit2, x, y, z, w, i, j, k, l, d, t);
      n = Math.min(r, s);
      l = 0;
      results = [];
      for (k = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; k = 0 <= ref ? ++o : --o) {
        results.push(emit(scratch[l++], scratch[l++], scratch[l++], scratch[l++]));
      }
      return results;
    };
  }
  emitter.lerp = function(f) {
    var ref;
    return ref = [1 - f, f], lerp1 = ref[0], lerp2 = ref[1], ref;
  };
  return emitter;
};

exports.getLerpThunk = function(data1, data2) {
  var n, n1, n2, scratch, thunk1, thunk2;
  n1 = exports.getSizes(data1).reduce(function(a, b) {
    return a * b;
  });
  n2 = exports.getSizes(data2).reduce(function(a, b) {
    return a * b;
  });
  n = Math.min(n1, n2);
  thunk1 = exports.getThunk(data1);
  thunk2 = exports.getThunk(data2);
  scratch = new Float32Array(n);
  scratch.lerp = function(f) {
    var a, b, i, results;
    thunk1.reset();
    thunk2.reset();
    i = 0;
    results = [];
    while (i < n) {
      a = thunk1();
      b = thunk2();
      results.push(scratch[i++] = a + (b - a) * f);
    }
    return results;
  };
  return scratch;
};
