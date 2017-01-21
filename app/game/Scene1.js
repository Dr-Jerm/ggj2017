/* global WEBVR */
/* global THREE */
import CANNON from 'cannon';
import Controller from './vr-controller';
import Skybox from './Skybox';
import GroundPlane from './GroundPlane';
import Physics from './Physics';
import Sheep from './Sheep';

class Scene1 extends THREE.Scene {
  constructor(renderer) {
    super();
    this.controls;
    this.controller1;
    this.controller2;
    
    this.world = new CANNON.World();
    this.world.gravity.set(0,0,0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 10;
    
    let camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth/window.innerHeight,
      0.1,
      10000
    );
    
    this.add(camera);
    
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
    
    this.camera = camera;
    
    this.controls = new THREE.VRControls(camera);
    this.controls.standing = true;
    
    this.controller1 = new Controller(0, this.controls);
    this.add(this.controller1);
    this.controller2 = new Controller(1, this.controls);
    this.add(this.controller2);
    
    let skybox = new Skybox();
    this.add(skybox.object3D);
    
    // let sheep = new Sheep();
    // this.add(sheep.object3D);
    let groundPlane = new GroundPlane();
    this.add(groundPlane.object3D);
    this.world.add(groundPlane.body);
    
    let physics = new Physics();
    this.add(physics.object3D);
    this.world.add(physics.body);
  }
  
  update () {
    this.controls.update();
    this.controller1.update();
    this.controller2.update();
  }
  
}

module.exports = Scene1;