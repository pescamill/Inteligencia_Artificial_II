// Adapted from My Perceptron/, Adaline/ and NN/ coursework.
// Keep the neuron objects, Spanish counters and original method vocabulary.
import { random } from "./models.js";
export function activationFn(input) {
  return input >= 0 ? 1 : -1;
}
export function f(x) {
  return 1 / (1 + Math.exp(-x));
}
export function transfer_derivative(output) {
  return output * (1 - output);
}

export class Perceptron {
  constructor(n, learningRate, rng = random(42)) {
    this.weights = Array.from({ length: n }, () => rng() * 2 - 1);
    this.learningRate = learningRate;
    this.error = 0;
    this.errorAcumulado = 0;
    this.iterations = 0;
  }
  set islearningRate(value) {
    this.learningRate = value;
  }
  predict(inputs) {
    let weightedSum = 0;
    for (let i in this.weights) weightedSum += inputs[i] * this.weights[i];
    return activationFn(weightedSum);
  }
  train(inputs, target, training) {
    training.prediction = this.predict(inputs);
    this.error = target - training.prediction;
    this.errorAcumulado += this.error;
    for (let i in this.weights)
      this.weights[i] += this.error * inputs[i] * this.learningRate;
    training.predicted = this.error === 0;
    this.iterations++;
  }
  getY(x) {
    return Math.abs(this.weights[1]) < 1e-12
      ? null
      : -(this.weights[2] + this.weights[0] * x) / this.weights[1];
  }
}
export class Adaline extends Perceptron {
  multWX(inputs) {
    let weightedSum = 0;
    for (let i in this.weights) weightedSum += inputs[i] * this.weights[i];
    return weightedSum;
  }
  getSigma(inputs) {
    return this.multWX(inputs);
  }
  train(inputs, target, training) {
    const guess = this.multWX(inputs);
    // Sigmoid outputs require targets 0/1, not the original unreachable -1.
    this.error = target - f(guess);
    this.errorAcumulado += Math.pow(this.error, 2) / 2;
    for (let i in this.weights)
      this.weights[i] +=
        this.learningRate * this.error * f(guess) * (1 - f(guess)) * inputs[i];
    training.adalinePrediction = activationFn(guess);
    training.valueAdaline = guess;
    this.iterations++;
  }
}
export class CourseworkLinear {
  constructor(kind, learningRate, seed) {
    this.kind = kind;
    this.brain = new (kind === "perceptron" ? Perceptron : Adaline)(
      3,
      learningRate,
      random(seed),
    );
  }
  get weights() {
    return this.brain.weights;
  }
  score(p) {
    return this.weights[0] * p.x + this.weights[1] * p.y + this.weights[2];
  }
  predict(p) {
    return this.score(p) >= 0 ? 1 : 0;
  }
  train(points) {
    this.brain.errorAcumulado = 0;
    for (const p of points)
      this.brain.train(
        [p.x, p.y, 1],
        this.kind === "perceptron" ? p.label * 2 - 1 : p.label,
        p,
      );
  }
  loss(points) {
    return (
      points.reduce(
        (sum, p) =>
          sum +
          (this.kind === "perceptron"
            ? Number(this.predict(p) !== p.label)
            : Math.pow(p.label - f(this.score(p)), 2) / 2),
        0,
      ) / points.length
    );
  }
}

export class Neuron extends Adaline {
  constructor(n, learningRate, rng) {
    super(n, learningRate, rng);
    this.prev_s = Array(n).fill(0);
    this.prev_g = Array(n).fill(0);
    this.output = 0;
    this.net_input = 0;
    this.delta = 0;
  }
  activate_neuron(new_outputs) {
    // The fixed -1 threshold is mathematically valid: preserve it.
    let outputSum = -1;
    for (let i = 0; i < this.weights.length; i++)
      outputSum += new_outputs[i] * this.weights[i];
    this.net_input = outputSum;
    this.output = f(outputSum);
    return this.output;
  }
  first_delta(target) {
    this.error = target - this.output;
    this.delta = -2 * transfer_derivative(this.output) * this.error;
    return this.delta;
  }
  get_delta(p_delta, d_weights) {
    let weightedSum = 0;
    for (let i = 0; i < p_delta.length; i++)
      weightedSum +=
        transfer_derivative(this.output) * d_weights[i] * p_delta[i];
    this.delta = weightedSum;
  }
  update(m_inputs) {
    for (let i = 0; i < this.weights.length; i++)
      this.weights[i] -= this.learningRate * this.delta * m_inputs[i];
  }
  quick_update(slopes) {
    for (let i = 0; i < this.weights.length; i++) {
      const s = slopes[i];
      const difference = this.prev_s[i] - s;
      let temp =
        Math.abs(difference) > 1e-12 ? (s / difference) * this.prev_g[i] : 0;
      // Preserve the secant + gradient structure, but bound magnitude, not sign.
      const limit = 1.75 * Math.abs(this.prev_g[i]);
      if (!Number.isFinite(temp) || temp * s >= 0) temp = 0;
      temp = Math.sign(temp) * Math.min(Math.abs(temp), limit, 0.5);
      let g = temp;
      if (temp === 0 || this.prev_s[i] * s >= 0) g += -this.learningRate * s;
      this.prev_s[i] = s;
      this.prev_g[i] = g;
      this.weights[i] += g;
    }
  }
}
export class NN {
  constructor(
    n_hidden,
    n_outputs,
    n_inputs,
    n_neurons,
    learningRate,
    seed = 42,
    kind = "backprop",
  ) {
    this.n_hidden = n_hidden;
    this.n_neurons = [...n_neurons];
    this.learningRate = learningRate;
    this.classes = n_outputs;
    this.kind = kind;
    this.errorAcumulado = 0;
    const rng = random(seed);
    this.network = [];
    for (let i = 0; i < n_hidden; i++) {
      const hidden_layer = [];
      for (let j = 0; j < n_neurons[i]; j++)
        hidden_layer.push(
          new Neuron(i === 0 ? n_inputs : n_neurons[i - 1], learningRate, rng),
        );
      this.network.push(hidden_layer);
    }
    const output_layer = [];
    for (let j = 0; j < n_outputs; j++)
      output_layer.push(
        new Neuron(n_hidden ? n_neurons.at(-1) : n_inputs, learningRate, rng),
      );
    this.network.push(output_layer);
  }
  feed_forward(inputs) {
    let next_outputs = [...inputs];
    this.entry_layer = [];
    for (const layer of this.network) {
      this.entry_layer.push(next_outputs);
      // All neurons read the same input; never append outputs to the input array.
      next_outputs = layer.map((neuron) =>
        neuron.activate_neuron(next_outputs),
      );
    }
    return this.network.at(-1);
  }
  outputs(p) {
    return this.feed_forward([p.x, p.y, 1]).map((neuron) => neuron.output);
  }
  predict(p) {
    const values = this.outputs(p);
    return values.indexOf(Math.max(...values));
  }
  backward_propagate(expected) {
    for (let i = this.network.length - 1; i >= 0; i--) {
      for (let j = 0; j < this.network[i].length; j++) {
        const neuron = this.network[i][j];
        if (i === this.network.length - 1) neuron.first_delta(expected[j]);
        else
          neuron.get_delta(
            this.network[i + 1].map((n) => n.delta),
            this.network[i + 1].map((n) => n.weights[j]),
          );
      }
    }
  }
  update_weights() {
    this.network.forEach((layer, i) =>
      layer.forEach((neuron) => neuron.update(this.entry_layer[i])),
    );
  }
  get_error(expected) {
    return this.network
      .at(-1)
      .reduce(
        (sum, neuron, j) => sum + Math.pow(expected[j] - neuron.output, 2),
        0,
      );
  }
  target(p) {
    return Array.from({ length: this.classes }, (_, j) =>
      Number(j === p.label),
    );
  }
  loss(points) {
    this.errorAcumulado = 0;
    for (const p of points) {
      this.feed_forward([p.x, p.y, 1]);
      this.errorAcumulado += this.get_error(this.target(p));
    }
    return this.errorAcumulado / points.length;
  }
  gradient(points) {
    const slopes = this.network.map((layer) =>
      layer.map((neuron) => neuron.weights.map(() => 0)),
    );
    for (const p of points) {
      this.feed_forward([p.x, p.y, 1]);
      this.backward_propagate(this.target(p));
      this.network.forEach((layer, l) =>
        layer.forEach((neuron, j) =>
          neuron.weights.forEach(
            (_, k) =>
              (slopes[l][j][k] +=
                (neuron.delta * this.entry_layer[l][k]) / points.length),
          ),
        ),
      );
    }
    return slopes;
  }
  train(points) {
    if (this.kind === "quickprop") {
      // Compare slopes of the SAME objective: full-dataset error, not different samples.
      const slopes = this.gradient(points);
      this.network.forEach((layer, l) =>
        layer.forEach((neuron, j) => neuron.quick_update(slopes[l][j])),
      );
    } else {
      for (const p of points) {
        this.feed_forward([p.x, p.y, 1]);
        this.backward_propagate(this.target(p));
        this.update_weights();
      }
    }
  }
}
