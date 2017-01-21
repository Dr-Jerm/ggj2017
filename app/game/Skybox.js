/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Sheep extends Actor {
  constructor(scene, world) {
    super();
    
    var self = this;
    
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/skybox/');
    
    
    loader.load('skybox.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/skybox/');
      
      var skybox = object.children[0];
      skybox.material.map = loader.load(
        'skyboxDiffuse.png'
      );
      
      self.object3D.add(skybox.clone());
    });
    
    scene.add(this.object3D);
  }
}

module.exports = Sheep;