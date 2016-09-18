var Camera, Primitive, Util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Primitive = require('../../primitive');

Util = require('../../../util');

Camera = (function(superClass) {
  extend(Camera, superClass);

  function Camera() {
    return Camera.__super__.constructor.apply(this, arguments);
  }

  Camera.traits = ['node', 'camera'];

  Camera.prototype.init = function() {};

  Camera.prototype.make = function() {
    var camera;
    camera = this._context.defaultCamera;
    this.camera = this.props.proxy ? camera : camera.clone();
    this.euler = new THREE.Euler;
    return this.quat = new THREE.Quaternion;
  };

  Camera.prototype.unmake = function() {};

  Camera.prototype.getCamera = function() {
    return this.camera;
  };

  Camera.prototype.change = function(changed, touched, init) {
    var aspect, fov, lookAt, position, quaternion, ref, rotation, up;
    if (changed['camera.position'] || changed['camera.quaternion'] || changed['camera.rotation'] || changed['camera.lookAt'] || changed['camera.up'] || changed['camera.fov'] || init) {
      ref = this.props, position = ref.position, quaternion = ref.quaternion, rotation = ref.rotation, lookAt = ref.lookAt, up = ref.up, fov = ref.fov, aspect = ref.aspect;
      if (position != null) {
        this.camera.position.copy(position);
      }
      if ((quaternion != null) || (rotation != null) || (lookAt != null)) {
        if (lookAt != null) {
          this.camera.lookAt(lookAt);
        } else {
          this.camera.quaternion.set(0, 0, 0, 1);
        }
        if (rotation != null) {
          this.euler.setFromVector3(rotation, Util.Three.swizzleToEulerOrder(this.props.eulerOrder));
          this.quat.setFromEuler(this.euler);
          this.camera.quaternion.multiply(this.quat);
        }
        if (quaternion != null) {
          this.camera.quaternion.multiply(quaternion);
        }
      }
      if ((fov != null) && (this.camera.fov != null)) {
        this.camera.fov = fov;
      }
      if (up != null) {
        this.camera.up.copy(up);
      }
      return this.camera.updateMatrix();
    }
  };

  return Camera;

})(Primitive);

module.exports = Camera;
