var ease, π;

π = Math.PI;

ease = {
  clamp: function(x, a, b) {
    return Math.max(a, Math.min(b, x));
  },
  cosine: function(x) {
    return .5 - .5 * Math.cos(ease.clamp(x, 0, 1) * π);
  },
  binary: function(x) {
    return +(x >= .5);
  },
  hold: function(x) {
    return +(x >= 1);
  }
};

module.exports = ease;