import TreeNode from './tree_node'
import Floor from './floor'
import Skybox from './skybox'
import Toroid from './toroid'
import { mat4 } from 'gl-matrix'

export default class Scene extends TreeNode {
    constructor() {
        super();
        this.floor = new Floor();
        this.skybox = new Skybox();
        this.toroid = new Toroid();
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        this.floor.draw(modelMatrix, viewMatrix, projMatrix);
        this.skybox.draw(modelMatrix, viewMatrix, projMatrix);

        let toroidModelMatrix = mat4.clone(modelMatrix);
        mat4.translate(toroidModelMatrix, toroidModelMatrix, [6, -1.3, 9]);
        mat4.rotateY(toroidModelMatrix, toroidModelMatrix, Math.PI);
        this.toroid.draw(toroidModelMatrix, viewMatrix, projMatrix);
    }
}
