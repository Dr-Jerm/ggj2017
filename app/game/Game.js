/* global THREE */
import CANNON from 'cannon';
import MathHelpers from '../util/MathHelpers';
import Actor from '../core/Actor';
import Sheep from './Sheep';

class Game extends Actor {
  constructor(scene, world) {
    super(scene,world);
    this.scene = scene;
    this.world = world;
    
    this.score = 0;
    
    this.impactConfig = {
      scalar: 5000.0,
      yScalar: 4.0,
      maxRange: 3
    };
    
    
    
  }
  
  impact(vector3Location, floatScale) {
    let tickables = this.scene.tickingActors;
    for (let i = 0; i < tickables.length; i++) {
      let ticker = tickables[i];
      if (!ticker instanceof Sheep || !ticker.body) continue;
      
      let _objectPos = new THREE.Vector3(ticker.body.position.x, ticker.body.position.y, ticker.body.position.z); //vec3
      let _diff = _objectPos.clone().sub(vector3Location);
      
      if (_diff.length() > this.impactConfig.maxRange) continue;
      
      let _distanceScale = Math.abs((_diff.length() / this.impactConfig.maxRange) - 1) * floatScale;
      // _distanceScale = 1/(Math.pow(_distanceScale, 2));
      
      let _force = _diff.clone().normalize().multiplyScalar(_distanceScale).multiplyScalar(this.impactConfig.scalar);
      
      let worldPoint = ticker.body.position;
      let force = new CANNON.Vec3(_force.x,Math.abs(_force.y) * this.impactConfig.yScalar,_force.z);
      if (ticker instanceof Sheep) {
        ticker.bump(force, vector3Location);
      }
      // ticker.body.applyImpulse(force,worldPoint);
    }
  }
  
  tick(delta) {
    super.tick(delta);
  }
}

module.exports = Game;