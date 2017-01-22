/* global THREE */
import Actor from '../core/Actor';
import CANNON from 'cannon';

class Pen extends Actor {
  	constructor(scene, world, center) {
    	super(scene, world);
		
		this.scene = scene;
    	var self = this;

	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/fence/');
	    	    
	    loader.load('fence_v2.obj', function(object) {
	      var loader = new THREE.TextureLoader();
	      loader.setPath('./models/obj/fence/');
	      
      		var penMesh1 = object.children[0];
      		var penMesh2 = object.children[1];
      		var penMesh3 = object.children[2];
			self.object3D.add(penMesh1);
			self.object3D.add(penMesh2);
			self.object3D.add(penMesh3);

			penMesh1.material.map = loader.load( 
			'fenceDiffuse.png'
			);
			penMesh1.material.specularMap = loader.load(
			'fenceSpecular.png'
			);
		    penMesh1.castShadow = true;
		    penMesh1.receiveShadow = true;

			penMesh2.material.map = loader.load( 
			'fenceDiffuse.png'
			);
			penMesh2.material.specularMap = loader.load(
			'fenceSpecular.png'
			);
		    penMesh2.castShadow = true;
		    penMesh2.receiveShadow = true;

			penMesh3.material.map = loader.load( 
			'fenceDiffuse.png'
			);
			penMesh3.material.specularMap = loader.load(
			'fenceSpecular.png'
			);
		    penMesh3.castShadow = true;
		    penMesh3.receiveShadow = true;
/*
			let collisionMesh = new THREE.Mesh(
			      new THREE.SphereGeometry( self.radius, 6, 6 ),
			      new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
			    );
			self.object3D.add(collisionMesh);
			*/

	    });

		this.object3D.position.set(center.x, center.y, center.z);
		var _scale = 0.05;
    	this.object3D.scale.set(_scale,_scale,_scale);
		this.radius = 6 * _scale;


	    //this.body.addShape(this.shape);
	    //world.addBody(this.body);
    
	    scene.add(this.object3D);

	    console.log(center);

	}
}

module.exports = Pen;