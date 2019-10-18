import { vec3, mat4 } from 'gl-matrix'
import colors from '../colors';
import Sphere from './sphere'

export default class Skybox extends Sphere {
    color() {
        return colors.skyBlue;
    }
}
