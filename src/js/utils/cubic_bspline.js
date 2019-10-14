export default class BSpline {
    constructor(controlPoints) {
        // Vector de 4 puntos de control que forman la curva cubica B-Spline
        // Cada punto de control es otro vector con las coordenadas [x,y,z]
        this.controlPoints = controlPoints;
    }

    base0(u) {
        return (1-u)*(1-u)*(1-u)*1/6;       // 1/6*(1-u)^3 
    }

    base1(u) {
        return (4-6*u*u+3*u*u*u)*1/6;       // (u^3)/2 - u^2 +2/3
    }

    base2(u) {
        return (1+3*u+3*u*u-3*u*u*u)*1/6;   // -0.5*u^3+0.5*u^2+0.5*u+1/6
    }

    base3(u) {
        return (u*u*u)*1/6;                 // 1/6*u^3
    }

    derivativeBase0(u) {
        return -0.5*Math.pow(1-u,2);        // -((1-u)^2)/2
    }
    derivativeBase1(u) {
        return (3/2)*u*u-2*u;               // 3/2*u^2 - 2*u
    }
    derivativeBase2(u) {
        return -1.5*u*u+u+0.5;              // -3/2*u^2 + u + 1/2
     }
    derivativeBase3(u) {
        return (u*u)/2;                     // (u^2)/2
    }

    doubleDerivativeBase0(u) {
        return 1-u;
    }

    doubleDerivativeBase1(u) {
        return 3*u - 2;
    }

    doubleDerivativeBase2(u) {
        return -3*u + 1;
    }

    doubleDerivativeBase3(u) {
        return u;
    }

    BSplineCurve(u) {
        // Renombro atributos y funciones para emprolijar la ecuacion
        let b0 = this.base0, b1 = this.base1, b2 = this.base2, b3 = this.base3;
        let p0 = this.controlPoints[0], p1 = this.controlPoints[1], p2 = this.controlPoints[2], p3 = this.controlPoints[3];
        
        let x = b0(u) * p0[0] + b1(u) * p1[0] + b2(u) * p2[0] + b3(u) * p3[0];
        let y = b0(u) * p0[1] + b1(u) * p1[1] + b2(u) * p2[1] + b3(u) * p3[1];
        let z = b0(u) * p0[2] + b1(u) * p1[2] + b2(u) * p2[2] + b3(u) * p3[2];

        return [x, y, z];
    }

    BSplineTangentVector(u) {
        // Renombro atributos y funciones para emprolijar la ecuacion
        let db0 = this.derivativeBase0, db1 = this.derivativeBase1, db2 = this.derivativeBase2, db3 = this.derivativeBase3;
        let p0 = this.controlPoints[0], p1 = this.controlPoints[1], p2 = this.controlPoints[2], p3 = this.controlPoints[3];
        
        let x = db0(u) * p0[0] + db1(u) * p1[0] + db2(u) * p2[0] + db3(u) * p3[0];
        let y = db0(u) * p0[1] + db1(u) * p1[1] + db2(u) * p2[1] + db3(u) * p3[1];
        let z = db0(u) * p0[2] + db1(u) * p1[2] + db2(u) * p2[2] + db3(u) * p3[2];

        return [x, y, z];
    }

    BSplineNormalVector(u) {

        let ddb0 = this.doubleDerivativeBase0, ddb1 = this.doubleDerivativeBase1,
        ddb2 = this.doubleDerivativeBase2, ddb3 = this.doubleDerivativeBase3;
        let p0 = this.controlPoints[0], p1 = this.controlPoints[1],
        p2 = this.controlPoints[2], p3 = this.controlPoints[3];

        let x = ddb0(u) * p0[0] + ddb1(u) * p1[0] + ddb2(u) * p2[0] + ddb3(u) * p3[0];
        let y = ddb0(u) * p0[1] + ddb1(u) * p1[1] + ddb2(u) * p2[1] + ddb3(u) * p3[1];
        let z = ddb0(u) * p0[2] + ddb1(u) * p1[2] + ddb2(u) * p2[2] + ddb3(u) * p3[2];

        return [x, y, z];
    }
}