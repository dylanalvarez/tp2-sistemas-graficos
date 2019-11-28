#define M_PI 3.1415926535897932384626433832795

precision highp float;

attribute vec3 aVertexPosition;			//atributo posicion
attribute vec3 aVertexNormal;			//atributo normal

uniform mat4 modelMatrix;     			// matriz de modelado       
uniform mat4 viewMatrix;				// matriz de vista
uniform mat4 projMatrix;				// matriz de proyección

uniform mat4 normalMatrix;				// matriz de normales

uniform vec3 uCameraPosition;	     	// posicion de la camara

varying vec3 vNormal;    				// vector normal enviado al fragment shader
varying vec3 vPosWorld;  				// vector posición en coord de mundo.

varying highp vec2 vUv;					

void main(void) {
	gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);

	vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
	vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       //la normal en coordenadas de mundo         
	
	vec3 cameraRelativeToVertex = normalize(uCameraPosition - vPosWorld);
	//vec3 reflectionVector = normalize(cameraRelativeToVertex - vec3(2.0, 2.0, 2.0) * (cameraRelativeToVertex * vNormal) * vNormal);
	vec3 reflectionVector = normalize(2.0*vNormal*dot(cameraRelativeToVertex, vNormal) - cameraRelativeToVertex);

	float latitude = acos(reflectionVector.y/sqrt(pow(reflectionVector.x, 2.0) + pow(reflectionVector.y, 2.0) + pow(reflectionVector.z, 2.0)));
	float longitude = atan(reflectionVector.z, reflectionVector.x); // de -pi a pi
	vUv = vec2((longitude) / (2.0 * M_PI), (latitude) / (1.0 * M_PI));
}
