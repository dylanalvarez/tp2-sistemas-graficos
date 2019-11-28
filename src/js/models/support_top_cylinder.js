import Cylinder from "./cylinder";
import PlasticProperties from "./plastic_properties";

export default class SupportTopCylinder extends Cylinder {
    buildBuffers() {
        return super.buildBuffers(1, 0);
    }

    phongProperties() {
        return PlasticProperties;
    }
}