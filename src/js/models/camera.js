import { mat4, vec4 } from 'gl-matrix'

export default class Camera {
    constructor() {
        this.step = 0.1;
        this.angleMultiplier = Math.PI / 500;
        this.yAngleLimit =  (3 / 8) * Math.PI;
        this.pressedKeys = new Set();
        this.offsetX = 0;
        this.offsetY = -1;
        this.offsetZ = 15;

        this.xAngle = 0;
        this.yAngle = 0;

        this.lastMouseX = 0;
        this.lastMouseY = 0;

        window.onkeydown = (event) => {
            this.pressedKeys.add(String.fromCharCode(event.keyCode));
        }
        window.onkeyup = (event) => {
            this.pressedKeys.delete(String.fromCharCode(event.keyCode));
        }
        window.onmousedown = (event) => {
            this.listenToMouse = true;
            this.lastMouseX = event.x;
            this.lastMouseY = event.y;
        }
        window.onmouseup = () => {
            this.listenToMouse = false;
        }
        window.onmousemove = (event) => {
            if (!this.listenToMouse) return;
            
            this.updateXAngle(event.x);
            this.updateYAngle(event.y);
            
            this.lastMouseX = event.x;
            this.lastMouseY = event.y;
        }
    }

    offset(backwardKey, forwardKey) {
        let backward = this.pressedKeys.has(backwardKey);
        let forward = this.pressedKeys.has(forwardKey);
        if (backward && !forward) {
            return 1;
        }
        if (forward && !backward) {
            return -1;
        }
        return 0;
    }

    updateXAngle(mouseX) {
        let difference = (mouseX - this.lastMouseX) * this.angleMultiplier;
        this.xAngle = (this.xAngle + difference) % (Math.PI * 2);
    }

    updateYAngle(mouseY) {
        let difference = (this.lastMouseY - mouseY) * this.angleMultiplier;
        let angle = (this.yAngle + difference) % (Math.PI * 2);
        this.yAngle = angle;
        if (angle > this.yAngleLimit) {
            this.yAngle = this.yAngleLimit;
        }
        if (angle < -this.yAngleLimit) {
            this.yAngle = -this.yAngleLimit;
        }
    }

    updateOffsets() {
        let offset = vec4.fromValues(
            this.offset('D', 'A'),
            0,
            this.offset('W', 'S'),
            1
        );
        let transformationMatrix = mat4.create();
        mat4.rotateY(transformationMatrix, transformationMatrix, this.xAngle);
        mat4.rotateX(transformationMatrix, transformationMatrix, this.yAngle);
        vec4.transformMat4(offset, offset, transformationMatrix);

        let x = offset[0];
        let y = offset[1];
        let z = offset[2];
        let sum = Math.abs(x) + Math.abs(z);

        if (sum > 0.001) {
            x = x / sum;
            z = z / sum;
        } else {
            x = z = 0;
        }

        this.offsetX += x * this.step;
        this.offsetY += y * this.step;
        this.offsetY += this.offset('E', 'Q') * this.step;
        this.offsetZ += z *  this.step;
    }

    applyOffsets(eye) {
        mat4.translate(eye, eye, [this.offsetX, this.offsetY, this.offsetZ])
    }

    tangent(matrix) {
        return matrix.slice(8, 11);
    }

    position(matrix) {
        return matrix.slice(12, 15);
    }

    setViewMatrix(viewMatrix) {
        let eye = mat4.create();

        this.updateOffsets();
        this.applyOffsets(eye);
        mat4.rotateY(eye, eye, this.xAngle);
        mat4.rotateX(eye, eye, this.yAngle);

        let eyePosition = this.position(eye);
        let eyeTangent = this.tangent(eye);

        let centerPosition = [
            eyePosition[0] + eyeTangent[0],
            eyePosition[1] + eyeTangent[1],
            eyePosition[2] + eyeTangent[2],
        ]

        mat4.lookAt(
            viewMatrix,
            eyePosition,
            centerPosition,
            [0, 1, 0]
        )
    }
}