import { mat4, vec4 } from 'gl-matrix'

export default class Camera {
    constructor(canvas) {
        this.step = 0.2;
        this.angleMultiplier = Math.PI / 500;
        this.yAngleLimit =  (3 / 8) * Math.PI;
        this.pressedKeys = new Set();
        this.mode = 'first_person';
        this.setDefaults();
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        window.onkeydown = (event) => {
            this.pressedKeys.add(String.fromCharCode(event.keyCode));
        }
        window.onkeyup = (event) => {
            this.pressedKeys.delete(String.fromCharCode(event.keyCode));
        }
        window.onkeypress = (event) => {
            if (String.fromCharCode(event.keyCode) !== 'c') return;
            if (this.mode === 'first_person') {
                this.mode = 'general';
            } else if (this.mode === 'general') {
                this.mode = 'rollercoaster';
            } else if (this.mode === 'rollercoaster') {
                this.mode = 'chairs';
            } else if (this.mode === 'chairs') {
                this.mode = 'car';
            } else {
                this.mode = 'first_person';
            }
            this.setDefaults();
        }
        canvas.onmousedown = (event) => {
            this.listenToMouse = true;
            this.lastMouseX = event.x;
            this.lastMouseY = event.y;
        }
        canvas.onmouseup = () => {
            this.listenToMouse = false;
        }
        canvas.onmousemove = (event) => {
            if (!this.listenToMouse) return;
            
            this.updateXAngle(event.x);
            this.updateYAngle(event.y);
            
            this.lastMouseX = event.x;
            this.lastMouseY = event.y;
        }
    }

    setDefaults() {
        if (this.mode === 'first_person') {
            this.offsetX = 0;
            this.offsetY = 2;
            this.offsetZ = 0;
            this.xAngle = -0.37;
            this.yAngle = 0.05;
        } else if (this.mode === 'general') {
            this.offsetX = -5.4;
            this.offsetY = 0.6;
            this.offsetZ = -24.3;
            this.xAngle = -2.04;
            this.yAngle = 0.23;
        } else if (this.mode === 'rollercoaster') {
            this.offsetX = 13.5;
            this.offsetY = 10.4;
            this.offsetZ = -20.9;
            this.xAngle = 0.08;
            this.yAngle = -0.39;
        } else if (this.mode === 'chairs') {
            this.offsetX = 1;
            this.offsetY = 1;
            this.offsetZ = -8.6;
            this.xAngle = 1.23;
            this.yAngle = 0.08;
        }
    }

    offset(backwardKey, forwardKey) {
        let backward = this.pressedKeys.has(backwardKey);
        let forward = this.pressedKeys.has(forwardKey);
        if (backward && !forward) {
            return -1;
        }
        if (forward && !backward) {
            return 1;
        }
        return 0;
    }

    updateXAngle(mouseX) {
        let difference = (this.lastMouseX - mouseX) * this.angleMultiplier;
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
            this.offset('A', 'D'),
            0,
            this.offset('W', 'S'),
            1
        );
        let transformationMatrix = mat4.create();
        mat4.rotateY(transformationMatrix, transformationMatrix, this.xAngle);
        mat4.rotateX(transformationMatrix, transformationMatrix, this.yAngle);
        vec4.transformMat4(offset, offset, transformationMatrix);

        let x = offset[0];
        let z = offset[2];
        let sum = Math.abs(x) + Math.abs(z);

        if (sum > 0.001) {
            x = x / sum;
            z = z / sum;
        } else {
            x = z = 0;
        }

        this.offsetX += x * this.step;
        this.offsetY = Math.max(this.offsetY + this.offset('E', 'Q') * this.step, 0.1);
        this.offsetZ += z * this.step;
    }

    updateCarPosition(position) {
        mat4.rotateX(position, position, Math.PI / 2);
        mat4.translate(position, position, [2, 0, 0]);
        this.carPosition = position;
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

    updateEye() {
        if (this.mode === 'car') {
            this.eye = this.carPosition;
            return;
        }
        this.eye = mat4.create();
        if (this.mode === 'first_person') this.updateOffsets();
        this.applyOffsets(this.eye);
        mat4.rotateY(this.eye, this.eye, this.xAngle);
        mat4.rotateX(this.eye, this.eye, this.yAngle);
    }

    setViewMatrix(viewMatrix) {
        this.updateEye();

        let eyePosition = this.position(this.eye);
        let eyeTangent = this.tangent(this.eye);

        let centerPosition = [
            eyePosition[0] - eyeTangent[0],
            eyePosition[1] - eyeTangent[1],
            eyePosition[2] - eyeTangent[2],
        ]

        mat4.lookAt(
            viewMatrix,
            eyePosition,
            centerPosition,
            [0, 1, 0]
        )
    }
}