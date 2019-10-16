import ScanningSurfaceTreeNode from './scanning_surface_tree_node';
import { vec3, mat4, mat3, vec4 } from 'gl-matrix';
import Car from './car'
import colors from '../colors'
import BSpline from '../utils/cubic_bspline'
import Bezier from '../utils/cubic_bezier'

export default class Rollercoaster extends ScanningSurfaceTreeNode {
    constructor() {
        super();
        // matrices for car movement (needs more precision)
        this.matrices = this.controlCurveMatrices(1000);
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
        let matrices = [];

        let levelPoints = [
            [-14, 11, 0], [-14, 11.5, 0], [-13.5, 12, 0], [-13, 12, 0],
            [-13, 12, 0], [-12.66, 12, 0], [-12.33, 12, 0], [-12, 12, 0],
            [-12, 12, 0], [-12, 10.66, 0], [-12, 9.33, 0], [-12, 8, 0],
            [-12, 8, 0], [-8, 8, 0], [-4, 4, 0], [0, 4, 0],
            [0, 4, 0], [4, 4, 0], [8, 8, 0], [12, 8, 0],
            [12, 8, 0], [12, 9.33, 0], [12, 10.66, 0], [12, 12, 0],
            [12, 12, 0], [12.33, 12, 0], [12.66, 12, 0], [13, 12, 0],
            [13, 12, 0], [13.5, 12, 0], [14, 11.5, 0], [14, 11, 0],
            [14, 11, 0], [14, 9, 0], [14, 7, 0], [14, 5, 0],
            [14, 5, 0], [14, 4.5, 0], [13.5, 4, 0], [13, 4, 0],
            [13, 4, 0], [6, 4, 0], [6, -4, 0], [0, -4, 0],
            [0, -4, 0], [-6, -4, 0], [-6, 4, 0], [-13, 4, 0],
            [-13, 4, 0], [-13.5, 4, 0], [-14, 4, 0], [-14, 5, 0],
            [-14, 5, 0], [-14, 7, 0], [-14, 9, 0], [-14, 11, 0]
        ];
        console.log(levelPoints.length / 4)
        for (let i = 0; i < levelPoints.length / 4; i+=4) {
            let segment = [levelPoints[i], levelPoints[i+1], levelPoints[i+2], levelPoints[i+3]];
            let bezier = new Bezier(segment);

            let deltaU = 0.1;

            for (let u = 0; u <= 1.0; u+=deltaU) {

                let levelPoint = bezier.bezierCurve(u);

                let t = bezier.bezierCurveDerivative(u);
                t = vec3.fromValues(...t);
                vec3.normalize(t, t);

                // Al tratarse de una curva 2D, puedo orientar la binormal siempre en Z
                let b = vec3.fromValues(0, 0, 1);

                let n = vec3.fromValues(0, 1, 0);
                vec3.cross(n, t, b);
                vec3.normalize(n, n);
                
                let matrix = mat4.fromValues(n[0],          n[1],          n[2],          0,
                                             b[0],          b[1],          b[2],          0,
                                             t[0],          t[1],          t[2],          0,
                                             levelPoint[0], levelPoint[1], levelPoint[2], 1 );

                matrices.push(matrix);
            }

        }
        console.log(matrices.length)
        return matrices;
        //return this.circunference(0.4, 256);
    }

    controlCurveMatrices(steps) {
        // steps for each BSpline cruve defined. Must be multiple of 10
        steps = steps || 10;
        let matrices = [];
        let controlPoints = [
            [0, 0, 0], [0, 0, 5],
            [5, 0, 5], [5, 0, 0], [5, 0, -5], [5, 10, -10],
            [7, 10, -20], [5, 5, -20], [5, 6, -30], [5, 0, -35],
            [5, 0, -40], [-10, 0, -40], [-10, 2, -35], [-10, 0, -30],
            [0, 0, -30], [0, 0, -20], [-10, 3, -20], [-10, 3, -10], 
            [-10, 0, -5], [-5, 0, -5], [-5, 0, 0],
            [0, 0, 0], [0, 0, 5], [5, 0, 5],
        ];

        for (let i = 0; i < controlPoints.length - 3; i++) {
            
            let segment = [controlPoints[i], controlPoints[i+1], controlPoints[i+2], controlPoints[i+3]];
            let bspline = new BSpline(segment);
            
            let deltaU = 1 / steps;

            for(let u = 0; u <= 1.0; u+=deltaU) {
                
                let controlPoint = bspline.BSplineCurve(u);

                let t = bspline.BSplineTangentVector(u);
                t = vec3.fromValues(...t);
                vec3.normalize(t, t);

                let n = vec3.fromValues(0,1,0);
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