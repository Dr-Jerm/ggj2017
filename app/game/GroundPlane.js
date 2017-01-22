/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class GroundPlane extends Actor {
  constructor(scene, world) {
    super(scene, world);
    this.physicsScale = {
      x: 2.5,
      y: 1,
      z: 2.5
    };
    // this.geometry = new THREE.PlaneGeometry( 2, 2, 1, 1 );
    // //this.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
    // this.material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
    // //THREE.ColorUtils.adjustHSV( this.material.color, 0, 0, 0.9 );
    // this.object3D = new THREE.Mesh( this.geometry, this.material );
    // this.object3D.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI / 2);
    
    // this.shape = new CANNON.Plane();
    // this.body = new CANNON.Body({ mass: 0 });
    // this.body.addShape(this.shape);
    // this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    
    // scene.add(this.object3D);
    // world.addBody(this.body);
    
    this.shape = new CANNON.Box(new CANNON.Vec3(this.physicsScale.x/2,this.physicsScale.y/2,this.physicsScale.z/2));
    let collisionMesh = new THREE.Mesh(
      new THREE.BoxGeometry( this.physicsScale.x, this.physicsScale.y, this.physicsScale.z),
      new THREE.MeshStandardMaterial( { color: 0x777777, roughness: 1.0, metalness: 0, wireframe: false } )
    );
    collisionMesh.receiveShadow = true;
    this.object3D.add(collisionMesh);
    this.mass = 0;
    this.body = new CANNON.Body({
      mass: this.mass
    });
    this.body.addShape(this.shape);
    world.addBody(this.body);
    scene.add(this.object3D);
  }
}

module.exports = GroundPlane;