import { vec3, mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'

export default class Car extends TreeNode {
    draw(modelMatrix, viewMatrix, projMatrix) {
        new Cylinder().draw(modelMatrix, viewMatrix, projMatrix);

        let childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 0, 2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [1, 0, 0])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        new Cylinder().draw(childModelMatrix, viewMatrix, projMatrix);
    }
}
