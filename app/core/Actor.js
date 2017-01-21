/* global THREE */

class Actor {
  constructor() {
    // THREE.js
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.object3D = new THREE.Object3D();
    // Cannon.js
    this.mass = null;
    this.body = null;
    this.shape = null;
  }
  
  tick(delta) {
    
  }
  
  destroy() {
    delete this;
  }
  
  beginPlay() {
    
  }
  
}

module.exports = Actor;