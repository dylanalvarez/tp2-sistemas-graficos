precision highp float;

uniform sampler2D uSampler0;

uniform vec3 uViewerPosition;

varying highp vec2 vUv;
varying vec3 vPosWorld;
varying vec3 vNormal;

vec3 phongReflection() {
	vec3 lightVec = normalize(vec3(0.0, 60.0, 0.0)-vPosWorld);
	
	// Iluminacion ambiental de Phong
	vec3 ka = vec3(1.0, 1.0, 1.0); // Valor constante por ahora, cambiara al definir materiales
	vec3 ia = vec3(0.6, 0.6, 0.6); // Intensidad de iluminacion ambiente
	vec3 ambientIllumination = ka*ia;

	// Iluminacion difusa de Phong
	vec3 kd = vec3(1.0, 1.0, 1.0); // Valor constante por ahora, cambiara al definir materiales
	vec3 id = vec3(0.8, 0.8, 0.8); // Intensidad de iluminacion difusa
	vec3 diffuseIllumination = clamp(dot(lightVec, vNormal), 0.0, 1.0)*kd*id;

	// Iluminacion especular de Phong
	vec3 ks = vec3(1.0, 1.0, 1.0); // Valor constante por ahora, cambiara al definir materiales
	vec3 is = vec3(1.0, 1.0, 1.0); // Intensidad de iluminacion especular
	float glossiness = 500.0;
	vec3 viewerVector = normalize(uViewerPosition-vPosWorld);
	vec3 reflectionVector = normalize(2.0*vNormal*dot(lightVec, vNormal) - lightVec);
	float RdotV = clamp(dot(reflectionVector, viewerVector), 0.0, 1.0);
	vec3 specularIllumination = pow(RdotV, glossiness)*ks*is;

	vec3 phongIllumination = ambientIllumination + diffuseIllumination + specularIllumination;
	return phongIllumination;
}

void main(void) {
	vec4 texture = texture2D(uSampler0,vUv);
	vec3 finalTexture = texture.xyz * phongReflection();
	gl_FragColor = vec4(finalTexture.xyz, 1.0);
}