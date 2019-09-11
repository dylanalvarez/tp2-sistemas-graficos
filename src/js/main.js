import { mat4 } from 'gl-matrix'
import fragmentSource from 'shaders/fragment.glsl';
import vertexSource from 'shaders/vertex.glsl';

/** @type {WebGLRenderingContext} */
var gl = null;

var canvas = null;
var glProgram = null;
var fragmentShader = null;
var vertexShader = null;

var vertexPositionAttribute = null,
    trianglesVerticeBuffer = null,
    vertexColorAttribute = null,
    trianglesColorBuffer = null,
    trianglesIndexBuffer = null;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var rotate_angle = -1.57078;

/** @param {HTMLCanvasElement} canvas */
function resize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initWebGL() {

    canvas = document.getElementById("my-canvas");
    resize(canvas);

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    } catch (e) {
        alert("Error: Your browser does not appear to support WebGL.");
    }

    if (gl) {

        setupWebGL();
        initShaders();
        setupBuffers();
        setupVertexShaderMatrix();
        tick();

    } else {
        alert("Error: Your browser does not appear to support WebGL.");
    }

}

function setupVertexShaderMatrix() {
    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
}

function setupWebGL() {
    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix, modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -5.0]);
}


function initShaders() {
    //get shader source
    var fs_source = fragmentSource,
        vs_source = vertexSource;

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
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function setupBuffers() {
    var data = [
        0.0, 0.0, 0.0,
        1.0, 0.0, 1.0,
        0.5, 0.886, 1.0,
        -0.5, 0.886, 1.0,
        -1.0, 0.0, 1.0,
        -0.5, -0.886, 1.0,
        0.5, -0.886, 1.0
    ];

    trianglesVerticeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    var color = [
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 1.0,
        0.0, 0.0, 1.0,
        1.0, 0.0, 1.0
    ];

    trianglesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    var index = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];
    trianglesIndexBuffer = gl.createBuffer();
    trianglesIndexBuffer.number_vertex_point = index.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
}

function drawScene() {
    setupVertexShaderMatrix();

    vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
    gl.drawElements(gl.TRIANGLES, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
}

var angle = 0;
var i = 0;

var mousex = 0;
var mousey = 0;

onmousemove = function (e) { mousex = e.clientX; mousey = e.clientY; }

function animate() {
    rotate_angle += (mousex + mousey) / 2000 - 0.3;
    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix, modelMatrix, rotate_angle, [0.9, 0.1, 0.2]);
}

function tick() {
    i++;
    if (i % 10 == 0) { angle += Math.random() - 0.5 }
    if (i % 100 == 0) { angle = 0 }

    requestAnimationFrame(tick);
    drawScene();
    animate();
}

window.onload = initWebGL;
