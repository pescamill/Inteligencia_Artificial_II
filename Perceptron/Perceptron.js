function activationFn(input) {
  return input >= 0 ? 1 : -1;
}

class Perceptron {
  constructor(n, learningRate) {
    this.weights = [];
    this.learningRate = learningRate;
    this.error = 0;
    this.errorAcumulado;
    this.iterations = 0;
    this.correctGuesses = 0;
    for (let i = 0; i < n; i++) {
      this.weights.push(random(-1, 1));
    }
  }

  set islearningRate(learningRate){
    this.learningRate = learningRate;
  }

  predict(inputs) {
    let weightedSum = 0;
    for (let i in this.weights) {
      weightedSum += inputs[i] * this.weights[i];
    }
    return activationFn(weightedSum);
  }

  train(inputs, target, training) {
    let guess = this.predict(inputs);
    training.prediction = guess;
    this.error = target - guess;

    this.errorAcumulado += this.error;

    for (let i in this.weights) {
      this.weights[i] += this.error * inputs[i] * this.learningRate;
    }

    this.iterations++;

    if (this.error == 0) {
      training.predicted = true;
      
    } else {
      training.predicted = false;
    }

  }



  getY(x) {
    let w0 = this.weights[0];
    let w1 = this.weights[1];
    let w2 = this.weights[2];

    return -w2 / w1 - (w0 / w1) * x;
  }
}
