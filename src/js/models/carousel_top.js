import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import colors from '../constants/colors';
import ChairWithRope from './chair_with_rope';

export default class CarouselTop extends Cylinder {
    constructor() {
        super(colors.carouselTopOrange);
        this.chairWithRope = new ChairWithRope();
        this.speed = 0;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(topModelMatrix, topModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(topModelMatrix, topModelMatrix, [1.2, 1.2, 0.1]);
        super.draw(topModelMatrix, viewMatrix, projMatrix);

        let chairCount = window['Cant. sillas'];
        for (let i = 0; i < chairCount; i++) {
            let childModelMatrix = mat4.clone(modelMatrix);
            mat4.rotateY(childModelMatrix, childModelMatrix, 2 * Math.PI * i / chairCount);
            mat4.translate(childModelMatrix, childModelMatrix, [2, 0, 0]);
            mat4.rotateZ(childModelMatrix, childModelMatrix, this.speed * 2 * Math.PI);
            this.chairWithRope.draw(childModelMatrix, viewMatrix, projMatrix);
        }
    }

    buildBuffers() {
        return super.buildBuffers(2, 7);
    }
}
