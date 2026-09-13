# Fidelity to Pablo's original coursework

The default is **Your coursework · corrected**. The first revamp's algorithms remain under **Revised alternatives**. Original files remain untouched, apart from the previously introduced entry-page redirects; `legacy.html` preserves the original page.

## What is kept

| Original idea or quirk | Current default |
| --- | --- |
| `Perceptron` object and mistake-driven update | Adapted directly, with original `for...in` weight loops and −1/+1 targets |
| `Adaline`, `f`, `activationFn`, `multWX`, `getSigma` | Preserved, including sigmoid-based learning and per-point updates |
| `valueAdaline`, `errorAcumulado`, `iterations`, `islearningRate` | Preserved in the numerical code |
| `NN`, neuron objects, `network`, `n_hidden`, `n_neurons` | Preserved |
| `feed_forward`, `backward_propagate`, `first_delta`, `get_delta`, `update_weights` | Preserved and adapted to the shared interface |
| Sigmoids in every NN layer | Preserved; no tanh or softmax in the default |
| Fixed −1 neuron threshold | Preserved in every NN neuron; it is a valid constraint |
| Constant input `1` for the first layer | Preserved with its trainable weight; no new trainable biases in later layers |
| Three independent NN outputs | Preserved even for two-class presets; custom points can use A, B and C |
| Squared-error derivative with factor −2 | Preserved |
| Per-point NN backpropagation | Preserved; an epoch visits all points in order |
| QuickProp `prev_s`, `prev_g`, `s`, `difference`, `temp`, `g` | Preserved with the secant-plus-gradient structure |
| Continuous Adaline color ramp | Restored, using raw score magnitude and the original two-sided channel mapping |
| Three-output RGB visualization | Restored without normalizing independent sigmoid activations |
| First-layer neuron boundary lines | Restored as an optional overlay, including valid vertical boundaries |
| Keyboard class cycling | Space cycles classes when the plot is focused; typing in form fields does not change classes |

## Necessary corrections, not silent redesigns

1. **Sigmoid Adaline targets:** map class labels to 0/1 during learning. A sigmoid cannot attain the original −1 target. Keep the original sigmoid squared-error rule. This is still called *sigmoid Adaline* in the UI, explicitly distinguished from classical linear Adaline.
2. **Forward propagation:** neurons in a layer receive the same input vector. Never append outputs to the caller's input array. The original aliasing also corrupted the vector passed into the next layer.
3. **Error accounting:** sum squared errors across all three outputs and average across points. The original reporting squared a sum of only two residuals, allowing cancellation and omitting the third class. NN gradients still use the original squared-error math, not cross-entropy.
4. **QuickProp:** consecutive slopes must describe the same objective. Use full-dataset gradients for QuickProp, while ordinary backpropagation remains per-point. Replace the signed step comparison with a magnitude limit, reject uphill secant directions, start history at zero, and fall back to a gradient step for unusable curvature. This is explicitly a corrected variant, not exact numerical equivalence to the unstable original.
5. **RGB range and identity:** sigmoid outputs are in [0,1], so map that actual range to [0,255]. The original [-1,1] mapping used only half the channel range. Align channels with the original point identities: A/blue, B/red, C/green. The original background channel ordering did not match the training-point colors.
6. **Coordinates and lines:** preserve x=0/y=0 instead of treating them as missing values; clip boundary lines without dividing by a possibly zero y-weight. For first-layer NN lines, include the fixed −1 threshold that `getY` originally omitted.
7. **Lifecycle:** one controlled animation loop, no duplicate training intervals, safe empty-data handling, and deterministic resets.

## What the gradient means

**Linear models:** `z = w·x + b`. Negative scores use yellow → red; positive scores use cyan → blue, following the original `map(|z|, 2, 0, 100, 255)` channel rule. Channels are clamped for display. The two ramps meet at a hue discontinuity, as in the original. The color does **not** encode distance to training points. Geometric distance to the separating line would require dividing |z| by the norm of the two non-bias weights.

**Coursework NN:** RGB shows independent sigmoid activations directly. Dark means all outputs are small; blended colors mean more than one output is active. The activations do not necessarily sum to one and are not calibrated probabilities.

**Revised NN:** RGB shows softmax probabilities, which do sum to one. Switching formulation resets the model and updates the explanation. Probing a point displays all outputs numerically. **Winning class** is an optional discrete view; it does not replace the continuous default.

## What remains a redesign

The responsive UI, seeded datasets, settings validation, English/Spanish explanations, metrics, and tests are new. Architecture entry is currently bounded to 1–3 hidden layers of 1–16 neurons for browser responsiveness. The UI shows epoch-level progress rather than repainting every individual weight update. The original simultaneous Perceptron/Adaline comparison is not reproduced: the lab displays one selected algorithm. The old error-based stopping criterion is not restored; NN training runs to the chosen epoch limit, which is clearly labeled.

## Tests distinguish fidelity from correctness

The numerical tests execute the untouched original classes in isolated JavaScript contexts and compare Perceptron updates, sigmoid Adaline updates with corrected targets, and NN neuron outputs/deltas/updates. Separate finite-difference tests check the corrected complete NN gradient. Browser tests cover both formulations, actual learning, continuous pixel variation, probe values, class cycling, overlays, and switching formulations. These are bounded checks, not a claim that every original behavior was preserved.

## Español

La opción predeterminada es **Tu código original · corregido**. Conserva los objetos neurona, nombres, sigmoides, umbral fijo −1, tres salidas, error cuadrático y retropropagación por punto. Las alternativas tanh/softmax y Adaline lineal se eligen explícitamente.

Las correcciones necesarias son: objetivos 0/1 para la sigmoide; entradas de capa sin modificar; error cuadrático de las tres salidas; QuickProp con pendientes del mismo objetivo y pasos acotados; colores en el rango real [0,1] alineados con las clases; coordenadas cero válidas y líneas verticales sin división por cero. El umbral fijo −1 no se elimina: es matemáticamente válido.

Se recuperan las rampas de intensidad y la mezcla RGB. En Adaline representan la salida lineal, no distancia a ejemplos. En tu NN representan activaciones independientes, no probabilidades normalizadas. Las líneas de neuronas y el cambio de clase con Espacio están disponibles. El cambio de clase por teclado solo funciona con el plano enfocado.

Las pruebas comparan directamente operaciones con tus clases originales y verifican además los gradientes y el comportamiento en el navegador. El diseño visual, los límites de arquitectura, la visualización por época y el entrenamiento de un solo algoritmo a la vez siguen siendo cambios respecto a tu interfaz original.

## Why playback became faster

Originally, `nextIteration` processed one point per timer callback. The UI also redrew neuron lines frequently, and updating the chart incurred rendering overhead. The revamped Fast loop spends up to 12 ms training full epochs before rendering a frame. Timer intervals such as 0.00001 ms never guaranteed execution at that physical frequency; scheduling and rendering overhead dominated.

Observe and Medium now display individual epochs at capped rates (5 or 30 per second), without changing the numerical learning rate. They do not reproduce every original per-point visual update. The corrected target handling, propagation and error metric can also change the apparent convergence, so runtime differences alone are not evidence of a better learning algorithm.
