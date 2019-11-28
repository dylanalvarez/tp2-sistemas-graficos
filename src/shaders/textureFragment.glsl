uniform sampler2D uSampler0;
varying highp vec2 vUv;

void main(void) {
	vec4 texture = texture2D(uSampler0,vUv);
	vec3 BRIGHTNESS = phongReflection(uLightOne) + 
         			phongReflection(uLightTwo) + 
					phongReflection(uLightThree) + 
					phongReflection(uLightFour) + 
					phongReflection(uLightFive) + 
					phongReflection(uLightSix);
	vec3 mixedTexture = texture.xyz * BRIGHTNESS;
	vec3 finalTexture = mix(mixedTexture, texture.xyz, 0.8);
	gl_FragColor = vec4(finalTexture.xyz, 1.0);
}