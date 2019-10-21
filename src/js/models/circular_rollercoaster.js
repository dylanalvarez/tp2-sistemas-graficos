import { vec3, mat4 } from 'gl-matrix';
import Rollercoaster from './rollercoaster'
import coasterTypes from '../constants/rollerCoasterTypes'
import BSpline from '../utils/cubic_bspline'

export default class CircularRollerCoaster extends Rollercoaster {
    controlCurveMatrices(steps) {
        // steps for each BSpline curve defined. Must be multiple of 10
        steps = steps || 10;
        let matrices = [];
        let controlPoints = coasterTypes['No Cruzado'];
        
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
        if (steps === 10){
            this.curveMatrices = matrices;
        }
        return matrices;
    }
}