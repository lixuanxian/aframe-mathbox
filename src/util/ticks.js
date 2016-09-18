/*
 Generate equally spaced ticks in a range at sensible positions.
 
 @param min/max - Minimum and maximum of range
 @param n - Desired number of ticks in range
 @param unit - Base unit of scale (e.g. 1 or π).
 @param scale - Division scale (e.g. 2 = binary division, or 10 = decimal division).
 @param bias - Integer to bias divisions one or more levels up or down (to create nested scales)
 @param start - Whether to include a tick at the start
 @param end - Whether to include a tick at the end
 @param zero - Whether to include zero as a tick
 @param nice - Whether to round to a more reasonable interval
 */
var LINEAR, LOG, linear, log, make;

linear = function(min, max, n, unit, base, factor, start, end, zero, nice) {
  var distance, f, factors, i, ideal, ref, span, step, steps, ticks;
  if (nice == null) {
    nice = true;
  }
  n || (n = 10);
  unit || (unit = 1);
  base || (base = 10);
  factor || (factor = 1);
  span = max - min;
  ideal = span / n;
  if (!nice) {
    ticks = (function() {
      var j, ref1, results;
      results = [];
      for (i = j = 0, ref1 = n; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
        results.push(min + i * ideal);
      }
      return results;
    })();
    if (!start) {
      ticks.shift();
    }
    if (!end) {
      ticks.pop();
    }
    if (!zero) {
      ticks = ticks.filter(function(x) {
        return x !== 0;
      });
    }
    return ticks;
  }
  unit || (unit = 1);
  base || (base = 10);
  ref = unit * (Math.pow(base, Math.floor(Math.log(ideal / unit) / Math.log(base))));
  factors = base % 2 === 0 ? [base / 2, 1, 1 / 2] : base % 3 === 0 ? [base / 3, 1, 1 / 3] : [1];
  steps = (function() {
    var j, len, results;
    results = [];
    for (j = 0, len = factors.length; j < len; j++) {
      f = factors[j];
      results.push(ref * f);
    }
    return results;
  })();
  distance = Infinity;
  step = steps.reduce(function(ref, step) {
    var d;
    f = step / ideal;
    d = Math.max(f, 1 / f);
    if (d < distance) {
      distance = d;
      return step;
    } else {
      return ref;
    }
  }, ref);
  step *= factor;
  min = (Math.ceil((min / step) + +(!start))) * step;
  max = (Math.floor(max / step) - +(!end)) * step;
  n = Math.ceil((max - min) / step);
  ticks = (function() {
    var j, ref1, results;
    results = [];
    for (i = j = 0, ref1 = n; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
      results.push(min + i * step);
    }
    return results;
  })();
  if (!zero) {
    ticks = ticks.filter(function(x) {
      return x !== 0;
    });
  }
  return ticks;
};


/*
 Generate logarithmically spaced ticks in a range at sensible positions.
 */

log = function(min, max, n, unit, base, bias, start, end, zero, nice) {
  throw new Error("Log ticks not yet implemented.");
};

LINEAR = 0;

LOG = 1;

make = function(type, min, max, n, unit, base, bias, start, end, zero, nice) {
  switch (type) {
    case LINEAR:
      return linear(min, max, n, unit, base, bias, start, end, zero, nice);
    case LOG:
      return log(min, max, n, unit, base, bias, start, end, zero, nice);
  }
};

exports.make = make;

exports.linear = linear;

exports.log = log;
