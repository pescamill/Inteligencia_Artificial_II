// Dependency-free numerical core. Coordinates are normalized to [-1, 1].
export function random(seed = 42) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function dataset(kind, seed = 42, count = 90) {
  const rng = random(seed),
    points = [];
  for (let i = 0; i < count; i++) {
    let x, y, label;
    if (kind === "linear") {
      label = i % 2;
      x = (label ? 0.5 : -0.5) + (rng() - 0.5) * 0.65;
      y = (rng() - 0.5) * 1.6;
    } else if (kind === "xor") {
      x = (i % 2 ? 0.55 : -0.55) + (rng() - 0.5) * 0.4;
      y = (i % 4 < 2 ? 0.55 : -0.55) + (rng() - 0.5) * 0.4;
      label = x * y > 0 ? 0 : 1;
    } else if (kind === "circles") {
      label = i % 2;
      const angle = rng() * Math.PI * 2,
        radius = (label ? 0.72 : 0.22) + (rng() - 0.5) * 0.12;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else if (kind === "clusters") {
      label = i % 3;
      const angle = (label * Math.PI * 2) / 3 + Math.PI / 2;
      x = Math.cos(angle) * 0.6 + (rng() - 0.5) * 0.35;
      y = Math.sin(angle) * 0.6 + (rng() - 0.5) * 0.35;
    } else throw new Error("Unknown dataset");
    points.push({ x, y, label });
  }
  return points;
}
const dot = (a, b) => a.reduce((s, w, i) => s + w * b[i], 0);
export class LinearModel {
  constructor(kind, rate, seed) {
    this.kind = kind;
    this.rate = rate;
    const rng = random(seed);
    this.weights = Array.from({ length: 3 }, () => (rng() - 0.5) * 0.2);
  }
  score(p) {
    return dot(this.weights, [p.x, p.y, 1]);
  }
  predict(p) {
    return this.score(p) >= 0 ? 1 : 0;
  }
  train(points) {
    if (this.kind === "perceptron") {
      for (const p of points) {
        const error = p.label * 2 - 1 - (this.predict(p) * 2 - 1);
        [p.x, p.y, 1].forEach(
          (v, i) => (this.weights[i] += this.rate * error * v),
        );
      }
    } else {
      const gradient = [0, 0, 0];
      for (const p of points) {
        const error = this.score(p) - (p.label * 2 - 1);
        [p.x, p.y, 1].forEach(
          (v, i) => (gradient[i] += (error * v) / points.length),
        );
      }
      this.weights = this.weights.map((w, i) => w - this.rate * gradient[i]);
    }
  }
  loss(points) {
    return (
      points.reduce(
        (sum, p) =>
          sum +
          (this.kind === "perceptron"
            ? Number(this.predict(p) !== p.label)
            : 0.5 * (this.score(p) - (p.label * 2 - 1)) ** 2),
        0,
      ) / points.length
    );
  }
}
export class Network {
  constructor(kind, rate, seed, hidden = [8, 8], classes = 2) {
    this.kind = kind;
    this.rate = rate;
    this.classes = classes;
    const rng = random(seed),
      sizes = [2, ...hidden, classes];
    this.weights = sizes
      .slice(1)
      .map((size, l) =>
        Array.from({ length: size }, () =>
          Array.from({ length: sizes[l] + 1 }, (_, j) =>
            j === sizes[l]
              ? 0
              : (rng() * 2 - 1) * Math.sqrt(6 / (sizes[l] + size)),
          ),
        ),
      );
    this.previousGradient = this.zeros();
    this.previousStep = this.zeros();
  }
  zeros() {
    return this.weights.map((layer) => layer.map((row) => row.map(() => 0)));
  }
  forward(p) {
    const activations = [[p.x, p.y]];
    this.weights.forEach((layer, l) => {
      let z = layer.map((row) => dot(row, [...activations[l], 1]));
      if (l === this.weights.length - 1) {
        const max = Math.max(...z);
        z = z.map((v) => Math.exp(v - max));
        const sum = z.reduce((a, b) => a + b, 0);
        z = z.map((v) => v / sum);
      } else z = z.map(Math.tanh);
      activations.push(z);
    });
    return activations;
  }
  probabilities(p) {
    return this.forward(p).at(-1);
  }
  predict(p) {
    const out = this.probabilities(p);
    return out.indexOf(Math.max(...out));
  }
  loss(points) {
    return (
      points.reduce(
        (sum, p) =>
          sum - Math.log(Math.max(1e-15, this.probabilities(p)[p.label])),
        0,
      ) / points.length
    );
  }
  gradient(points) {
    const gradient = this.zeros();
    for (const p of points) {
      const a = this.forward(p);
      let delta = a.at(-1).map((v, j) => v - Number(j === p.label));
      for (let l = this.weights.length - 1; l >= 0; l--) {
        const input = [...a[l], 1];
        delta.forEach((d, j) =>
          input.forEach(
            (v, k) => (gradient[l][j][k] += (d * v) / points.length),
          ),
        );
        if (l > 0)
          delta = a[l].map(
            (v, k) =>
              (1 - v * v) *
              delta.reduce((sum, d, j) => sum + d * this.weights[l][j][k], 0),
          );
      }
    }
    return gradient;
  }
  train(points) {
    const gradient = this.gradient(points);
    this.weights.forEach((layer, l) =>
      layer.forEach((row, j) =>
        row.forEach((w, k) => {
          const g = gradient[l][j][k],
            previous = this.previousGradient[l][j][k],
            lastStep = this.previousStep[l][j][k];
          let step = -this.rate * g;
          if (this.kind === "quickprop") {
            // Safeguarded secant variant: accept only downhill steps, cap growth,
            // and fall back to gradient descent when curvature is uninformative.
            const denominator = previous - g;
            const secant =
              Math.abs(denominator) > 1e-12
                ? (lastStep * g) / denominator
                : NaN;
            if (Number.isFinite(secant) && secant * g < 0) {
              const cap = Math.min(
                0.5,
                Math.max(Math.abs(step), 1.75 * Math.abs(lastStep)),
              );
              step = Math.sign(secant) * Math.min(Math.abs(secant), cap);
            }
          }
          this.previousGradient[l][j][k] = g;
          this.previousStep[l][j][k] = step;
          this.weights[l][j][k] = w + step;
        }),
      ),
    );
  }
}
export function metrics(model, points) {
  if (!points.length) return { loss: 0, accuracy: 0, confusion: [] };
  const count = model.classes || 2,
    confusion = Array.from({ length: count }, () => Array(count).fill(0));
  for (const p of points) confusion[p.label][model.predict(p)]++;
  return {
    loss: model.loss(points),
    accuracy: confusion.reduce((s, row, i) => s + row[i], 0) / points.length,
    confusion,
  };
}
