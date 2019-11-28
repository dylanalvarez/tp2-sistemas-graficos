import Cylinder from "./cylinder";
import MetallicProperties from "./metalic_properties";
import ReflectiveMaterial from './reflective_material';
import sunsetImage from '../../assets/maps/sunset.jpg'
import colors from '../constants/colors'

export default class RollerCoasterColumn extends Cylinder {
    phongProperties() {
        return MetallicProperties;
    }

    materialClass() {
        return ReflectiveMaterial;
    }

    imageSources() {
        return [sunsetImage];
    }

    color() {
        return colors.pillarRed;
    }
}