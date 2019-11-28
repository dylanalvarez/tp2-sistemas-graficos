import PhongProperties from "./phong_properties";

export default class PlasticProperties extends PhongProperties{
    ka() { return 0.6 }
    ia() { return 1.0 }
    kd() { return 0.2 }
    id() { return 1.0 }
    ks() { return 0.5 }
    is() { return 1.0 }
    glossiness() { return 300.0 }
}