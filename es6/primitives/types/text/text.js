var Buffer, Text, Util, Voxel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Buffer = require('../data/buffer');

Voxel = require('../data/voxel');

Util = require('../../../util');

Text = (function(superClass) {
  extend(Text, superClass);

  function Text() {
    return Text.__super__.constructor.apply(this, arguments);
  }

  Text.traits = ['node', 'buffer', 'active', 'data', 'texture', 'voxel', 'text', 'font'];

  Text.defaults = {
    minFilter: 'linear',
    magFilter: 'linear'
  };

  Text.finals = {
    channels: 1
  };

  Text.prototype.init = function() {
    Text.__super__.init.apply(this, arguments);
    return this.atlas = null;
  };

  Text.prototype.textShader = function(shader) {
    return this.atlas.shader(shader);
  };

  Text.prototype.textIsSDF = function() {
    return this.props.sdf > 0;
  };

  Text.prototype.textHeight = function() {
    return this.props.detail;
  };

  Text.prototype.make = function() {
    var atlas, channels, data, depth, detail, dims, emit, font, height, items, magFilter, minFilter, ref, ref1, ref2, ref3, ref4, reserveX, reserveY, reserveZ, sdf, space, style, type, variant, weight, width;
    ref = this.props, minFilter = ref.minFilter, magFilter = ref.magFilter, type = ref.type;
    ref1 = this.props, font = ref1.font, style = ref1.style, variant = ref1.variant, weight = ref1.weight, detail = ref1.detail, sdf = ref1.sdf;
    this.atlas = this._renderables.make('textAtlas', {
      font: font,
      size: detail,
      style: style,
      variant: variant,
      weight: weight,
      outline: sdf,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
    this.minFilter = THREE.NearestFilter;
    this.magFilter = THREE.NearestFilter;
    this.type = THREE.FloatType;
    Buffer.prototype.make.call(this);
    minFilter = (ref2 = this.minFilter) != null ? ref2 : this.props.minFilter;
    magFilter = (ref3 = this.magFilter) != null ? ref3 : this.props.magFilter;
    type = (ref4 = this.type) != null ? ref4 : this.props.type;
    width = this.props.width;
    height = this.props.height;
    depth = this.props.depth;
    reserveX = this.props.bufferWidth;
    reserveY = this.props.bufferHeight;
    reserveZ = this.props.bufferDepth;
    channels = this.props.channels;
    items = this.props.items;
    dims = this.spec = {
      channels: channels,
      items: items,
      width: width,
      height: height,
      depth: depth
    };
    this.items = dims.items;
    this.channels = dims.channels;
    data = this.props.data;
    dims = Util.Data.getDimensions(data, dims);
    space = this.space;
    space.width = Math.max(reserveX, dims.width || 1);
    space.height = Math.max(reserveY, dims.height || 1);
    space.depth = Math.max(reserveZ, dims.depth || 1);
    this.buffer = this._renderables.make(this.storage, {
      width: space.width,
      height: space.height,
      depth: space.depth,
      channels: 4,
      items: items,
      minFilter: minFilter,
      magFilter: magFilter,
      type: type
    });
    atlas = this.atlas;
    emit = this.buffer.streamer.emit;
    return this.buffer.streamer.emit = function(text) {
      return atlas.map(text, emit);
    };
  };

  Text.prototype.unmake = function() {
    Text.__super__.unmake.apply(this, arguments);
    if (this.atlas) {
      this.atlas.dispose();
      return this.atlas = null;
    }
  };

  Text.prototype.update = function() {
    this.atlas.begin();
    Text.__super__.update.apply(this, arguments);
    return this.atlas.end();
  };

  Text.prototype.change = function(changed, touched, init) {
    if (touched['font']) {
      return this.rebuild();
    }
    return Text.__super__.change.call(this, changed, touched, init);
  };

  return Text;

})(Voxel);

module.exports = Text;
