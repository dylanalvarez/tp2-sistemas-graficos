import { mat4 } from 'gl-matrix'
import TreeNode from './tree_node'
import Cylinder from './cylinder'
import colors from '../constants/colors';
import ChairWithRope from './chair_with_rope';
import carouselTopImage from '../../assets/maps/patron1.png'

export default class CarouselTop extends Cylinder {
    constructor() {
        super(colors.carouselTopOrange);
        this.chairWithRope = new ChairWithRope();
        this.speed = 0;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    iamgeSource() {
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

        // lid
        for (let i = 0; i < cols; i++) {
            let alfa = i / (cols - 1) * Math.PI * 2;
            let v = this.getPos(alfa, 0)[0];

            uv.push(0);
            uv.push(v)
        }

        // center
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let alfa = j / (cols - 1) * Math.PI * 2;
                let z = (i - 2) / 2;

                let pos = this.getPos(alfa, z);

                uv.push(pos[0]);
                uv.push(pos[1]);
            }
        }

        // lid
        for (let i = 0; i < cols; i++) {
            let alfa = i / (cols - 1) * Math.PI * 2;
            let v = this.getPos(alfa, 0)[0];

            uv.push(0);
            uv.push(v)
        }

        let trianglesUvBuffer = gl.createBuffer();
        trianglesUvBuffer.number_points = uv.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

        cylinderBuffers.uVBuffer = trianglesUvBuffer;

        return cylinderBuffers;
    }
}
