import CANNON from 'cannon';
import Actor from '../core/Actor'

class Game extends Actor {
  constructor(scene, world) {
    super(scene,world);
    this.scene = scene;
    this.world = world;
    
    this.score = 0;
    this.impactScalar = 100000.0;
    
  }
  
  impact(vector3Location, floatScale) {
    let tickables = this.scene.tickingActors;
    for (let i = 0; i < tickables.length; i++) {
      let ticker = tickables[i];
      if (!ticker.physicsEnabled || !ticker.body) continue;
      
      let _objectPos = ticker.body.position; //vec3
      let _diff = vector3Location.clone().sub(_objectPos);
      
      let _distanceScale = _diff.length() * floatScale;
      
      let _force = _diff.clone().normalize().multiplyScalar(_distanceScale).multiplyScalar(this.impactScalar);
      
      let worldPoint = ticker.body.position;
      let force = new CANNON.Vec3(_force.x,_force.y,_force.z);
      ticker.body.applyImpulse(force,worldPoint);
    }
  }
  
  tick(delta) {
    super.tick(delta);
  }
}

module.exports = Game;