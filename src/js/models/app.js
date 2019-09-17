import colors from "../colors";

export default class App {
    constructor(canvas) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;

        /** @type {WebGLRenderingContext} */
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    }

    run() {
        this.resize();
        window.onresize = () => this.resize();
        this.gl.clearColor(...colors.black);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}