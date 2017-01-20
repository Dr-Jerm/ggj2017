webpackJsonp([0,2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _Scene = __webpack_require__(2);
	
	var _Scene2 = _interopRequireDefault(_Scene);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	if (WEBVR.isAvailable() === false) {
	  document.body.appendChild(WEBVR.getMessage());
	} /* global WEBVR */
	/* global THREE */
	
	
	var scene = void 0;
	var vrRenderer = void 0;
	var renderer = void 0;
	
	var init = function init() {
	  var container = document.createElement('div');
	  document.body.appendChild(container);
	  scene = new _Scene2.default();
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
	};
	
	var tick = function tick() {
	  vrRenderer.requestAnimationFrame(tick);
	  scene.update();
	  vrRenderer.render(scene, scene.camera);
	};
	
	var onWindowResize = function onWindowResize() {
	  scene.camera.aspect = window.innerWidth / window.innerHeight;
	  scene.camera.updateProjectionMatrix();
	  vrRenderer.setSize(window.innerWidth, window.innerHeight);
	};
	
	init();
	tick();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _vrController = __webpack_require__(3);
	
	var _vrController2 = _interopRequireDefault(_vrController);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global WEBVR */
	/* global THREE */
	
	
	var Scene1 = function (_THREE$Scene) {
	  _inherits(Scene1, _THREE$Scene);
	
	  function Scene1() {
	    _classCallCheck(this, Scene1);
	
	    var _this = _possibleConstructorReturn(this, (Scene1.__proto__ || Object.getPrototypeOf(Scene1)).call(this));
	
	    _this.controls;
	    _this.controller1;
	    _this.controller2;
	    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
	
	    _this.add(camera);
	
	    _this.add(new THREE.HemisphereLight(0x808080, 0x606060));
	    var light = new THREE.DirectionalLight(0xffffff);
	    light.position.set(0, 6, 0);
	
	    light.castShadow = true;
	    light.shadow.camera.top = 2;
	    light.shadow.camera.bottom = -2;
	    light.shadow.camera.right = 2;
	    light.shadow.camera.left = -2;
	
	    light.shadow.mapSize.set(4096, 4096);
	    _this.add(light);
	
	    _this.camera = camera;
	
	    _this.controls = new THREE.VRControls(camera);
	    _this.controls.standing = true;
	
	    _this.controller1 = new _vrController2.default(0, _this.controls);
	    _this.add(_this.controller1);
	    _this.controller2 = new _vrController2.default(1, _this.controls);
	    _this.add(_this.controller2);
	    return _this;
	  }
	
	  _createClass(Scene1, [{
	    key: 'update',
	    value: function update() {
	      this.controls.update();
	      this.controller1.update();
	      this.controller2.update();
	    }
	  }]);
	
	  return Scene1;
	}(THREE.Scene);
	
	module.exports = Scene1;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* global WEBVR */
	/* global THREE */
	
	var Controller = function (_THREE$ViveController) {
	  _inherits(Controller, _THREE$ViveController);
	
	  function Controller(index, controls) {
	    _classCallCheck(this, Controller);
	
	    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, index));
	
	    _this.index = index;
	    var self = _this;
	
	    _this.onTriggerDown = function (event) {
	      console.log("triggerDown " + this.index);
	    };
	    _this.onTriggerUp = function (event) {
	      console.log("triggerUp " + this.index);
	    };
	
	    _this.standingMatrix = controls.getStandingMatrix();
	    _this.addEventListener('triggerdown', _this.onTriggerDown);
	    _this.addEventListener('triggerup', _this.onTriggerUp);
	
	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/vive-controller/');
	
	    loader.load('vr_controller_vive_1_5.obj', function (object) {
	      var loader = new THREE.TextureLoader();
	      loader.setPath('./models/obj/vive-controller/');
	
	      var controller = object.children[0];
	      controller.material.map = loader.load('onepointfive_texture.png');
	      controller.material.specularMap = loader.load('onepointfive_spec.png');
	
	      self.add(object.clone());
	    });
	    return _this;
	  }
	
	  return Controller;
	}(THREE.ViveController);
	
	module.exports = Controller;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);
//# sourceMappingURL=index.js.map