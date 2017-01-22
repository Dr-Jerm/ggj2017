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
    console.log(THREE.UniformsLib['lights']);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
          rippleOriginLeft: { type: '2fv', value: new THREE.Vector2(1000, 1000) },
          rippleOriginRight: { type: '2fv', value: new THREE.Vector2(1000, 1000) },
          timeLeft: { type: 'f', value: 0 },
          timeRight: { type: 'f', value: 0 },
          rippleSize: { type: 'f', value: 0 }
        },
      vertexShader: waves_vert,
      fragmentShader: waves_frag

    });

    this.object3D = new THREE.Mesh(
      this.geometry, 
      this.material
    );

    this.object3D.rotation.x = -Math.PI / 2;
    this.object3D.matrixAutoUpdate = false;
    this.object3D.updateMatrix();

    scene.add(this.object3D);

  }

  acceptPunch(punch_location, hand) {
    if (hand == "left") {
      this.material.uniforms["rippleOriginLeft"] = { 
        type: '2fv', 
        value: punch_location 
      };
      this.timeLeft = 0;
    } else {
      this.material.uniforms["rippleOriginRight"] = { 
        type: '2fv', 
        value: punch_location 
      };
      this.timeRight = 0;

    }
  }

  tick(delta) {
    this.timeLeft += delta / 10;
    this.timeRight += delta / 10;
    this.material.uniforms.timeLeft = { 
      type: 'f', 
      value: this.timeLeft
    };
    super.tick(delta);
  }
}

module.exports = RipplePlane;
