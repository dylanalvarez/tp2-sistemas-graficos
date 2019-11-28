import TreeNode from './tree_node'
import Floor from './floor'
import Skybox from './skybox'
import CircularRollercoaster from './circular_rollercoaster'
import CrossedRollercoaster from './crossed_rollercoaster'
import { mat4 } from 'gl-matrix'
import Carousel from './carousel'
import Lightpole from './lightpole'

export default class Scene extends TreeNode {
    constructor() {
        super();
        this.floor = new Floor();
        this.skybox = new Skybox();
        this.circularCoaster = new CircularRollercoaster();
        this.crossedCoaster = new CrossedRollercoaster();
        this.carousel = new Carousel();
        this.lightpoleOne = new Lightpole([0, 3, 0]);
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        this.floor.draw(modelMatrix, viewMatrix, projMatrix);
        this.skybox.draw(modelMatrix, viewMatrix, projMatrix);

        let coasterModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(coasterModelMatrix, coasterModelMatrix, [15, 0, -10]);
        if (window['Tipo de camino'] === "No cruzado") this.circularCoaster.draw(coasterModelMatrix, viewMatrix, projMatrix);
        if (window['Tipo de camino'] === "Cruzado") this.crossedCoaster.draw(coasterModelMatrix, viewMatrix, projMatrix);

        let carouselModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(carouselModelMatrix, carouselModelMatrix, [-7, 0, -15]);
        mat4.scale(carouselModelMatrix, carouselModelMatrix, [1.5, 1.5, 1.5]);
        this.carousel.draw(carouselModelMatrix, viewMatrix, projMatrix);

        let lightpoleOneModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleOneModelMatrix, lightpoleOneModelMatrix, [3, 0, 0]);
        this.lightpoleOne.draw(lightpoleOneModelMatrix, viewMatrix, projMatrix);

        lightpoleOneModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleOneModelMatrix, lightpoleOneModelMatrix, [0, 0, -40]);
        this.lightpoleOne.draw(lightpoleOneModelMatrix, viewMatrix, projMatrix);

        lightpoleOneModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleOneModelMatrix, lightpoleOneModelMatrix, [30, 0, -5]);
        this.lightpoleOne.draw(lightpoleOneModelMatrix, viewMatrix, projMatrix);

        lightpoleOneModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleOneModelMatrix, lightpoleOneModelMatrix, [30, 0, -40]);
        this.lightpoleOne.draw(lightpoleOneModelMatrix, viewMatrix, projMatrix);

        lightpoleOneModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleOneModelMatrix, lightpoleOneModelMatrix, [-15, 0, -7]);
        this.lightpoleOne.draw(lightpoleOneModelMatrix, viewMatrix, projMatrix);

        lightpoleOneModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(lightpoleOneModelMatrix, lightpoleOneModelMatrix, [-5, 0, -25]);
        this.lightpoleOne.draw(lightpoleOneModelMatrix, viewMatrix, projMatrix);

    }

    setWebGLUniformLightSource(key, lightSource) {
        gl.uniform3f(gl.getUniformLocation(glProgram, key), lightSource[0], lightSource[1], lightSource[2]);
    }
}
