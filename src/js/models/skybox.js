import colors from '../constants/colors';
import Sphere from './sphere'
import sunsetImage from '../../assets/maps/sunset.jpg'
import TextureMaterial from "./texture_material";
import BrightProperties from './bright_properties';

export default class Skybox extends Sphere {
    color() {
        return colors.skyBlue;
    }

    imageSources() {
        return [sunsetImage];
    }

    materialClass() {
        return TextureMaterial;
    }
    
    phongProperties() {
        return BrightProperties;
    }

    buildBuffers() {
        let pos = [];
        let normal = [];
        let uv = [];
        let radius = 500;
        let rows = 128;
        let cols = 256;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let alphaStep = j / (cols - 1);
                let betaStep = i / (rows - 1);

                let alpha = alphaStep * Math.PI * 2;
                let beta = betaStep * Math.PI;

                let p = this.getPosInSphere(alpha, beta, radius);
                pos.push(p[0]);
                pos.push(p[1]);
                pos.push(p[2]);

                let n = this.getNrm(alpha, beta, radius);

                normal.push(n[0]);
                normal.push(n[1]);
                normal.push(n[2]);

                let u = alphaStep;
                let v = (i + 14) / (rows - 1);

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
}
