/* global WEBVR */
/* global THREE */

class Controller extends THREE.ViveController  {
  constructor(index, controls) {
    super(index);
    
    this.index = index;
    this.showViveControllers = false;
    this.lastPosition = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.isAboveGround = false;
    this.isBelowGround = true;
    let self = this;
    
    
    this.onTriggerDown = (event) => {
      console.log("triggerDown "+ this.index);
      // var worldLocation = this.getWorldPosition();
      // window.game.impact(worldLocation, this.velocity.length(), this.index ? "right" : "left");
    };
    this.onTriggerUp = (event) => {
      console.log("triggerUp "+ this.index);
    };
    
    this.standingMatrix = controls.getStandingMatrix();
    this.addEventListener('triggerdown', this.onTriggerDown);
    this.addEventListener('triggerup', this.onTriggerUp);
    
    if (this.showViveControllers) {
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
    } else {
      var loader1 = new THREE.OBJLoader();
      loader1.setPath('./models/obj/fist/');
      
      
      loader1.load('fist.obj', function(object) {
        var loader1 = new THREE.TextureLoader();
        loader1.setPath('./models/obj/fist/');
        
        var controller = object.children[0];
        controller.material.map = loader1.load(
          'fistDiffuse.png'
        );
        controller.material.side = THREE.DoubleSide;
        
        let mesh = object.clone();
        mesh.position.set(0, 0, 0.2);
        mesh.rotation.set(-Math.PI/2, Math.PI,0);
        mesh.scale.set(0.1,0.1,0.1);
        if (self.index == 1) {
          mesh.scale.x = mesh.scale.y * -1;
        }
        self.add(mesh);
      });
    }
  }
  
  tick(delta) {
    this.update();
    
    var _currentPosition = this.position;
    var _diff = _currentPosition.clone().sub(this.lastPosition);
    this.velocity = _diff.multiplyScalar(delta);
    
    this.lastPosition = this.position.clone();
    
    this.checkWentBelowGround();
  }
  
  getWorldPosition() {
    var matrix = this.matrixWorld;
    return new THREE.Vector3().setFromMatrixPosition( matrix );
  }
  
  checkWentBelowGround() {
    let raycaster =  new THREE.Raycaster();
    var worldLocation = this.getWorldPosition();
    raycaster.set(worldLocation, new THREE.Vector3(0,-1,0));
    var _ground = window.game.scene.ripplePlane.object3D;    
    var _intersects = raycaster.intersectObject(_ground, true)
    if(_intersects.length == 0) {
      this.isBelowGround = true;
      
      if (this.isAboveGround) {
        let worldLocation = this.getWorldPosition();
        window.game.impact(worldLocation, this.velocity.length(), this.index ? "right" : "left");
        console.log("Just went below ground");
      }
      this.isAboveGround = false;
      
    } else {
      this.isAboveGround = true;
      this.isBelowGround = false;
    }
  }
}

let transformPoint = function( vector ) {
  vector.x = ( vector.x + 1.0 ) / 2.0;
  vector.y = ( vector.y / 2.0 );
  vector.z = ( vector.z + 1.0 ) / 2.0;
  return vector;
};

module.exports = Controller;