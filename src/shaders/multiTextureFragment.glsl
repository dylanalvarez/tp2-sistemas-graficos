precision highp float;

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;

varying highp vec2 vUv;

void main(void) {
	gl_FragColor = texture2D(uSampler0,vUv) * texture2D(uSampler1,vUv);
}