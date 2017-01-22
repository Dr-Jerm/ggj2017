/* global THREE */
import Actor from '../core/Actor';

var soundFiles = [
  'pop.ogg'
];

class SoundManager extends Actor {
  constructor(scene, world) {
    super(scene,world);
    var self = this;
    this.soundDictionary = {};
    
    for (let i = 0; i < soundFiles.length; i++) {
      let path = '../sound/'+soundFiles[i];
      
      var audioLoader = new THREE.AudioLoader();
      var sound1 = new THREE.PositionalAudio( window.game.scene.camera.listener );
      (function(name) {
        audioLoader.load( path, function( buffer ) {
      	sound1.setBuffer( buffer );
      	sound1.setRefDistance( 20 );
      	self.soundDictionary[name];
      });})(soundFiles[i]);
      this.object3D.add( sound1 );
    }
    
   
    document.body.onkeyup = function(e){
      if(e.keyCode == 65){
        console.log("I pressed a");
        self.play3DSound(new THREE.Vector3(), 1);
      }
    };
  }
  
  play3DSound(name, vector3Location, floatScale) {
    let sound = this.soundDictionary[name];
    if (!sound) return;
    
    sound.position = vector3Location;
    sound.play();
  }
  
  tick(delta) {
    super.tick(delta);

  }
}

module.exports = SoundManager;

// var audioLoader = new THREE.AudioLoader();
// var sound1 = new THREE.PositionalAudio( listener );
// audioLoader.load( 'sounds/358232_j_s_song.ogg', function( buffer ) {
// 	sound1.setBuffer( buffer );
// 	sound1.setRefDistance( 20 );
// 	sound1.play();
// });
// this.object3D.add( sound1 );