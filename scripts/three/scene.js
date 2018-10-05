var frame, light, controls;
var camera, scene, renderer;

var log;
class Scene {

  constructor(options) {
    frame = document.getElementById('frame');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 100, frame.clientWidth / frame.clientHeight, 0.1, 100 );


    light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
    light.position.set( 0, 0, 0 );
    scene.add( light );

    this.loadGLTF('/gltf/log/scene.gltf');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( frame.clientWidth, frame.clientHeight );
    renderer.gammaOutput = true;
    frame.appendChild( renderer.domElement );

    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // this.cube = new THREE.Mesh( geometry, material );
    // this.scene.add( this.cube );

    camera.position.set(0, 0, 30);


    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // begin animation loop
    var animate = this.animate.bind(this);
    animate();
  }

  // function that performs animation frames
  animate () {
    requestAnimationFrame( this.animate.bind(this) );

    // runs mutations on object properties
    this.animations();

    renderer.render( scene, camera );
  };

  animations() {
    controls.update();
  }


  loadGLTF(url) {
    // Instantiate a loader
    var loader = new THREE.GLTFLoader();

    // model
    var loader = new THREE.GLTFLoader();

    loader.load( url, function ( gltf ) {
      log = gltf.scene;
      var box = new THREE.Box3().setFromObject( log );
      box.center( log.position ); // this re-sets the mesh position
      log.position.multiplyScalar( - 1 );
      scene.add( log );

    }, undefined, function ( e ) {
      console.error( e );
    });
  }


};