THREE.Bootstrap.registerPlugin('splash', {
  defaults: {
    color: 'mono',
    fancy: true
  },
  listen: ['ready', 'mathbox/init:init', 'mathbox/progress:progress', 'mathbox/destroy:destroy'],
  uninstall: function() {
    return this.destroy();
  },
  ready: function(event, three) {
    if (three.MathBox && !this.div) {
      return init(event, three);
    }
  },
  init: function(event, three) {
    var color, div, html, l, x, y, z;
    this.destroy();
    color = this.options.color;
    html = "<div class=\"mathbox-loader mathbox-splash-" + color + "\">\n  <div class=\"mathbox-logo\">\n    <div> <div></div><div></div><div></div> </div>\n    <div> <div></div><div></div><div></div> </div>\n  </div>\n  <div class=\"mathbox-progress\"><div></div></div>\n</div>";
    this.div = div = document.createElement('div');
    div.innerHTML = html;
    three.element.appendChild(div);
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
    l = 1 / Math.sqrt(x * x + y * y + z * z);
    this.loader = div.querySelector('.mathbox-loader');
    this.bar = div.querySelector('.mathbox-progress > div');
    this.gyro = div.querySelectorAll('.mathbox-logo > div');
    this.transforms = ["rotateZ(22deg) rotateX(24deg) rotateY(30deg)", "rotateZ(11deg) rotateX(12deg) rotateY(15deg) scale3d(.6, .6, .6)"];
    this.random = [x * l, y * l, z * l];
    this.start = three.Time.now;
    return this.timer = null;
  },
  progress: function(event, three) {
    var current, el, f, i, increment, k, len, ref, results, t, total, visible, weights, width;
    if (!this.div) {
      return;
    }
    current = event.current, total = event.total;
    visible = current < total;
    clearTimeout(this.timer);
    if (visible) {
      this.loader.classList.remove('mathbox-exit');
      this.loader.style.display = 'block';
    } else {
      this.loader.classList.add('mathbox-exit');
      this.timer = setTimeout(((function(_this) {
        return function() {
          return _this.loader.style.display = 'none';
        };
      })(this)), 150);
    }
    width = current < total ? (Math.round(1000 * current / total) * .1) + '%' : '100%';
    this.bar.style.width = width;
    if (this.options.fancy) {
      weights = this.random;
      f = Math.max(0, Math.min(1, three.Time.now - this.start));
      increment = function(transform, j) {
        if (j == null) {
          j = 0;
        }
        return transform.replace(/(-?[0-9.e]+)deg/g, function(_, n) {
          return (+n + weights[j++] * f * three.Time.step * 60) + 'deg';
        });
      };
      ref = this.gyro;
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        el = ref[i];
        this.transforms[i] = t = increment(this.transforms[i]);
        results.push(el.style.transform = el.style.WebkitTransform = t);
      }
      return results;
    }
  },
  destroy: function() {
    var ref;
    if ((ref = this.div) != null) {
      ref.remove();
    }
    return this.div = null;
  }
});
