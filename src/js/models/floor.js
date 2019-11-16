import TreeNode from './tree_node'
import colors from '../constants/colors';
import grassImage from '../../assets/maps/pasto.jpg'

export default class Floor extends TreeNode {
    color() {
        return colors.grassGreen;
    }

    initTexture() {
        let texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = () => {

            gl.bindTexture(gl.TEXTURE_2D, texture); 						// activo la textura

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);	// cargo el bitmap en la GPU
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);					// selecciono filtro de magnificacion
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);	// selecciono filtro de minificacion

            gl.generateMipmap(gl.TEXTURE_2D);		// genero los mipmaps
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        texture.image.src = grassImage;
        return texture;
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

                uv.push(j*500);
                uv.push(i*500);
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

}
