export default class PhongProperties {
    setPhongParameters(program) {
        gl.uniform3f(gl.getUniformLocation(program, 'uKa'), this.ka(), this.ka(), this.ka());
        gl.uniform3f(gl.getUniformLocation(program, 'uIa'), this.ia(), this.ia(), this.ia());
        gl.uniform3f(gl.getUniformLocation(program, 'uKd'), this.kd(), this.kd(), this.kd());
        gl.uniform3f(gl.getUniformLocation(program, 'uId'), this.id(), this.id(), this.id());
        gl.uniform3f(gl.getUniformLocation(program, 'uKs'), this.ks(), this.ks(), this.ks());
        gl.uniform3f(gl.getUniformLocation(program, 'uIs'), this.is(), this.is(), this.is());
        gl.uniform3f(gl.getUniformLocation(program, 'uGlossiness'), this.glossiness(), this.glossiness(), this.glossiness());
    }

}