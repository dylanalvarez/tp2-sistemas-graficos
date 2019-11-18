import { mat4 } from "gl-matrix";
import { isNullOrUndefined } from "util";

export default class TreeNode {
    constructor() {
        window.buffers = window.buffers || {}
        window.texture = window.texture || {}
        if (!window.buffers[this.constructor.name]) {
            window.buffers[this.constructor.name] = this.buildBuffers();
        }
        if (!window.texture[this.constructor.name]) {
            window.texture[this.constructor.name] = this.initTexture();
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

    uVBuffer() {
        return window.buffers[this.constructor.name]['uVBuffer'];
    }

    texture() {
        return window.texture[this.constructor.name];
    }

    initTexture() {
        let imageSource = this.imageSource();
        if(!imageSource) return null;

        let texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = () => {

            gl.bindTexture(gl.TEXTURE_2D, texture); 						// activo la textura

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);	// cargo el bitmap en la GPU
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);					// selecciono filtro de magnificacion
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);	// selecciono filtro de minificacion

            gl.generateMipmap(gl.TEXTURE_2D);		// genero los mipmaps
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        texture.image.src = imageSource;
        return texture;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        //let normalMatrix = mat4.create()
        let normalMatrix = mat4.clone(modelMatrix); // absolute normals, not relative to viewMatrix

        //mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        if(!this.texture()) {
            gl.useProgram(glColorProgram);

            this.setWebGLUniformMatrix(glColorProgram, "modelMatrix", modelMatrix);
            this.setWebGLUniformMatrix(glColorProgram, "viewMatrix", viewMatrix);
            this.setWebGLUniformMatrix(glColorProgram, "projMatrix", projMatrix);
            this.setWebGLUniformMatrix(glColorProgram, "normalMatrix", normalMatrix);
            this.setWebGLUniformColor("uColor", this.color());

            let vertexPositionAttribute = gl.getAttribLocation(glColorProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer());
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glColorProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer());
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            let indexBuffer = this.indexBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);

        } else { // Quizas hacer que los modelos que usan textura en vez de color plano sobreescriban draw
                // en vez de hacer este if-else
            gl.useProgram(glTextureProgram);

            this.setWebGLUniformMatrix(glTextureProgram, "modelMatrix", modelMatrix);
            this.setWebGLUniformMatrix(glTextureProgram, "viewMatrix", viewMatrix);
            this.setWebGLUniformMatrix(glTextureProgram, "projMatrix", projMatrix);
            this.setWebGLUniformMatrix(glTextureProgram, "normalMatrix", normalMatrix);

            let vertexPositionAttribute = gl.getAttribLocation(glColorProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer());
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glColorProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer());
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

                
            let trianglesUvBuffer = this.uVBuffer();
            let vertexUvAttribute = gl.getAttribLocation(glTextureProgram, "aVertexUv");
            gl.enableVertexAttribArray(vertexUvAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
            gl.vertexAttribPointer(vertexUvAttribute, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture());
            gl.uniform1i(glTextureProgram.samplerUniform, 0);

            let indexBuffer = this.indexBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);

        }
        
    }

    setWebGLUniformColor(key, color) {
        gl.uniform3f(gl.getUniformLocation(glColorProgram, key), color[0], color[1], color[2]);
    }

    setWebGLUniformMatrix(program, key, value) {
        gl.uniformMatrix4fv(gl.getUniformLocation(program, key), false, value);
    }

    buildBuffers() {
        return {}
    }

    imageSource() {
        return null;
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
