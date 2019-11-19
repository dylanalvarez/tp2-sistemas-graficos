import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import SupportCylinder from './support_cylinder'
import CarouselTop from './carousel_top';
import colors from '../constants/colors';
import SmoothedOutRandom from '../utils/smoothed_out_random';
import SupportTopCylinder from './support_top_cylinder';

export default class Carousel extends TreeNode {
    constructor() {
        super();
        this.base = new Cylinder(colors.white);
        this.support = new SupportCylinder(colors.lightBlue);
        this.supportTop = new SupportTopCylinder(colors.lightBlue);
        this.top = new CarouselTop();
        this.time = 0;
        this.yAngle = 0;
        this.xAngle = 0;
        this.zAngle = 0;
        this.random1 = new SmoothedOutRandom(10);
        this.random2 = new SmoothedOutRandom(100);
        this.random3 = new SmoothedOutRandom(100);
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let baseModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(baseModelMatrix, baseModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(baseModelMatrix, baseModelMatrix, [0.15, 0.15, window['Altura sillas']]);
        mat4.translate(baseModelMatrix, baseModelMatrix, [0, 0, -1]);
        this.base.draw(baseModelMatrix, viewMatrix, projMatrix);

        baseModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(baseModelMatrix, baseModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(baseModelMatrix, baseModelMatrix, [0.2, 0.2, 0.3]);
        mat4.translate(baseModelMatrix, baseModelMatrix, [0, 0, -1]);
        this.support.draw(baseModelMatrix, viewMatrix, projMatrix);

        baseModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(baseModelMatrix, baseModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(baseModelMatrix, baseModelMatrix, [0.18, 0.18, 0.45]);
        mat4.translate(baseModelMatrix, baseModelMatrix, [0, 0, -1]);
        this.supportTop.draw(baseModelMatrix, viewMatrix, projMatrix);
        
        this.time += this.random1.nextValue() * 0.01;
        let speed = Math.pow(Math.sin(this.time), 2) / 12 + 0.01
        this.yAngle -= speed;
        this.top.setSpeed(speed);

        this.xAngle += (Math.sin(this.random2.nextValue()) - 0.5) / 20;
        if (this.xAngle > Math.PI / 32) this.xAngle = Math.PI / 32;
        if (this.xAngle < - Math.PI / 32) this.xAngle = - Math.PI / 32;
        this.zAngle += (Math.sin(this.random3.nextValue()) - 0.5) / 20;
        if (this.zAngle > Math.PI / 32) this.zAngle = Math.PI / 32;
        if (this.zAngle < - Math.PI / 32) this.zAngle = - Math.PI / 32;

        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(topModelMatrix, topModelMatrix, [0, 2 * window['Altura sillas'], 0]);
        mat4.rotateX(topModelMatrix, topModelMatrix, this.xAngle * 10 * speed);
        mat4.rotateY(topModelMatrix, topModelMatrix, this.yAngle);
        mat4.rotateZ(topModelMatrix, topModelMatrix, this.zAngle * 10 * speed);
        this.top.draw(topModelMatrix, viewMatrix, projMatrix);
    }
}
