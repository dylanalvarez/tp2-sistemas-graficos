export default class ColorMaterial {
    constructor(color) {
        this.color = color;
    }

    program() {
        return glColorProgram;
    }

    enableColors() {
        this.setWebGLUniformColor("uColor");
    }

    setWebGLUniformColor(key) {
        gl.uniform3f(gl.getUniformLocation(glColorProgram, key), this.color[0], this.color[1], this.color[2]);
    }

    disableColors() {
    }
}
