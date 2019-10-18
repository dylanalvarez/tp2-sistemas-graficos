export default class Bezier {
    constructor(controlPoints) {
        this.controlPoints = controlPoints;
    }

    base0(u) { return (1-u)*(1-u)*(1-u); }

    base1(u) { return 3*(1-u)*(1-u)*u; }  
    
	base2(u) { return 3*(1-u)*u*u; }
    
	base3(u) {  return u*u*u; }

    derivativeBase0(u) { return -3*u*u+6*u-3;}

	derivativeBase1(u) { return 9*u*u-12*u+3; }

	derivativeBase2(u) { return -9*u*u+6*u;}

	derivativeBase3(u) { return 3*u*u; }

	doubleDerivativeBase0(u) { return -6*u+6;}

	doubleDerivativeBase1(u) { return 18*u-12; }

	doubleDerivativeBase2(u) { return 6-18*u; }

    doubleDerivativeBase3(u) { return 6*u; }

    bezierCurve(u) {
        let b0=this.base0, b1=this.base1, b2=this.base2, b3=this.base3;
        let p0 = this.controlPoints[0], p1 = this.controlPoints[1], p2 = this.controlPoints[2], p3 = this.controlPoints[3];

        let x = b0(u) * p0[0] + b1(u) * p1[0] + b2(u) * p2[0] + b3(u) * p3[0];
        let y = b0(u) * p0[1] + b1(u) * p1[1] + b2(u) * p2[1] + b3(u) * p3[1];
        let z = b0(u) * p0[2] + b1(u) * p1[2] + b2(u) * p2[2] + b3(u) * p3[2];

        return [x, y, z];
    }

    bezierCurveDerivative(u) {
        let db0 = this.derivativeBase0, db1 = this.derivativeBase1, db2 = this.derivativeBase2, db3 = this.derivativeBase3;
        let p0 = this.controlPoints[0], p1 = this.controlPoints[1], p2 = this.controlPoints[2], p3 = this.controlPoints[3];
        
        let x = db0(u) * p0[0] + db1(u) * p1[0] + db2(u) * p2[0] + db3(u) * p3[0];
        let y = db0(u) * p0[1] + db1(u) * p1[1] + db2(u) * p2[1] + db3(u) * p3[1];
        let z = db0(u) * p0[2] + db1(u) * p1[2] + db2(u) * p2[2] + db3(u) * p3[2];

        return [x, y, z];
    }

    bezierCurveDoubleDerivative(u) {

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