import colors from '../constants/colors'
import carBodyPoints from '../constants/carBodyPoints'
import ScanningSurfaceTreeNode from "./scanning_surface_tree_node";
import { mat4, vec3, vec4 } from "gl-matrix";
import Bezier from '../utils/cubic_bezier';

export default class CarCenterBody extends ScanningSurfaceTreeNode {
    color() {
        return colors.carYellow;
    }

    levelCurveMatrices() {
        let matrices = [];
        let carCapsLevelsPoints = carBodyPoints.carCapsLevelPoints;
        for (let i = 0; i < carCapsLevelsPoints.length; i+=4) {
            let segment = [carCapsLevelsPoints[i], carCapsLevelsPoints[i+1], carCapsLevelsPoints[i+2], carCapsLevelsPoints[i+3]];
            let bezier = new Bezier(segment);

            let deltaU = 0.1;
            
            for(let u = 0; u <= 1.0; u+=deltaU) {
                let levelPoint = bezier.bezierCurve(u);

                let t = bezier.bezierCurveDerivative(u);
                t = vec3.fromValues(...t);
                vec3.normalize(t, t);

                // Al tratarse de una curva 2D, puedo orientar la binormal siempre en Z
                let b = vec3.fromValues(0, 0, 1);

                let n = vec3.fromValues(0, 1, 0);
                vec3.cross(n, t, b);
                vec3.normalize(n, n);

                let matrix = mat4.fromValues(n[0],          n[1],          n[2],          0,
                                             b[0],          b[1],          b[2],          0,
                                             t[0],          t[1],          t[2],          0,
                                             levelPoint[0], levelPoint[1], levelPoint[2], 1 );
                
                matrices.push(matrix);
            }
        }
        return matrices;
    }

    controlCurveMatrices() {
        let steps = 10;
        let matrices = [];
        
        for(let i=0; i < steps; i++) {
            
            let z = i / (steps - 1);
            let controlPoint = [0, 0, z];

            let t = vec3.fromValues(0, 0, 1);
            let n = vec3.fromValues(0, 1, 0);
            let b = vec3.fromValues(-1, 0, 0);

            let matrix = mat4.fromValues(n[0],            n[1],            n[2],            0,
                                         b[0],            b[1],            b[2],            0,
                                         t[0],            t[1],            t[2],            0,
                                         controlPoint[0], controlPoint[1], controlPoint[2], 1 );
            
            matrices.push(matrix);
        }
        return matrices;
    }

    buildBuffers() {
        let pos = [];
        let normal = [];

        let controlCurveMatrices = this.controlCurveMatrices();

        let levelCurveMatrices = this.levelCurveMatrices();

        let rows = controlCurveMatrices.length;
        let cols = levelCurveMatrices.length;
        let scale = 0.73;

        // Add lid
        for (let i = 0; i < cols; i++) {
            pos.push(0);
            pos.push(0);
            pos.push(0);

            normal.push(0);
            normal.push(0);
            normal.push(-1);
        }
        
        for (let i = 0; i < rows; i++) {
            let controlPointMatrix = controlCurveMatrices[i];

            for (let j = 0; j < cols; j++) {

                let curvePointMatrix = levelCurveMatrices[j];
                
                let vec_pos = vec4.fromValues(curvePointMatrix[12]*scale, curvePointMatrix[13]*scale, curvePointMatrix[14]*scale, 1);
                
                vec4.transformMat4(vec_pos, vec_pos, controlPointMatrix); // multiplico M*vec_4 - F

                pos.push(vec_pos[0]);			// lleno el buffer de vértices
                pos.push(vec_pos[1]);
                pos.push(vec_pos[2]);

                let n = vec3.fromValues(curvePointMatrix[0], curvePointMatrix[1], curvePointMatrix[2]);
                
                vec3.normalize(n, n);

                normal.push(n[0]);		// lleno el buffer de normales
                normal.push(n[1]);
                normal.push(n[2]);
            }
            scale+=0.03;
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
