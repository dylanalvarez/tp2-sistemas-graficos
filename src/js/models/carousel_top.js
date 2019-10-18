import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import colors from '../constants/colors';

export default class CarouselTop extends TreeNode {
    constructor() {
        super();
        this.top = new Cylinder(colors.carouselTopOrange);
        this.chair = new Cylinder(colors.black);
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(topModelMatrix, topModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(topModelMatrix, topModelMatrix, [1, 1, 0.1]);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);

        let chairModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(chairModelMatrix, chairModelMatrix, [1.5, -0.51, 0]);
        mat4.rotate(chairModelMatrix, chairModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(chairModelMatrix, chairModelMatrix, [0.06, 0.06, 0.6]);
        this.chair.draw(chairModelMatrix, viewMatrix, projMatrix);
    }
}
