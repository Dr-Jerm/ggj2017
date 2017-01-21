/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class GroundPlane extends Actor {
  constructor(scene, world) {
    super();
    
    this.geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
    //this.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
    this.material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
    //THREE.ColorUtils.adjustHSV( this.material.color, 0, 0, 0.9 );
    this.object3D = new THREE.Mesh( this.geometry, this.material );
    
    this.shape = new CANNON.Plane();
    this.body = new CANNON.Body({ mass: 0 });
    this.body.addShape(this.shape);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    this.body.angularVelocity.set(0,10,0);
    this.body.angularDamping = 0.5;
    
    scene.add(this.object3D);
    world.addBody(this.body);
  }
}

module.exports = GroundPlane;