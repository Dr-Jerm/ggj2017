/* global WEBVR */
/* global THREE */

class Controller extends THREE.ViveController  {
  constructor(index, controls) {
    super(index);
    
    this.index = index;
    let self = this;
    
    this.onTriggerDown = function (event) {
      console.log("triggerDown "+ this.index);
    };
    this.onTriggerUp = function (event) {
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
}

module.exports = Controller;