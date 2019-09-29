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

    static buildIndexBuffer(rowCount, columnCount) {
        let index = [];

        for (let i = 0; i < rowCount - 1; i++) {
            index.push(i * columnCount);
            for (let j = 0; j < columnCount - 1; j++) {

                // lleno el buffer de indices del quad 
                index.push(i * columnCount + j);
                index.push((i + 1) * columnCount + j);
                index.push(i * columnCount + j + 1);
                index.push((i + 1) * columnCount + j + 1);
            }
            index.push((i + 1) * columnCount + columnCount - 1);
        }

        let trianglesIndexBuffer = gl.createBuffer();
        trianglesIndexBuffer.number_vertex_point = index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

        return trianglesIndexBuffer;
    }
}
