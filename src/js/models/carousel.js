import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'

export default class Carousel extends TreeNode {
    constructor() {
        super();
        this.base = new Cylinder();
        this.top = new Cylinder();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let baseModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(baseModelMatrix, baseModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(baseModelMatrix, baseModelMatrix, [0.1, 0.1, 1]);
        this.base.draw(baseModelMatrix, viewMatrix, projMatrix);

        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(topModelMatrix, topModelMatrix, [0, -1, 0]);
        mat4.rotate(topModelMatrix, topModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(topModelMatrix, topModelMatrix, [1, 1, 0.1]);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);
    }
}
