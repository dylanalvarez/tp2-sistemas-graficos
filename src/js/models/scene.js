import TreeNode from './tree_node'
import Floor from './floor'
import Skybox from './skybox'
import CircularRollercoaster from './circular_rollercoaster'
import CrossedRollercoaster from './crossed_rollercoaster'
import { mat4 } from 'gl-matrix'
import Carousel from './carousel'

export default class Scene extends TreeNode {
    constructor() {
        super();
        this.floor = new Floor();
        this.skybox = new Skybox();
        this.circularCoaster = new CircularRollercoaster();
        this.crossedCoaster = new CrossedRollercoaster();
        this.carousel = new Carousel();
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
    }
}
