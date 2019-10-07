import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'

export default class Carousel extends TreeNode {
    constructor() {
        super();
        this.center = new Cylinder();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let childModelMatrix = mat4.clone(modelMatrix);
        this.center.draw(childModelMatrix, viewMatrix, projMatrix);
    }
}
