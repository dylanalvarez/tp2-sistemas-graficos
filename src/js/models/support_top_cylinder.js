import Cylinder from "./cylinder";

export default class SupportTopCylinder extends Cylinder {
    buildBuffers() {
        return super.buildBuffers(1, 0);
    }
}