/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Physics extends Actor {
  constructor(scene, world) {
    super(scene, world);
    
    this.ticks = true;
    
    this.object3D.scale.set(1.0, 1.0,1.0);
    this.physicsEnabled = true;
    
    var self = this;
    
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/test_arrow/');
    
    
    loader.load('test_arrow.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/test_arrow/');
      
      var mesh = object.children[0];
      mesh.material.map = loader.load(
        'sheepDiffuseMap.png'
      );
      mesh.material.specularMap = loader.load(
        'sheepSpecularMap.png'
      );
      
      self.object3D.add(mesh.clone());
      // self.object3D.position.set(0,2,0);
    });
    
    this.shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    let collisionMesh = new THREE.Mesh(
      new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 ),
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
    
    
    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 100, 0 )
    );

    var line = new THREE.Line( geometry, material );
    this.object3D.add( line );
    
    scene.add(this.object3D);
    world.addBody(this.body);
  }
  
  tick(delta) {
    super.tick(delta);
    
  }
}

module.exports = Physics;