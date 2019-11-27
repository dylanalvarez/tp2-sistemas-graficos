precision highp float;

varying vec3 vPosWorld;
varying vec3 vNormal;
uniform vec3 uViewerPosition;

vec3 phongReflection(vec3 lightSourcePosition) {
	vec3 lightVec = normalize(lightSourcePosition - vPosWorld);

	// Iluminacion ambiental de Phong
	vec3 ka = vec3(1.0, 1.0, 1.0); // Valor constante por ahora, cambiara al definir materiales
	vec3 ia = vec3(0.6, 0.6, 0.6); // Intensidad de iluminacion ambiente
	vec3 ambientIllumination = ka * ia * 1.0 / 10.0;

	// Iluminacion difusa de Phong
	vec3 kd = vec3(1.0, 1.0, 1.0); // Valor constante por ahora, cambiara al definir materiales
	vec3 id = vec3(0.2, 0.2, 0.2); // Intensidad de iluminacion difusa
	vec3 diffuseIllumination = clamp(dot(lightVec, vNormal), 0.0, 1.0)*kd*id;

	// Iluminacion especular de Phong
	vec3 ks = vec3(1.0, 1.0, 1.0); // Valor constante por ahora, cambiara al definir materiales
	vec3 is = vec3(1.0, 1.0, 1.0); // Intensidad de iluminacion especular
	float glossiness = 500.0;
	vec3 viewerVector = normalize(uViewerPosition-vPosWorld);
	vec3 reflectionVector = normalize(2.0*vNormal*dot(lightVec, vNormal) - lightVec);
	float RdotV = clamp(dot(reflectionVector, viewerVector), 0.0, 1.0);
	vec3 specularIllumination = pow(RdotV, glossiness)*ks*is;

	float linearDecay = clamp(3.0 - length(lightSourcePosition - vPosWorld) / 10.0, 0.0, 99999.0);
	vec3 phongIllumination = ambientIllumination + (diffuseIllumination + specularIllumination) * linearDecay;
	return phongIllumination;
}

uniform vec3 uLightOne;
uniform vec3 uLightTwo;
uniform vec3 uLightThree;
uniform vec3 uLightFour;
uniform vec3 uLightFive;
uniform vec3 uLightSix;
