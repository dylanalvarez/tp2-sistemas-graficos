precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;

void main(void) {

	vec3 lightVec=normalize(vPosWorld-vec3(0.0,-3.0,0.5));					// vector desde el pixel a la fuente de luz
	vec3 diffColor=mix(vec3(0.7,0.7,0.7),vNormal,0.1);						// color del pixel
	vec3 colorFinal=dot(lightVec,vNormal)*diffColor+vec3(0.2,0.2,0.2);		// color final iluminado

   gl_FragColor = vec4(vNormal, 1.0);
}