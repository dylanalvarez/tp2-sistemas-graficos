import TextureMaterial from "./texture_material";

export default class MultiTextureMaterial extends TextureMaterial {
    program() {
        return glMultiTextureProgram;
    }
}
