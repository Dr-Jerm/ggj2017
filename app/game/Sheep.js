/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Sheep extends Actor {
  constructor(scene, world) {
    super(scene, world);
    this.ticks = true;
    this.object3D.scale.set(0.1,0.1,0.1);
    
    var self = this;
    
    var loader = new THREE.OBJLoader();
    loader.setPath('./models/obj/sheep-v1/');
    
    
    loader.load('sheep.obj', function(object) {
      var loader = new THREE.TextureLoader();
      loader.setPath('./models/obj/sheep-v1/');
      
      var sheepMesh = object.children[0];
      sheepMesh.material.map = loader.load(
        'sheepDiffuseMap.png'
      );
      sheepMesh.material.specularMap = loader.load(
        'sheepSpecularMap.png'
      );
      
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

    this.targetPos = this.getNewTargetPos();
    this.velocity = new THREE.Vector3(0,0,0);

    this.speed = 1.5;
    this.rotationRate = 1.5;

    scene.add(this.object3D);
    world.addBody(this.body);

    /*
    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 10, 0, 0 )
    );

    this.line = new THREE.Line( geometry, material );
    this.line1 = new THREE.Line( geometry, material );
    //this.object3D.add( line );
    scene.add( this.line );
    scene.add( this.line1 );
    */

    this.scene = scene;
  }



  tick(delta)
  {
    super.tick(delta);

    this.updateTransform(delta);    


    //this.drawDebugLines()
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
    
    var _finalRotRate = this.rotationRate * delta;
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
    if(_distance > this.speed)
    {
      _velocity = _fwdVect.clone().multiplyScalar(this.speed);
      _velocity.multiplyScalar(delta);
    }
    else
    {
      this.targetPos = this.getNewTargetPos();
    }

    this.object3D.position.add(_velocity);
  }

  // Return the next target position
  getNewTargetPos()
  {
      var randX = this.randRange(-5,5);
      var randZ = this.randRange(-5,5);
      return new THREE.Vector3(randX,0,randZ);
      //return new THREE.Vector3(1,0,-1);
  }

  // Draw forward and destination lines
  drawDebugLines()
  {
    var _targetPos = this.targetPos.clone();
    var _currentPos = this.object3D.position.clone();

    var _fwdVect = this.getForwardVector();
    _fwdVect.add(_currentPos);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      _currentPos,
      _fwdVect
    );
    this.line.geometry = geometry;

    var geometry1 = new THREE.Geometry();
    geometry.vertices.push(
      _currentPos,
      _targetPos
    );
    this.line1.geometry = geometry;
  }

}

module.exports = Sheep;