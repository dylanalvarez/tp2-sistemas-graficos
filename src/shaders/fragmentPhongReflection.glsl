precision highp float;

varying vec3 vPosWorld;
varying vec3 vNormal;
uniform vec3 uViewerPosition;
uniform vec3 uKa;
uniform vec3 uIa;
uniform vec3 uKd;
uniform vec3 uId;
uniform vec3 uKs;
uniform vec3 uIs;
uniform float uGlossiness;

vec3 phongReflection(vec3 lightSourcePosition) {
	vec3 lightVec = normalize(lightSourcePosition - vPosWorld);

	// Iluminacion ambiental de Phong
	vec3 ambientIllumination = uKa * uIa * 1.0 / 10.0;

	// Iluminacion difusa de Phong
	vec3 diffuseIllumination = clamp(dot(lightVec, vNormal), 0.0, 1.0)*uKd*uId;

	// Iluminacion especular de Phong
	vec3 viewerVector = normalize(uViewerPosition-vPosWorld);
	vec3 reflectionVector = normalize(2.0*vNormal*dot(lightVec, vNormal) - lightVec);
	float RdotV = clamp(dot(reflectionVector, viewerVector), 0.0, 1.0);
	vec3 specularIllumination = pow(RdotV, uGlossiness)*uKs*uIs;

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
