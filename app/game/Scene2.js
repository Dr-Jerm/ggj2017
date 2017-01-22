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
import Sign from './Sign';
import RipplePlane from './RipplePlane';

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
          10000
        );
        var listener = new THREE.AudioListener();
		    camera.add( listener );
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

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        let skybox = new Skybox(this, this.world);

        this.groundPlane = new GroundPlane(this, this.world);
        this.groundPlane.object3D.position.set(0,1.7,0);
        this.groundPlane.body.position.set(0,1.7,0);

        this.ripplePlane = new RipplePlane(this, this.world);
        this.tickingActors.push(this.ripplePlane);
        this.ripplePlane.object3D.position.set(0,2.2,0);
        this.ripplePlane.object3D.scale.set(0.06,0.06,0.06);
      
        this.pen = new Pen(this, this.world, new THREE.Vector3(0,2.18,0));

        this.scoreSign = new DynamicSign(this, this.world);    
        this.scoreSign.object3D.position.set(-2.2,0,-5);   
        this.scoreSign.object3D.rotation.y = 0.3
        this.scoreSign.setMessage("Score");
        this.scoreSign.setNumber( 0 );
        this.tickingActors.push(this.scoreSign);
        this.scoreSign.object3D.visible = false;

        this.timeSign = new DynamicSign(this, this.world);    
        this.timeSign.object3D.position.set(2.5,0,-5);
        this.timeSign.object3D.rotation.y = -0.2
        this.timeSign.setMessage("Time");
        this.timeSign.setNumber(window.game.timeRemaining);
        this.tickingActors.push(this.timeSign);
        this.timeSign.object3D.visible = false;

        this.freezeFrameTimer = 0;
        this.freezeFrameTime = 0;

        this.signs = [];
        var sign_count = 6;
        for (var i = 0; i < sign_count; i++) {
          this.signs[i] = new Sign(this, this.world, i);
          var angle = -i * 2 * Math.PI / sign_count - Math.PI / 2;
          this.signs[i].object3D.position.x = 
            8 * Math.cos(i * 2 * Math.PI / sign_count);
          this.signs[i].object3D.position.z = 
            8 * Math.sin(i * 2 * Math.PI / sign_count);

          this.signs[i].object3D.rotation.y = angle;
        }

        this.numSheep = 100;
        for(var i=0; i<this.numSheep; i++)
        {
            var sheep = new Sheep(this, this.world);
            sheep.object3D.position.y = 2.23;
            this.tickingActors.push(sheep);
        }    

        this.bPause = false;
        
        document.body.onkeyup = (e)=>{
            if(e.keyCode == 32){
                console.log("I pressed spacebar");
                this.bPause = !this.bPause;
            }
            else if(e.keyCode == 87){     
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

        document.body.onmousemove = (e)=>{

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        }

        document.body.onmousedown = (e)=>{
            if(e.button == 0)
            {
                // update the picking ray with the camera and mouse position
                this.raycaster.setFromCamera( this.mouse, this.camera );

                // calculate objects intersecting the picking ray
                var _intersects = this.raycaster.intersectObject( this.ripplePlane.object3D, true );
                if(_intersects.length > 0)
                {
                    var _impactPoint = _intersects[ 0 ].point;
                    window.game.impact(_impactPoint, 0.0008, "right");
                }
                //groundPlane
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
        if(!this.bPause)
        {
            // this.world.step(delta);
            this.world.step(1/60);
            this.controls.update();
            tickActors(this.tickingActors, delta);
        }    
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