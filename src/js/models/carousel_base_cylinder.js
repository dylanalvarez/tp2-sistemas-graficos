import Cylinder from "./cylinder";
import baseCylinderImage from '../../assets/maps/patron1.png'
import TextureMaterial from "./texture_material";

export default class BaseCylinder extends Cylinder {

    imageSources() {
        return [baseCylinderImage];
    }

    materialClass() {
        return TextureMaterial;
    }

    buildBuffers() {
        let cylinderBuffers = super.buildBuffers(0, 0);
        let uv = [];
        let rows = 5;	// filas	
        let cols = 256;	// columnas

         // lid
         for (let i = 0; i < cols; i++) {
            let u = i / (cols - 1)

            uv.push(u);
            uv.push(0);
        }

        // center
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let u = j / (cols - 1);
                let v = i / (rows - 1);
                uv.push(u);
                uv.push(v);
            }
        }

        // lid
        for (let i = 0; i < cols; i++) {
            let u = i / (cols - 1)

            uv.push(u);
            uv.push(1);
        }

        let trianglesUvBuffer = gl.createBuffer();
        trianglesUvBuffer.number_points = uv.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

        cylinderBuffers.uVBuffer = trianglesUvBuffer;

        return cylinderBuffers;
    }
}