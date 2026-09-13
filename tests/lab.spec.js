import { test, expect } from "@playwright/test";

// Each scenario drives the public UI; no mocked model or test-only app state.
test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  page.__runtimeErrors = errors;
});
test.afterEach(async ({ page }) => expect(page.__runtimeErrors).toEqual([]));

async function configure(page, epochs = 350) {
  await page.locator("#epochs").fill(String(epochs));
  await page
    .getByRole("button", { name: "Apply & reset", exact: true })
    .click();
}
async function train(page) {
  await page.getByRole("button", { name: "Train model", exact: true }).click();
  await expect(page.locator("#status")).toHaveText(
    /Epoch limit reached|All training points classified/,
  );
}
const accuracy = (page) =>
  page
    .locator("#accuracy")
    .innerText()
    .then((text) => parseFloat(text));
const loss = (page) => page.locator("#loss").innerText().then(Number);

for (const algorithm of ["perceptron", "adaline", "backprop", "quickprop"]) {
  test(`${algorithm}: learns linear data through the UI`, async ({ page }) => {
    await page.goto(`/?algorithm=${algorithm}&formulation=revised`);
    await configure(page);
    const initial = await loss(page);
    const beforePlot = await page
      .locator("#plot")
      .evaluate((canvas) => canvas.toDataURL());
    await train(page);
    expect(await accuracy(page)).toBeGreaterThanOrEqual(98);
    expect(await loss(page)).toBeLessThan(initial * 0.3);
    expect(
      await page.locator("#plot").evaluate((canvas) => canvas.toDataURL()),
    ).not.toBe(beforePlot);
    await expect(page.locator("#confusion td.correct")).toHaveText([
      "45",
      "45",
    ]);
    await expect(
      page.locator('#loss-chart path[stroke="#548267"]'),
    ).toBeVisible();
  });
}
for (const algorithm of ["backprop", "quickprop"]) {
  for (const data of ["xor", "circles", "clusters"]) {
    test(`${algorithm}: learns ${data}, including every output class`, async ({
      page,
    }) => {
      await page.goto(`/?algorithm=${algorithm}&formulation=revised`);
      await page.locator("#dataset").selectOption(data);
      await configure(page, 700);
      const initial = await loss(page);
      await train(page);
      expect(await accuracy(page)).toBeGreaterThanOrEqual(98);
      expect(await loss(page)).toBeLessThan(initial * 0.1);
      const expected = data === "clusters" ? ["30", "30", "30"] : ["45", "45"];
      await expect(page.locator("#confusion td.correct")).toHaveText(expected);
      await page.locator("#mode").selectOption("probe");
      const plot = page.locator("#plot");
      await plot.click({ position: { x: 60, y: 60 } });
      await expect(page.locator("#prediction")).toContainText(
        "Prediction: Class",
      );
      await expect(page.locator("#point-count")).toHaveText("90");
    });
  }
}
test("linear limitation is visible and XOR does not falsely converge", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#dataset").selectOption("xor");
  await configure(page, 100);
  await expect(page.locator("#linear-note")).toBeVisible();
  await train(page);
  expect(await accuracy(page)).toBeLessThan(90);
  await expect(page.locator("#status")).toHaveText("Epoch limit reached");
});
test("one epoch, pause, resume, reset and deterministic replay", async ({
  page,
}) => {
  await page.goto("/?algorithm=backprop&formulation=revised");
  await page.locator("#dataset").selectOption("circles");
  await configure(page, 5000);
  const initialLoss = await loss(page);
  await page.getByRole("button", { name: "One epoch", exact: true }).click();
  await expect(page.locator("#epoch")).toHaveText("1");
  const firstEpochLoss = await loss(page);
  await page.getByRole("button", { name: "Train model", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.locator("#status")).toHaveText("Paused");
  const pausedEpoch = await page.locator("#epoch").innerText();
  // Observe multiple browser frames; this detects a timer that continues after pause.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await expect(page.locator("#epoch")).toHaveText(pausedEpoch);
  await page.getByRole("button", { name: "Train model", exact: true }).click();
  await expect
    .poll(() => page.locator("#epoch").innerText().then(Number))
    .toBeGreaterThan(Number(pausedEpoch));
  await page.getByRole("button", { name: "Reset model", exact: true }).click();
  await expect(page.locator("#epoch")).toHaveText("0");
  expect(await loss(page)).toBe(initialLoss);
  await page.getByRole("button", { name: "One epoch", exact: true }).click();
  expect(await loss(page)).toBe(firstEpochLoss);
});
test("empty data, manual points and class selection", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Clear points", exact: true }).click();
  await page.getByRole("button", { name: "Train model", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("at least two classes");
  await page.getByText("Add an exact point", { exact: true }).click();
  for (const [label, x] of [
    ["A", "-0.5"],
    ["B", "0.5"],
  ]) {
    await page
      .getByRole("button", { name: `Class ${label}`, exact: true })
      .click();
    await page.locator("#point-x").fill(x);
    await page.getByRole("button", { name: "Add point", exact: true }).click();
  }
  await expect(page.locator("#point-count")).toHaveText("2");
  await train(page);
  expect(await accuracy(page)).toBe(100);
  await page.locator("#plot").click({ position: { x: 80, y: 80 } });
  await expect(page.locator("#point-count")).toHaveText("3");
  await expect(page.locator("#epoch")).toHaveText("0");
});
test("invalid settings do not change the model and architecture is configurable", async ({
  page,
}) => {
  await page.goto("/?algorithm=backprop&formulation=revised");
  await page.locator("#hidden").fill("8, nope");
  await page
    .getByRole("button", { name: "Apply & reset", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Use a rate");
  await expect(page.locator("#architecture")).toHaveText("2 → 8 → 8 → 2");
  await page.locator("#hidden").fill("6, 4, 3");
  await page.locator("#rate").fill("0");
  await page
    .getByRole("button", { name: "Apply & reset", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.locator("#rate").fill("0.1");
  await page
    .getByRole("button", { name: "Apply & reset", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeHidden();
  await expect(page.locator("#architecture")).toHaveText("2 → 6 → 4 → 3 → 2");
  await page.getByRole("button", { name: "One epoch", exact: true }).click();
  expect(Number.isFinite(await loss(page))).toBe(true);
});
test("all explanations are bilingual; language persists without resetting training", async ({
  page,
}) => {
  await page.goto("/?algorithm=backprop&formulation=revised");
  await page.getByRole("button", { name: "One epoch", exact: true }).click();
  await page.getByRole("button", { name: "ES", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Observa cómo aprende una máquina.",
  );
  await expect(page.locator("#epoch")).toHaveText("1");
  for (const algorithm of ["perceptron", "adaline", "backprop", "quickprop"]) {
    await page.locator(`[data-algorithm=${algorithm}]`).click();
    await expect(page.locator("#article-steps li")).toHaveCount(3);
    await expect(
      page.getByRole("heading", {
        name: "Regla de actualización",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator("#article-intuition")).not.toBeEmpty();
    await expect(page.locator("#formula")).not.toBeEmpty();
  }
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "The update rule", exact: true }),
  ).toBeVisible();
});
test("legacy URLs open the corresponding modern simulation", async ({
  page,
}) => {
  for (const [path, algorithm] of [
    ["Perceptron", "perceptron"],
    ["Adaline", "adaline"],
    ["NN", "backprop"],
    ["NN - QuickPropagation", "quickprop"],
  ]) {
    await page.goto(`/${encodeURIComponent(path)}/`);
    await expect(page.locator(`[data-algorithm=${algorithm}]`)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  }
});
test("layout fits the viewport and app runs without external requests", async ({
  page,
}) => {
  const external = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1:4173") &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
  });
  await page.goto("/?algorithm=backprop&formulation=revised");
  await page.locator("#dataset").selectOption("circles");
  await expect(page.locator("#plot")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(external).toEqual([]);
});

for (const algorithm of ["perceptron", "adaline", "backprop", "quickprop"]) {
  test(`coursework ${algorithm}: default formulation learns and retains continuous colors`, async ({
    page,
  }) => {
    await page.goto(`/?algorithm=${algorithm}`);
    await expect(page.locator("#formulation")).toHaveValue("coursework");
    await expect(page.locator("#color-mode")).toHaveValue("gradient");
    await configure(page, 700);
    const initial = await loss(page);
    await train(page);
    expect(await accuracy(page)).toBeGreaterThanOrEqual(98);
    expect(await loss(page)).toBeLessThan(initial * 0.3);
    if (algorithm === "backprop" || algorithm === "quickprop") {
      await expect(page.locator("#architecture")).toHaveText("2 → 8 → 8 → 3");
      await expect(page.locator("#confusion td.correct")).toHaveText([
        "45",
        "45",
        "0",
      ]);
    }
  });
}
for (const algorithm of ["backprop", "quickprop"])
  for (const data of ["xor", "circles", "clusters"]) {
    test(`coursework ${algorithm}: learns ${data} with sigmoid squared error`, async ({
      page,
    }) => {
      await page.goto(`/?algorithm=${algorithm}`);
      await page.locator("#dataset").selectOption(data);
      await configure(page, 1000);
      const initial = await loss(page);
      await train(page);
      expect(await accuracy(page)).toBeGreaterThanOrEqual(98);
      expect(await loss(page)).toBeLessThan(initial * 0.1);
      await expect(page.locator("#confusion td.correct")).toHaveText(
        data === "clusters" ? ["30", "30", "30"] : ["45", "45", "0"],
      );
    });
  }
test("continuous canvas colors, probe activations, and optional neuron lines", async ({
  page,
}) => {
  await page.goto("/?algorithm=backprop");
  // A shallow initial network avoids almost-uniform quantized colors from deep sigmoid attenuation.
  await page.locator("#hidden").fill("4");
  await configure(page);
  const countColors = () =>
    page.locator("#plot").evaluate((canvas) => {
      const ctx = canvas.getContext("2d"),
        colors = new Set();
      for (let x = 11; x < 550; x += 8)
        colors.add([...ctx.getImageData(x, 11, 1, 1).data].join(","));
      return colors.size;
    });
  expect(await countColors()).toBeGreaterThan(8);
  await page.locator("#color-mode").selectOption("classes");
  expect(await countColors()).toBeLessThanOrEqual(6);
  const before = await page.locator("#plot").evaluate((c) => c.toDataURL());
  await page.locator("#neuron-lines").check();
  expect(await page.locator("#plot").evaluate((c) => c.toDataURL())).not.toBe(
    before,
  );
  await page.locator("#mode").selectOption("probe");
  await page.locator("#plot").click({ position: { x: 100, y: 100 } });
  await expect(page.locator("#prediction")).toContainText("Activations: A=");
  await expect(page.locator("#prediction")).toContainText("C=");
  await expect(page.locator("#point-count")).toHaveText("90");
});
test("three custom classes, scoped space key, and labeled alternative", async ({
  page,
}) => {
  await page.goto("/?algorithm=backprop");
  await page.locator("#clear").click();
  for (let i = 0; i < 3; i++) {
    await page
      .getByRole("button", { name: `Class ${"ABC"[i]}`, exact: true })
      .click();
    await page
      .locator("#plot")
      .click({ position: { x: 50 + i * 60, y: 60 + i * 30 } });
  }
  await expect(page.locator("#point-count")).toHaveText("3");
  await page.locator("#plot").focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Class A", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator("#formulation").selectOption("revised");
  await expect(page.locator("#point-count")).toHaveText("3");
  await expect(page.locator("#dataset")).toHaveValue("custom");
  await expect(page.locator("#formula")).toContainText("softmax");
  await page.locator("#formulation").selectOption("coursework");
  await expect(page.locator("#formula")).toContainText("− 1");
  await page.getByRole("button", { name: "ES", exact: true }).click();
  await expect(page.locator("#gradient-legend")).toContainText(
    "sigmoides independientes",
  );
  await expect(page.locator("#article-detail")).toContainText("factor −2");
});
