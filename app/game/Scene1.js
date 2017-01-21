/* global WEBVR */
/* global THREE */
import Controller from './vr-controller';

class Scene1 extends THREE.Scene {
  constructor() {
    super();
    this.controls;
    this.controller1;
    this.controller2;
    let camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth/window.innerHeight,
      0.1,
      10
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
  }
  
  update () {
    this.controls.update();
    this.controller1.update();
    this.controller2.update();
  }
  
}

module.exports = Scene1;