/* global THREE */
import CANNON from 'cannon';
import MathHelpers from '../util/MathHelpers';
import Actor from '../core/Actor'

class Game extends Actor {
  constructor(scene, world) {
    super(scene,world);
    this.scene = scene;
    this.world = world;
    
    this.score = 0;
    this.impactScalar = 10000.0;
    this.impactYScalar = 20.0;
    
  }
  
  impact(vector3Location, floatScale) {
    let tickables = this.scene.tickingActors;
    for (let i = 0; i < tickables.length; i++) {
      let ticker = tickables[i];
      if (!ticker.physicsEnabled || !ticker.body) continue;
      
      let _objectPos = new THREE.Vector3(ticker.body.position.x, ticker.body.position.y, ticker.body.position.z); //vec3
      let _diff = _objectPos.clone().sub(vector3Location);
      
      let _distanceScale = _diff.length() * floatScale;
      
      let _force = _diff.clone().normalize().multiplyScalar(_distanceScale).multiplyScalar(this.impactScalar);
      
      let worldPoint = ticker.body.position;
      let force = new CANNON.Vec3(_force.x,Math.abs(_force.y) * this.impactYScalar,_force.z);
      ticker.body.applyImpulse(force,worldPoint);
    }
  }
  
  tick(delta) {
    super.tick(delta);
  }
}

module.exports = Game;