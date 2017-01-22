/* global THREE */
import Actor from '../core/Actor';

class DynamicSign extends Actor {
  constructor(scene, world, texture_idx) {
    super(scene, world);

    console.log("before loader load");
    var self = this;
    
    console.log(self.object3D);

    scene.add(this.object3D);
    this.width = window.innerWidth, this.height = window.innerHeight / 2;
    this.size = 256;
    
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 128;
    this.canvas.height = 128;
    this.message = "Sheep Left";
    this.number = "0";
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

      self.texture = new THREE.Texture(self.canvas);
      signMesh.material.materials[1].map = self.texture;
      self.texture.needsUpdate = true;
      
      self.object3D.add(signMesh.clone());
      self.object3D.scale.set(10,10,10);

    });
  }

  changeCanvas() {
    this.ctx.font = '18pt Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.message, this. canvas.width / 2, this.canvas.height / 3);
    this.ctx.font = '40pt Arial';
    this.ctx.fillText(this.number, this. canvas.width / 2, this.canvas.height / (1.5));
  }

  setNumSheep( value )
  {
    this.number = value;
    if(this.texture)
    {
      this.texture.needsUpdate = true;  
    }    
  }

  tick(delta)
  {
    super.tick(delta);
    
    this.changeCanvas();
  }
}

module.exports = DynamicSign;
