/* global WEBVR */
/* global THREE */

class Controller extends THREE.ViveController  {
  constructor(index, controls) {
    super(index);
    
    this.index = index;
    this.lastPosition = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    let self = this;
    
    this.onTriggerDown = (event) => {
      console.log("triggerDown "+ this.index);
      window.game.impact(this.position, this.velocity.length());
    };
    this.onTriggerUp = (event) => {
      console.log("triggerUp "+ this.index);
    };
    
    this.standingMatrix = controls.getStandingMatrix();
    this.addEventListener('triggerdown', this.onTriggerDown);
    this.addEventListener('triggerup', this.onTriggerUp);
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/vive-controller/');
    
    
    loader.load('vr_controller_vive_1_5.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/vive-controller/');
      
      var controller = object.children[0];
      controller.material.map = loader.load(
        'onepointfive_texture.png'
      );
      controller.material.specularMap = loader.load(
        'onepointfive_spec.png'
      );
      
      self.add(object.clone());
    });
  }
  
  tick(delta) {
    this.update();
    
    var _currentPosition = this.position;
    var _diff = _currentPosition.clone().sub(this.lastPosition);
    this.velocity = _diff.multiplyScalar(delta);
    
    this.lastPosition = this.position.clone();
  }
}

module.exports = Controller;