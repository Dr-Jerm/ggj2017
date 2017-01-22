/* global WEBVR */
/* global THREE */

import CANNON from 'cannon';
import Sheep from './Sheep';
import Game from './Game';
import Skybox from './Skybox';
import GroundPlane from './GroundPlane';
import Physics from './Physics';
import Pen from './Pen';
import DynamicSign from './DynamicSign';

class Scene2 extends THREE.Scene {
  constructor(renderer) {
    super();
    this.controls;
    
    renderer.setClearColor(0xf0f0f0, 1);

    this.world = new CANNON.World();
    this.world.gravity.set(0,-4.9,0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 10;

    let camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth/window.innerHeight,
      0.1,
      1000
    );
    camera.position.y = 10;
    //camera.rotation.x = 10;
    this.controls = new THREE.OrbitControls( camera, renderer.domElement );
    this.controls.enableZoom = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;

    this.tickingActors = [];
    
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

    window.game = new Game(this, this.world);
    this.tickingActors.push(window.game);

    let skybox = new Skybox(this, this.world);

    let groundPlane = new GroundPlane(this, this.world);
    groundPlane.object3D.position.set(0,1.7,0);
    groundPlane.body.position.set(0,1.7,0);
  
    this.pen = new Pen(this, this.world, new THREE.Vector3(3,2.8,2));

    this.sign = new DynamicSign(this, this.world);    
    this.sign.object3D.position.set(-10,0,0);
    this.tickingActors.push(this.sign);

    this.freezeFrameTimer = 0;
    this.freezeFrameTime = 0;

    this.numSheep = 50;
    for(var i=0; i<this.numSheep; i++)
    {
        var sheep = new Sheep(this, this.world);     
        this.tickingActors.push(sheep);
    }    
    this.sign.setNumSheep( this.numSheep );

    this.bPause = false;
    
      document.body.onkeyup = (e)=>{
        if(e.keyCode == 32){
            console.log("I pressed spacebar");
            this.bPause = !this.bPause;
        }
        else if(e.keyCode == 87){
            console.log("87!");            
            for (let i = 0; i < this.tickingActors.length; i++) 
            {
                if(this.tickingActors[i].object3D.name == "Sheep")
                {
                    this.tickingActors[i].object3D.position.set(_curPos);
                    this.tickingActors[i].physicsEnabled = !this.tickingActors[i].physicsEnabled;
                }

            }
        }
      }
  }
  
  tick (delta) {
    if(!this.bPause)
    {
        // this.world.step(delta);
        this.world.step(1/60);
        this.controls.update();
        tickActors(this.tickingActors, delta);
    }    
  }

  removeSheep()
  {
    this.numSheep--;
    this.sign.setNumSheep( this.numSheep );
  }
}

let tickActors = function (actors, delta) {
for (let i = 0; i < actors.length; i++) {
        if (actors[i].tick) {
            actors[i].tick(delta);
        }
    }
}

module.exports = Scene2;