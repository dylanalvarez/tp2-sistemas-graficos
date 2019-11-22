export default class TextureMaterial {
    constructor(uVBuffer, texture) {
        this.uVBuffer = uVBuffer;
        this.texture = texture;
    }

    program() {
        return glTextureProgram;
    }

    enableColors() {
        let trianglesUvBuffer = this.uVBuffer;
        this.vertexUvAttribute = gl.getAttribLocation(this.program(), "aVertexUv");
        gl.enableVertexAttribArray(this.vertexUvAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.vertexAttribPointer(this.vertexUvAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.program().samplerUniform, 0);
    }

    disableColors() {
        gl.disableVertexAttribArray(this.vertexUvAttribute);
    }
}
