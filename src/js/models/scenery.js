import { vec3 } from 'gl-matrix'
import TreeNode from './tree_node'

export default class Scenery extends TreeNode {

    buildBuffers() {

        let pos = [];
        let normal = [];
        let rows = 25;
        let cols = 25;

        let n = [0, 1, 0];

        for (let i = 0; i < rows; i++) {
            for (let j=0; j < cols; j++) {

                pos.push(i);
                pos.push(0);
                pos.push(j);

                normal.push(n[0]);
                normal.push(n[1]);
                normal.push(n[2]);
            }
        }

        // Reemplazar estas constantes por las que estan en el modulo 'colors'
        const grassGreen = [0.26, 0.82, 0.27, 1.0];
        const skyBlue = [0.32, 0.53, 0.87];

        // Repito rows*cols veces el vector de colores para el piso
        // (repito el vector color por cada vertice que compone al piso)
        let floorColors = [];
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++) {
                floorColors.push(grassGreen)
            }
        }

        let skyColors = [];
        // Hacer lo mismo para sky colors

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
