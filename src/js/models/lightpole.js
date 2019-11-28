import {mat4} from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import Sphere from './sphere'
import colors from '../constants/colors';
import MetallicProperties from './metalic_properties';

export default class Lightpole extends TreeNode {
    constructor(lightSource) {
        super();
        this.pole = new Cylinder(colors.poleDarkGrey);
        this.bulb = new Sphere(colors.bulbYellow);
        this.lightSource = lightSource;
    }

    phongProperties() {
        return MetallicProperties;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let poleModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(poleModelMatrix, poleModelMatrix, Math.PI / 2, [1, 0, 0])
        mat4.scale(poleModelMatrix, poleModelMatrix, [0.06, 0.06, 3]);
        this.pole.draw(poleModelMatrix, viewMatrix, projMatrix);

        let bulbModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(bulbModelMatrix, bulbModelMatrix, [0, 3, 0]);
        mat4.scale(bulbModelMatrix, bulbModelMatrix, [0.3, 0.3, 0.3]);
        this.bulb.draw(bulbModelMatrix, viewMatrix, projMatrix);
    }
}