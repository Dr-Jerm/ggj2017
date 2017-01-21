/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Sheep extends Actor {
  constructor() {
    super();
    
    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    for ( var i =0; i < this.geometry.faces.length; i += 2 ) {
      var hex = 0xff0000;
      this.geometry.faces[ i ].color.setHex( hex );
      this.geometry.faces[ i + 1 ].color.setHex( hex );
    }
    this.material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    
    this.shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    this.mass = 1;
    this.body = new CANNON.Body({
      mass: 1
    });
    this.body.addShape(this.shape);
    this.body.angularVelocity.set(0,10,0);
    this.body.angularDamping = 0.5;

    this.targetPos = this.getNewTargetPos()
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
      this.targetPos = this.getNewTargetPos()
    }

    this.mesh.position.add(_velocity);
  }

  getNewTargetPos()
  {
      var randX = this.randRange(-10,10);
      var randY = this.randRange(-10,10);
      return new THREE.Vector3(randX,randY,0)
  }

  randRange(min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }
}

module.exports = Sheep;