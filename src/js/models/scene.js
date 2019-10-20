import TreeNode from './tree_node'
import Floor from './floor'
import Skybox from './skybox'
import CircularRollercoaster from './circular_rollercoaster'
import CrossedRollercoaster from './crossed_rollercoaster'
import { mat4 } from 'gl-matrix'
import Carousel from './carousel'
import Lightpole from './lightpole'
import Chair from './chair'
import colors from '../constants/colors'
import CarBody from './carbody'
import Car from './car'

export default class Scene extends TreeNode {
    constructor() {
        super();
        this.floor = new Floor();
        this.skybox = new Skybox();
        this.circularCoaster = new CircularRollercoaster();
        this.crossedCoaster = new CrossedRollercoaster();
        this.carousel = new Carousel();
        this.lightpoleOne = new Lightpole();
        this.lightpoleTwo = new Lightpole();
        this.lightpoleThree = new Lightpole();
        this.carBody = new Car();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        this.floor.draw(modelMatrix, viewMatrix, projMatrix);
        this.skybox.draw(modelMatrix, viewMatrix, projMatrix);

        let coasterModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(coasterModelMatrix, coasterModelMatrix, [15, 0, -10]);
        if (window.tipoDeCamino === "No Cruzado") this.circularCoaster.draw(coasterModelMatrix, viewMatrix, projMatrix);
        if (window.tipoDeCamino === "Cruzado") this.crossedCoaster.draw(coasterModelMatrix, viewMatrix, projMatrix);

        let carouselModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(carouselModelMatrix, carouselModelMatrix, [-3, 0, -10]);

        this.carousel.draw(carouselModelMatrix, viewMatrix, projMatrix);

        let lightpoleOneModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleOneModelMatrix, lightpoleOneModelMatrix, [2, 0, -5]);
        this.lightpoleOne.draw(lightpoleOneModelMatrix, viewMatrix, projMatrix);

        let lightpoleTwoModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleTwoModelMatrix, lightpoleTwoModelMatrix, [-2, 0, -30]);
        this.lightpoleOne.draw(lightpoleTwoModelMatrix, viewMatrix, projMatrix);

        let lightpoleThreeModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleThreeModelMatrix, lightpoleThreeModelMatrix, [30, 0, -20]);
        this.lightpoleOne.draw(lightpoleThreeModelMatrix, viewMatrix, projMatrix);
    }
}
