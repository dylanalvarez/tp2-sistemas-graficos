import TreeNode from './tree_node'
import Floor from './floor'
import Skybox from './skybox'
import Rollercoaster from './rollercoaster'
import { mat4 } from 'gl-matrix'
import Carousel from './carousel'
import Lightpole from './lightpole'

export default class Scene extends TreeNode {
    constructor() {
        super();
        this.floor = new Floor();
        this.skybox = new Skybox();
        this.coaster = new Rollercoaster();
        this.carousel = new Carousel();
        this.lightpoleOne = new Lightpole();
        this.lightpoleTwo = new Lightpole();
        this.lightpoleThree = new Lightpole();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        this.floor.draw(modelMatrix, viewMatrix, projMatrix);

        let skyboxModelMatrix = mat4.clone(modelMatrix);
        mat4.scale(skyboxModelMatrix, skyboxModelMatrix, [100, 100, 100]);
        this.skybox.draw(skyboxModelMatrix, viewMatrix, projMatrix);

        let coasterModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(coasterModelMatrix, coasterModelMatrix, [15, 0, -10]);
        this.coaster.draw(coasterModelMatrix, viewMatrix, projMatrix);

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
