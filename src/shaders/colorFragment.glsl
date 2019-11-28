uniform vec3 uColor;

void main(void) {
	vec3 BRIGHTNESS = phongReflection(uLightOne) + 
         			  phongReflection(uLightTwo) + 
					  phongReflection(uLightThree) + 
					  phongReflection(uLightFour) + 
					  phongReflection(uLightFive) + 
					  phongReflection(uLightSix);
	vec3 colorFinal= mix(uColor, BRIGHTNESS, 0.2);
	gl_FragColor = vec4(colorFinal, 1.0);
}