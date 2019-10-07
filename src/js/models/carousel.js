import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import CarouselTop from './carousel_top';

export default class Carousel extends TreeNode {
    constructor() {
        super();
        this.base = new Cylinder();
        this.top = new CarouselTop();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let baseModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(baseModelMatrix, baseModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(baseModelMatrix, baseModelMatrix, [0.1, 0.1, 1]);
        this.base.draw(baseModelMatrix, viewMatrix, projMatrix);

        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(topModelMatrix, topModelMatrix, [0, -1, 0]);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);
    }
}
