import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'

export default class Car extends TreeNode {
    constructor() {
        super();
        this.center = new Cylinder();
        this.wheel1 = new Cylinder();
        this.wheel2 = new Cylinder();
        this.wheel3 = new Cylinder();
        this.wheel4 = new Cylinder();

        this.counter = 0;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        // animation example, with internal state (counter)
        let displacedModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(displacedModelMatrix, displacedModelMatrix, [0, 0.005 * this.counter, 0]);
        modelMatrix = displacedModelMatrix;

        this.counter++;

        let childModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [1, 0, 0])
        mat4.scale(childModelMatrix, childModelMatrix, [0.5, 1, 2]);
        this.center.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 1.2, 2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel1.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, -1.2, 2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel2.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 1.2, -2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel3.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, -1.2, -2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel4.draw(childModelMatrix, viewMatrix, projMatrix);
    }
}
