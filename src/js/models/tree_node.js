import { mat4 } from "gl-matrix";

export default class TreeNode {
    draw(modelMatrix, viewMatrix, projMatrix, vertexBuffer, normalBuffer, indexBuffer) {
        let normalMatrix = mat4.create()

        mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        this.setWebGLUniform("modelMatrix", modelMatrix);
        this.setWebGLUniform("viewMatrix", viewMatrix);
        this.setWebGLUniform("projMatrix", projMatrix);
        this.setWebGLUniform("normalMatrix", normalMatrix);

        let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
    }

    setWebGLUniform(key, value) {
        gl.uniformMatrix4fv(gl.getUniformLocation(glProgram, key), false, value);
    }

    static buildBuffers() {
        return {}
    }
}
