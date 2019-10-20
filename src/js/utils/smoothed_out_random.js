export default class SmoothedOutRandom {
    constructor(smoothness) {
        this.previousRandom = 0.5;
        this.smoothness = smoothness;
    }

    nextValue() {
        this.previousRandom += (Math.random() - 0.5) / this.smoothness;
        return this.previousRandom;
    }
}