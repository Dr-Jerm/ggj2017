/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';
import FSM from './FSM';
import MathHelpers from '../util/MathHelpers';


class Sheep extends Actor {
  constructor(scene, world) {
    super(scene, world);
    this.ticks = true;
    //this.object3D.scale.set(0.1,0.1,0.1);

    // this.hackyYOffset = 0.56;
    this.lastPosition = THREE.Vector3();
    
    this.physicsEnabled = false;
    this.totalScale = 0.075;
    this.physicsScale = new THREE.Vector3(1.0, 0.7, 0.5);
    
    var self = this;
    this.scene = scene;
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/sheep-v2/');
    
    var textures = ['sheepDiffuse.png', 'sheepDiffuseBlack.png', 'sheepDiffuseBW.png', 'sheepDiffuseWhite.png', 'sheepDiffuseZombie.png']
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
      let mesh = object.clone();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(0, -0.3*self.totalScale, 0);
      mesh.scale.set(self.totalScale, self.totalScale, self.totalScale);
      // mesh.rotation.set(-Math.PI/2, Math.PI,0);
      self.object3D.add(mesh);
    });
    
    this.shape = new CANNON.Box(new CANNON.Vec3((this.physicsScale.x * this.totalScale)/2,(this.physicsScale.y * this.totalScale)/2,(this.physicsScale.z * this.totalScale)/2));
    let collisionMesh = new THREE.Mesh(
      new THREE.BoxGeometry( this.physicsScale.x * this.totalScale, this.physicsScale.y * this.totalScale, this.physicsScale.z * this.totalScale),
      new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
    );
    this.object3D.add(collisionMesh);
    this.mass = 5;
    this.body = new CANNON.Body({
      mass: this.mass
    });
    this.body.addShape(this.shape);

    this.object3D.position.x = this.randFloatRange(-1,1);
    this.object3D.position.y = 2.8;
    this.object3D.position.z = this.randFloatRange(-1,1);

    this.wanderRange = 1

    this.velocity = new THREE.Vector3(0,0,0);

    this.brain = new FSM();
    this.brain.setState(this.wander.bind(this));    

    this.grazeTimer = 0;
    this.newDestTimer = 0;
    this.limitInState = this.randFloatRange(2,5);
    this.nextDestTimeRange = this.randFloatRange(2,5);

    this.destinationRange = 0.2;

    this.accel = 0.01;
    this.speed = 0;
    //this.maxSpeed = 1.5;
    this.maxSpeed = 0.25;
    this.rotationRate = 1;

    this.pen = scene.pen;
    this.bIsInPen = false;

    this.targetPos = this.getNewTargetPos(this.wanderRange, this.wanderRange);

    scene.add(this.object3D);
    world.addBody(this.body);

    this.scene = scene;
  }

  checkIsInPen()
  {
      var _sheepPos = this.getPosition();
      var _penPos = this.pen.getPosition()
      var _dist = _penPos.sub(_sheepPos).length();
      if (_dist < this.pen.radius)
      {
        this.setPenned();        
        this.scene.removeSheep()
      }
  }

  tick(delta)
  {
    super.tick(delta);

    this.brain.tick(delta);
    this.updateTransform(delta);   

    if(!this.bIsInPen)
    {
      this.checkIsInPen(); 
    }
    
    if (this.physicsEnabled) {
      this.checkIfLanded(delta);
    }
    //this.drawDebugLines()
  }
  
  checkIfLanded (delta) {
    let _currentPosition = MathHelpers.cannonVec3ToThreeVec3(this.body.position);
    
    // let _diff = _currentPosition.clone()
    
    
    
    
    this.lastPosition = MathHelpers.cannonVec3ToThreeVec3(this.body.position);
  }
  
  bump (forceVector, sourceVector) {
    this.physicsEnabled = true;
    this.body.applyImpulse(forceVector,this.body.position.clone());
  }

  wander(delta)
  {
    var _currentPos = this.getPosition();
    var _targetPos = this.targetPos.clone();
    var _distance =  _targetPos.distanceTo(_currentPos);  

    this.newDestTimer += delta;
    if( this.newDestTimer > this.nextDestTimeRange )
    {
      this.targetPos = this.getNewTargetPos(this.wanderRange, this.wanderRange);
      this.nextDestTimeRange = this.randFloatRange(2,5);
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
    var _currentPos = this.getPosition();
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
        this.nextDestTimeRange = this.randFloatRange(2,6);
    } 

    if(this.grazeTimer > this.limitInState)
    {
      this.targetPos = this.getNewTargetPos(2, 2); 
      this.limitInState = this.randFloatRange(4,8);
      this.grazeTimer = 0;
      this.brain.timeInState = 0;
      this.speed = 0;
    }
  }

  setPenned()
  {
    this.bIsInPen = true;
    this.targetPos = this.getPenTargetPos();
    this.newDestTimer = 0;
    this.nextDestTimeRange = this.randFloatRange(2,6);
    this.brain.setState(this.penned.bind(this));
    this.maxSpeed = this.maxSpeed / 2.0;
  }

  penned(delta)
  {
    this.newDestTimer += delta;
    if( this.newDestTimer > this.nextDestTimeRange )
    {
        this.newDestTimer = 0;
        this.nextDestTimeRange = this.randFloatRange(2,4);
        this.targetPos = this.getPenTargetPos();
    } 
  }

  updateTransform(delta)
  {
    var _targetPos = this.targetPos.clone();
    var _currentPos = this.getPosition();

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
    var _currentPos = this.getPosition();
    var _penPos = this.pen.getPosition();

    var _difference = _penPos.clone().sub(_currentPos);
    var _distance = _difference.length();
    if(_distance >= 2)
    {
      var randX = this.randFloatRange(-x,x);
      var randZ = this.randFloatRange(-z,z);
      var offset = new THREE.Vector3(randX,0,randZ);
      var _currentPos = this.getPosition();
      var newTarget = _currentPos.add(offset);
      return newTarget;
    }
    else
    {
      var _penDir = _difference.normalize().multiplyScalar(-1);
      var randX = this.randFloatRange(0,z);
      var randZ = this.randFloatRange(0,z);
      var _cPerpVect = new THREE.Vector3(_penDir.z, 0, -_penDir.x).multiplyScalar(randX);
      var _ccPerpVect = new THREE.Vector3(-_penDir.z, 0, _penDir.x).multiplyScalar(randZ);

      var _newDir = _penDir.add(_cPerpVect).add(_ccPerpVect);
      var newTarget = _currentPos.add(_newDir);
      return newTarget;
    }
  } 

  // Return the next target position
  getPenTargetPos()
  {
    var _penPos = this.pen.getPosition();
    var _rad = this.pen.radius * 0.1;
    var randX = this.randFloatRange(-_rad,_rad);
    var randZ = this.randFloatRange(-_rad,_rad);
    var offset = new THREE.Vector3(randX,0,randZ);
    var newTarget = _penPos;//.add(offset);

    return newTarget;
  }

  // Draw forward and destination lines
  drawDebugLines()
  {
    var _targetPos = this.targetPos.clone();
    var _currentPos = this.getPosition();

    var _fwdVect = this.getForwardVector();
    _fwdVect.add(_currentPos);

    this.draweLine(_currentPos, _targetPos, 0x00ff00);
    this.draweLine(_currentPos, _fwdVect, 0x0000ff);
  }

}

module.exports = Sheep;