import TreeNode from './tree_node'
import Floor from './floor'
import Skybox from './skybox'
import Rollercoaster from './rollercoaster'
import { mat4 } from 'gl-matrix'
import Carousel from './carousel'

export default class Scene extends TreeNode {
    constructor() {
        super();
        this.floor = new Floor();
        this.skybox = new Skybox();
        this.coaster = new Rollercoaster();
        this.carousel = new Carousel();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        this.floor.draw(modelMatrix, viewMatrix, projMatrix);
        this.skybox.draw(modelMatrix, viewMatrix, projMatrix);

        let coasterModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(coasterModelMatrix, coasterModelMatrix, [15, 0, -10]);
        this.coaster.draw(coasterModelMatrix, viewMatrix, projMatrix);

        let carouselModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(carouselModelMatrix, carouselModelMatrix, [-3, 0, -10]);

        this.carousel.draw(carouselModelMatrix, viewMatrix, projMatrix);
    }
}
