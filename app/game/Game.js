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
    this.timeRemaining = 60;

    this.gameStart = false;
    this.gameOver = false;
    
    this.impactConfig = {
      scalar: 4000.0,
      yScalar: 15.0,
      maxRange: 2,
      forceThreshold: 1.0
    };
    
  }
  
  impact(vector3Location, floatScale, hand) {
    if(!this.gameStart)
    {
      this.scene.beginGame();
      this.gameStart = true;
    }

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
      
      console.log(_force.length())
      if (_force.length() < this.impactConfig.forceThreshold) continue;
      
      let worldPoint = ticker.body.position;
      let force = new CANNON.Vec3(_force.x,Math.abs(_force.y) * this.impactConfig.yScalar,_force.z);
      if (ticker instanceof Sheep) {
        ticker.bump(force, vector3Location);
      }
      // ticker.body.applyImpulse(force,worldPoint);
    }

    if (this.scene.ripplePlane) {
      let impact_amt = (1.0 - (1.0/(Math.abs(floatScale * 1000) + 1)));
      this.scene.ripplePlane.acceptPunch(vector3Location, hand, impact_amt);
    }

  }

  incrementScore()
  {
    if(!this.gameOver)
    {
      this.score++;
      this.scene.scoreSign.setNumber( this.score );
    }
  }

  updateTime(delta)
  {
    this.timeRemaining -= delta;
    this.timeRemaining = Math.max(0, this.timeRemaining);
    var _secondsRemaining = Math.floor(this.timeRemaining);
    this.scene.timeSign.setNumber( _secondsRemaining );

    if(this.timeRemaining <= 0)
    {
      if(!this.gameOver)
      {
        this.gameOver = true;
        this.scene.timeSign.setMessage("Restarting")
        this.timeRemaining = 10;
      }
      else
      {
        window.location.reload(false); 
      }
    }
  }
  
  tick(delta) {
    super.tick(delta);
    this.updateTime(delta);
  }
}

module.exports = Game;
