import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import Chair from './chair'
import colors from '../constants/colors';

export default class Car extends TreeNode {
    constructor() {
        super();
        this.center = new Cylinder(colors.carYellow);
        this.wheel1 = new Cylinder(colors.black);
        this.wheel2 = new Cylinder(colors.black);
        this.wheel3 = new Cylinder(colors.black);
        this.wheel4 = new Cylinder(colors.black);
        this.chair = new Chair(colors.carChairGreen);
    }

    color() {
        return colors.carYellow;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let childModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [1, 0, 0])
        mat4.scale(childModelMatrix, childModelMatrix, [0.5, 1, 2]);
        this.center.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 1.2, 2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel1.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, -1.2, 2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel2.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 1.2, -2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel3.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, -1.2, -2]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [0, 0, 1])
        mat4.scale(childModelMatrix, childModelMatrix, [0.3, 0.3, 0.3]);
        this.wheel4.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(modelMatrix);
        // Los ejes de la silla estan rotados por la aplicacion que se le aplica a todo el auto
        // en Rollercoaster
        mat4.translate(childModelMatrix, childModelMatrix, [1,-0.2, 0]);
        mat4.scale(childModelMatrix, childModelMatrix, [0.4, 0.4, 0.4]);
        
        this.chair.draw(childModelMatrix, viewMatrix, projMatrix);
    }
}
