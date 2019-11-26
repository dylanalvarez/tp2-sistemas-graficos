uniform vec3 uColor;
uniform vec3 uLightOne;
uniform vec3 uLightTwo;
uniform vec3 uLightThree;
uniform vec3 uLightFour;
uniform vec3 uLightFive;
uniform vec3 uLightSix;

void main(void) {
	vec3 colorFinal= uColor * phongReflection();
	gl_FragColor = vec4(colorFinal, 1.0);
}