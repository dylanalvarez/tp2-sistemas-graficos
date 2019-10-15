import { vec3 } from 'gl-matrix'
import TreeNode from './tree_node'
import colors from '../colors';

export default class Floor extends TreeNode {
    color() {
        return colors.grassGreen;
    }

    buildBuffers() {

        let pos = [];
        let normal = [];
        let rows = 25;
        let cols = 25;

        let n = [0, -1, 0];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                pos.push(1000 * Math.trunc(i - rows / 2));
                pos.push(0);
                pos.push(1000 * Math.trunc(- j + cols / 2));

                normal.push(n[0]);
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

        return {
            vertexBuffer: trianglesVerticeBuffer,
            normalBuffer: trianglesNormalBuffer,
            indexBuffer: this.buildIndexBuffer(rows, cols)
        }
    }

}
