import Cylinder from "./cylinder";
import PlasticProperties from "./plastic_properties";

export default class SupportCylinder extends Cylinder {
    buildBuffers() {
        return super.buildBuffers(5, 0);
    }

    phongProperties() {
        return PlasticProperties;
    }
}