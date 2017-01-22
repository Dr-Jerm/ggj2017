/* global THREE */
import Actor from '../core/Actor';

var soundFiles = [
  
];

class SoundManager extends Actor {
  constructor(scene, world) {
    super(scene,world);
    
    this.soundDictionary = {};
  }
  
  play3DSound(vector3Location, floatScale) {
    
  }
  
  tick(delta) {
    super.tick(delta);

  }
}

module.exports = SoundManager;

// var audioLoader = new THREE.AudioLoader();
// var mesh1 = new THREE.Mesh( sphere, material_sphere1 );
// mesh1.position.set( -250, 30, 0 );
// scene.add( mesh1 );
// var sound1 = new THREE.PositionalAudio( listener );
// audioLoader.load( 'sounds/358232_j_s_song.ogg', function( buffer ) {
// 	sound1.setBuffer( buffer );
// 	sound1.setRefDistance( 20 );
// 	sound1.play();
// });
// mesh1.add( sound1 );