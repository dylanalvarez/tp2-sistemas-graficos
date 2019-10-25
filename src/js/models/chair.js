import TreeNode from './tree_node'
import chairPoints from '../constants/chair_points'

export default class Chair extends TreeNode {
    constructor(color) {
        super();
        this.colors = color;
    }

    color() {
        return this.colors;
    }

    buildBuffers() {
        let levelPoints = chairPoints.chairLevelPoints;
        let levelNormals = chairPoints.chairLevelNormals;

        let pos = [];
        let normal = [];
        let rows = 128;	// filas	
        let cols = levelPoints.length;	// columnas

        // Add lid
        for (let i = 0; i < cols; i++) {
            pos.push(0);
            pos.push(0);
            pos.push(1);

            normal.push(0);
            normal.push(0);
            normal.push(1);
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                let z = (i - rows / 2) / 32;

                let p = levelPoints[j];
                p = [p[0], p[1], z]

                pos.push(p[0]);			// lleno el buffer de vértices
                pos.push(p[1]);
                pos.push(p[2]);

                let n = levelNormals[j];

                normal.push(n[0]);		// lleno el buffer de normales
                normal.push(n[1]);
                normal.push(n[2]);
            }

        }

        // Add another lid
        for (let i = 0; i < cols; i++) {
            pos.push(0);
            pos.push(0);
            pos.push(-1);

            normal.push(0);
            normal.push(0);
            normal.push(-1);
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
