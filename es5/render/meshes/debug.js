var Base, Debug,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Base = require('./base');

Debug = (function(superClass) {
  extend(Debug, superClass);

  function Debug(renderer, shaders, options) {
    var object;
    Debug.__super__.constructor.call(this, renderer, shaders, options);
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.MeshBasicMaterial({
      map: options.map
    });
    this.material.side = THREE.DoubleSide;
    object = new THREE.Mesh(this.geometry, this.material);
    object.position.x += options.x || 0;
    object.position.y += options.y || 0;
    object.frustumCulled = false;
    object.scale.set(2, 2, 2);
    object.__debug = true;
    this.objects = [object];
  }

  Debug.prototype.dispose = function() {
    this.geometry.dispose();
    this.material.dispose();
    this.objects = this.geometry = this.material = null;
    return Debug.__super__.dispose.apply(this, arguments);
  };

  return Debug;

})(Base);

module.exports = Debug;
