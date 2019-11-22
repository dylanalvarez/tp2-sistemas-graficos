export default class TextureMaterial {
    constructor(uVBuffer, textures) {
        this.uVBuffer = uVBuffer;
        this.textures = textures;
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

        let index = 0;
        for (let texture of this.textures) {
            gl.activeTexture(gl[`TEXTURE${index}`]);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(this.program()[`samplerUniform${index}`], index);
            index += 1;
        }
    }

    disableColors() {
        gl.disableVertexAttribArray(this.vertexUvAttribute);
    }
}
