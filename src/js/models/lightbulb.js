import BrightProperties from "./bright_properties";
import Sphere from "./sphere";

export default class Lightbulb extends Sphere {
    phongProperties() {
        return BrightProperties;
    }
}