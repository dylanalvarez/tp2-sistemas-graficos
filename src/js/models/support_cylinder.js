import Cylinder from "./cylinder";

export default class SupportCylinder extends Cylinder {
    buildBuffers() {
        return super.buildBuffers(5, 0);
    }
}