/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';
// import MathHelpers from '../utils/MathHelpers';


class Physics extends Actor {
  constructor(scene, world) {
    super(scene, world);
    
    this.ticks = true;
    
    // this.object3D.scale.set(1.0, 1.0,1.0);
    this.physicsEnabled = true;
    this.totalScale = 0.25;
    this.physicsScale = new THREE.Vector3(1.0, 0.7, 0.5);
    
    var self = this;
    
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/sheep-v2/');
    
    
    loader.load('sheep.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/sheep-v2/');
      
      var sheepMesh = object.children[0];
      sheepMesh.material.map = loader.load(
        'sheepDiffuse.png'
      );
      // mesh.material.specularMap = loader.load(
      //   'sheepSpecularMap.png'
      // );
      
        let mesh = object.clone();
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(0, -0.3*self.totalScale, 0);
        mesh.scale.set(self.totalScale, self.totalScale, self.totalScale);
        // mesh.rotation.set(-Math.PI/2, Math.PI,0);
        self.object3D.add(mesh);
      // self.object3D.position.set(0,2,0);
    });
    
    this.shape = new CANNON.Box(new CANNON.Vec3(this.physicsScale.x * this.totalScale,this.physicsScale.y * this.totalScale,this.physicsScale.z * this.totalScale));
    let collisionMesh = new THREE.Mesh(
      new THREE.BoxGeometry( this.physicsScale.x * this.totalScale, this.physicsScale.y * this.totalScale, this.physicsScale.z * this.totalScale),
      new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
    );
    this.object3D.add(collisionMesh);
    this.mass = 10;
    this.body = new CANNON.Body({
      mass: this.mass
    });
    this.body.addShape(this.shape);
    // this.body.angularVelocity.set(0,10,0);
    // this.body.angularDamping = 0.5;
    
    
    scene.add(this.object3D);
    world.addBody(this.body);
  }
  
  tick(delta) {
    super.tick(delta);
    
  }
}

module.exports = Physics;