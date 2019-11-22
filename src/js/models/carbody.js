import colors from '../constants/colors'
import carBodyPoints from '../constants/car_body_points'
import ScanningSurfaceTreeNode from "./scanning_surface_tree_node";
import { mat4, vec3 } from "gl-matrix";
import Bezier from '../utils/cubic_bezier';

export default class CarBody extends ScanningSurfaceTreeNode {
    color() {
        return colors.carYellow;
    }

    levelCurveMatrices() {
        let matrices = [];
        let centerBodyLevelPoints = carBodyPoints.carBodyLevelPoints;

        for (let i = 0; i < centerBodyLevelPoints.length; i+=4) {
            let segment = [centerBodyLevelPoints[i], centerBodyLevelPoints[i+1], centerBodyLevelPoints[i+2], centerBodyLevelPoints[i+3]];
            let bezier = new Bezier(segment);

            let deltaU = 0.1;

            for (let u = 0; u <= 1.0; u+=deltaU) {

                let levelPoint = bezier.bezierCurve(u);

                let t = bezier.bezierCurveDerivative(u);
                t = vec3.fromValues(...t);
                vec3.normalize(t, t);

                // Al tratarse de una curva 2D, puedo orientar la binormal siempre en Z
                let b = vec3.fromValues(0, 0, 1);

                let n = vec3.create();
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

    controlCurveMatrices() {
        let steps = 10;
        let matrices = [];

        for(let i=0; i < steps; i++) {
            
            let z = i / steps - 1;
            let controlPoint = [0, 0, z];

            let t = vec3.fromValues(0, 0, 1);
            let n = vec3.fromValues(0, 1, 0);
            let b = vec3.fromValues(-1, 0, 0);

            let matrix = mat4.fromValues(n[0],            n[1],            n[2],            0,
                                         b[0],            b[1],            b[2],            0,
                                         t[0],            t[1],            t[2],            0,
                                         controlPoint[0], controlPoint[1], controlPoint[2], 1 );
            
            matrices.push(matrix);
        }
        
        return matrices;
    }
}