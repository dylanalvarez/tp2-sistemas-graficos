import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import CarouselTop from './carousel_top';
import colors from '../constants/colors';
import Chair from './chair';

export default class Carousel extends TreeNode {
    constructor() {
        super();
        this.base = new Cylinder(colors.white);
        this.top = new CarouselTop();
        this.time = 0;
        this.angle = 0;
        this.previousRandom = 0.5;
    }

    smoothedOutRandom() {
        this.previousRandom += (Math.random() - 0.5) / 10;
        return this.previousRandom;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let baseModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(baseModelMatrix, baseModelMatrix, [0, 1, 0])
        mat4.rotate(baseModelMatrix, baseModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(baseModelMatrix, baseModelMatrix, [0.1, 0.1, 1]);
        this.base.draw(baseModelMatrix, viewMatrix, projMatrix);

        this.time += this.smoothedOutRandom() * 0.01;
        let speed = Math.pow(Math.sin(this.time), 2) / 12 + 0.01
        this.angle += speed;
        this.top.setSpeed(speed);

        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(topModelMatrix, topModelMatrix, [0, 2, 0]);
        mat4.rotate(topModelMatrix, topModelMatrix, this.angle, [0, -1, 0]);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);
    }
}
