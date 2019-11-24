precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
uniform vec3 uColor;
uniform vec3 uLightOne;
uniform vec3 uLightTwo;
uniform vec3 uLightThree;
uniform vec3 uLightFour;
uniform vec3 uLightFive;
uniform vec3 uLightSix;

uniform vec3 uViewerPosition;

vec3 phongIlluminationVector() {
	vec3 lightVec = normalize(vec3(0.0, 60.0, 0.0)-vPosWorld);
	
	// Iluminacion ambiental de Phong
	vec3 ka = vec3(0.5, 0.5, 0.5); // Valor constante por ahora, cambiara al definir materiales
	vec3 ia = vec3(1.0, 1.0, 1.0); // Intensidad de iluminacion ambiente
	vec3 ambientIllumination = ka*ia;

	// Iluminacion difusa de Phong
	vec3 kd = vec3(0.25, 0.25, 0.25); // Valor constante por ahora, cambiara al definir materiales
	vec3 id = vec3(1.0, 1.0, 1.0); // Intensidad de iluminacion difusa
	vec3 diffuseIllumination = dot(lightVec, vNormal)*kd*id;

	// Iluminacion especular de Phong
	vec3 ks = vec3(0.2, 0.2, 0.2); // Valor constante por ahora, cambiara al definir materiales
	vec3 is = vec3(0.5, 0.5, 0.5);
	float glossiness = 200.0;
	vec3 viewerVector = normalize(uViewerPosition-vPosWorld);
	vec3 reflectionVector = normalize(2.0*vNormal*dot(lightVec, vNormal) - lightVec);
	float RdotV = dot(reflectionVector, viewerVector);
	vec3 specularIllumination = pow(RdotV, glossiness)*ks*is;

	vec3 phongIllumination = ambientIllumination + diffuseIllumination + specularIllumination;
	return phongIllumination;
}

void main(void) {

	vec3 colorFinal= mix(uColor, phongIlluminationVector(), 0.2);

	gl_FragColor = vec4(colorFinal, 1.0);
}