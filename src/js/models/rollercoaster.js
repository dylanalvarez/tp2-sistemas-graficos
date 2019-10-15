import ScanningSurfaceTreeNode from './scanning_surface_tree_node';
import { vec3, mat4, mat3, vec4 } from 'gl-matrix';
import Car from './car'
import colors from '../constants/colors'
import coasterTypes from '../constants/rollerCoasterTypes'
import BSpline from '../utils/cubic_bspline'

export default class Rollercoaster extends ScanningSurfaceTreeNode {
    constructor() {
        super();
        this.matrices = this.controlCurveMatrices(16384);
        this.car = new Car();
        this.carPosition = 0;
    }

    color() {
        return colors.rollerCoasterGrey;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let modelMatrixCopy = mat4.clone(modelMatrix);
        mat4.translate(modelMatrixCopy, modelMatrixCopy, [0, 2, 0]);
        super.draw(modelMatrixCopy, viewMatrix, projMatrix);
        
        this.carPosition = this.carPosition + window.carSpeed;
        let index = Math.trunc(this.carPosition) % this.matrices.length;
        let childModelMatrix = mat4.clone(this.matrices[index]);

        mat4.mul(childModelMatrix, modelMatrixCopy, childModelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0.5, 0, 0]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [1, 0, 0])
        mat4.scale(childModelMatrix, childModelMatrix, [0.1, 0.1, 0.1]);

        this.car.draw(childModelMatrix, viewMatrix, projMatrix);
    }

    circunference(radius, levels) {
        // Devuelve lista de matrices para cada punto de la curva

        let matrices = []
        
        for (let i = 0; i < levels; i++) {
            let alpha = (i / (levels - 1)) * 2 * Math.PI;
            let x = radius * Math.cos(alpha);
            let y = radius * Math.sin(alpha);

            let matrix = mat4.create();
            // Creo matriz identidad de 4x4 y la roto sobre el eje Z (porque la circunferencia esta sobre XY)
            mat4.translate(matrix, matrix, [x, y, 0]);
            mat4.rotate(matrix, matrix, alpha, [0,0,1]);

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
        return this.circunference(0.4, 256);
    }

    controlCurveMatrices(rows) {
        rows = rows || 120;
        let matrices = [];
        let controlPoints = coasterTypes[window.tipoDeCamino];
        let i;
        for (i = 0; i < controlPoints.length - 3; i++) {
            
            let segment = [controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]];
            let bspline = new BSpline(segment);
            
            let deltaU = (controlPoints.length - 3) / rows;

            for(let u = 0; u <= 1.0; u+=deltaU) {
                
                let controlPoint = bspline.BSplineCurve(u);

                let t = bspline.BSplineTangentVector(u);
                t = vec3.fromValues(...t);
                vec3.normalize(t, t);

                let n = bspline.BSplineNormalVector(u);
                n = vec3.fromValues(0,1,0);
                vec3.normalize(n, n);

                let b = vec3.create();
                vec3.cross(b, t, n);
                vec3.normalize(b, b);

                // El 'n' inicial es tan solo (0,1,0). Multiplicando vectorialmente el nuevo 'b' con 't' obtengo el 'n' real
                vec3.cross(n, b, t);
                vec3.normalize(n, n);

                let matrix = mat4.fromValues(n[0],            n[1],            n[2],            0,
                                             b[0],            b[1],            b[2],            0,
                                             t[0],            t[1],            t[2],            0,
                                             controlPoint[0], controlPoint[1], controlPoint[2], 1 );
                
                matrices.push(matrix);

            }
            
        }
        return matrices;
    }
}