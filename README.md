# Neural Lab · Inteligencia Artificial II

[English](#english) · [Español](#español)

## English

### From my college coursework to an interactive lab

I originally developed this project as **my college coursework for Inteligencia Artificial II**. It explored how artificial neurons learn to classify points. I later revisited it as a personal project to improve the interface, explain the mathematics in English and Spanish, and add automated checks.

The application runs four learning simulations directly in the browser:

| Algorithm | What it demonstrates |
| --- | --- |
| Perceptron | A binary classifier that adjusts a straight boundary after classification errors. |
| Adaline | Learning from continuous errors: my past implementation uses a sigmoid; the revised alternative uses classical linear Adaline. |
| Backpropagation | A multilayer network that learns nonlinear boundaries using the chain rule. |
| QuickProp | A network that uses consecutive gradients to estimate weight updates, with safeguards for unstable steps. |

### Experiments and visualization

Built-in datasets include linear separation, XOR, concentric circles and three clusters. **Custom points** supports coordinates entered manually or placed on the plot. Backpropagation and QuickProp offer an explicit **Number of classes** selector: two classes (A/B) or three (A/B/C), in either mathematical formulation. The class buttons choose the label of the next point. Each selected class needs at least one point before training. Existing C points must be cleared before reducing the experiment to two classes. Perceptron and Adaline remain binary.

Training can run, pause, advance one epoch or reset. The seed, learning rate, epoch limit and hidden layers are configurable. Animation runs at up to 5 or 30 epochs per second, or at maximum speed; playback speed does not change the learning rule. Optional neuron boundaries show the first-layer lines moving during training.

The background and prediction points show continuous model responses. Network outputs mix as RGB: A is blue, B is red and C is green; with two outputs the green channel is zero. Linear models use a two-sided score ramp. These colors represent outputs, not geometric proximity. Independent sigmoid activations are not normalized or calibrated probabilities. An optional view displays the winning class instead.

Prediction points do not participate in training. Up to 100 remain visible and update with the model; they can be cleared separately. Resetting the model clears them. The interface also displays loss, training accuracy, an epoch history and a confusion matrix. These metrics describe the training examples, not performance on unseen data.

### My past code and the revised alternatives

**My past code · corrected** is the default. It retains my neuron objects, sigmoid functions, fixed −1 thresholds, per-point backpropagation and names such as `errorAcumulado`, `getSigma`, `prev_s` and `prev_g`. Network presets retain three outputs; custom experiments can explicitly use two or three.

Corrections include reachable 0/1 targets for sigmoid Adaline, forward propagation without input mutation, loss accounting across every output, and bounded QuickProp steps using gradients of the same dataset objective. **Revised alternatives** offers linear Adaline and tanh/softmax networks. Changing formulations resets training and changes the mathematical explanation. [The fidelity comparison](docs/fidelity.md) documents the retained behavior and remaining differences.

The original directories retain their scripts and `legacy.html` pages. Their `index.html` entry points redirect to the maintained simulations. The archived pages preserve historical bugs and external dependencies.

### Running locally

Requires Node.js 22 or later:

```bash
npm ci
npm start
```

The application opens at [localhost:4173](http://127.0.0.1:4173). It uses static HTML, CSS and JavaScript with no runtime dependencies or external scripts. ES modules require serving it over HTTP. The EN/ES switch translates the interface and algorithm explanations without resetting training.

### Automated checks

```bash
npx playwright install --with-deps chromium
npm run test:math
npm test
npm run test:report
```

Playwright starts the server automatically and exercises the public interface in desktop Chromium and mobile Chromium emulation. Scenarios cover learning, custom classes, controls, translations, continuous colors and invalid inputs. Node tests separately verify numerical gradients and fidelity to the original neuron updates. These checks cover specific scenarios; they do not guarantee convergence for arbitrary data or constitute testing on physical phones.

`npm run test:ui` opens the interactive test runner. An existing Chromium binary can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. GitHub Actions runs the suites on pushes and pull requests and saves reports and failure traces. [Validation details](docs/validation.md) record the verification scope.

### Source map

| File | Purpose |
| --- | --- |
| `src/coursework.js` | My adapted coursework classes and mathematical corrections |
| `src/models.js` | Revised models, datasets and metrics |
| `src/colors.js` | Continuous output colors and boundary geometry |
| `src/app.js` | Controls, rendering and training lifecycle |
| `src/content.js` | English/Spanish interface and revised explanations |
| `src/coursework-content.js` | English/Spanish explanations of my past models |
| `tests/` | Browser scenarios and numerical checks |

## Español

### De mi trabajo universitario a un laboratorio interactivo

Originalmente desarrollé este proyecto como **mi trabajo universitario para la materia Inteligencia Artificial II**. Exploraba cómo aprenden las neuronas artificiales a clasificar puntos. Después lo retomé como proyecto personal para mejorar la interfaz, explicar las matemáticas en inglés y español y añadir verificaciones automatizadas.

La aplicación ejecuta cuatro simulaciones de aprendizaje directamente en el navegador:

| Algoritmo | Qué demuestra |
| --- | --- |
| Perceptrón | Un clasificador binario que ajusta una frontera recta después de cometer errores de clasificación. |
| Adaline | Aprendizaje a partir de errores continuos: mi implementación pasada usa una sigmoide; la alternativa revisada usa Adaline lineal clásico. |
| Backpropagation | Una red multicapa que aprende fronteras no lineales mediante la regla de la cadena. |
| QuickProp | Una red que usa gradientes consecutivos para estimar actualizaciones de pesos, con protecciones frente a pasos inestables. |

### Experimentos y visualización

Los conjuntos incluidos son separación lineal, XOR, círculos concéntricos y tres grupos. **Puntos propios** permite introducir coordenadas manualmente o colocar puntos sobre el plano. Backpropagation y QuickProp ofrecen un selector explícito de **Número de clases**: dos clases (A/B) o tres (A/B/C), en ambas formulaciones matemáticas. Los botones de clase eligen la etiqueta del siguiente punto. Cada clase seleccionada necesita al menos un punto antes de entrenar. Para reducir el experimento a dos clases es necesario borrar los puntos de C existentes. Perceptrón y Adaline siguen siendo binarios.

El entrenamiento se puede iniciar, pausar, avanzar una época o reiniciar. La semilla, la tasa de aprendizaje, el límite de épocas y las capas ocultas son configurables. La animación funciona hasta a 5 o 30 épocas por segundo, o a máxima velocidad; la velocidad visual no cambia la regla de aprendizaje. Las fronteras de neuronas opcionales muestran el movimiento de las rectas de la primera capa durante el entrenamiento.

El fondo y los puntos de predicción muestran respuestas continuas del modelo. Las salidas de las redes se mezclan como RGB: A es azul, B es rojo y C es verde; con dos salidas el canal verde vale cero. Los modelos lineales usan una rampa de color según el signo y la magnitud de la salida. Estos colores representan salidas, no proximidad geométrica. Las activaciones sigmoides independientes no son probabilidades normalizadas ni calibradas. Una vista opcional muestra la clase ganadora.

Los puntos de predicción no participan en el entrenamiento. Hasta 100 permanecen visibles y se actualizan con el modelo; se pueden borrar por separado. Reiniciar el modelo los borra. La interfaz también muestra pérdida, exactitud de entrenamiento, historial por época y matriz de confusión. Estas métricas describen los ejemplos de entrenamiento, no el desempeño con datos nuevos.

### Mi código pasado y las alternativas revisadas

**Mi código pasado · corregido** es la opción predeterminada. Conserva mis objetos neurona, funciones sigmoides, umbrales fijos −1, retropropagación por punto y nombres como `errorAcumulado`, `getSigma`, `prev_s` y `prev_g`. Los conjuntos predefinidos para redes mantienen tres salidas; los experimentos propios permiten elegir explícitamente dos o tres.

Las correcciones incluyen objetivos alcanzables 0/1 para Adaline sigmoide, propagación hacia delante sin modificar las entradas, cálculo de la pérdida sobre todas las salidas y pasos acotados de QuickProp con gradientes del mismo objetivo sobre el conjunto de datos. **Alternativas revisadas** ofrece Adaline lineal y redes tanh/softmax. Cambiar de formulación reinicia el entrenamiento y cambia la explicación matemática. [La comparación de fidelidad](docs/fidelity.md) documenta el comportamiento conservado y las diferencias restantes.

Los directorios originales conservan sus scripts y páginas `legacy.html`. Sus archivos de entrada `index.html` redirigen a las simulaciones mantenidas. Las páginas archivadas conservan errores históricos y dependencias externas.

### Ejecución local

Requiere Node.js 22 o posterior:

```bash
npm ci
npm start
```

La aplicación se abre en [localhost:4173](http://127.0.0.1:4173). Usa HTML, CSS y JavaScript estáticos, sin dependencias de ejecución ni scripts externos. Los módulos ES requieren servirla mediante HTTP. El selector EN/ES traduce la interfaz y las explicaciones de los algoritmos sin reiniciar el entrenamiento.

### Verificaciones automatizadas

```bash
npx playwright install --with-deps chromium
npm run test:math
npm test
npm run test:report
```

Playwright inicia el servidor automáticamente y recorre la interfaz pública en Chromium de escritorio y con emulación móvil de Chromium. Los escenarios cubren aprendizaje, clases propias, controles, traducciones, colores continuos y entradas inválidas. Por separado, las pruebas de Node verifican gradientes numéricos y fidelidad a las actualizaciones de las neuronas originales. Estas verificaciones cubren escenarios concretos; no garantizan convergencia con datos arbitrarios ni constituyen pruebas en teléfonos físicos.

`npm run test:ui` abre el ejecutor interactivo de pruebas. Es posible seleccionar un ejecutable de Chromium existente mediante `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. GitHub Actions ejecuta las pruebas en cada envío de cambios y solicitud de integración, y guarda informes y trazas de fallos. [Los detalles de validación](docs/validation.md) registran el alcance de las verificaciones.

### Mapa del código

| Archivo | Función |
| --- | --- |
| `src/coursework.js` | Mis clases universitarias adaptadas y correcciones matemáticas |
| `src/models.js` | Modelos revisados, conjuntos de datos y métricas |
| `src/colors.js` | Colores continuos de las salidas y geometría de fronteras |
| `src/app.js` | Controles, dibujo y ciclo de entrenamiento |
| `src/content.js` | Interfaz y explicaciones revisadas en inglés/español |
| `src/coursework-content.js` | Explicaciones de mis modelos pasados en inglés/español |
| `tests/` | Escenarios de navegador y verificaciones numéricas |
