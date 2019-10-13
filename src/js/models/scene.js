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
        mat4.translate(coasterModelMatrix, coasterModelMatrix, [0, 0, 0]);
        //mat4.rotateY(coasterModelMatrix, coasterModelMatrix, Math.PI);
        //mat4.scale(coasterModelMatrix, cosaterModelMatrix, [1.3, 1.3, 1.3])
        this.coaster.draw(coasterModelMatrix, viewMatrix, projMatrix);

        let carouselModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(carouselModelMatrix, carouselModelMatrix, [6, -1, 16]);
        //mat4.rotateY(carouselModelMatrix, carouselModelMatrix, Math.PI);
        this.carousel.draw(carouselModelMatrix, viewMatrix, projMatrix);
    }
}
