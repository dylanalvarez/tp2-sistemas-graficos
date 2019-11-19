import { vec3 } from 'gl-matrix'
import TreeNode from './tree_node'

export default class Cylinder extends TreeNode {
    constructor(color) {
        super();
        this.colors = color;
    }

    color() {
        return this.colors;
    }

    getPos(alfa, height) {
        let r = 2;
        let x = r * Math.cos(alfa);
        let y = r * Math.sin(alfa);
        return [x, y, height];
    }

    getNrm(alfa) {
        let position = this.getPos(alfa, 0);
        let v1 = vec3.fromValues(...position);
        vec3.normalize(v1, v1);
        return v1;
    }

    buildBuffers(lowerLidOffset, upperLidOffset) {
        lowerLidOffset = lowerLidOffset || 0;
        upperLidOffset = upperLidOffset || 0;

        let pos = [];
        let normal = [];
        let rows = 5;	// filas	
        let cols = 256;	// columnas


        // Add lid
        for (let i = 0; i < cols; i++) {
            pos.push(0);
            pos.push(0);
            pos.push(-1 - lowerLidOffset);

            normal.push(0);
            normal.push(0);
            normal.push(-1);
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                let alfa = j / (cols - 1) * Math.PI * 2;
                let z = (i - 2) / 2;

                // evaluo la posición sobre la superficie de la esfera a partir de latitud y longitud
                let p = this.getPos(alfa, z);

                pos.push(p[0]);			// lleno el buffer de vértices
                pos.push(p[1]);
                pos.push(p[2]);

                // evaluo el vector normal sobre la superficie de la esfera a partir de latitud y longitud
                let n = this.getNrm(alfa);

                normal.push(n[0]);		// lleno el buffer de normales
                normal.push(n[1]);
                normal.push(n[2]);
            }

        }

        // Add another lid
        for (let i = 0; i < cols; i++) {
            pos.push(0);
            pos.push(0);
            pos.push(1 + upperLidOffset);

            normal.push(0);
            normal.push(0);
            normal.push(1);
        }

        let trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        let trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

        return {
            vertexBuffer: trianglesVerticeBuffer,
            normalBuffer: trianglesNormalBuffer,
            indexBuffer: this.buildIndexBuffer(rows + 2, cols)
        }
    }
}
