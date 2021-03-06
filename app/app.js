/* global WEBVR */
/* global THREE */
import Scene1 from './game/Scene1.js';
import Scene2 from './game/Scene2.js';



if (WEBVR.isAvailable() === false) {
  // document.body.appendChild(WEBVR.getMessage());
}

let scene;
let webGLRenderer;
let vrRenderer;
let renderer;

let init = function () {
	let container = document.createElement('div');
	document.body.appendChild(container);
	
  
  webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
  webGLRenderer.setPixelRatio(window.devicePixelRatio);
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;
  webGLRenderer.gammaInput = true;
  webGLRenderer.gammaOutput = true;
  container.appendChild(webGLRenderer.domElement);
  if (WEBVR.isAvailable() === true) {
    vrRenderer = new THREE.VREffect(webGLRenderer);
    document.body.appendChild(WEBVR.getButton(vrRenderer));
    renderer = vrRenderer;
    scene = new Scene1(renderer);
  } else {
    renderer = webGLRenderer;
    scene = new Scene2(renderer);
  }
  
  window.addEventListener('resize', onWindowResize, false);
};

let time;
let delta = 0;
let tick = function () {
  if (WEBVR.isAvailable() === true) {
    vrRenderer.requestAnimationFrame(tick);
  } else {
    window.requestAnimationFrame(tick);
  }
  let now = new Date().getTime();
  delta = (now - (time || now))/1000;
  time = now;
  
  if (delta > 0) {
    scene.tick(delta);
  }
  
  renderer.render(scene, scene.camera);
};

let onWindowResize = function() {
  scene.camera.aspect = window.innerWidth/window.innerHeight;
  scene.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

init();
tick();
