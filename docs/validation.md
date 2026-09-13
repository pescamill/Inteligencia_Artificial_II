# Validation — 2026-09-13

- **88/88 Playwright scenarios passed**, no retries, in 41.7 seconds.
- **12/12 numerical and fidelity tests passed**.
- Desktop (1440 px) and Spanish mobile (390 px) screenshots visually inspected after restoring the continuous output colors.
- Browser tests fail on page errors, console errors and HTTP errors.

## What is verified

Both the corrected coursework defaults and the revised alternatives learn the supplied linear data. Both network formulations learn XOR, concentric circles and all three classes. A negative control confirms that a linear Perceptron does not falsely claim to solve XOR.

Fidelity tests execute the untouched original Perceptron and Adaline classes in isolated JavaScript contexts. They compare predictions and weight updates, including the original NN neuron's fixed threshold, output derivative, hidden delta and update. Adaline comparisons use the explicitly corrected 0/1 targets. Finite-difference tests independently check the full three-output network gradients.

Color tests verify continuous intensity changes within the same class, independent RGB output magnitudes, consistent output/class color identity, and more canvas color variation than the discrete-class view. Interaction checks cover first-layer lines, numeric probes, three custom classes, scoped keyboard cycling, formulation switching, training controls, validation, translation and mobile layouts.

## Environment

Node.js 24.19.0, Playwright 1.63.0, Linux x64, packaged Chromium 153.0.8010.0. The local browser was supplied through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; GitHub Actions is configured to install Playwright's matching Chromium normally.

```bash
npm run test:math
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium npm test
```

The screenshots use the coursework backpropagation model, circles, seed 42, hidden layers `[8, 8]`, learning rate 0.3, and 100 epochs: 100% training accuracy and loss approximately 0.0021. These results concern the training dataset. Local results are not a claim about a hosted CI run, all possible datasets, or physical mobile devices.

## Animation, prediction and negative-case update

The 88 browser runs include 26 additional negative-case runs across both viewports: invalid learning rates, epoch counts, seeds and architectures; one-class data; invalid coordinates; and contradictory labels at an identical coordinate. Invalid settings must leave epoch and loss unchanged. Contradictory labels must reach the epoch limit without reporting convergence.

Additional checks verify deterministic one-epoch observation playback and prediction-marker colors/persistence without adding training samples. These UI changes do not modify the numerical algorithms; the 12 numerical tests were already passing for this unchanged core. Hosted CI runs both suites again.

Screenshots of the updated controls and predictions: `prediction-points-desktop.png` and `prediction-points-mobile.png` (Spanish).
