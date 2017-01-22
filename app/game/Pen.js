/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';

class Pen extends Actor {
  	constructor(scene, world, center) {
    	super(scene, world);
		
		this.scene = scene;
		this.object3D.position.set(center.x, center.y, center.z);
		this.radius = 4;

		let collisionMesh = new THREE.Mesh(
		      new THREE.SphereGeometry( this.radius, 6, 6 ),
		      new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
		    );
		this.object3D.add(collisionMesh);


	    scene.add(this.object3D);

	    console.log(center);

	}

  	tick(delta)
  	{
    	super.tick(delta);
    	var _herd = this.scene.herd;

	    for(var i=0; i<_herd.length; i++)
	    {
	        var _sheepPos = _herd[i].getPosition();
    		var _penPos = this.getPosition()
	        var _dist = _penPos.sub(_sheepPos).length();
	        if (_dist < this.radius)
	        {
	        	_herd.splice(i, 1);
	        }
	    }    
	}
}

module.exports = Pen;