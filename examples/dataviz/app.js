var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 3);
// Create a renderer with Antialiasing
let canvas = document.createElement('canvas');
let context2 = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    canvas,
    context:context2
});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var cube = new THREE.Mesh( geometry, material );

// Add cube to Scene
scene.add( cube );

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

render();

var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
var material = new THREE.MeshBasicMaterial( { color: "#414F81" } );
var cube1 = new THREE.Mesh( geometry, material );
  // 3D Scatterplot by Max Goldstein, CC-BY
  var group = new THREE.Object3D()
  scene.add(group)
  var context = new MathBox.Context(renderer, group, camera).init();
  var mathbox  = context.api;
  renderer.context._renderer = renderer

  view = mathbox.cartesian({
    id:"plot",
    range: [[0, 1], [0, 1], [0, 1]],
    scale: [1, 1, 1],
  });


  view.axis({
    end: true,
    width: 0.1,
  });
  view.axis({
    id:"plotX",
    axis: 2,
    end: true,
    width: 0.1,
  });
  view.axis({
    axis: 3,
    end: true,
    width: 0.1,
  });

  // var plot = view.select("#plot").set('visible',false)
//   var axis = view.select("#plotX").set('width',0.3)

  window.scene = scene
  var colors = {
    x: 0xFF4136,   // red
    y: 0xFFDC00,   // yellow
    z: 0x0074D9,   // blue
    xy: 0xFF851B,  // orange
    xz: 0xB10DC9,  // purple
    yz: 0x2ECC40,  // green
    xyz: 0x654321, // brown
  }

  var dataMaximums = [1, 1, 1];
  var dataMinimums = [0, 0, 0];
  var dataRanges = [0,1,2].map(function(i){ return dataMaximums[i] - dataMinimums[i] })
  var dataScaledMinimums = [0,1,2].map(function(i){ return dataMinimums[i] / dataRanges[i] })

  function interpolate(lo, hi, n){
    n--; // go to end of range
    var vals = [];
    for (var i = 0; i <= n; i++){
      vals.push(Math.round(10 * (lo + (hi - lo)*(i/n)))/10);
    }
    return vals;
  }

  view.scale({
    divide: 5,
    origin: [0,0,1,0],
    axis: "x",
  }).text({
    live: false,
    data: interpolate(dataMinimums[0], dataMaximums[0], 11)
  })
  // .point({
  //   size: 5,
  //   color: 0xFF0000
  // })
  .label({
    color: colors.x,
  })

  view.scale({
    divide: 5,
    origin: [0,0,1,0],
    axis: "y",
  }).text({
    live: false,
    data: interpolate(dataMinimums[1], dataMaximums[1], 11)
  })
  // .point({
  //   size: 5,
  //   color: 0xFF0000
  // })
  .label({
    color: colors.y,
    offset: [-16, 0]
  })

  view.scale({
    divide: 5,
    origin: [1,0,0,0],
    axis: "z",
  })
  .text({
    live: false,
    data: interpolate(dataMinimums[2], dataMaximums[2], 11)
  })
  // .point({
  //   size: 5,
  //   color: 0xFF0000
  // })
  .label({
    color: colors.z,
    offset: [16, 0]
  })

  view.grid({
    axes: "xy",
    width:0.01,
    divideX: 3,
    divideY: 3
  })
  .grid({
    axes: "xz",
    width:0.01,
    divideX: 5,
    divideY: 5,
  })
  .grid({
    axes: "yz",
    width:0.01,
    divideX: 5,
    divideY: 5,
  })

//   view.array({
//     items: 1,
//     channels: 3,
//     live: false,
//     id: 'data',
//     // data: is set below
//   }).swizzle({
//     order: "xyz"
//   }).transform({
//     scale: dataRanges.slice(0,2).map(function(d,i){return d}),
//     position: dataScaledMinimums.slice(0,2).map(function(d,i){return d}),
//   }).point({
//     color: 0x222222,
//     size: 12,
//   })

//   view.select('#data').set('data', [
//     [0.5,0.5,0.5]
//   ])
