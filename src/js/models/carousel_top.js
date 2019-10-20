import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import colors from '../constants/colors';
import ChairWithRope from './chair_with_rope';

export default class CarouselTop extends TreeNode {
    constructor() {
        super();
        this.top = new Cylinder(colors.carouselTopOrange);
        this.chairWithRope = new ChairWithRope();
        this.speed = 0;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(topModelMatrix, topModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(topModelMatrix, topModelMatrix, [1, 1, 0.1]);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);

        let chairCount = window['Cantidad sillas'];
        for (let i = 0; i < chairCount; i++) {
            let childModelMatrix = mat4.clone(modelMatrix);
            mat4.rotateY(childModelMatrix, childModelMatrix, 2 * Math.PI * i / chairCount);
            mat4.translate(childModelMatrix, childModelMatrix, [1.5, 0, 0]);
            mat4.rotateZ(childModelMatrix, childModelMatrix, this.speed * 2 * Math.PI);
            this.chairWithRope.draw(childModelMatrix, viewMatrix, projMatrix);
        }
    }
}
