import { mat4 } from 'gl-matrix'

export default class Camera {
    constructor() {
        this.step = 0.1;
        this.pressedKeys = new Set();
        this.offsetX = -2;
        this.offsetY = 1;
        this.offsetZ = -5;
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

    updateOffsets() {
        this.offsetX += this.offset('D', 'A');
        this.offsetY += this.offset('E', 'Q');
        this.offsetZ += this.offset('W', 'S');
    }

    setViewMatrix(viewMatrix) {
        this.updateOffsets();

        mat4.identity(viewMatrix);
        mat4.translate(
            viewMatrix,
            viewMatrix,
            [this.offsetX, this.offsetY, this.offsetZ]
        );
        
    }
}