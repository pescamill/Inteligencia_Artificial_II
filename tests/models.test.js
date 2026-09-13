import { test } from "node:test";
import assert from "node:assert/strict";
import { dataset, LinearModel, Network, metrics } from "../src/models.js";

test("backprop gradient matches finite differences in all layers, including biases and third output", () => {
  const model = new Network("backprop", 0.1, 42, [3, 2], 3),
    points = dataset("clusters", 17, 9);
  const gradient = model.gradient(points),
    epsilon = 1e-5;
  model.weights.forEach((layer, l) =>
    layer.forEach((row, j) =>
      row.forEach((w, k) => {
        row[k] = w + epsilon;
        const plus = model.loss(points);
        row[k] = w - epsilon;
        const minus = model.loss(points);
        row[k] = w;
        assert.ok(
          Math.abs((plus - minus) / (2 * epsilon) - gradient[l][j][k]) < 1e-7,
          `gradient ${l}/${j}/${k}`,
        );
      }),
    ),
  );
});
test("Adaline follows the linear squared-error gradient (no sigmoid)", () => {
  const model = new LinearModel("adaline", 0.1, 42);
  model.weights = [0, 0, 0];
  model.train([{ x: 0.5, y: -0.5, label: 1 }]);
  assert.deepEqual(model.weights, [0.05, -0.05, 0.1]);
});
test("forward pass does not mutate inputs and probabilities sum to one", () => {
  const model = new Network("backprop", 0.3, 42, [8, 8], 3),
    p = Object.freeze({ x: 0.2, y: 0.1, label: 2 });
  assert.ok(
    Math.abs(model.probabilities(p).reduce((a, b) => a + b) - 1) < 1e-12,
  );
  assert.deepEqual(model.probabilities(p), model.probabilities(p));
});
test("QuickProp uses secant history and handles a zero denominator safely", () => {
  const model = new Network("quickprop", 0.3, 42, [2], 2),
    points = dataset("linear", 42, 10);
  const g = model.gradient(points);
  model.previousGradient = structuredClone(g); // Forces denominator to zero.
  model.previousStep = model.weights.map((l) =>
    l.map((row) => row.map(() => 0.1)),
  );
  const before = structuredClone(model.weights);
  model.train(points);
  assert.ok(
    Math.abs(model.weights[0][0][0] - (before[0][0][0] - 0.3 * g[0][0][0])) <
      1e-12,
  );
  model.train(points);
  assert.ok(model.weights.flat(2).every(Number.isFinite));
  const plain = new Network("backprop", 0.3, 42, [2], 2);
  plain.train(points);
  plain.train(points);
  assert.notDeepEqual(model.weights, plain.weights);
});
for (const kind of ["backprop", "quickprop"]) {
  test(`${kind} learns nonlinear data across multiple seeds and classifies fresh points`, () => {
    for (const seed of [7, 42, 91]) {
      const training = dataset("circles", seed),
        model = new Network(kind, 0.3, seed, [8, 8], 2);
      for (let i = 0; i < 700; i++) model.train(training);
      assert.ok(
        metrics(model, dataset("circles", seed + 1000, 180)).accuracy >= 0.95,
        `seed ${seed}`,
      );
    }
  });
}

// Fidelity checks execute the untouched source as the reference implementation.
import { readFileSync } from "node:fs";
import vm from "node:vm";
import {
  CourseworkLinear,
  NN,
  Neuron,
  f,
  Perceptron,
  Adaline,
} from "../src/coursework.js";
import { outputColor, clipLine, firstLayerLines } from "../src/colors.js";
function originalClass(path, name) {
  return vm.runInNewContext(
    readFileSync(new URL(path, import.meta.url), "utf8") + `\n${name}`,
    { random: () => 0.2, Math },
  );
}
test("coursework Perceptron matches original predictions and weight updates", () => {
  const Original = originalClass("../Perceptron/Perceptron.js", "Perceptron");
  const original = new Original(3, 0.3),
    current = new Perceptron(3, 0.3, () => 0.6);
  for (const target of [-1, 1, -1]) {
    original.train([0.4, -0.2, 1], target, {});
    current.train([0.4, -0.2, 1], target, {});
    current.weights.forEach((w, i) =>
      assert.ok(Math.abs(w - original.weights[i]) < 1e-12),
    );
  }
});
test("sigmoid Adaline matches original update once targets are mapped to 0/1", () => {
  const Original = originalClass("../Adaline/Adaline.js", "Adaline");
  const original = new Original(3, 0.3),
    current = new Adaline(3, 0.3, () => 0.6);
  for (const target of [0, 1, 0]) {
    original.train([0.4, -0.2, 1], target, {});
    current.train([0.4, -0.2, 1], target, {});
    current.weights.forEach((w, i) =>
      assert.ok(Math.abs(w - original.weights[i]) < 1e-12),
    );
  }
});
test("NN neuron preserves original fixed threshold, deltas and online update", () => {
  const Original = originalClass("../NN/Adaline.js", "Adaline");
  const original = new Original(3, 0.3),
    current = new Neuron(3, 0.3, () => 0.6);
  const inputs = [0.4, -0.2, 1];
  assert.ok(
    Math.abs(
      current.activate_neuron(inputs) - original.activate_neuron(inputs),
    ) < 1e-12,
  );
  original.first_delta(1);
  current.first_delta(1);
  assert.ok(Math.abs(current.delta - original.delta) < 1e-12);
  original.get_delta([0.3, -0.1], [0.2, 0.5]);
  current.get_delta([0.3, -0.1], [0.2, 0.5]);
  assert.ok(Math.abs(current.delta - original.delta) < 1e-12);
  original.update(inputs);
  current.update(inputs);
  current.weights.forEach((w, i) =>
    assert.ok(Math.abs(w - original.weights[i]) < 1e-12),
  );
});
test("coursework NN gradients match finite differences across all three outputs", () => {
  const model = new NN(2, 3, 3, [3, 2], 0.3, 42),
    points = dataset("clusters", 17, 9);
  const slopes = model.gradient(points),
    eps = 1e-5;
  model.network.forEach((layer, l) =>
    layer.forEach((neuron, j) =>
      neuron.weights.forEach((w, k) => {
        neuron.weights[k] = w + eps;
        const plus = model.loss(points);
        neuron.weights[k] = w - eps;
        const minus = model.loss(points);
        neuron.weights[k] = w;
        assert.ok(
          Math.abs((plus - minus) / (2 * eps) - slopes[l][j][k]) < 1e-7,
        );
      }),
    ),
  );
  const input = Object.freeze([0, 0.2, 1]);
  model.feed_forward(input);
  assert.deepEqual(input, [0, 0.2, 1]);
});
test("coursework QuickProp uses actual history, finite fallback and a downhill capped secant", () => {
  const neuron = new Neuron(1, 0.3, () => 0.6);
  neuron.quick_update([0.2]);
  assert.ok(Math.abs(neuron.prev_g[0] + 0.06) < 1e-12);
  neuron.quick_update([0.2]);
  assert.ok(Math.abs(neuron.prev_g[0] + 0.06) < 1e-12);
  neuron.quick_update([0.1]);
  assert.ok(neuron.prev_g[0] < -0.03);
  assert.ok(neuron.weights.every(Number.isFinite));
});
test("continuous color retains magnitude within the same predicted class and maps RGB to labels", () => {
  const linear = (score) => ({ score: () => score, predict: () => 1 });
  assert.notEqual(
    outputColor(linear(0.1), {}, "adaline", "coursework"),
    outputColor(linear(1), {}, "adaline", "coursework"),
  );
  assert.equal(
    outputColor(linear(0), {}, "adaline", "coursework"),
    "rgb(0, 255, 255)",
  );
  assert.equal(
    outputColor(linear(2), {}, "adaline", "coursework"),
    "rgb(0, 100, 255)",
  );
  assert.equal(
    outputColor({ outputs: () => [1, 0, 0] }, {}, "backprop", "coursework"),
    "rgb(0, 0, 255)",
  );
  assert.notEqual(
    outputColor(
      { outputs: () => [0.8, 0.1, 0.1] },
      {},
      "backprop",
      "coursework",
    ),
    outputColor(
      { outputs: () => [0.4, 0.05, 0.05] },
      {},
      "backprop",
      "coursework",
    ),
  );
  assert.ok(
    clipLine([1, 0, 0]).every(
      ([x, y]) => Math.abs(x) < 1e-12 && Math.abs(y) === 1,
    ),
  );
  assert.deepEqual(clipLine([0, 0, 1]), []);
});
