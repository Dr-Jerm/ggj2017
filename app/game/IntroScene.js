/* global WEBVR */
/* global THREE */

import CANNON from 'cannon';
import Sheep from './Sheep';
import Sign from './Sign';

class IntroScene extends THREE.Scene {
  constructor(renderer) {
    super();
    this.controls;
    
    renderer.setClearColor(0xf0f0f0, 1);

    this.world = new CANNON.World();
    this.world.gravity.set(0,0,0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 10;

    let camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth/window.innerHeight,
      0.1,
      1000
    );
    camera.position.y = 10;
    camera.rotation.z = 10;
    this.controls = new THREE.OrbitControls( camera, renderer.domElement );
    this.controls.enableZoom = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    
    this.add(camera);
    this.camera = camera;
    
    this.add(new THREE.HemisphereLight(0x808080, 0x606060));
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 6, 0);
    
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = -2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = -2;
    
    light.shadow.mapSize.set(4096, 4096);
    this.add(light);
  
    this.sheep = new Sheep(this, this.world);
    this.signs = [];
    var sign_count = 6;
    for (var i = 0; i < sign_count; i++) {
      this.signs[i] = new Sign(this, this.world, i);
      var angle = -i * 2 * Math.PI / sign_count - Math.PI / 2;
      this.signs[i].object3D.position.x = 
        1.25 * Math.cos(i * 2 * Math.PI / sign_count);
      this.signs[i].object3D.position.z = 
        1.25 * Math.sin(i * 2 * Math.PI / sign_count);


      this.signs[i].object3D.rotation.y = angle;
    }
    
  document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        console.log("I pressed spacebar");
    }
  }
    
  }
  
  tick (delta) {
    this.controls.update();
    this.sheep.tick(delta);
  }
  
}

module.exports = IntroScene;
