import ScanningSurfaceTreeNode from './scanning_surface_tree_node';
import { vec3, mat4 } from 'gl-matrix';

export default class Toroid extends ScanningSurfaceTreeNode {
    circunference(radius) {
        // Devuelve lista de matrices para cada punta de la curva

        let matrices = []
        
        for (let i = 0; i < 256; i++) {
            let alpha = (i / 256 - 1) * 2 * Math.PI;
            let x = radius * Math.cos(alpha);
            let y = radius * Math.sin(alpha);

            let matrix = mat4.create();
            // Creo matriz identidad de 4x4 y la roto sobre el eje Z (porque la circunferencia esta sobre XY)
            mat4.rotate(matrix, matrix, radius, alpha);
            matrix[12] = x;
            matrix[13] = y;
            matrix[14] = 0;

            matrices.push(matrix);
        }

        return matrices
    }

    getPos(alpha, radius) {
        let x = radius * Math.cos(alpha);
        let y = radius * Math.sin(alpha);
        return [x, y, 0];
    }
    
    levelCurveMatrices() {
        // Aca me sirve el metodo circunference
        return this.circunference(0.4);
    }

    controlCurveMatrices() {
        // ...aca no tanto, porque tengo que cambiar del plano XY a XZ

        let matrices = [];

        for (let i = 0; i < 128; i++) {
            
            let alpha = (i / (128 - 1)) * 2 * Math.PI;
            let controlPoint = this.getPos(alpha, 2);
            controlPoint = vec3.fromValues(controlPoint[0], 0, controlPoint[1]);

            // Vector normal (siempre apuntando hacia Y) - F
            let n = vec3.fromValues(0,1,0);
            vec3.normalize(n,n);

            // Vector tangente
            let t = vec3.fromValues(Math.sin(alpha),0,-Math.cos(alpha));
            vec3.normalize(t,t);

            // Vector binormal (producto vectorial entre los 2 vectores anteriores) - F
            let b = vec3.create();
            vec3.cross(b, n, t);
            vec3.normalize(b,b);

            let matrix = mat4.fromValues(b[0],            b[1],            b[2],            0,
                                         n[0],            n[1],            n[2],            0,
                                         t[0],            t[1],            t[2],            0,
                                         controlPoint[0], controlPoint[1], controlPoint[2], 1 );
        
            matrices.push(matrix);
        }

        return matrices;
    }
}