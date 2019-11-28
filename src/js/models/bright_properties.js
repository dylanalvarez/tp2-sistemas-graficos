import PhongProperties from "./phong_properties";

export default class BrightProperties extends PhongProperties{
    ka() { return 1.0 }
    ia() { return 1.0 }
    kd() { return 0.0 }
    id() { return 0.0 }
    ks() { return 0.0 }
    is() { return 0.0 }
    glossiness() { return 0.0 }
}