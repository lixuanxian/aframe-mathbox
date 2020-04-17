window._ = require('lodash');

require('./binder.js');
require('./api.js');
require('./bootstrap.js');
require('./plugin.js');
require('./aliases.js');
require('./core/fallback.js');
require('./core/renderer.js');
require('./core/bind.js');
require('./core/size.js');
require('./core/fill.js');
require('./core/loop.js');
require('./core/time.js');
require('./core/scene.js');
require('./core/camera.js');
require('./core/render.js');
require('./core/warmup.js');


require('./../vendor/stats.min.js');
require('./../vendor/controls/DeviceOrientationControls.js');
require('./../vendor/controls/FirstPersonControls.js');
require('./../vendor/controls/OrbitControls.js');
require('./../vendor/controls/TrackballControls.js');
require('./../vendor/controls/VRControls.js');
require('./extra/stats.js');
require('./extra/controls.js');
require('./extra/cursor.js');
require('./extra/fullscreen.js');
require('./extra/vr.js');
require('./extra/ui.js');