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
import Sign from './Sign';
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
    
    this.offsety = 1.5;

    let camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth/window.innerHeight,
      0.1,
      10000
    );
    var listener = new THREE.AudioListener();
		camera.add( listener );
    
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
    this.groundPlane = new GroundPlane(this, this.world);
    this.groundPlane.object3D.position.set(0,1.7 - this.offsety,0);
    this.groundPlane.body.position.set(0,1.7 - this.offsety,0);
    
    this.ripplePlane = new RipplePlane(this, this.world);
    this.tickingActors.push(this.ripplePlane);
    this.ripplePlane.object3D.position.set(0,2.2 - this.offsety,0);
    this.ripplePlane.object3D.scale.set(0.06,0.06,0.06);
    
    this.pen = new Pen(this, this.world, new THREE.Vector3(0,2.18 - this.offsety,0));

    this.scoreSign = new DynamicSign(this, this.world);    
    this.scoreSign.object3D.position.set(-2.2,0 - this.offsety,-5);   
    this.scoreSign.object3D.rotation.y = 0.3
    this.scoreSign.setMessage("Score");
    this.scoreSign.setNumber( 0 );
    this.tickingActors.push(this.scoreSign);
    this.scoreSign.visible = false;

    this.timeSign = new DynamicSign(this, this.world);    
    this.timeSign.object3D.position.set(2.5,0 - this.offsety,-5);
    this.timeSign.object3D.rotation.y = -0.2
    this.timeSign.setMessage("Time");
    this.timeSign.setNumber(window.game.timeRemaining);
    this.tickingActors.push(this.timeSign);
    this.timeSign.visible = false;

    this.signs = [];
    var sign_count = 8;
    for (var i = 0; i < 6; i++) {
      this.signs[i] = new Sign(this, this.world, i);
      var angle = -i * 2 * Math.PI / sign_count - Math.PI / 2;
      this.signs[i].object3D.position.x = 
        8 * Math.cos(i * 2 * Math.PI / sign_count);
      this.signs[i].object3D.position.z = 
        8 * Math.sin(i * 2 * Math.PI / sign_count);

        this.signs[i].object3D.position.y = - this.offsety;
      this.signs[i].object3D.rotation.y = angle;
    }


    this.numSheep = 50;
    for(var i=0; i<this.numSheep; i++)
    {
        var sheep = new Sheep(this, this.world);
        sheep.object3D.position.y = 2.23- this.offsety;
        this.tickingActors.push(sheep);
    }    

    this.bPause = false;

    
    document.body.onkeyup = function(e){
      if(e.keyCode == 32){
        console.log("I pressed spacebar");
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

  beginGame() {
        for (var key in this.signs) {
            let sign = this.signs[key];
            sign.object3D.visible = false;
        }
        this.scoreSign.object3D.visible = true;
        this.timeSign.object3D.visible = true;
    }
  
  tick (delta) {
    this.world.step(delta);
    //this.world.step(1/60);
    this.controls.update();
    tickActors(this.tickingActors, delta);
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