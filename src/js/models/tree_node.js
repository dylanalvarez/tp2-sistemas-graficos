export default class TreeNode {
    setWebGLUniform(key, value) {
        gl.uniformMatrix4fv(gl.getUniformLocation(glProgram, key), false, value);
    }
}
