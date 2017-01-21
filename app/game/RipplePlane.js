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

    this.geometry = new THREE.PlaneBufferGeometry(
      this.BOUNDS,
      this.BOUNDS,
      this.WIDTH - 1,
      this.WIDTH - 1
    );

    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib['phong'].uniforms,
        {
          heightmap: {value: null}
        }
      ]),
      vertexShader: waves_vert,
      fragmentShader: THREE.ShaderChunk['meshphong_frag']
    });

    this.object3D = new THREE.Mesh(
      this.geometry, 
      this.material
    );

    this.object3D.rotation.x = -Math.PI / 2;
    this.object3D.matrixAutoUpdate = false;
    this.object3D.updateMatrix();

    this.material.lights = true;
    this.material.color = new THREE.Color(0x0040c0);
    this.material.specular = new THREE.Color(0x111111);
    this.material.shininess = 50;

    this.material.uniforms.diffuse.value = this.material.color;
    this.material.uniforms.specular.value = this.material.specular;
    this.material.uniforms.shininess.value = Math.max(this.material.shininess, 1e-4);
    this.material.uniforms.opacity.value = this.material.opacity;

    this.material.defines.WIDTH = this.WIDTH.toFixed(1);
    this.material.defines.BOUNDS = this.BOUNDS.toFixed(1);

    this.waterUniforms = this.material.uniforms;

    scene.add(this.object3D);
    this.gpuCompute = new GPUComputationRenderer(this.WIDTH, this.WIDTH, scene.renderer);
    this.heightmap0 = this.gpuCompute.createTexture();

    console.log(waves_frag);
    this.heightMapVariable = this.gpuCompute.addVariable(
      "heightmap",
      waves_frag,
      this.heightmap0
    );

    this.gpuCompute.setVariableDependencies(
      this.heightMapVariable, 
      [this.heightMapVariable]
    );
    this.heightMapVariable.material.uniforms.rippleOrigin = {
      value: new THREE.Vector2(-1, 0)
    };
    this.heightMapVariable.material.uniforms.rippleSize = { value: 0.15 };
    this.heightMapVariable.material.uniforms.viscosityConstant = { value: 0.1 };
    this.heightMapVariable.material.defines.BOUNDS = this.BOUNDS.toFixed(1);

    var error = this.gpuCompute.init();
    if (error != null) {
      console.log(error);
    }

  }

  tick(delta) {
    super.tick(delta);
    this.gpuCompute.compute();
    this.waterUniforms.heightmap.value = 
      this.gpuCompute.getCurrentRenderTarget(this.heightMapVariable).texture;
  }
}

module.exports = RipplePlane;
