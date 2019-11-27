import Cylinder from "./cylinder";
import MetallicProperties from "./metalic_properties";

export default class RollerCoasterColumn extends Cylinder {
    phongProperties() {
        return MetallicProperties;
    }
}