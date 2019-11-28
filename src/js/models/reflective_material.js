export default class ReflectiveMaterial {
    constructor(uVBuffer, textures, color) {
        this.uVBuffer = uVBuffer;
        this.sphereTexture = textures[0];
        this.color = color;
    }

    program() {
        return glReflectiveProgram;
    }

    enableColors() {
        this.setWebGLUniformColor("uColor");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.sphereTexture);
        gl.uniform1i(this.program().samplerUniform, 0);

        let cameraPosition = window.camera.getPosition();
        gl.uniform3fv(gl.getUniformLocation(this.program(), 'uCameraPosition'), cameraPosition);
    }

    setWebGLUniformColor(key) {
        gl.uniform3f(gl.getUniformLocation(this.program(), key), this.color[0], this.color[1], this.color[2]);
    }

    disableColors() {
        gl.disableVertexAttribArray(this.vertexUvAttribute);
    }
}
