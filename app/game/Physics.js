/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Sheep extends Actor {
  constructor(scene, world) {
    super();
    
    this.object3D.scale.set(0.2,0.2,0.2);
    
    var self = this;
    
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/test_arrow/');
    
    
    loader.load('test_arrow.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/test_arrow/');
      
      var controller = object.children[0];
      controller.material.map = loader.load(
        'sheepDiffuseMap.png'
      );
      controller.material.specularMap = loader.load(
        'sheepSpecularMap.png'
      );
      
      self.object3D.add(controller.clone());
    });
    
    this.shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    this.mass = 1;
    this.body = new CANNON.Body({
      mass: 1
    });
    this.body.addShape(this.shape);
    this.body.angularVelocity.set(0,10,0);
    this.body.angularDamping = 0.5;
    
    
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
}

module.exports = Sheep;