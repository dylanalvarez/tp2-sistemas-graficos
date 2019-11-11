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

void main(void) {

	vec3 lightVec=normalize(vec3(0.0, 60.0, 0.0)-vPosWorld);
	vec3 diffColor=uColor;
	vec3 colorFinal=dot(lightVec,vNormal)*diffColor+vec3(0.2,0.2,0.2);
	colorFinal= mix(uColor, colorFinal, 0.3);

    gl_FragColor = vec4(colorFinal, 1.0);
}