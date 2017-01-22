varying vec2 vUv;
varying float noise;
varying vec3 fNormal;
varying vec4 vColor;

uniform vec2 rippleOriginLeft;
uniform vec2 rippleOriginRight;
uniform float rippleSize;

uniform float timeLeft;
uniform float timeRight;

void main() {
  fNormal = normal;
  vUv = uv;
  noise = 0.0;
  
  vec2 distLeft = ((rippleOriginLeft + 0.5) - uv); 
  vec3 newPosition = position;
  float radiusLeftOutside = timeLeft;
  float radiusLeftInside = timeLeft - 0.05;

  vec2 distRight = ((rippleOriginRight + 0.5) - uv); 
  float radiusRightOutside = timeRight;
  float radiusRightInside = timeRight - 0.05;

  vColor = vec4(0.3, 0.5, 0.0, 1.0);

  if (( distLeft.x * distLeft.x + distLeft.y * distLeft.y < 
        radiusLeftOutside * radiusLeftOutside &&
        distLeft.x * distLeft.x + distLeft.y * distLeft.y > 
        radiusLeftInside * radiusLeftInside) ||
      ( distRight.x * distRight.x + distRight.y * distRight.y < 
        radiusRightOutside * radiusRightOutside &&
        distRight.x * distRight.x + distRight.y * distRight.y > 
        radiusRightInside * radiusRightInside)) {

    vec3 offset = vec3(0.0, 1.5, 0.0);
    newPosition = newPosition + offset;

    vColor = vec4(0.0, 0.2, 0.0, 1.0);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}

