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
    
    console.log(self.object3D);

    scene.add(this.object3D);
    this.width = window.innerWidth, this.height = window.innerHeight / 2;
    this.size = 256;
    
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 128;
    this.canvas.height = 128;
    this.ctx = this.canvas.getContext('2d');

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

      this.texture = new THREE.Texture(this.canvas);
      signMesh.material.materials[1].map = this.texture;
      
      self.object3D.add(signMesh.clone());

    });
    

  }

  changeCanvas() {
    this.ctx.font = '20pt Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(new Date().getTime(), this. canvas.width / 2, this.canvas.height / 2);
  }

  tick(delta)
  {
    super.tick(delta);
    this.texture.needsUpdate = true;
    this.changeCanvas();
  }
}

module.exports = Sign;
