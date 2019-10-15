export default class Bezier {
    constructor(controlPoints) {
        this.controlPoints = controlPoints;
    }

    base0(u) { 
        return (1-u)*(1-u)*(1-u);  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3
    }

	base1(u) { 
        return 3*(1-u)*(1-u)*u;    
    }

	base2(u) { 
        return 3*(1-u)*u*u;     //   -u3 +3u2
    }

	base3(u) { 
        return u*u*u;			 // u3
    }

    derivativeBase0(u) { return -3*u*u+6*u-3;} 	//-3u2 +6u -3

	derivativeBase1(u) { return 9*u*u-12*u+3; }  // 9u2 -12u +3

	derivativeBase2(u) { return -9*u*u+6*u;}		 // -9u2 +6u

	derivativeBase3der(u) { return 3*u*u; }			// 3u2

	doubleDerivativeBase0(u) { return -6*u+6;} 		//-6u +6

	doubleDerivativeBase1(u) { return 18*u-12; }  		// 18u-12 

	doubleDerivativeBase2(u) { return 6-18*u;}		 // -18u +6

    doubleDerivativeBase3(u) { return 6*u; }			// 6u

}