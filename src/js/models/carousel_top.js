import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import colors from '../constants/colors';
import ChairWithRope from './chair_with_rope';
import factors from '../constants/factors';
import carouselTopImage from '../../assets/maps/patron2.png'

export default class CarouselTop extends Cylinder {
    constructor() {
        super(colors.carouselTopOrange);
        this.chairWithRope = new ChairWithRope();
        this.speed = 0;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    imageSource() {
        return carouselTopImage;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let topModelMatrix = mat4.clone(modelMatrix);
        mat4.rotate(topModelMatrix, topModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(topModelMatrix, topModelMatrix, [1.2, 1.2, 0.1]);
        super.draw(topModelMatrix, viewMatrix, projMatrix);

        let chairCount = window['Cant. sillas'];
        for (let i = 0; i < chairCount; i++) {
            let childModelMatrix = mat4.clone(modelMatrix);
            mat4.rotateY(childModelMatrix, childModelMatrix, 2 * Math.PI * i / chairCount);
            mat4.translate(childModelMatrix, childModelMatrix, [2, 0, 0]);
            mat4.rotateZ(childModelMatrix, childModelMatrix, this.speed * 2 * Math.PI);
            this.chairWithRope.draw(childModelMatrix, viewMatrix, projMatrix);
        }
    }

    buildBuffers() {
        let cylinderBuffers = super.buildBuffers(2, 7);
        let uv = [];
        let rows = 5;	// filas	
        let cols = 256;	// columnas

        let createLidUVVertices = function(factor) {
            for (let i = 0; i < cols; i++) {
                let u = i / (cols - 1)
    
                uv.push(u*factors.carousel_top_u_factor);
                uv.push(1*factor);
            }
        }
        // lid
        createLidUVVertices(1);

        // center
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let u = j / (cols - 1);
                let v = Math.abs((2 - i) / 28);

                uv.push(u*factors.carousel_top_u_factor);
                uv.push(v);
            }
        }

        // lid
        createLidUVVertices(-1);

        let trianglesUvBuffer = gl.createBuffer();
        trianglesUvBuffer.number_points = uv.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

        cylinderBuffers.uVBuffer = trianglesUvBuffer;

        return cylinderBuffers;
    }
}
