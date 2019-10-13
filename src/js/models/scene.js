import TreeNode from './tree_node'
import Floor from './floor'
import Skybox from './skybox'
import Toroid from './toroid'
import { mat4 } from 'gl-matrix'
import Carousel from './carousel'

export default class Scene extends TreeNode {
    constructor() {
        super();
        this.floor = new Floor();
        this.skybox = new Skybox();
        this.toroid = new Toroid();
        this.carousel = new Carousel();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        this.floor.draw(modelMatrix, viewMatrix, projMatrix);
        this.skybox.draw(modelMatrix, viewMatrix, projMatrix);

        let toroidModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(toroidModelMatrix, toroidModelMatrix, [3, 0, -10]);
        mat4.scale(toroidModelMatrix, toroidModelMatrix, [1.3, 1.3, 1.3])
        this.toroid.draw(toroidModelMatrix, viewMatrix, projMatrix);

        let carouselModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(carouselModelMatrix, carouselModelMatrix, [-3, 0, -10]);
        this.carousel.draw(carouselModelMatrix, viewMatrix, projMatrix);
    }
}
