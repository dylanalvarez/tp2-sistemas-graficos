import CarCap from "./carcap";

export default class FrontCarCap extends CarCap {
    levelCurveMatrices() {
        return super.levelCurveMatrices(-1);
    }

    buildBuffers() {
        return super.buildBuffers(-1);
    }
}