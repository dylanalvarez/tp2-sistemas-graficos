precision highp float;

uniform sampler2D uSampler0;

uniform vec3 uViewerPosition;

varying highp vec2 vUv;

void main(void) {
	vec4 textureColor = texture2D(uSampler0,vUv);
	gl_FragColor = vec4(textureColor.xyz, 1.0);
}