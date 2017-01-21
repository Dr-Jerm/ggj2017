/* global THREE */
import Actor from '../core/Actor';

class Sign extends Actor {
  constructor(scene, world, texture_idx) {
    super(scene, world);

    var signTextures = [
      "controllers.png",
      "credits.png",
      "gamePlay.png",
      "gettingStarted.png",
      "splash1.png",
      "splash2.png",
    ];
    
    console.log("before loader load");
    var self = this;
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/sign/');
    
    
    loader.load('sign.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/sign/');
      
      var signMesh = object.children[0];

      signMesh.material.materials[0].map = loader.load(
        'wood_Base_Color.png'
      );
      signMesh.material.materials[1].map = loader.load(
        signTextures[texture_idx]
      );
      self.object3D.add(signMesh.clone());
    });
    
    console.log(self.object3D);

    scene.add(this.object3D);
  }

  tick()
  {
    super.tick();
  }
}

module.exports = Sign;
