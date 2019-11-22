import TreeNode from './tree_node'
import colors from '../constants/colors';
import grassImage from '../../assets/maps/pasto.jpg'
import factors from '../constants/factors';

export default class Floor extends TreeNode {
    color() {
        return colors.grassGreen;
    }

    imageSources() {
        return [grassImage];
    }

    buildBuffers() {

        let pos = [];
        let normal = [];
        let uv = [];
        let rows = 25;
        let cols = 25;

        let n = [0, 1, 0];
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                pos.push(1000 * Math.trunc(i - rows / 2));
                pos.push(0);
                pos.push(1000 * Math.trunc(- j + cols / 2));

                normal.push(n[0]);
                normal.push(n[1]);
                normal.push(n[2]);

                uv.push(j*factors.ground_texture_factor);
                uv.push(i*factors.ground_texture_factor);
            }
        }

        let trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        let trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

        let trianglesUvBuffer = gl.createBuffer();
        trianglesUvBuffer.number_points = uv.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

        return {
            vertexBuffer: trianglesVerticeBuffer,
            normalBuffer: trianglesNormalBuffer,
            indexBuffer: this.buildIndexBuffer(rows, cols),
            uVBuffer: trianglesUvBuffer
        }
    }

}
