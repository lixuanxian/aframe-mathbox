var Label, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Label = (function(superClass) {
  extend(Label, superClass);

  function Label() {
    return Label.__super__.constructor.apply(this, arguments);
  }

  Label.traits = ['node', 'bind', 'object', 'visible', 'style', 'label', 'attach', 'geometry', 'position'];

  Label.prototype.make = function() {
    var color, combine, depth, height, items, labelUniforms, map, mask, pointDims, position, snippet, sprite, styleUniforms, textDims, textIsSDF, uniforms, unitUniforms, width;
    Label.__super__.make.apply(this, arguments);
    this._helpers.bind.make([
      {
        to: 'label.text',
        trait: 'text'
      }, {
        to: 'geometry.points',
        trait: 'source'
      }, {
        to: 'geometry.colors',
        trait: 'source'
      }
    ]);
    if (this.bind.points == null) {
      return;
    }
    if (this.bind.text == null) {
      return;
    }
    pointDims = this.bind.points.getDimensions();
    textDims = this.bind.text.getDimensions();
    textIsSDF = this.bind.text.textIsSDF();
    items = Math.min(pointDims.items, textDims.items);
    width = Math.min(pointDims.width, textDims.width);
    height = Math.min(pointDims.height, textDims.height);
    depth = Math.min(pointDims.depth, textDims.depth);
    position = this.bind.points.sourceShader(this._shaders.shader());
    position = this._helpers.position.pipeline(position);
    sprite = this.bind.text.sourceShader(this._shaders.shader());
    map = this._shaders.shader().pipe('label.map');
    map.pipe(this.bind.text.textShader(this._shaders.shader()));
    labelUniforms = {
      spriteDepth: this.node.attributes['attach.depth'],
      spriteOffset: this.node.attributes['attach.offset'],
      spriteSnap: this.node.attributes['attach.snap'],
      spriteScale: this._attributes.make(this._types.number()),
      outlineStep: this._attributes.make(this._types.number()),
      outlineExpand: this._attributes.make(this._types.number()),
      outlineColor: this.node.attributes['label.background']
    };
    this.spriteScale = labelUniforms.spriteScale;
    this.outlineStep = labelUniforms.outlineStep;
    this.outlineExpand = labelUniforms.outlineExpand;
    snippet = textIsSDF ? 'label.outline' : 'label.alpha';
    combine = this._shaders.shader().pipe(snippet, labelUniforms);
    if (this.bind.colors) {
      color = this._shaders.shader();
      this.bind.colors.sourceShader(color);
    }
    mask = this._helpers.object.mask();
    styleUniforms = this._helpers.style.uniforms();
    unitUniforms = this._inherit('unit').getUnitUniforms();
    uniforms = Util.JS.merge(unitUniforms, styleUniforms, labelUniforms);
    this.sprite = this._renderables.make('sprite', {
      uniforms: uniforms,
      width: width,
      height: height,
      depth: depth,
      items: items,
      position: position,
      sprite: sprite,
      map: map,
      combine: combine,
      color: color,
      mask: mask,
      linear: true
    });
    this._helpers.visible.make();
    return this._helpers.object.make([this.sprite]);
  };

  Label.prototype.unmake = function() {
    this._helpers.bind.unmake();
    this._helpers.visible.unmake();
    this._helpers.object.unmake();
    return this.sprite = null;
  };

  Label.prototype.resize = function() {
    var depth, height, items, pointDims, textDims, width;
    pointDims = this.bind.points.getActiveDimensions();
    textDims = this.bind.text.getActiveDimensions();
    items = Math.min(pointDims.items, textDims.items);
    width = Math.min(pointDims.width, textDims.width);
    height = Math.min(pointDims.height, textDims.height);
    depth = Math.min(pointDims.depth, textDims.depth);
    return this.sprite.geometry.clip(width, height, depth, items);
  };

  Label.prototype.change = function(changed, touched, init) {
    var expand, height, outline, scale, size;
    if (touched['geometry'] || changed['label.text']) {
      return this.rebuild();
    }
    if (this.bind.points == null) {
      return;
    }
    size = this.props.size;
    outline = this.props.outline;
    expand = this.props.expand;
    height = this.bind.text.textHeight();
    scale = size / height;
    this.outlineExpand.value = expand / scale * 16 / 255;
    this.outlineStep.value = outline / scale * 16 / 255;
    return this.spriteScale.value = scale;
  };

  return Label;

})(Primitive);

module.exports = Label;
