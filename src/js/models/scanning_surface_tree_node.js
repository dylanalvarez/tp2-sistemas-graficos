import TreeNode from "./tree_node";
import { vec4, vec3 } from "gl-matrix";

export default class ScanningSurfaceTreeNode extends TreeNode {    
    levelCurveMatrices() {} // los hijos deben implementar

    controlCurveMatrices() {} // los hijos deben implementar

    buildBuffers() {
        let pos = [];
        let normal = [];
        let rows = 128;
        let cols = 256;

        // Lista de matrices de tamaño <rows>
        let controlCurveMatrices = this.controlCurveMatrices();
        // Lista de matrices de tamaño <cols>
        let levelCurveMatrices = this.levelCurveMatrices();

        for (let i = 0; i < rows; i++) {

            let controlPointMatrix = controlCurveMatrices[i];

            for (let j = 0; j < cols; j++) {

                let curvePointMatrix = levelCurveMatrices[j];
                let p = [curvePointMatrix[12], curvePointMatrix[13], curvePointMatrix[14]];
                
                let vec_pos = vec4.fromValues(p[0], p[1], p[2], 1);
                vec4.transformMat4(vec_pos, vec_pos, controlPointMatrix); // multiplico M*vec_4 - F

                pos.push(vec_pos[0]);			// lleno el buffer de vértices
                pos.push(vec_pos[1]);
                pos.push(vec_pos[2]);

                let norm = vec3.fromValues([curvePointMatrix[0], curvePointMatrix[1], curvePointMatrix[2]]);
                vec3.normalize(norm, norm);

                normal.push(norm[0]);		// lleno el buffer de normales
                normal.push(norm[1]);
                normal.push(norm[2]);
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
