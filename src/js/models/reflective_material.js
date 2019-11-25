export default class ReflectiveMaterial {
    constructor(uVBuffer, textures) {
        this.uVBuffer = uVBuffer;
        this.sphereTexture = textures[0];
    }

    program() {
        return glReflectiveProgram;
    }

    enableColors() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.sphereTexture);
        gl.uniform1i(this.program().samplerUniform, 0);

        let cameraPosition = window.camera.getPosition();
        gl.uniform3fv(gl.getUniformLocation(this.program(), 'uCameraPosition'), cameraPosition);
    }

    disableColors() {
        gl.disableVertexAttribArray(this.vertexUvAttribute);
    }
}
