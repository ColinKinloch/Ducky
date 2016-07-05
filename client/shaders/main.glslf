#version 100
precision mediump float;

varying vec3 vNormal;
varying float zDepth;

void main(void) {
  gl_FragColor = vec4(zDepth * vec3((vNormal.x + vNormal.y + vNormal.z / 3.)), 1.);
}
