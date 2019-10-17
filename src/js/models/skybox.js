import { vec3 } from 'gl-matrix'
import TreeNode from './tree_node'
import colors from '../constants/colors';

export default class Skybox extends TreeNode {
    color() {
        return colors.skyBlue;
    }

    getPosInSphere(alpha, beta, radius) {
        var x = radius * Math.sin(beta) * Math.sin(alpha);
        var y = radius * Math.sin(beta) * Math.cos(alpha);
        var z = radius * Math.cos(beta);

        return [x, y, z];
    }

    getNrm(alpha, beta) {
        var p=this.getPosInSphere(alpha, beta, 1);
        var v=vec3.create();
        vec3.normalize(v, p);

        var delta=0.05;
        var p1=this.getPosInSphere(alpha, beta, 1);
        var p2=this.getPosInSphere(alpha, beta+delta, 1);
        var p3=this.getPosInSphere(alpha+delta, beta, 1);

        var v1=vec3.fromValues(p2[0]-p1[0],
                               p2[1]-p1[1],
                               p2[2]-p1[2]);
        var v2=vec3.fromValues(p3[0]-p1[0],
                               p3[1]-p1[1],
                               p3[2]-p1[2]);

        vec3.normalize(v1,v1);
        vec3.normalize(v2,v2);
        
        var n=vec3.create();
        vec3.cross(n, v1, v2);
        vec3.scale(n, n, -1);
        return n;
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

                let n = this.getNrm(alpha, beta);
                
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
