import { mat4, vec4 } from 'gl-matrix'

export default class Camera {
    constructor(canvas) {
        this.angleMultiplier = Math.PI / 500;
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
            if (String.fromCharCode(event.keyCode) !== 'c' && String.fromCharCode(event.keyCode) !== 'C') return;
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
            if (event.which !== 1) return;
            this.listenToMouse = true;
            this.lastMouseX = event.x;
            this.lastMouseY = event.y;
        }
        canvas.onmouseup = () => {
            if (event.which !== 1) return;
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
        let cameraModeNameDiv = document.getElementById('camera-mode-name');
        if (this.mode === 'first_person') {
            cameraModeNameDiv.innerHTML = '<b>Primera persona</b><br>(<b>C</b> cambia cámara, navegar con <b>mouse</b>, <b>WASD</b> y <b>QE</b>)'
            this.yAngleUpperLimit =  (3 / 8) * Math.PI;
            this.yAngleLowerLimit =  - (3 / 8) * Math.PI;    
            this.offsetX = 0;
            this.offsetY = 6;
            this.offsetZ = 2;
            this.xAngle = -0.37;
            this.yAngle = -0.3;
            this.step = 0.3;
        } else if (this.mode === 'general') {
            cameraModeNameDiv.innerHTML = '<b>Vista orbital general</b><br>(<b>C</b> cambia cámara, navegar con <b>mouse</b> y <b>WS</b>)'
            this.yAngleUpperLimit =  (1 / 64) * Math.PI;
            this.yAngleLowerLimit =  - (3 / 8) * Math.PI;    
            this.orbitalRadius = 40;
            this.maxOrbitalRadius = 60;
            this.minOrbitalRadius = 20;
            this.offsetX = 5;
            this.offsetY = 3;
            this.offsetZ = -24;
            this.xAngle = 0.6;
            this.yAngle = -0.3;
            this.step = 0.4;
        } else if (this.mode === 'rollercoaster') {
            cameraModeNameDiv.innerHTML = '<b>Vista orbital montaña rusa</b><br>(<b>C</b> cambia cámara, navegar con <b>mouse</b> y <b>WS</b>)'
            this.yAngleUpperLimit = (1 / 64) * Math.PI;
            this.yAngleLowerLimit = - (3 / 8) * Math.PI;
            this.orbitalRadius = 28;
            this.maxOrbitalRadius = 40;
            this.minOrbitalRadius = 10;
            this.offsetX = 12;
            this.offsetY = 5;
            this.offsetZ = -28;
            this.xAngle = -0.9;
            this.yAngle = -0.3;
            this.step = 0.3;
        } else if (this.mode === 'chairs') {
            cameraModeNameDiv.innerHTML = '<b>Vista orbital sillas voladoras</b><br>(<b>C</b> cambia cámara, navegar con <b>mouse</b> y <b>WS</b>)'
            this.yAngleUpperLimit = 0;
            this.yAngleLowerLimit = - (3 / 8) * Math.PI;
            this.orbitalRadius = 10;
            this.maxOrbitalRadius = 25;
            this.minOrbitalRadius = 3;
            this.offsetX = -2.9;
            this.offsetY = 0.7;
            this.offsetZ = -10;
            this.xAngle = -1;
            this.yAngle = -0.1;
            this.step = 0.1;
        } else {
            cameraModeNameDiv.innerHTML = '<b>Vista desde carro</b><br>(<b>C</b> cambia cámara)'
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
        if (angle > this.yAngleUpperLimit) {
            this.yAngle = this.yAngleUpperLimit;
        }
        if (angle < this.yAngleLowerLimit) {
            this.yAngle = this.yAngleLowerLimit;
        }
    }

    updateOrbitalRadius() {
        this.orbitalRadius += this.offset('W', 'S') * this.step;
        if (this.orbitalRadius < this.minOrbitalRadius) this.orbitalRadius = this.minOrbitalRadius;
        if (this.orbitalRadius > this.maxOrbitalRadius) this.orbitalRadius = this.maxOrbitalRadius;
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
        this.offsetY = Math.max(this.offsetY + this.offset('E', 'Q') * this.step, 0.2);
        this.offsetZ += z * this.step;
    }

    updateCarPosition(position) {
        mat4.rotateX(position, position, Math.PI / 2);
        mat4.translate(position, position, [3, 0, 1]);
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
        if (this.mode === 'first_person') {
            this.updateOffsets();
        } else {
            this.updateOrbitalRadius();
        }
        this.applyOffsets(this.eye);
        mat4.rotateY(this.eye, this.eye, this.xAngle);
        mat4.rotateX(this.eye, this.eye, this.yAngle);
    }

    setWebGLViewerPositionUniform(position) {
        let key = 'uViewerPosition';
        gl.uniform3f(gl.getUniformLocation(glColorProgram, key), position[0], position[1], position[2]);
        gl.uniform3f(gl.getUniformLocation(glTextureProgram, key), position[0], position[1], position[2]);
        gl.uniform3f(gl.getUniformLocation(glMultiTextureProgram, key), position[0], position[1], position[2]);
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

        if (this.mode === 'first_person' || this.mode === 'car') {
            mat4.lookAt(
                viewMatrix,
                eyePosition,
                centerPosition,
                [0, 1, 0]
            );
            this.setWebGLViewerPositionUniform(eyePosition);
        } else {
            let eye = mat4.create();

            mat4.translate(eye, eye, [this.offsetX, this.offsetY, this.offsetZ]);
            mat4.rotateY(eye, eye, this.xAngle);
            mat4.rotateX(eye, eye, this.yAngle);
            mat4.translate(eye, eye, [0, 0, this.orbitalRadius]);
            
            let eyePosition = this.position(eye);
            mat4.lookAt(
                viewMatrix,
                eyePosition,
                [this.offsetX, this.offsetY, this.offsetZ],
                [0, 1, 0]
            );
            this.setWebGLViewerPositionUniform(eyePosition);   
        }
    }
}