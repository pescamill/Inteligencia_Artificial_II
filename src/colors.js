// Continuous output visualization; deliberately independent of argmax/predict.
const byte = (value) => Math.round(Math.max(0, Math.min(255, value)));
export function pointPalette(algorithm) {
  return ["backprop", "quickprop"].includes(algorithm)
    ? ["#0000ff", "#ff0000", "#00aa00"]
    : ["#ff5500", "#0055ff"];
}
export function outputColor(
  model,
  p,
  algorithm,
  formulation,
  discrete = false,
) {
  const palette = pointPalette(algorithm);
  if (discrete) return palette[model.predict(p)];
  if (algorithm === "perceptron" || algorithm === "adaline") {
    const valueAdaline = model.score(p);
    // Pablo's original two-sided map(valueAdaline, 2, 0, 100, 255).
    // Clamp only the display channel; never clamp the model's score.
    const c = byte(255 - Math.abs(valueAdaline) * 77.5);
    return valueAdaline >= 0 ? `rgb(0, ${c}, 255)` : `rgb(255, ${c}, 0)`;
  }
  const value =
    formulation === "coursework" ? model.outputs(p) : model.probabilities(p);
  // Preserve A=blue, B=red, C=green and align each output with its point color.
  // Independent sigmoids retain their magnitude; do NOT normalize them.
  return `rgb(${byte(255 * (value[1] || 0))}, ${byte(255 * (value[2] || 0))}, ${byte(255 * value[0])})`;
}
export function firstLayerLines(model, formulation) {
  if (model.network)
    return model.network[0].map((neuron) => [
      neuron.weights[0],
      neuron.weights[1],
      (neuron.weights[2] || 0) - 1,
    ]);
  if (Array.isArray(model.weights[0]))
    return model.weights[0].map((row) => [row[0], row[1], row[2]]);
  return [model.weights];
}
// Intersect with the square instead of dividing by wy (vertical lines are valid).
export function clipLine([a, b, c]) {
  const points = [];
  const add = (x, y) => {
    if (
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      Math.abs(x) <= 1.000001 &&
      Math.abs(y) <= 1.000001 &&
      !points.some((p) => Math.hypot(p[0] - x, p[1] - y) < 1e-8)
    )
      points.push([x, y]);
  };
  if (Math.abs(b) > 1e-12) {
    add(-1, (a - c) / b);
    add(1, (-a - c) / b);
  }
  if (Math.abs(a) > 1e-12) {
    add((b - c) / a, -1);
    add((-b - c) / a, 1);
  }
  return points.slice(0, 2);
}
