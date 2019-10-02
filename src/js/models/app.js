import fragmentShaderSource from '../../shaders/fragment.glsl'
import vertexShaderSource from '../../shaders/vertex.glsl'
import { mat4 } from 'gl-matrix'
import Camera from './camera'
import Toroid from './toroid'

export default class App {
    constructor() {
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();

        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById("my-canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        /** @type {WebGLRenderingContext} */
        window.gl = this.canvas.getContext("webgl");

        this.setupWebGL();
        this.initShaders();

        this.camera = new Camera();
        this.scene = new Toroid();
    }

    run() {
        requestAnimationFrame(() => this.run());
        this.drawScene();
        this.animate();
    }

    drawScene() {
        this.scene.draw(this.modelMatrix, this.viewMatrix, this.projMatrix);
    }

    animate() {
        mat4.identity(this.modelMatrix);
        this.camera.applyTransformations(this.viewMatrix, this.viewMatrix);
    }

    setupWebGL() {
        gl.enable(gl.DEPTH_TEST);

        // set the clear color
        gl.clearColor(0.1, 0.1, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        mat4.perspective(this.projMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 100.0);

        mat4.rotate(this.modelMatrix, this.modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

        mat4.identity(this.viewMatrix);
        mat4.translate(this.viewMatrix, this.viewMatrix, [0.0, 0.0, -5.0]);
    }

    initShaders() {
        // compile shaders    
        let vertexShader = this.makeShader(vertexShaderSource, gl.VERTEX_SHADER);
        let fragmentShader = this.makeShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

        // create program
        window.glProgram = gl.createProgram();

        // attach and link shaders to the program
        gl.attachShader(glProgram, vertexShader);
        gl.attachShader(glProgram, fragmentShader);
        gl.linkProgram(glProgram);

        if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }

        // use program
        gl.useProgram(glProgram);
    }

    makeShader(src, type) {
        // compile the vertex shader
        let shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
        }
        return shader;
    }
}
