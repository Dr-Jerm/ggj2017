varying vec2 vUv;
varying float noise;
varying vec3 fNormal;

uniform vec2 rippleOrigin;
uniform float rippleSize;

void main() {
  vec3 light = vec3(1.0, 1.0, 1.0);
  float dProd = max(0.0, dot(fNormal, light));

  gl_FragColor = vec4(0.3 * dProd, 0.5 * dProd, 0.0 * dProd, 1.0);

}
