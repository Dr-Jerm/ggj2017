/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';
import waves_vert from './shaders/waves.vert';
import waves_frag from './shaders/waves.frag';

class RipplePlane extends Actor {
  constructor(scene, world) {
    super(scene, world);
    
    this.WIDTH = 64;
    this.NUM_TEXELS = this.WIDTH * this.WIDTH;
    this.BOUNDS = 10;
    this.BOUNDS_HALF = this.BOUNDS * 0.5;
    this.timeLeft = 0;

    this.geometry = new THREE.PlaneBufferGeometry(
      this.BOUNDS,
      this.BOUNDS,
      this.WIDTH - 1,
      this.WIDTH - 1
    );

    this.maxRippleSize = 400.0;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
          rippleOriginLeft: { type: '2fv', value: new THREE.Vector2(1000, 1000) },
          rippleOriginRight: { type: '2fv', value: new THREE.Vector2(1000, 1000) },
          timeLeft: { type: 'f', value: 0 },
          timeRight: { type: 'f', value: 0 },
          rippleSizeLeft: { type: 'f', value: this.maxRippleSize },
          rippleSizeRight: { type: 'f', value: this.maxRippleSize },
          falloff: { type: 'f', value: 10.0 }
        },
      vertexShader: waves_vert,
      fragmentShader: waves_frag

    });

    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/island/');
    var self = this;

    loader.load('island_2.obj', function(object) {
      var island = object.children[0];
      island.geometry.computeFaceNormals();
      island.geometry.computeVertexNormals();
      island.material = self.material;
      
      self.object3D.add(island.clone());
      scene.add(self.object3D);
      //self.object3D.scale.set(0.1, 0.1, 0.1);
    });

/*
    this.object3D = new THREE.Mesh(
      this.geometry, 
      this.material
    );

   this.object3D.rotation.x = -Math.PI / 2;
   this.object3D.matrixAutoUpdate = false;
   this.object3D.updateMatrix();

    scene.add(this.object3D);
*/
  }

  acceptPunch(punch_location, hand, power) {
    punch_location = punch_location.clone().multiplyScalar(0.3);
    punch_location = new THREE.Vector2(punch_location.x, -punch_location.z);
    // punch_location = new THREE.Vector2(0,0);
    console.log(punch_location);

    
    if (hand == "left") {
      this.material.uniforms["rippleOriginLeft"] = { 
        type: '2fv', 
        value: punch_location 
      };
      this.material.uniforms["rippleSizeLeft"] = { 
        type: 'f', 
        value: this.maxRippleSize * power
      };
      this.timeLeft = 0;
    } else {
      this.material.uniforms["rippleOriginRight"] = { 
        type: '2fv', 
        value: punch_location 
      };
      this.material.uniforms["rippleSizeRight"] = { 
        type: 'f', 
        value: this.maxRippleSize * power
      };
      this.timeRight = 0;
    }
  }

  tick(delta) {
    this.timeLeft += delta / 2;
    this.timeRight += delta / 2;
    this.material.uniforms.timeLeft = { 
      type: 'f', 
      value: this.timeLeft
    };
    this.material.uniforms.timeRight = { 
      type: 'f', 
      value: this.timeRight
    };
    super.tick(delta);
  }
}

module.exports = RipplePlane;
