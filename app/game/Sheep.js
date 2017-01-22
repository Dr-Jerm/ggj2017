/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';
import FSM from './FSM';


class Sheep extends Actor {
  constructor(scene, world) {
    super(scene, world);
    this.ticks = true;
    //this.object3D.scale.set(0.1,0.1,0.1);
    
    var self = this;
    this.scene = scene;
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/sheep-v2/');
    
    var textures = ['sheepDiffuse.png', 'sheepDiffuseBlack.png', 'sheepDiffuseBW.png', 'sheepDiffuseWhite.png']
    var texIndex = this.randRange(0, textures.length - 1);

    loader.load('sheep.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/sheep-v2/');
      
      var sheepMesh = object.children[0];
      sheepMesh.material.map = loader.load( 
        textures[texIndex]
      );
      /*
      sheepMesh.material.specularMap = loader.load(
        'sheepSpecularMap.png'
      );
*/
      
      self.object3D.add(sheepMesh.clone());
    });
    
    this.shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    this.mass = 1;
    this.body = new CANNON.Body({
      mass: 1
    });
    this.body.addShape(this.shape);
    this.body.angularVelocity.set(0,10,0);
    this.body.angularDamping = 0.5;

    this.wanderRange = 7

    this.targetPos = this.getNewTargetPos(this.wanderRange, this.wanderRange);
    this.velocity = new THREE.Vector3(0,0,0);

    this.brain = new FSM();
    this.brain.setState(this.wander.bind(this));    

    this.grazeTimer = 0;
    this.newDestTimer = 0;
    this.limitInState = this.randRange(2,5);
    this.nextDestTimeRange = this.randRange(2,5);

    this.destinationRange = 0.2;

    this.accel = 0.01;
    this.speed = 0;
    this.maxSpeed = 1.5;
    this.rotationRate = 1;

    scene.add(this.object3D);
    world.addBody(this.body);

    this.scene = scene;
  }

  tick(delta)
  {
    super.tick(delta);

    this.brain.tick(delta);
    this.updateTransform(delta);    

    //this.drawDebugLines()
  }

  wander(delta)
  {
    var _currentPos = this.object3D.position.clone();
    var _targetPos = this.targetPos.clone();
    var _distance =  _targetPos.distanceTo(_currentPos);  

    this.newDestTimer += delta;
    if( this.newDestTimer > this.nextDestTimeRange )
    {
      this.targetPos = this.getNewTargetPos(this.wanderRange, this.wanderRange);
      this.nextDestTimeRange = this.randRange(2,5);
      this.newDestTimer = 0;
    } 

    if(_distance <= this.destinationRange)
    {
      this.speed = 0;
      this.brain.setState(this.graze.bind(this));
    }
  }

  graze(delta)
  {
    var _currentPos = this.object3D.position.clone();
    var _targetPos = this.targetPos.clone();
    // We're Grazing
    var _distance =  _targetPos.distanceTo(_currentPos);    
    if(_distance <= this.destinationRange)
    {
      this.grazeTimer += delta;
      this.speed = 0;
    }

    this.newDestTimer += delta;
    if( this.newDestTimer > this.nextDestTimeRange )
    {
        this.targetPos = this.getNewTargetPos(2, 2);
        this.newDestTimer = 0;
        this.nextDestTimeRange = this.randRange(2,6);
    } 

    if(this.grazeTimer > this.limitInState)
    {
      this.targetPos = this.getNewTargetPos(2, 2); 
      this.limitInState = this.randRange(4,8);
      this.grazeTimer = 0;
      this.brain.timeInState = 0;
      this.speed = 0;
    }
  }

  updateTransform(delta)
  {
    var _targetPos = this.targetPos.clone();
    var _currentPos = this.object3D.position.clone();

    // Handle Position
    var _fwdVect = this.getForwardVector();

    // Handle Rotation
    var _direction = _targetPos.clone().sub(_currentPos).normalize();  
    var _dotProd = _fwdVect.clone().dot(_direction);
    var _theta = Math.acos(_dotProd);

    // Get the destination angle
    var _destDotProd = new THREE.Vector3(1,0,0).dot(_direction);
    var _destTheta = Math.acos(_destDotProd);
    if(_direction.z > 0)
    {
      _destTheta = (2 * Math.PI) - _destTheta;      
    }

    // Ensure we do not use negative angles
    if(this.object3D.rotation.y < 0)
    {
        this.object3D.rotation.y += (2 * Math.PI);
    }

    // Ensure we do not cross over 2 pi radians
    var _yaw = this.object3D.rotation.clone().y % (2 * Math.PI);

    // Get whether to go clockwise or counter clockwise
    var _angleDif = _yaw - _destTheta;
    var _absDif = Math.abs(_angleDif);   
    
    var _finalRotRate = this.rotationRate;      
    if( this.brain.timeInState > 6 )
    {
      _finalRotRate = 2;
    }

    _finalRotRate = _finalRotRate * delta;
    if(_angleDif > 0.0 && _absDif <= Math.PI)
    {
        _finalRotRate *= -1;  
    }
    else if(_angleDif < 0.0 && _absDif > Math.PI)
    {
        _finalRotRate *= -1;
    }

    if(_theta > 0.01)
    {
      this.object3D.rotation.y += _finalRotRate;
    }

    // Update Position
    var _distance =  _targetPos.distanceTo(_currentPos);
    var _velocity = new THREE.Vector3(0,0,0);
    if(_distance > this.destinationRange)
    {
      this.speed += this.accel;
    }

    this.speed = this.clamp(this.speed, 0, this.maxSpeed);
    _velocity = _fwdVect.clone().multiplyScalar(this.speed);
    _velocity.multiplyScalar(delta);

    this.object3D.position.add(_velocity);
  }

  // Return the next target position
  getNewTargetPos(x, z)
  {
      var randX = this.randRange(-x,x);
      var randZ = this.randRange(-z,z);
      var offset = new THREE.Vector3(randX,0,randZ);
      var _currentPos = this.object3D.position.clone();
      var newTarget = _currentPos.add(offset);
      return newTarget;
      //return new THREE.Vector3(1,0,-1);
  }

  // Draw forward and destination lines
  drawDebugLines()
  {
    var _targetPos = this.targetPos.clone();
    var _currentPos = this.object3D.position.clone();

    var _fwdVect = this.getForwardVector();
    _fwdVect.add(_currentPos);

    this.draweLine(_currentPos, _targetPos, 0x00ff00);
    this.draweLine(_currentPos, _fwdVect, 0x0000ff);
  }

}

module.exports = Sheep;