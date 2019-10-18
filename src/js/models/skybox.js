import colors from '../constants/colors';
import Sphere from './sphere'

export default class Skybox extends Sphere {
    color() {
        return colors.skyBlue;
    }

    buildBuffers() {
        let pos = [];
        let normal = [];
        let radius = 100;
        let rows = 128;
        let cols = 256;
        for (let i = 0; i < rows; i++) {
            for (let j=0; j < cols; j++) {

                let alpha = j / (cols - 1) * Math.PI * 2;
                let beta = i / (rows - 1) * Math.PI;

                let p = this.getPosInSphere(alpha, beta, radius);

                pos.push(p[0]);
                pos.push(p[1]);
                pos.push(p[2]);

                let n = this.getNrm(alpha, beta, radius);
                
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
