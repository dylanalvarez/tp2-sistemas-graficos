import colors from '../constants/colors';
import Sphere from './sphere'
import sunsetImage from '../../assets/maps/sunset.jpg'

export default class Skybox extends Sphere {
    color() {
        return colors.skyBlue;
    }

    buildBuffers() {
        let pos = [];
        let normal = [];
        let uv = [];
        let radius = 100;
        let rows = 128;
        let cols = 256;

        this.initTexture(sunsetImage);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let alphaStep = j / (cols - 1);
                let betaStep = i / (rows - 1);

                let alpha = alphaStep * Math.PI * 2;
                let beta = -betaStep * Math.PI;

                let p = this.getPosInSphere(alpha, beta, radius);
                pos.push(p[0]);
                pos.push(p[1]);
                pos.push(p[2]);

                let n = this.getNrm(alpha, beta, radius);

                normal.push(-n[0]);
                normal.push(-n[1]);
                normal.push(-n[2]);

                let u = alphaStep;
                let v = (i + 17) / (rows - 1);

                uv.push(u);
                uv.push(v);
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

    draw(modelMatrix, viewMatrix, projMatrix) {
        super.draw(modelMatrix, viewMatrix, projMatrix);
        let trianglesUvBuffer = this.uVBuffer();
        let vertexUvAttribute = gl.getAttribLocation(glProgram, "aVertexUv");
        gl.enableVertexAttribArray(vertexUvAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.vertexAttribPointer(vertexUvAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(glProgram.samplerUniform, 0);
        gl.drawArrays(gl.TRIANGLES, 0,trianglesUvBuffer.number_points);
    }
}
