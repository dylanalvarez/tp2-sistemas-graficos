import { mat4 } from 'gl-matrix'

export default class Camera {
    constructor() {
        this.step = 0.1;
        this.pressedKeys = new Set();
        window.onkeydown = (event) => {
            this.pressedKeys.add(String.fromCharCode(event.keyCode));
        }
        window.onkeyup = (event) => {
            this.pressedKeys.delete(String.fromCharCode(event.keyCode));
        }
    }

    offset(backwardKey, forwardKey) {
        let backward = this.pressedKeys.has(backwardKey);
        let forward = this.pressedKeys.has(forwardKey);
        if (backward && !forward) {
            return this.step;
        }
        if (forward && !backward) {
            return -this.step;
        }
        return 0;
    }

    offsetX() {
        return this.offset('A', 'D');
    }

    offsetY() {
        return this.offset('E', 'Q');
    }

    offsetZ() {
        return this.offset('W', 'S');
    }

    applyTransformations(outputViewMatrix, inputViewMatrix) {
        mat4.translate(
            outputViewMatrix,
            inputViewMatrix,
            [this.offsetX(), this.offsetY(), this.offsetZ()]
        );
    }
}