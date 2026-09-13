import { dataset, LinearModel, Network, metrics } from "./models.js";
import { CourseworkLinear, NN, f } from "./coursework.js";
import {
  outputColor,
  pointPalette,
  firstLayerLines,
  clipLine,
} from "./colors.js";
import { courseworkArticles } from "./coursework-content.js";
import { copy, names, articles } from "./content.js";
const $ = (id) => document.getElementById(id);
let palette = pointPalette("perceptron");
const params = new URLSearchParams(location.search);
let language = "en";
try {
  language = localStorage.getItem("neural-lab-language") === "es" ? "es" : "en";
} catch {}
let algorithm = Object.hasOwn(names, params.get("algorithm"))
  ? params.get("algorithm")
  : "perceptron";
let formulation =
  params.get("formulation") === "revised" ? "revised" : "coursework";
let points = [],
  model,
  epoch = 0,
  history = [],
  running = false,
  frame = null,
  selectedClass = 0,
  status = "ready",
  notice = "",
  probe = null;
let settings = { rate: 0.3, epochs: 1000, seed: 42, hidden: [8, 8] };
const nonlinear = () => algorithm === "backprop" || algorithm === "quickprop";
const classes = () =>
  (nonlinear() && formulation === "coursework") ||
  $("dataset").value === "clusters" ||
  points.some((p) => p.label === 2)
    ? 3
    : 2;
const t = (key) => copy[language][key];
function stop() {
  running = false;
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
}
function setNotice(key = "") {
  notice = key;
  $("notice").hidden = !key;
  $("notice").textContent = key ? t(key) : "";
}
function reset() {
  stop();
  epoch = 0;
  status = "ready";
  setNotice();
  probe = null;
  model =
    formulation === "coursework"
      ? nonlinear()
        ? new NN(
            settings.hidden.length,
            3,
            3,
            settings.hidden,
            settings.rate,
            settings.seed,
            algorithm,
          )
        : new CourseworkLinear(algorithm, settings.rate, settings.seed)
      : nonlinear()
        ? new Network(
            algorithm,
            settings.rate,
            settings.seed,
            settings.hidden,
            classes(),
          )
        : new LinearModel(algorithm, settings.rate, settings.seed);
  history = points.length ? [model.loss(points)] : [];
  render();
}
function loadData() {
  points =
    $("dataset").value === "custom"
      ? []
      : dataset($("dataset").value, settings.seed);
  selectedClass = 0;
  reset();
}
function switchAlgorithm(value) {
  algorithm = value;
  const url = new URL(location.href);
  url.searchParams.set("algorithm", algorithm);
  window.history.replaceState(null, "", url);
  $("dataset").querySelector("[value=clusters]").disabled = !nonlinear();
  if (
    !nonlinear() &&
    ($("dataset").value === "clusters" || points.some((p) => p.label === 2))
  ) {
    $("dataset").value = "linear";
    loadData();
  } else reset();
  translate();
}
function translate() {
  document.documentElement.lang = language;
  document
    .querySelectorAll("[data-i18n]")
    .forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $("en").setAttribute("aria-pressed", String(language === "en"));
  $("es").setAttribute("aria-pressed", String(language === "es"));
  $("mode").setAttribute("aria-label", t("mode"));
  $("plot").setAttribute("aria-label", t("boundary"));
  $("loss-chart").setAttribute("aria-label", t("curve"));
  const selectedArticles =
    formulation === "coursework" ? courseworkArticles : articles;
  const article = selectedArticles[algorithm][language];
  for (const key of [
    "tag",
    "title",
    "intuition",
    "detail",
    "limitations",
    "try",
  ])
    $("article-" + key).textContent =
      article[key === "title" ? "subtitle" : key];
  $("article-steps").replaceChildren(
    ...article.steps.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }),
  );
  $("formula").textContent = selectedArticles[algorithm].formula;
  $("model-name").textContent = names[algorithm];
  $("guide-name").textContent = names[algorithm];
  $("subtitle").textContent = article.subtitle;
  setNotice(notice);
  render();
}
function drawPlot() {
  const canvas = $("plot"),
    ctx = canvas.getContext("2d"),
    size = canvas.width,
    cell = running ? 8 : 4;
  ctx.clearRect(0, 0, size, size);
  for (let y = 0; y < size; y += cell)
    for (let x = 0; x < size; x += cell) {
      const point = {
        x: ((x + cell / 2) / size) * 2 - 1,
        y: 1 - ((y + cell / 2) / size) * 2,
      };
      ctx.fillStyle = outputColor(
        model,
        point,
        algorithm,
        formulation,
        $("color-mode").value === "classes",
      );
      ctx.fillRect(x, y, cell, cell);
    }
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    ctx.strokeStyle = i === 5 ? "#9dacac90" : "#a8b3b430";
    ctx.beginPath();
    ctx.moveTo((i * size) / 10, 0);
    ctx.lineTo((i * size) / 10, size);
    ctx.moveTo(0, (i * size) / 10);
    ctx.lineTo(size, (i * size) / 10);
    ctx.stroke();
  }
  if ($("neuron-lines").checked) {
    ctx.strokeStyle = "#ffffffbb";
    ctx.lineWidth = 1.4;
    for (const line of firstLayerLines(model, formulation)) {
      const ends = clipLine(line);
      if (ends.length !== 2) continue;
      ctx.beginPath();
      ctx.moveTo(((ends[0][0] + 1) * size) / 2, ((1 - ends[0][1]) * size) / 2);
      ctx.lineTo(((ends[1][0] + 1) * size) / 2, ((1 - ends[1][1]) * size) / 2);
      ctx.stroke();
    }
  }
  for (const p of points) {
    const x = ((p.x + 1) * size) / 2,
      y = ((1 - p.y) * size) / 2;
    ctx.fillStyle = palette[p.label];
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    if (p.label === 0) ctx.arc(x, y, 5, 0, Math.PI * 2);
    else if (p.label === 1) ctx.rect(x - 4.5, y - 4.5, 9, 9);
    else {
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x + 6, y + 4);
      ctx.lineTo(x - 6, y + 4);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
  }
  if (probe) {
    const x = ((probe.x + 1) * size) / 2,
      y = ((1 - probe.y) * size) / 2;
    ctx.strokeStyle = "#263a37";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function drawCurve() {
  const svg = $("loss-chart");
  if (history.length < 2) {
    svg.innerHTML = `<path d="M10 110H290M10 60H290M10 10H290" stroke="#e6ebe7" stroke-dasharray="3 4"/><text x="150" y="65" text-anchor="middle" fill="#78867d" font-size="9">${t("noCurve")}</text>`;
    return;
  }
  const max = Math.max(...history, 0.000001),
    stride = Math.max(1, Math.floor(history.length / 200));
  const samples = history
    .map((value, i) => [i, value])
    .filter(([i]) => i % stride === 0 || i === history.length - 1);
  const path = samples
    .map(
      ([i, value], j) =>
        `${j ? "L" : "M"}${10 + (i / (history.length - 1)) * 280},${110 - (value / max) * 97}`,
    )
    .join(" ");
  svg.innerHTML = `<path d="M10 110H290M10 60H290M10 10H290" stroke="#e6ebe7" stroke-dasharray="3 4"/><path d="${path} L290 110 L10 110Z" fill="#e9f1eb"/><path d="${path}" fill="none" stroke="#548267" stroke-width="2"/><text x="10" y="128" fill="#78867d" font-size="9">0</text><text x="290" y="128" text-anchor="end" fill="#78867d" font-size="9">${epoch}</text>`;
}
function render() {
  palette = pointPalette(algorithm);
  $("formulation").value = formulation;
  $("gradient-legend").textContent = t(
    nonlinear()
      ? formulation === "coursework"
        ? "rgbLegend"
        : "probabilityLegend"
      : "scoreLegend",
  );
  const m = metrics(model, points);
  $("epoch").textContent = epoch;
  $("accuracy").innerHTML = `${Math.round(m.accuracy * 100)}<span>%</span>`;
  $("loss").textContent = m.loss.toFixed(4);
  $("point-count").textContent = points.length;
  $("status").textContent = t(status);
  $("train").textContent = t(running ? "pause" : "train");
  $("train").disabled =
    epoch >= settings.epochs || status === "converged" || status === "unstable";
  $("step").disabled =
    running ||
    epoch >= settings.epochs ||
    status === "converged" ||
    status === "unstable";
  $("hidden-field").hidden = !nonlinear();
  document
    .querySelectorAll("[data-algorithm]")
    .forEach((el) =>
      el.setAttribute(
        "aria-pressed",
        String(el.dataset.algorithm === algorithm),
      ),
    );
  $("linear-note").hidden =
    nonlinear() || !["xor", "circles"].includes($("dataset").value);
  $("architecture").textContent = nonlinear()
    ? `2 → ${settings.hidden.join(" → ")} → ${classes()}`
    : "2 → 1";
  $("classes").replaceChildren(
    ...Array.from({ length: classes() }, (_, i) => {
      const button = document.createElement("button");
      button.textContent = "ABC"[i];
      button.style.color = palette[i];
      button.setAttribute("aria-label", `${t("class")} ${"ABC"[i]}`);
      button.setAttribute("aria-pressed", String(i === selectedClass));
      button.onclick = () => {
        selectedClass = i;
        render();
      };
      return button;
    }),
  );
  const matrix = m.confusion.length
    ? m.confusion
    : Array.from({ length: classes() }, () => Array(classes()).fill(0));
  $("confusion").innerHTML =
    `<table><caption>${t("actual")}</caption><thead><tr><th scope="col"></th>${matrix.map((_, i) => `<th scope="col">${"ABC"[i]}</th>`).join("")}</tr></thead><tbody>${matrix.map((row, i) => `<tr><th scope="row">${"ABC"[i]}</th>${row.map((value, j) => `<td class="${i === j ? "correct" : ""}">${value}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  $("dataset-preview").innerHTML = points
    .slice(0, 45)
    .map(
      (p) =>
        `<i style="left:${(p.x + 1) * 48}%;top:${(1 - p.y) * 45}%;background:${palette[p.label]}"></i>`,
    )
    .join("");
  $("prediction").textContent = probe
    ? `${t("prediction")}: ${t("class")} ${"ABC"[model.predict(probe)]} · (${probe.x.toFixed(2)}, ${probe.y.toFixed(2)}) · ${nonlinear() ? t(formulation === "coursework" ? "activations" : "probabilities") + ": " + (formulation === "coursework" ? model.outputs(probe) : model.probabilities(probe)).map((v, i) => "ABC"[i] + "=" + v.toFixed(3)).join(" · ") : "z=" + model.score(probe).toFixed(3) + (algorithm === "adaline" && formulation === "coursework" ? " · σ(z)=" + f(model.score(probe)).toFixed(3) : "")}`
    : "";
  drawPlot();
  drawCurve();
}
function canTrain() {
  if (
    new Set(points.map((p) => p.label)).size <
    ($("dataset").value === "clusters" ? 3 : 2)
  ) {
    setNotice("empty");
    return false;
  }
  if (
    epoch >= settings.epochs ||
    status === "converged" ||
    status === "unstable"
  )
    return false;
  setNotice();
  return true;
}
function oneEpoch() {
  model.train(points);
  epoch++;
  const m = metrics(model, points);
  if (!Number.isFinite(m.loss)) {
    stop();
    status = "unstable";
    setNotice("unstable");
    return;
  }
  history.push(m.loss);
  if (algorithm === "perceptron" && m.accuracy === 1) {
    stop();
    status = "converged";
  } else if (epoch >= settings.epochs) {
    stop();
    status = "complete";
  }
}
function tick() {
  if (!running) return;
  const start = performance.now();
  do {
    oneEpoch();
  } while (running && performance.now() - start < 12);
  render();
  if (running) frame = requestAnimationFrame(tick);
}
$("train").onclick = () => {
  if (running) {
    stop();
    status = "paused";
    render();
    return;
  }
  if (!canTrain()) return;
  running = true;
  status = "running";
  render();
  frame = requestAnimationFrame(tick);
};
$("step").onclick = () => {
  if (canTrain()) {
    status = "paused";
    oneEpoch();
    render();
  }
};
$("reset").onclick = reset;
$("clear").onclick = () => {
  $("dataset").value = "custom";
  points = [];
  selectedClass = 0;
  reset();
};
$("dataset").onchange = loadData;
$("settings").onsubmit = (e) => {
  e.preventDefault();
  const rate = Number($("rate").value),
    epochs = Number($("epochs").value),
    seed = Number($("seed").value),
    hidden = $("hidden")
      .value.split(",")
      .map((v) => Number(v.trim()));
  if (
    !Number.isFinite(rate) ||
    rate < 0.001 ||
    rate > 1 ||
    !Number.isInteger(epochs) ||
    epochs < 1 ||
    epochs > 5000 ||
    !$("seed").value.trim() ||
    !Number.isInteger(seed) ||
    seed < 0 ||
    seed > 4294967295 ||
    (nonlinear() &&
      (hidden.length > 3 ||
        hidden.some((v) => !Number.isInteger(v) || v < 1 || v > 16)))
  ) {
    setNotice("invalid");
    return;
  }
  const newSeed = seed !== settings.seed;
  settings = {
    rate,
    epochs,
    seed,
    hidden: nonlinear() ? hidden : settings.hidden,
  };
  if (newSeed && $("dataset").value !== "custom") loadData();
  else reset();
};
function addPoint(x, y) {
  if (points.length >= 300) {
    setNotice("limit");
    return;
  }
  // Preserve the preset label so a three-class dataset keeps its third output.
  points.push({ x, y, label: selectedClass });
  reset();
}
$("plot").onclick = (e) => {
  const box = $("plot").getBoundingClientRect(),
    x = Math.max(-1, Math.min(1, ((e.clientX - box.left) / box.width) * 2 - 1)),
    y = Math.max(-1, Math.min(1, 1 - ((e.clientY - box.top) / box.height) * 2));
  if ($("mode").value === "probe") {
    probe = { x, y };
    render();
  } else addPoint(x, y);
};
$("point-form").onsubmit = (e) => {
  e.preventDefault();
  const x = Number($("point-x").value),
    y = Number($("point-y").value);
  if (
    !$("point-x").value ||
    !$("point-y").value ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    Math.abs(x) > 1 ||
    Math.abs(y) > 1
  ) {
    setNotice("coordinates");
    return;
  }
  addPoint(x, y);
};
for (const lang of ["en", "es"])
  $(lang).onclick = () => {
    language = lang;
    try {
      localStorage.setItem("neural-lab-language", lang);
    } catch {}
    translate();
  };
document
  .querySelectorAll("[data-algorithm]")
  .forEach((el) => (el.onclick = () => switchAlgorithm(el.dataset.algorithm)));
$("formulation").onchange = () => {
  formulation = $("formulation").value;
  const url = new URL(location.href);
  url.searchParams.set("formulation", formulation);
  window.history.replaceState(null, "", url);
  selectedClass = 0;
  reset();
  translate();
};
$("color-mode").onchange = render;
$("neuron-lines").onchange = render;
$("plot").onkeydown = (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    selectedClass = (selectedClass + 1) % classes();
    render();
  }
};
$("dataset").querySelector("[value=clusters]").disabled = !nonlinear();
loadData();
translate();
