import { mat4 } from "gl-matrix";

export default class TreeNode {
    constructor() {
        window.buffers = window.buffers || {}
        if (!window.buffers[this.constructor.name]) {
            window.buffers[this.constructor.name] = this.buildBuffers();
        }
    }

    vertexBuffer() {
        return window.buffers[this.constructor.name]['vertexBuffer'];
    }

    normalBuffer() {
        return window.buffers[this.constructor.name]['normalBuffer'];
    }

    indexBuffer() {
        return window.buffers[this.constructor.name]['indexBuffer'];
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        if (this.constructor.name === "Skybox") console.log(this.color())
        let normalMatrix = mat4.create()

        mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        this.setWebGLUniformMatrix("modelMatrix", modelMatrix);
        this.setWebGLUniformMatrix("viewMatrix", viewMatrix);
        this.setWebGLUniformMatrix("projMatrix", projMatrix);
        this.setWebGLUniformMatrix("normalMatrix", normalMatrix);
        this.setWebGLUniformColor("uColor", this.color());

        let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer());
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer());
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        let indexBuffer = this.indexBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
    }

    setWebGLUniformColor(key, color) {
        gl.uniform3f(gl.getUniformLocation(glProgram, key), color[0], color[1], color[2]);
    }

    setWebGLUniformMatrix(key, value) {
        gl.uniformMatrix4fv(gl.getUniformLocation(glProgram, key), false, value);
    }

    buildBuffers() {
        return {}
    }

    color() {
        return [
            Math.random(),
            Math.random(),
            Math.random(),
            1.0
        ];
    }

    buildIndexBuffer(rowCount, columnCount) {
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
