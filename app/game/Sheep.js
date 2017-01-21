/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';


class Sheep extends Actor {
  constructor() {
    super();
    
    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    for ( var i =0; i < this.geometry.faces.length; i += 2 ) {
      var hex = Math.random() * 0xffffff;
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
  }
}

module.exports = Sheep;