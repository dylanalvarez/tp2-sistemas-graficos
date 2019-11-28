import PhongProperties from "./phong_properties";

export default class MetallicProperties extends PhongProperties{
    ka() { return 0.6 }
    ia() { return 1.0 }
    kd() { return 0.5 }
    id() { return 1.0 }
    ks() { return 1.0 }
    is() { return 1.0 }
    glossiness() { return 500.0 }
}