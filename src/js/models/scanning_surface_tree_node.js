import TreeNode from "./tree_node";
import { vec4, vec3 } from "gl-matrix";

export default class ScanningSurfaceTreeNode extends TreeNode {

    levelCurveMatrices() {} // los hijos deben implementar

    controlCurveMatrices() {} // los hijos deben implementar

    buildBuffers() {
        let pos = [];
        let normal = [];

        let controlCurveMatrices = this.controlCurveMatrices();

        let levelCurveMatrices = this.levelCurveMatrices();

        let rows = controlCurveMatrices.length;
        let cols = levelCurveMatrices.length;

        for (let i = 0; i < rows; i++) {
            let controlPointMatrix = controlCurveMatrices[i];

            for (let j = 0; j < cols; j++) {
                
                let curvePointMatrix = levelCurveMatrices[j];
                
                let vec_pos = vec4.fromValues(curvePointMatrix[12], curvePointMatrix[13], curvePointMatrix[14], 1);
                
                vec4.transformMat4(vec_pos, vec_pos, controlPointMatrix); // multiplico M*vec_4 - F

                pos.push(vec_pos[0]);			// lleno el buffer de vértices
                pos.push(vec_pos[1]);
                pos.push(vec_pos[2]);

                let vec_norm = vec4.fromValues(curvePointMatrix[0], curvePointMatrix[1], curvePointMatrix[2], 0);

                vec4.transformMat4(vec_norm, vec_norm, controlPointMatrix);
                
                vec3.normalize(vec_norm, vec_norm);

                normal.push(vec_norm[0]);		// lleno el buffer de normales
                normal.push(vec_norm[1]);
                normal.push(vec_norm[2]);
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
