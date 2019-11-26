uniform sampler2D uSampler0;
varying highp vec2 vUv;

void main(void) {
	vec4 texture = texture2D(uSampler0,vUv);
	vec3 finalTexture = texture.xyz * phongReflection();
	gl_FragColor = vec4(finalTexture.xyz, 1.0);
}