/* global WEBVR */
/* global THREE */
import CANNON from 'cannon';
import Controller from './vr-controller';
import Game from './Game';
import Skybox from './Skybox';
import GroundPlane from './GroundPlane';
import Pen from './Pen';
import Sheep from './Sheep';
import DynamicSign from './DynamicSign';
import RipplePlane from './RipplePlane';

class Scene1 extends THREE.Scene {
  constructor(renderer) {
    super();
    this.controls;
    
    this.tickingActors = [];
    
    let controller1;
    let controller2;
    
    this.world = new CANNON.World();
    this.world.gravity.set(0,-4.9,0);
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
    light.rotation.set(2, 2, 5.0);
    
    // light.castShadow = true;
    // // light.shadow.camera.zoom = 4;
    // // light.shadow.camera.top = 2;
    // // light.shadow.camera.bottom = -2;
    // // light.shadow.camera.right = 2;
    // // light.shadow.camera.left = -2;
    
    // // light.shadow.mapSize.set(4096, 4096);
    this.add(light);
    
    this.camera = camera;
    
    this.controls = new THREE.VRControls(camera);
    this.controls.standing = true;
    
    controller1 = new Controller(0, this.controls);
    this.tickingActors.push(controller1);
    this.add(controller1);
    controller2 = new Controller(1, this.controls);
    this.add(controller2);
    this.tickingActors.push(controller2);
    
    window.game = new Game(this, this.world);
    this.tickingActors.push(window.game);
    
    let skybox = new Skybox(this, this.world);
    
    // let sheep = new Sheep();
    // this.add(sheep.object3D);
    let groundPlane = new GroundPlane(this, this.world);
    groundPlane.object3D.position.set(0,1.7,0);
    groundPlane.body.position.set(0,1.7,0);
    
    // this.ripplePlane = new RipplePlane(this, this.world);
    // this.tickingActors.push(this.ripplePlane);
    // this.ripplePlane.object3D.position.set(0,1.78,0);
    // this.ripplePlane.object3D.scale.set(0.2,1,0.2);
    
    this.pen = new Pen(this, this.world, new THREE.Vector3(3,2.8,2));

    this.sign = new DynamicSign(this, this.world);    
    this.sign.object3D.position.set(10,0,0);
    this.sign.object3D.scale.set(10,10,10);
    this.tickingActors.push(this.sign);

    this.numSheep = 10;
    for(var i=0; i<this.numSheep; i++)
    {
        var sheep = new Sheep(this, this.world);
        sheep.object3D.position.y = 2.23;
        this.tickingActors.push(sheep);
    }    
    this.sign.setNumSheep( this.numSheep );

    this.bPause = false;
    
    document.body.onkeyup = function(e){
      if(e.keyCode == 32){
        console.log("I pressed spacebar");
        var worldPoint = new CANNON.Vec3(0,0,0);
        var force = new CANNON.Vec3(0,10,0);
        // physics.body.applyImpulse(force,worldPoint);
        for (let i = 0; i < this.tickingActors.length; i++) 
        {
          if(this.tickingActors[i].object3D.name == "Sheep")
          {
              this.tickingActors[i].physicsEnabled = !this.tickingActors[i].physicsEnabled;
          }
        }
      }
    }
  }
  
  tick (delta) {
    // this.world.step(delta);
    this.world.step(1/60);
    this.controls.update();
    tickActors(this.tickingActors, delta);
  }
  removeSheep()
  {
    this.numSheep--;
    console.log("LESS SHEEP ", this.numSheep);
    this.sign.setNumSheep( this.numSheep );
  }
}

let tickActors = function (actors, delta) {
  for (let i = 0; i < actors.length; i++) {
    if (actors[i].tick) {
      actors[i].tick(delta);
    }
  }
};

module.exports = Scene1;