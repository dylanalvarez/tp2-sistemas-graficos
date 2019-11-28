precision highp float;

uniform sampler2D uSampler0;

uniform vec3 uColor;

varying highp vec2 vUv;

void main(void) {
	vec4 textureColor = mix(texture2D(uSampler0,vUv), vec4(uColor.xyz, 1.0), 0.7);
	vec3 finalTexture = mix(textureColor.xyz, vec3(0.0, 0.0, 0.0), 0.3);
	gl_FragColor = vec4(finalTexture, 1.0);
}
