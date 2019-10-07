import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'

export default class CarouselTop extends TreeNode {
    constructor() {
        super();
        this.top = new Cylinder();
        this.something = new Cylinder();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(topModelMatrix, topModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(topModelMatrix, topModelMatrix, [1, 1, 0.1]);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);

        let somethingModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(somethingModelMatrix, somethingModelMatrix, [1.5, 0.5, 0]);
        mat4.rotate(somethingModelMatrix, somethingModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(somethingModelMatrix, somethingModelMatrix, [0.06, 0.06, 0.6]);
        this.top.draw(somethingModelMatrix, viewMatrix, projMatrix);
    }
}
