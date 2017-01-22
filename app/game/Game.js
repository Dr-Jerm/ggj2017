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
    
    this.initialized = false;
    this.initializedTime = 2.0;
    this.initializedCount = 0;
    
    this.impactConfig = {
      forwardScalar: 2500.0,
        yBaseForce: 10000.0,
      maxRange: 2,
      forceThreshold: 1.0
    };
    
  }
  
  impact(vector3ImpactLocation, floatScale, hand) {
    // floatScale = Math.min(floatScale, 0.0015);
    vector3ImpactLocation.y = 0;
    
    if (!this.initialized) return;
    
    
    if(!this.gameStart)
    {
      this.scene.beginGame();
      this.gameStart = true;
    }

    let tickables = this.scene.tickingActors;
    for (let i = 0; i < tickables.length; i++) {
      let ticker = tickables[i];
      if (!ticker instanceof Sheep || !ticker.body) continue;
      
      let _objectPos = new THREE.Vector3(ticker.body.position.x, 0, ticker.body.position.z); //vec3
      let _diff = _objectPos.clone().sub(vector3ImpactLocation);
      
      if (_diff.length() > this.impactConfig.maxRange) continue;
      
      let _distanceScale = Math.abs((_diff.length() / this.impactConfig.maxRange) - 1) * floatScale;
      // _distanceScale = 1/(Math.pow(_distanceScale, 2));
      
      // Scale forward force
      let _force = _diff.clone().normalize().multiplyScalar(_distanceScale).multiplyScalar(this.impactConfig.forwardScalar);
      
      // Set and scale height
      _force.y = this.impactConfig.yBaseForce * _distanceScale;
      console.log("FORCE: ", _force);
      
      //console.log(_force.length())
      if (_force.length() < this.impactConfig.forceThreshold) continue;
      
      let force = new CANNON.Vec3(_force.x, _force.y,_force.z);
      if (ticker instanceof Sheep) {
        ticker.bump(force, vector3ImpactLocation);
      }
    }

    if (this.scene.ripplePlane) {
      let impact_amt = (1.0 - (1.0/(Math.abs(floatScale * 1000) + 1)));
      this.scene.ripplePlane.acceptPunch(vector3ImpactLocation, hand, impact_amt);
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
    if (!this.gameStart) return; 
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
        // let refresh = function () {
        //   window.location.reload(false); 
        // }
        // setTimeout(refresh, 0);
      }
    }
  }
  
  tick(delta) {
    super.tick(delta);
    this.updateTime(delta);
    
    this.initializedCount += delta;
    if (this.initializedCount >= this.initializedTime) {
      this.initialized = true;
    }
  }
}

module.exports = Game;
