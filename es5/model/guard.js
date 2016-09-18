var Guard;

Guard = (function() {
  function Guard(limit1) {
    this.limit = limit1 != null ? limit1 : 10;
  }

  Guard.prototype.iterate = function(options) {
    var last, limit, run, step;
    step = options.step, last = options.last;
    limit = this.limit;
    while (run = step()) {
      if (!--limit) {
        console.warn("Last iteration", typeof last === "function" ? last() : void 0);
        throw new Error("Exceeded iteration limit.");
      }
    }
    return null;
  };

  return Guard;

})();

module.exports = Guard;
