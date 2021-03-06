import colorFragmentShaderSource from '../../shaders/colorFragment.glsl'
import textureFragmentShaderSource from '../../shaders/textureFragment.glsl'
import multiTextureFragmentShaderSource from '../../shaders/multiTextureFragment.glsl'
import reflectiveFragmentShaderSource from '../../shaders/reflectiveFragment.glsl'
import vertexShaderSource from '../../shaders/vertex.glsl'
import reflectiveVertexShaderSource from '../../shaders/reflectiveVertex.glsl'
import commonFragmentShaderSource from '../../shaders/fragmentPhongReflection.glsl'
import { mat4 } from 'gl-matrix'
import Camera from './camera'
import Scene from './scene'
import * as dat from 'dat.gui';

// dat.gui global variables
window['Velocidad carro'] = 20;
window['Veloc. camara'] = 10;
window['Tipo de camino'] = 'Cruzado'
window['Altura sillas'] = 1.5
window['Cant. sillas'] = 8
window['Cant. columnas'] = 20;

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

        window.camera = new Camera(this.canvas);
        this.scene = new Scene();

        this.gui = new dat.GUI({hideable: false});
        this.gui.add(window, 'Velocidad carro', 1, 60);
        this.gui.add(window, 'Veloc. camara', 1, 30);
        this.gui.add(window, 'Tipo de camino', ['No cruzado', 'Cruzado']);
        this.gui.add(window, 'Altura sillas', 1, 4, 0.01);
        this.gui.add(window, 'Cant. sillas', 0, 30, 1);
        this.gui.add(window, 'Cant. columnas', 4, 40, 1);
    }

    run() {
        requestAnimationFrame(() => this.run());
        this.drawScene();
        window.camera.setViewMatrix(this.viewMatrix);
    }

    drawScene() {
        this.scene.draw(this.modelMatrix, this.viewMatrix, this.projMatrix);
    }

    setupWebGL() {
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        mat4.perspective(this.projMatrix, Math.PI / 3, this.canvas.width / this.canvas.height, 0.1, 1000.0);
    }

    initShaders() {
        // compile shaders    
        let vertexShader = this.makeShader(vertexShaderSource, gl.VERTEX_SHADER);
        let colorFragmentShader = this.makeShader(commonFragmentShaderSource + colorFragmentShaderSource, gl.FRAGMENT_SHADER);
        let textureFragmentShader = this.makeShader(commonFragmentShaderSource + textureFragmentShaderSource, gl.FRAGMENT_SHADER);
        let multiTextureFragmentShader = this.makeShader(commonFragmentShaderSource + multiTextureFragmentShaderSource, gl.FRAGMENT_SHADER);
        let reflectiveVertexShader = this.makeShader(reflectiveVertexShaderSource, gl.VERTEX_SHADER);
        let reflectiveFragmentShader = this.makeShader(commonFragmentShaderSource + reflectiveFragmentShaderSource, gl.FRAGMENT_SHADER);

        // create program
        window.glColorProgram = gl.createProgram();

        // attach and link shaders to the program
        gl.attachShader(glColorProgram, vertexShader);
        gl.attachShader(glColorProgram, colorFragmentShader);
        gl.linkProgram(glColorProgram);

        if (!gl.getProgramParameter(glColorProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the colors shader program.");
        }

        window.glTextureProgram = gl.createProgram();

        gl.attachShader(glTextureProgram, vertexShader);
        gl.attachShader(glTextureProgram, textureFragmentShader);
        gl.linkProgram(glTextureProgram);

        if (!gl.getProgramParameter(glTextureProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the textures shader program.");
        }
        glTextureProgram.samplerUniform0 = gl.getUniformLocation(glTextureProgram, "uSampler0");        


        window.glMultiTextureProgram = gl.createProgram();

        gl.attachShader(glMultiTextureProgram, vertexShader);
        gl.attachShader(glMultiTextureProgram, multiTextureFragmentShader);
        gl.linkProgram(glMultiTextureProgram);

        if (!gl.getProgramParameter(glMultiTextureProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the textures shader program.");
        }
        glMultiTextureProgram.samplerUniform0 = gl.getUniformLocation(glMultiTextureProgram, "uSampler0");
        glMultiTextureProgram.samplerUniform1 = gl.getUniformLocation(glMultiTextureProgram, "uSampler1");
        glMultiTextureProgram.samplerUniform2 = gl.getUniformLocation(glMultiTextureProgram, "uSampler2");


        window.glReflectiveProgram = gl.createProgram();
        gl.attachShader(glReflectiveProgram, reflectiveVertexShader);
        gl.attachShader(glReflectiveProgram, reflectiveFragmentShader);
        gl.linkProgram(glReflectiveProgram);
        if (!gl.getProgramParameter(glReflectiveProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the textures shader program.");
        }
        glReflectiveProgram.samplerUniform0 = gl.getUniformLocation(glReflectiveProgram, "uSampler0");
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
