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
  
  setPosition(x,y,z) {
    this.object3D.position.set(x,y,z);
    if (this.body) {
      //this.body.position.set(x,y,z);
    }
  }

  setPosition(newPos) {
    this.object3D.position.set(newPos);
    if (this.body) {
      //this.body.position.set(x,y,z);
    }
  }
  
}

module.exports = Actor;