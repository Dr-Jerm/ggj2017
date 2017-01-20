/* global WEBVR */
/* global THREE */
import Scene1 from './game/Scene1.js';


if (WEBVR.isAvailable() === false) {
  document.body.appendChild(WEBVR.getMessage());
}

let scene;
let vrRenderer;
let renderer;

let init = function () {
	let container = document.createElement('div');
	document.body.appendChild(container);
  scene = new Scene1();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  container.appendChild(renderer.domElement);
  vrRenderer = new THREE.VREffect(renderer);
  if (WEBVR.isAvailable() === true) {
    document.body.appendChild(WEBVR.getButton(vrRenderer));
  }
  
  window.addEventListener('resize', onWindowResize, false);
}

let tick = function () {
  vrRenderer.requestAnimationFrame(tick);
  scene.update();
  vrRenderer.render(scene, scene.camera);
}

let onWindowResize = function() {
  scene.camera.aspect = window.innerWidth/window.innerHeight;
  scene.camera.updateProjectionMatrix();
  vrRenderer.setSize(window.innerWidth, window.innerHeight);
}

init();
tick();
