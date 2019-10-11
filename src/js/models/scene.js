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
        this.toroid = new Rollercoaster();
        this.carousel = new Carousel();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        this.floor.draw(modelMatrix, viewMatrix, projMatrix);
        this.skybox.draw(modelMatrix, viewMatrix, projMatrix);

        let toroidModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(toroidModelMatrix, toroidModelMatrix, [16, -1.65, 19]);
        mat4.rotateY(toroidModelMatrix, toroidModelMatrix, Math.PI);
        mat4.scale(toroidModelMatrix, toroidModelMatrix, [1.3, 1.3, 1.3])
        this.toroid.draw(toroidModelMatrix, viewMatrix, projMatrix);

        let carouselModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(carouselModelMatrix, carouselModelMatrix, [6, -1, 16]);
        mat4.rotateY(carouselModelMatrix, carouselModelMatrix, Math.PI);
        this.carousel.draw(carouselModelMatrix, viewMatrix, projMatrix);
    }
}
