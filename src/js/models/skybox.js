import colors from '../constants/colors';
import Sphere from './sphere'
import sunsetImage from '../../assets/maps/sunset.jpg'

export default class Skybox extends Sphere {
    color() {
        return colors.skyBlue;
    }

    initTexture(filePath) {
        this.texture = gl.createTexture();
        this.texture.image = new Image();
        this.texture.image.src = filePath;
        let texture = this.texture;
		this.texture.image.onload = function () {			
            gl.bindTexture(gl.TEXTURE_2D, texture); 						// activo la textura
                        
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);	// cargo el bitmap en la GPU
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);					// selecciono filtro de magnificacion
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);	// selecciono filtro de minificacion
                        
            gl.generateMipmap(gl.TEXTURE_2D);		// genero los mipmaps
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
            
    }
    
    buildBuffers() {
        let pos = [];
        let normal = [];
        let uv = [];
        let radius = 100;
        let rows = 128;
        let cols = 256;

        this.initTexture(sunsetImage);

        for (let i = 0; i < rows; i++) {
            for (let j=0; j < cols; j++) {

                let alpha = j / (cols - 1) * Math.PI * 2;
                let beta = i / (rows - 1) * Math.PI;

                let p = this.getPosInSphere(alpha, beta, radius);

                pos.push(p[0]);
                pos.push(p[1]);
                pos.push(p[2]);

                let n = this.getNrm(alpha, beta, radius);
                
                normal.push(-n[0]);
                normal.push(-n[1]);
                normal.push(-n[2]);
            }
        }

        // Armo de forma provisoria el vector de coordenadas UV
        let times=64*256;
        for (let k=0; k<times+1; k++){
            uv.push(0);
            uv.push(0);
            uv.push(0);
            uv.push(1);
            uv.push(1);
            uv.push(0);
            uv.push(0);
            uv.push(1);
            uv.push(1);
            uv.push(1);
            uv.push(1);
            uv.push(0);
        }
        let trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        let trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
        
        let trianglesUvBuffer = gl.createBuffer();
        trianglesUvBuffer.number_point = uv.length;
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
