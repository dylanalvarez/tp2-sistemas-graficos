import ScanningSurfaceTreeNode from './scanning_surface_tree_node';
import { vec3, mat4 } from 'gl-matrix';
import Car from './car'
import Cylinder from './cylinder'
import colors from '../constants/colors'
import bezierPoints from '../constants/bezierPoints'
import Bezier from '../utils/cubic_bezier'

export default class Rollercoaster extends ScanningSurfaceTreeNode {
    constructor() {
        super();
        // matrices for car movement (needs more precision)
        this.matrices = this.controlCurveMatrices(1000);
        this.car = new Car();
        this.carPosition = 0;
        this.column = new Cylinder(colors.pillarRed);
    }

    color() {
        return colors.rollerCoasterGrey;
    }

    draw(modelMatrix, viewMatrix, projMatrix) {
        let modelMatrixCopy = mat4.clone(modelMatrix);
        mat4.translate(modelMatrixCopy, modelMatrixCopy, [0, 2, 0]);
        super.draw(modelMatrixCopy, viewMatrix, projMatrix);
        
        this.carPosition = this.carPosition + window['Velocidad carro'];
        let index = Math.trunc(this.carPosition) % this.matrices.length;
        let childModelMatrix = mat4.clone(this.matrices[index]);

        mat4.mul(childModelMatrix, modelMatrixCopy, childModelMatrix);
        mat4.translate(childModelMatrix, childModelMatrix, [0.25, 0, 0]);
        mat4.rotate(childModelMatrix, childModelMatrix, Math.PI / 2, [1, 0, 0]);
        mat4.scale(childModelMatrix, childModelMatrix, [0.08, 0.08, 0.08]);

        this.car.draw(childModelMatrix, viewMatrix, projMatrix);
        
        let columnCount = window['Cant. columnas'];
        
        for (let i = 0; i < columnCount; i++) {
            let index = Math.floor(i * this.matrices.length / columnCount);
            let m = this.matrices[index];
            let columnModelMatrix = mat4.clone(modelMatrix);
            mat4.translate(columnModelMatrix, columnModelMatrix, [m[12], m[13]-28.1, m[14]]);
            mat4.scale(columnModelMatrix, columnModelMatrix, [0.1, 30, 0.1]);
            mat4.rotateX(columnModelMatrix, columnModelMatrix, Math.PI/2);

            this.column.draw(columnModelMatrix, viewMatrix, projMatrix);
        }        
    }
    
    levelCurveMatrices() {
        let matrices = [];

        let levelPoints = bezierPoints.rollercoasterLevelPoints;

        for (let i = 0; i < levelPoints.length; i+=4) {
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
        return matrices;
    }

    controlCurveMatrices() { }

}