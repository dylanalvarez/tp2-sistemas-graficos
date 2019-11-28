import PhongProperties from "./phong_properties";

export default class GrassyProperties extends PhongProperties {
    ka() { return 0.8 }
    ia() { return 1.0 }
    kd() { return 0.2 }
    id() { return 1.0 }
    ks() { return 0.1 }
    is() { return 1.0 }
    glossiness() { return 20.0 }
}