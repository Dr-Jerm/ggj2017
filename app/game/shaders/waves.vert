varying vec2 vUv;
varying float noise;
varying vec3 fNormal;

uniform vec2 rippleOriginLeft;
uniform vec2 rippleOriginRight;
uniform float rippleSize;

uniform float timeLeft;
uniform float timeRight;

void main() {
  fNormal = normal;
  vUv = uv;
  noise = 0.0;
  
  vec2 dist = ((rippleOriginLeft + 0.5) - uv); 
  vec3 newPosition = position;
  float radiusLeftOutside = timeLeft;
  float radiusLeftInside = timeLeft - 0.05;

  if (dist.x * dist.x + dist.y * dist.y < radiusLeftOutside * radiusLeftOutside) {
    vec3 offset = vec3(0.0, 1.0, 0.0);
    newPosition = newPosition + offset;
  }

  if (dist.x * dist.x + dist.y * dist.y < radiusLeftInside * radiusLeftInside) {
    vec3 offset = vec3(0.0, -1.0, 0.0);
    newPosition = newPosition + offset;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}

