/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Sheep extends Actor {
  constructor() {
    super();
    
    var self = this;
    
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/sheep-v1/');
    
    
    loader.load('sheep.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/sheep-v1/');
      
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
  }
}

module.exports = Sheep;