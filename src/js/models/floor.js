import TreeNode from './tree_node'
import colors from '../constants/colors';
import grassImage from '../../assets/maps/pasto.jpg'

export default class Floor extends TreeNode {
    color() {
        return colors.grassGreen;
    }

    buildBuffers() {

        let pos = [];
        let normal = [];
        let uv = [];
        let rows = 25;
        let cols = 25;

        this.initTexture(grassImage);

        let n = [0, 1, 0];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                pos.push(1000 * Math.trunc(i - rows / 2));
                pos.push(0);
                pos.push(1000 * Math.trunc(- j + cols / 2));

                normal.push(n[0]);
                normal.push(n[1]);
                normal.push(n[2]);

                uv.push(j);
                uv.push(i);
            }
        }

        let trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        let trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

        let trianglesUvBuffer = gl.createBuffer();
        trianglesUvBuffer.number_points = uv.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

        return {
            vertexBuffer: trianglesVerticeBuffer,
            normalBuffer: trianglesNormalBuffer,
            indexBuffer: this.buildIndexBuffer(rows, cols),
            uVBuffer: trianglesUvBuffer
        }
    }
    draw(modelMatrix, viewMatrix, projMatrix) {
        super.draw(modelMatrix, viewMatrix, projMatrix);
        let trianglesUvBuffer = this.uVBuffer();
        let vertexUvAttribute = gl.getAttribLocation(glProgram, "aVertexUv");
        gl.enableVertexAttribArray(vertexUvAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.vertexAttribPointer(vertexUvAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(glProgram.samplerUniform, 0);
                    
        gl.drawArrays(gl.TRIANGLES, 0,trianglesUvBuffer.number_points);
    }

}
