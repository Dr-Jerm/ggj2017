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

    this.speed = 0.1;

    scene.add(this.object3D);
    world.addBody(this.body);

    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 10, 0, 0 )
    );

    var line = new THREE.Line( geometry, material );
    this.object3D.add( line );

  }

  tick()
  {
    super.tick();

    var _targetPos = this.targetPos.clone();
    var _currentPos = this.object3D.position.clone();

    var _direction = _targetPos.clone().sub(_currentPos).normalize();    
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

    this.object3D.position.add(_velocity);

    /*
    var dotProd = .clone().dot(_currentPos);
    _targetPos.mag
    var _theta = Math.arccos()
    */

    this.object3D.rotation.y += 0.1;
  }

  getNewTargetPos()
  {
      var randX = this.randRange(-10,10);
      var randZ = this.randRange(-10,10);
      return new THREE.Vector3(randX,0,randZ);
  }

  randRange(min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }
}

module.exports = Sheep;