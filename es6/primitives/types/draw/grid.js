var Grid, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Grid = (function(superClass) {
  extend(Grid, superClass);

  Grid.traits = ['node', 'object', 'visible', 'style', 'line', 'grid', 'area', 'position', 'origin', 'shade', 'axis:x', 'axis:y', 'scale:x', 'scale:y', 'span:x', 'span:y'];

  Grid.defaults = {
    width: 1,
    zBias: -2
  };

  function Grid(node, context, helpers) {
    Grid.__super__.constructor.call(this, node, context, helpers);
    this.axes = null;
  }

  Grid.prototype.make = function() {
    var axes, axis, crossed, join, lineX, lineY, lines, mask, material, ref, ref1, stroke, transpose;
    mask = this._helpers.object.mask();
    material = this._helpers.shade.pipeline() || false;
    axis = (function(_this) {
      return function(first, second, transpose) {
        var buffer, detail, line, lineUniforms, p, position, positionUniforms, resolution, samples, strips, styleUniforms, uniforms, unitUniforms, values;
        detail = _this._get(first + 'axis.detail');
        samples = detail + 1;
        resolution = 1 / detail;
        strips = _this._helpers.scale.divide(second);
        buffer = _this._renderables.make('dataBuffer', {
          width: strips,
          channels: 1
        });
        positionUniforms = {
          gridPosition: _this._attributes.make(_this._types.vec4()),
          gridStep: _this._attributes.make(_this._types.vec4()),
          gridAxis: _this._attributes.make(_this._types.vec4())
        };
        values = {
          gridPosition: positionUniforms.gridPosition.value,
          gridStep: positionUniforms.gridStep.value,
          gridAxis: positionUniforms.gridAxis.value
        };
        p = position = _this._shaders.shader();
        if ((transpose != null) && (mask != null)) {
          mask = _this._helpers.position.swizzle(mask, transpose);
        }
        p.require(buffer.shader(_this._shaders.shader(), 2));
        p.pipe('grid.position', positionUniforms);
        position = _this._helpers.position.pipeline(p);
        styleUniforms = _this._helpers.style.uniforms();
        lineUniforms = _this._helpers.line.uniforms();
        unitUniforms = _this._inherit('unit').getUnitUniforms();
        uniforms = Util.JS.merge(lineUniforms, styleUniforms, unitUniforms);
        line = _this._renderables.make('line', {
          uniforms: uniforms,
          samples: samples,
          strips: strips,
          position: position,
          stroke: stroke,
          join: join,
          mask: mask,
          material: material
        });
        return {
          first: first,
          second: second,
          resolution: resolution,
          samples: samples,
          line: line,
          buffer: buffer,
          values: values
        };
      };
    })(this);
    ref = this.props, lineX = ref.lineX, lineY = ref.lineY, crossed = ref.crossed, axes = ref.axes;
    transpose = ['0000', 'x000', 'y000', 'z000', 'w000'][axes[1]];
    ref1 = this.props, stroke = ref1.stroke, join = ref1.join;
    this.axes = [];
    lineX && this.axes.push(axis('x.', 'y.', null));
    lineY && this.axes.push(axis('y.', 'x.', crossed ? null : transpose));
    lines = (function() {
      var i, len, ref2, results;
      ref2 = this.axes;
      results = [];
      for (i = 0, len = ref2.length; i < len; i++) {
        axis = ref2[i];
        results.push(axis.line);
      }
      return results;
    }).call(this);
    this._helpers.visible.make();
    this._helpers.object.make(lines);
    this._helpers.span.make();
    return this._listen(this, 'span.range', this.updateRanges);
  };

  Grid.prototype.unmake = function() {
    var axis, i, len, ref;
    this._helpers.visible.unmake();
    this._helpers.object.unmake();
    this._helpers.span.unmake();
    ref = this.axes;
    for (i = 0, len = ref.length; i < len; i++) {
      axis = ref[i];
      axis.buffer.dispose();
    }
    return this.axes = null;
  };

  Grid.prototype.change = function(changed, touched, init) {
    if (changed['x.axis.detail'] || changed['y.axis.detail'] || changed['x.axis.factor'] || changed['y.axis.factor'] || changed['grid.lineX'] || changed['grid.lineY'] || changed['line.stroke'] || changed['line.join'] || changed['grid.crossed'] || (changed['grid.axes'] && this.props.crossed)) {
      return this.rebuild();
    }
    if (touched['x'] || touched['y'] || touched['area'] || touched['grid'] || touched['view'] || init) {
      return this.updateRanges();
    }
  };

  Grid.prototype.updateRanges = function() {
    var axes, axis, lineX, lineY, origin, range1, range2, ref, ref1;
    axis = (function(_this) {
      return function(x, y, range1, range2, axis) {
        var buffer, first, line, max, min, n, resolution, samples, second, ticks, values;
        first = axis.first, second = axis.second, resolution = axis.resolution, samples = axis.samples, line = axis.line, buffer = axis.buffer, values = axis.values;
        min = range1.x;
        max = range1.y;
        Util.Axis.setDimension(values.gridPosition, x).multiplyScalar(min);
        Util.Axis.setDimension(values.gridStep, x).multiplyScalar((max - min) * resolution);
        Util.Axis.addOrigin(values.gridPosition, axes, origin);
        min = range2.x;
        max = range2.y;
        ticks = _this._helpers.scale.generate(second, buffer, min, max);
        Util.Axis.setDimension(values.gridAxis, y);
        n = ticks.length;
        return line.geometry.clip(samples, n, 1, 1);
      };
    })(this);
    ref = this.props, axes = ref.axes, origin = ref.origin;
    range1 = this._helpers.span.get('x.', axes[0]);
    range2 = this._helpers.span.get('y.', axes[1]);
    ref1 = this.props, lineX = ref1.lineX, lineY = ref1.lineY;
    if (lineX) {
      axis(axes[0], axes[1], range1, range2, this.axes[0]);
    }
    if (lineY) {
      return axis(axes[1], axes[0], range2, range1, this.axes[+lineX]);
    }
  };

  return Grid;

})(Primitive);

module.exports = Grid;
