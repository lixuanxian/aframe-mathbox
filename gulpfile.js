var gulp       = require('gulp');
var babel      = require('gulp-babel');
var gutil      = require('gulp-util');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var rename     = require("gulp-rename");
var karma      = require('gulp-karma');
var sequence   = require('run-sequence');
var browserify = require('gulp-browserify');
var watch      = require('gulp-watch');
var shell      = require('gulp-shell');
var jsify      = require('./vendor/gulp-jsify');
var plumber    = require('gulp-plumber');
var batch      = require('gulp-batch');
var sourcemaps = require('gulp-sourcemaps');

var KarmaServer = require('karma').Server;

var builds = {
  core:   'build/mathbox-core.js',
  bundle: 'build/mathbox-bundle.js',
  css:    'build/mathbox.css',
  // three: 'build'
};

var products = [
  builds.core,
  builds.bundle
];

var three = [
  "vendor/three.js",
  "vendor/three.min.js"
]

var vendor = [
  // 'vendor/three.js',
  'vendor/threestrap/build/threestrap.js',
  'vendor/threestrap/vendor/renderers/VRRenderer.js',
  'vendor/threestrap/vendor/controls/VRControls.js',
  'vendor/threestrap/vendor/controls/OrbitControls.js',
  'vendor/threestrap/vendor/controls/DeviceOrientationControls.js',
  'vendor/threestrap/vendor/controls/TrackBallControls.js',
];

var css = [
  'vendor/shadergraph/build/*.css',
  'es6/**/*.css',
];

var core = [
  '.tmp/index.js', 
];

var glsls = [
  'es6/shaders/glsl/**/*.glsl'
];

var js = [
  'es6/**/*.js'
];

// var coffees = [
//   'src/**/*.coffee'
// ];

//var source = coffees.concat(glsls).concat(vendor).concat(css);
var source = js.concat(glsls).concat(vendor).concat(css);
var bundle = vendor.concat(core);

var test = bundle.concat([
  'test/**/*.spec.coffee',
]).filter(function (path) { return !path.match(/fix\.js/); });

gulp.task('glsl', function () {
  return gulp.src(glsls)
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(jsify("shaders.js", "module.exports"))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/'))
});

gulp.task('browserify', function () {
  return gulp.src('es6/index.js', { read: false })
      .pipe(browserify({
        debug: true,
        //detectGlobals: false,
        bare: true,
        transform: ['coffeeify'/*, 'babelify'*/],
        extensions: ['.coffee']// extensions: ['.coffee'],
      }))
      .pipe(rename({
        extname: ".js",
      }))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel(
        
      ))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/'))
});

gulp.task('css', function () {
  return gulp.src(css)
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(concat(builds.css))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('core', function () {
  return gulp.src(core)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat(builds.core))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('bundle', function () {
  return gulp.src(bundle)
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(concat(builds.bundle))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('three', function () {
  return gulp.src(three)
     .pipe(gulp.dest('./build'));
});


gulp.task('uglify-js', function () {
  return gulp.src(products)
    .pipe(uglify())
    .pipe(rename({
      extname: ".min.js",
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('karma', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    files: test,
    singleRun: true,
  }, done).start();
});

gulp.task('watch-karma', function() {
  return gulp.src(test)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch',
    }));
});

gulp.task('watch-build-watch', function () {
  watch(source, function () {
    return gulp.start('build');
  });
});

// Main tasks

gulp.task('build', function (callback) {
  sequence('three','glsl', 'browserify', ['core', 'bundle', 'css'], callback);
})

gulp.task('default', function (callback) {
  sequence('build', callback);
});

gulp.task('docs', shell.task([
  'coffee src/docs/generate.coffee > docs/primitives.md',
]));

gulp.task('test', function (callback) {
  sequence('build', 'karma', callback);
});

gulp.task('watch-build', function (callback) {
  sequence('build', 'watch-build-watch', callback);
})

gulp.task('watch', function (callback) {
  sequence('watch-build', 'watch-karma', callback);
});
