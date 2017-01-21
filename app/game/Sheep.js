/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Sheep extends Actor {
  constructor() {
    super();
    this.object3D.scale.set(0.1,0.1,0.1);
    
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

    this.targetPos = this.getNewTargetPos();
    this.velocity = new THREE.Vector3(0,0,0);

    this.speed = 0.1;

  }

  tick()
  {
    super.tick();

    var _targetPos = this.targetPos.clone();
    var _currentPos = this.mesh.position.clone();

    var _direction = new THREE.Vector3().subVectors(_targetPos,_currentPos).normalize();    
    var _distance =  _targetPos.distanceTo(_currentPos);

    var _velocity = new THREE.Vector3(0,0,0);
    if(_distance > this.speed)
    {
      _velocity = _direction.clone().multiplyScalar(this.speed);
    }
    else
    {
      this.targetPos = this.getNewTargetPos();
    }

    this.mesh.position.add(_velocity);
  }

  getNewTargetPos()
  {
      var randX = this.randRange(-10,10);
      var randY = this.randRange(-10,10);
      return new THREE.Vector3(randX,randY,0);
  }

  randRange(min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }
}

module.exports = Sheep;