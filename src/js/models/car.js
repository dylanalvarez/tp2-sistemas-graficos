import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'

export default class Car extends TreeNode {
    draw(modelMatrix, viewMatrix, projMatrix) {
        let childModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [1, 0, 0])
        mat4.scale(childModelMatrix, childModelMatrix, [0.5, 1, 2]);
        new Cylinder().draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 1.2, 2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        new Cylinder().draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, -1.2, 2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        new Cylinder().draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 1.2, -2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        new Cylinder().draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, -1.2, -2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        new Cylinder().draw(childModelMatrix, viewMatrix, projMatrix);
    }
}
