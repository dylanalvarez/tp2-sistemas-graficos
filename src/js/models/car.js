import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Chair from './chair'
import CarBody from './carbody'
import CarCap from './carcap';
import FrontCarCap from './front_car_cap'
import colors from '../constants/colors';

export default class Car extends TreeNode {
    constructor() {
        super();
        this.chairOne = new Chair(colors.carChairGreen);
        this.chairTwo = new Chair(colors.carChairGreen);
        this.carBody = new CarBody();
        this.carCap1 = new CarCap();
        this.carCap2 = new FrontCarCap();
    }

    color() {
        return colors.carYellow;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        window.camera.updateCarPosition(mat4.clone(modelMatrix));

        childModelMatrix = mat4.clone(modelMatrix);
        // Los ejes de la silla estan rotados por la transformacion que se le aplica a todo el auto
        // en Rollercoaster
        let childModelMatrix = mat4.clone(modelMatrix);
        mat4.scale(childModelMatrix, childModelMatrix, [0.6, 0.6, 0.7]);
        this.chairTwo.draw(childModelMatrix, viewMatrix, projMatrix);

        mat4.translate(childModelMatrix, childModelMatrix, [0, 4, 0]);
        this.chairOne.draw(childModelMatrix, viewMatrix, projMatrix);
        
        let carBodyPartsMatrix = mat4.clone(modelMatrix);
        mat4.translate(carBodyPartsMatrix, carBodyPartsMatrix, [0, 5, 0]);
        mat4.rotate(carBodyPartsMatrix, carBodyPartsMatrix, Math.PI, [0, 0, 1]);
        mat4.rotate(carBodyPartsMatrix, carBodyPartsMatrix, Math.PI/2, [1, 0, 0]);

        childModelMatrix = mat4.clone(carBodyPartsMatrix);
        mat4.scale(childModelMatrix, childModelMatrix, [1, 1, 6]);
        this.carBody.draw(childModelMatrix, viewMatrix, projMatrix);

        childModelMatrix = mat4.clone(carBodyPartsMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0, 0, -7.77]);
        mat4.scale(childModelMatrix, childModelMatrix, [1.03, 1.03, 2]);
        this.carCap1.draw(childModelMatrix, viewMatrix, projMatrix);

        mat4.translate(childModelMatrix, childModelMatrix, [0, 0, 4.47])
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI, [1, 0, 0]);
        this.carCap2.draw(childModelMatrix, viewMatrix, projMatrix);

    }

}
