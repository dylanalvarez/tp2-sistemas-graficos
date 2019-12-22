#define M_PI 3.1415926535897932384626433832795

precision highp float;

uniform sampler2D uSampler0;

uniform vec3 uColor;


uniform vec3 uCameraPosition;	     	// posicion de la camara

void main(void) {
	vec3 cameraRelativeToVertex = normalize(uCameraPosition - vPosWorld);
	vec3 reflectionVector = normalize(2.0*vNormal*dot(cameraRelativeToVertex, vNormal) - cameraRelativeToVertex);

	float latitude = acos(reflectionVector.y/sqrt(pow(reflectionVector.x, 2.0) + pow(reflectionVector.y, 2.0) + pow(reflectionVector.z, 2.0)));
	float longitude = atan(reflectionVector.z, reflectionVector.x); // de -pi a pi
	vec2 uv = vec2((longitude) / (2.0 * M_PI), (latitude) / (1.0 * M_PI));
	vec4 textureColor = mix(texture2D(uSampler0,uv), vec4(uColor.xyz, 1.0), 0.7);
	vec3 finalTexture = mix(textureColor.xyz, vec3(0.0, 0.0, 0.0), 0.3);
	gl_FragColor = vec4(finalTexture, 1.0);
}
