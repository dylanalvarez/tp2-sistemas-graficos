import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import Chair from './chair'
import colors from '../constants/colors';

export default class ChairWithRope extends TreeNode {
    constructor() {
        super();
        this.rope = new Cylinder(colors.black);
        this.chair = new Chair(colors.carouselChairMagenta);
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let yOffset = 0.6 * window['Altura sillas'];

        let ropeModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(ropeModelMatrix, ropeModelMatrix, [0, -yOffset, 0.03]);
        mat4.rotate(ropeModelMatrix, ropeModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(ropeModelMatrix, ropeModelMatrix, [0.01, 0.01, yOffset]);
        this.rope.draw(ropeModelMatrix, viewMatrix, projMatrix);

        let chairModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(chairModelMatrix, chairModelMatrix, [0, -yOffset * 2, 0]);
        mat4.rotate(chairModelMatrix, chairModelMatrix, -Math.PI / 2, [0, 1, 0]);
        mat4.scale(chairModelMatrix, chairModelMatrix, [0.1, 0.1, 0.1]);
        this.chair.draw(chairModelMatrix, viewMatrix, projMatrix);
    }
}
