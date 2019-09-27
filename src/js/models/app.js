import colors from "../colors";
import fragmentShaderSource from '../../shaders/fragment.glsl'
import vertexShaderSource from '../../shaders/vertex.glsl'
import { mat4, vec3 } from 'gl-matrix'


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

        let gl = null,
            canvas = null,
            glProgram = null,
            fragmentShader = null,
            vertexShader = null;

        let vertexPositionAttribute = null,
            trianglesVerticeBuffer = null,
            vertexNormalAttribute = null,
            trianglesNormalBuffer = null;

        /** @type {WebGLBuffer} */
        let trianglesIndexBuffer = null;

        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projMatrix = mat4.create();
        let normalMatrix = mat4.create();
        let rotate_angle = -1.57078;

        let vs_source = "";
        let fs_source = "";

        function initWebGL() {

            canvas = document.getElementById("my-canvas");

            try {
                gl = canvas.getContext("webgl");

            } catch (e) {
                alert("Error: Your browser does not appear to support WebGL.");
            }

            if (gl) {

                setupWebGL();
                initShaders();
                setupBuffers();
                tick();

            } else {
                alert("Error: Your browser does not appear to support WebGL.");
            }

        }


        function setupWebGL() {
            gl.enable(gl.DEPTH_TEST);
            //set the clear color
            gl.clearColor(0.1, 0.1, 0.2, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.viewport(0, 0, canvas.width, canvas.height);

            // Matrix de Proyeccion Perspectiva

            mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

            mat4.rotate(modelMatrix, modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

            mat4.identity(viewMatrix);
            mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -5.0]);
        }


        function initShaders() {

            //compile shaders    
            vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
            fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

            //create program
            glProgram = gl.createProgram();

            //attach and link shaders to the program
            gl.attachShader(glProgram, vertexShader);
            gl.attachShader(glProgram, fragmentShader);
            gl.linkProgram(glProgram);

            if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program.");
            }

            //use program
            gl.useProgram(glProgram);
        }

        function makeShader(src, type) {
            //compile the vertex shader
            let shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        function getPos(alfa, height) {
            let r = 2;
            let x = r * Math.cos(alfa);
            let y = r * Math.sin(alfa);
            return [x, y, height];
        }

        function getNrm(alfa) {
            let position = getPos(alfa, 0);
            let v1 = vec3.fromValues(...position);
            vec3.normalize(v1, v1);
            return v1;
        }


        function setupBuffers() {
            let pos = [];
            let normal = [];
            let r = 2;
            let rows = 128;	// filas	
            let cols = 256;	// columnas

            let controlPoints = [];

            for (let i = 0; i < rows; i++) {
                let alfa = j / (cols - 1) * Math.PI * 2;
                let p = getPos(alfa, 0);
                controlPoints.push(p);
            }

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {

                    let alfa = j / (cols - 1) * Math.PI * 2;
                    let z = i / 64;

                    // evaluo la posición sobre la superficie de la esfera a partir de latitud y longitud
                    let p = getPos(alfa, z);

                    pos.push(p[0]);			// lleno el buffer de vértices
                    pos.push(p[1]);
                    pos.push(p[2]);

                    // evaluo el vector normal sobre la superficie de la esfera a partir de latitud y longitud
                    let n = getNrm(alfa);

                    normal.push(n[0]);		// lleno el buffer de normales
                    normal.push(n[1]);
                    normal.push(n[2]);
                }

            }

            trianglesVerticeBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);


            trianglesNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

            let index = [];

            for (let i = 0; i < rows - 1; i++) {
                index.push(i * cols);
                for (let j = 0; j < cols - 1; j++) {

                    // lleno el buffer de indices del quad 
                    index.push(i * cols + j);
                    index.push((i + 1) * cols + j);
                    index.push(i * cols + j + 1);
                    index.push((i + 1) * cols + j + 1);
                }
                index.push((i + 1) * cols + cols - 1);
            }


            trianglesIndexBuffer = gl.createBuffer();
            trianglesIndexBuffer.number_vertex_point = index.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
        }

        function setupVertexShaderMatrix() {

            let modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
            let viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
            let projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
            let normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");

            gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
            gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
            gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
            gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
        }

        function drawScene() {

            setupVertexShaderMatrix();

            vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
            gl.drawElements(gl.TRIANGLE_STRIP, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }

        function animate() {

            rotate_angle += 0.01;
            mat4.identity(modelMatrix);
            mat4.rotate(modelMatrix, modelMatrix, rotate_angle, [1.0, 0.0, 1.0]);


            mat4.identity(normalMatrix);
            mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
            mat4.invert(normalMatrix, normalMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

        }

        function tick() {
            requestAnimationFrame(tick);
            drawScene();
            animate();
        }

        vs_source = vertexShaderSource;
        fs_source = fragmentShaderSource;
        initWebGL();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}