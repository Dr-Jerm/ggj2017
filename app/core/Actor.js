/* global THREE */

class Actor {
  constructor(scene, world) {
    
    this.ticks = false;
    
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
    this.syncCollisionBodyAndRenderable();
  }
  
  destroy() {
    delete this;
  }
  
  beginPlay() {
    
  }

  randRange(min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

  getForwardVector()
  {
    var _currentPos = this.object3D.position.clone();
    var _currentRot = this.object3D.rotation.clone();

    var _originVect = new THREE.Vector3(1,0,0);

    var _fwdX = _originVect.x * Math.cos(_currentRot.y);
    var _fwdZ = _originVect.x * Math.sin(_currentRot.y);

    var forwardVect = new THREE.Vector3(_fwdX,0,-_fwdZ);

    return forwardVect;
  }
  
  syncCollisionBodyAndRenderable () {
    if (!this.body) return;
    
    if (this.physicsEnabled) {
    this.object3D.position.copy(this.body.position);
    this.object3D.quaternion.copy(this.body.quaternion);
  } else if (!this.physicsEnabled) {
    this.body.position.copy(this.object3D.position);
    this.body.quaternion.copy(this.object3D.quaternion);
  }
}
  
}

module.exports = Actor;