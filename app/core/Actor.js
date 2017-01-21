/* global THREE */

class Actor {
  constructor(scene, world) {
    
    // THREE.js
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.object3D = new THREE.Object3D();
    // Cannon.js
    this.physicsEnabled = false;
    this.mass = null;
    this.body = null;
    this.shape = null;
  }
  
  tick(delta) {
    if (this.physicsEnabled && this.body) {
      this.object3D.position.copy(this.body.position);
      this.object3D.quaternion.copy(this.body.quaternion);
    }
  }
  
  destroy() {
    delete this;
  }
  
  beginPlay() {
    
  }
  
  setPosition(x,y,z) {
    this.object3D.position.set(x,y,z);
    if (this.body) {
      this.body.position.set(x,y,z);
    }
  }
  
}

module.exports = Actor;