import { mat4 } from "gl-matrix";
import ColorMaterial from "./color_material";
import TextureMaterial from "./texture_material";

export default class TreeNode {
    constructor() {
        window.buffers = window.buffers || {}
        window.textures = window.textures || {}
        if (!window.buffers[this.constructor.name]) {
            window.buffers[this.constructor.name] = this.buildBuffers();
        }
        if (!window.textures[this.constructor.name]) {
            window.textures[this.constructor.name] = this.initTextures();
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

    textures() {
        return window.textures[this.constructor.name];
    }

    initTextures() {
        let textures = [];
        for (let source of this.imageSources()) {
            textures.push(this.initTexture(source));
        }
        return textures;
    }

    initTexture(imageSource) {
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

        let textureCount = this.textures().length;
        let material;
        if (textureCount === 0) {
            material = new ColorMaterial(this.color());
        } else if (textureCount === 1) {
            material = new TextureMaterial(this.uVBuffer(), this.textures()[0]);
        }
        let program = material.program();
        gl.useProgram(program);

        this.setWebGLUniformMatrix(program, "modelMatrix", modelMatrix);
        this.setWebGLUniformMatrix(program, "viewMatrix", viewMatrix);
        this.setWebGLUniformMatrix(program, "projMatrix", projMatrix);
        this.setWebGLUniformMatrix(program, "normalMatrix", normalMatrix);

        let vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer());
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer());
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        material.enableColors(this.color());
        this.drawElements();
        material.disableColors();
    }

    drawElements() {
        let indexBuffer = this.indexBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
    }

    setWebGLUniformColor(key, color) {
        new ColorMaterial(color).setWebGLUniformColor(key);
    }
   
    setWebGLUniformMatrix(program, key, value) {
        gl.uniformMatrix4fv(gl.getUniformLocation(program, key), false, value);
    }

    buildBuffers() {
        return {}
    }

    imageSources() {
        return [];
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
