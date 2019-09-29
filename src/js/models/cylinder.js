import { vec3 } from 'gl-matrix'
import TreeNode from './tree_node'

export default class Cylinder extends TreeNode {
    draw(modelMatrix, viewMatrix, projMatrix, normalMatrix) {
        this.setWebGLUniform("modelMatrix", modelMatrix);
        this.setWebGLUniform("viewMatrix", viewMatrix);
        this.setWebGLUniform("projMatrix", projMatrix);
        this.setWebGLUniform("normalMatrix", normalMatrix);

        let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.normalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.indexBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, Cylinder.indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
    }

    static buildBuffers() {
        function getPos(alfa, height) {
            let r = 2;
            let x = r * Math.cos(alfa);
            let y = r * Math.sin(alfa);
            return [x, y, height];
        }

        function getNrm(alfa) {
            let position = getPos(alfa, 0);
            let v1 = vec3.fromValues(...position);
            vec3.normalize(v1, v1);
            return v1;
        }

        let pos = [];
        let normal = [];
        let r = 2;
        let rows = 128;	// filas	
        let cols = 256;	// columnas

        let controlPoints = [];

        for (let i = 0; i < rows; i++) {
            let alfa = i / (cols - 1) * Math.PI * 2;
            let p = getPos(alfa, 0);
            controlPoints.push(p);
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                let alfa = j / (cols - 1) * Math.PI * 2;
                let z = i / 64;

                // evaluo la posición sobre la superficie de la esfera a partir de latitud y longitud
                let p = getPos(alfa, z);

                pos.push(p[0]);			// lleno el buffer de vértices
                pos.push(p[1]);
                pos.push(p[2]);

                // evaluo el vector normal sobre la superficie de la esfera a partir de latitud y longitud
                let n = getNrm(alfa);

                normal.push(n[0]);		// lleno el buffer de normales
                normal.push(n[1]);
                normal.push(n[2]);
            }

        }

        let trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);


        let trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

        let index = [];

        for (let i = 0; i < rows - 1; i++) {
            index.push(i * cols);
            for (let j = 0; j < cols - 1; j++) {

                // lleno el buffer de indices del quad 
                index.push(i * cols + j);
                index.push((i + 1) * cols + j);
                index.push(i * cols + j + 1);
                index.push((i + 1) * cols + j + 1);
            }
            index.push((i + 1) * cols + cols - 1);
        }

        let trianglesIndexBuffer = gl.createBuffer();
        trianglesIndexBuffer.number_vertex_point = index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

        return {
            vertexBuffer: trianglesVerticeBuffer,
            normalBuffer: trianglesNormalBuffer,
            indexBuffer: trianglesIndexBuffer
        }
    }
}
