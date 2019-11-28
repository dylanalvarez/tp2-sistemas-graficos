precision highp float;

uniform sampler2D uSampler0;

uniform vec3 uColor;

varying highp vec2 vUv;

void main(void) {
	vec4 textureColor = texture2D(uSampler0,vUv);
	gl_FragColor = mix(textureColor, vec4(uColor.xyz, 1.0), 0.7);
}
