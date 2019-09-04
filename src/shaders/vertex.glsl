attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

varying highp vec4 vColor;
void main(void){
    gl_Position=projMatrix*viewMatrix*modelMatrix*vec4(aVertexPosition,1.);
    vColor=vec4(aVertexColor,1.);
}
