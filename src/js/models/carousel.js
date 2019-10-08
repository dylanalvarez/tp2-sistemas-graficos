import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import CarouselTop from './carousel_top';
import colors from '../colors';

export default class Carousel extends TreeNode {
    constructor() {
        super();
        this.base = new Cylinder(colors.white);
        this.top = new CarouselTop();
        this.angle = 0;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let baseModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(baseModelMatrix, baseModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(baseModelMatrix, baseModelMatrix, [0.1, 0.1, 1]);
        this.base.draw(baseModelMatrix, viewMatrix, projMatrix);

        this.angle = this.angle + 0.05;

        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(topModelMatrix, topModelMatrix, [0, -1, 0]);
        mat4.rotate(topModelMatrix, topModelMatrix, this.angle, [0, -1, 0]);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);
    }
}
