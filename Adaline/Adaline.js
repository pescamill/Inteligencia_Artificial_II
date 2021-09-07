function activationFn(input) {
  return input >= 0 ? 1 : -1;
}

  function f(x){
    return (1 / (1+Math.exp(-x)));
 }

  class Adaline {
    constructor(n, learningRate) {
      this.weights = [];
      this.learningRate = learningRate;
      this.error = 0;
      this.errorAcumulado = 0;
      this.iterations = 0;
      this.correctGuesses = 0;
      for (let i = 0; i < n; i++) {
        this.weights.push(random(-1, 1));
      }
    }

    set islearningRate(learningRate){
      this.learningRate = learningRate;
    }

    multWX(inputs) {
      let weightedSum = 0;
      for (let i in this.weights) {
        weightedSum += inputs[i] * this.weights[i];
      }
      return weightedSum;
    }

    train(inputs, target, training) {
      let guess = this.multWX(inputs);
      training.adalinePrediction = activationFn(guess);
      this.error = (target - f(guess));
      this.errorAcumulado += (Math.pow(this.error,2)/2);

      this.weights[0] += this.learningRate * this.error * f(guess) * (1-f(guess)) * inputs[0];
      this.weights[1] += this.learningRate * this.error * f(guess) * (1-f(guess)) * inputs[1]
      this.weights[2] += this.learningRate * this.error * f(guess) * (1-f(guess)) * inputs[2];


      this.iterations++;

      training.valueAdaline = guess;

    }

    getSigma(inputs){
      let guess = this.multWX(inputs);
      return guess;
    }

    getY(x) {
      let w0 = this.weights[0];
      let w1 = this.weights[1];
      let w2 = this.weights[2];

      return -w2 / w1 - (w0 / w1) * x;
    }


  }
