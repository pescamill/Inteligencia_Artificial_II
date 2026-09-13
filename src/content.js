export const copy = {
  en: {
    formulation: "Mathematical formulation",
    coursework: "Your coursework · corrected",
    revised: "Revised alternatives",
    formulationHint:
      "The coursework preserves your sigmoid neurons, thresholds and learning rules, with documented mathematical fixes.",
    colorMode: "Color view",
    gradientMode: "Continuous outputs",
    classMode: "Winning class",
    neuronLines: "Neuron boundaries",
    rgbLegend:
      "A → blue · B → red · C → green. RGB mixes independent sigmoid outputs; dark means all are low. These are activations, not calibrated probabilities or distances. Space on the plot cycles the class.",
    probabilityLegend:
      "A → blue · B → red · C → green. RGB blends softmax probabilities, not geometric distances. Space on the plot cycles the class.",
    scoreLegend:
      "Negative score: yellow → red. Positive score: cyan → blue. Intensity follows |w·x + b|, not distance to training points. Space on the plot cycles the class.",
    activations: "Activations",
    probabilities: "Probabilities",
    lab: "Interactive learning lab",
    eyebrow: "INTELIGENCIA ARTIFICIAL II",
    title: "Watch a machine learn.",
    intro:
      "Place a point. Train a model. Discover the mathematics behind the boundary.",
    experiment: "Experiment",
    guide: "How it works",
    algorithm: "Algorithm",
    dataset: "Dataset",
    linear: "Linear separation",
    xor: "XOR",
    circles: "Concentric circles",
    clusters: "Three classes",
    custom: "Custom points",
    parameters: "Model settings",
    rate: "Learning rate",
    epochs: "Epoch limit",
    hidden: "Hidden layers",
    hiddenHint:
      "Neurons per layer, separated by commas. Up to 3 layers, 16 neurons each.",
    seed: "Random seed",
    apply: "Apply & reset",
    reset: "Reset model",
    clear: "Clear points",
    train: "Train model",
    pause: "Pause",
    step: "One epoch",
    boundary: "Decision boundary",
    boundaryHint:
      "Click the plot to add a point. Colors show predictions; shapes show the true class.",
    class: "Class",
    mode: "Plot interaction",
    add: "Add training points",
    probe: "Inspect prediction",
    pointCount: "training points",
    prediction: "Prediction",
    epoch: "Epoch",
    accuracy: "Training accuracy",
    loss: "Training loss",
    curve: "Learning curve",
    curveHint: "Loss after each epoch · lower is better",
    ready: "Ready to train",
    running: "Training",
    paused: "Paused",
    complete: "Epoch limit reached",
    converged: "All training points classified",
    empty:
      "Add points from at least two classes (all three for the three-class preset).",
    invalid:
      "Use a rate from 0.001 to 1, 1–5000 epochs, a non-negative integer seed, and 1–3 hidden layers of 1–16 neurons.",
    limit: "Maximum 300 points. Clear points to start again.",
    unstable:
      "Training stopped: non-finite values. Reset with a smaller learning rate.",
    linearNote:
      "A straight boundary cannot solve XOR or concentric circles. Try a neural network to learn a nonlinear boundary.",
    metricsNote:
      "Metrics describe the current training points, not performance on unseen data.",
    confusion: "Classification breakdown",
    actual: "Actual ↓ / Predicted →",
    architecture: "Network architecture",
    input: "inputs",
    output: "outputs",
    read: "Explore the algorithm",
    intuition: "The intuition",
    steps: "One training epoch",
    equation: "The update rule",
    limitations: "What to watch for",
    try: "Try this experiment",
    built: "Built from the math up.",
    footer: "Pablo Escamilla · An interactive study of neural learning",
    source: "View source",
    settingsNote:
      "Apply settings to restart training. Changing data also resets the model.",
    manual: "Add an exact point",
    addPoint: "Add point",
    coordinates: "Coordinates must be between −1 and 1.",
    noCurve: "Train the model to trace its learning curve.",
  },
  es: {
    formulation: "Formulación matemática",
    coursework: "Tu código original · corregido",
    revised: "Alternativas revisadas",
    formulationHint:
      "La versión original conserva tus neuronas sigmoides, umbrales y reglas de aprendizaje, con correcciones matemáticas documentadas.",
    colorMode: "Vista de color",
    gradientMode: "Salidas continuas",
    classMode: "Clase ganadora",
    neuronLines: "Fronteras de neuronas",
    rgbLegend:
      "A → azul · B → rojo · C → verde. RGB mezcla salidas sigmoides independientes; oscuro significa que todas son bajas. Son activaciones, no probabilidades calibradas ni distancias. Espacio sobre el plano cambia de clase.",
    probabilityLegend:
      "A → azul · B → rojo · C → verde. RGB mezcla probabilidades softmax, no distancias geométricas. Espacio sobre el plano cambia de clase.",
    scoreLegend:
      "Salida negativa: amarillo → rojo. Positiva: cian → azul. La intensidad sigue |w·x + b|, no la distancia a los puntos. Espacio sobre el plano cambia de clase.",
    activations: "Activaciones",
    probabilities: "Probabilidades",
    lab: "Laboratorio interactivo",
    eyebrow: "INTELIGENCIA ARTIFICIAL II",
    title: "Observa cómo aprende una máquina.",
    intro:
      "Coloca un punto. Entrena un modelo. Descubre las matemáticas detrás de la frontera.",
    experiment: "Experimento",
    guide: "Cómo funciona",
    algorithm: "Algoritmo",
    dataset: "Datos",
    linear: "Separación lineal",
    xor: "XOR",
    circles: "Círculos concéntricos",
    clusters: "Tres clases",
    custom: "Puntos propios",
    parameters: "Configuración del modelo",
    rate: "Tasa de aprendizaje",
    epochs: "Límite de épocas",
    hidden: "Capas ocultas",
    hiddenHint:
      "Neuronas por capa, separadas por comas. Hasta 3 capas de 16 neuronas.",
    seed: "Semilla aleatoria",
    apply: "Aplicar y reiniciar",
    reset: "Reiniciar modelo",
    clear: "Borrar puntos",
    train: "Entrenar modelo",
    pause: "Pausar",
    step: "Una época",
    boundary: "Frontera de decisión",
    boundaryHint:
      "Haz clic para añadir un punto. El color del fondo indica la predicción; la forma indica la clase real.",
    class: "Clase",
    mode: "Interacción con el plano",
    add: "Añadir puntos de entrenamiento",
    probe: "Consultar predicción",
    pointCount: "puntos de entrenamiento",
    prediction: "Predicción",
    epoch: "Época",
    accuracy: "Exactitud de entrenamiento",
    loss: "Pérdida de entrenamiento",
    curve: "Curva de aprendizaje",
    curveHint: "Pérdida después de cada época · menor es mejor",
    ready: "Listo para entrenar",
    running: "Entrenando",
    paused: "En pausa",
    complete: "Límite de épocas alcanzado",
    converged: "Todos los puntos de entrenamiento clasificados",
    empty:
      "Añade puntos de al menos dos clases (las tres para el conjunto de tres clases).",
    invalid:
      "Usa una tasa entre 0.001 y 1, 1–5000 épocas, una semilla entera no negativa y 1–3 capas ocultas de 1–16 neuronas.",
    limit: "Máximo de 300 puntos. Borra los puntos para empezar de nuevo.",
    unstable:
      "Entrenamiento detenido: valores no finitos. Reinicia con una tasa menor.",
    linearNote:
      "Una frontera recta no puede resolver XOR ni círculos concéntricos. Prueba una red neuronal para aprender una frontera no lineal.",
    metricsNote:
      "Las métricas describen los puntos de entrenamiento, no el desempeño con datos nuevos.",
    confusion: "Desglose de clasificación",
    actual: "Real ↓ / Predicción →",
    architecture: "Arquitectura de la red",
    input: "entradas",
    output: "salidas",
    read: "Explora el algoritmo",
    intuition: "La intuición",
    steps: "Una época de entrenamiento",
    equation: "Regla de actualización",
    limitations: "Qué debes observar",
    try: "Prueba este experimento",
    built: "Construido desde las matemáticas.",
    footer: "Pablo Escamilla · Un estudio interactivo del aprendizaje neuronal",
    source: "Ver código",
    settingsNote:
      "Aplica la configuración para reiniciar. Cambiar los datos también reinicia el modelo.",
    manual: "Añadir un punto exacto",
    addPoint: "Añadir punto",
    coordinates: "Las coordenadas deben estar entre −1 y 1.",
    noCurve: "Entrena el modelo para dibujar su curva de aprendizaje.",
  },
};
export const names = {
  perceptron: "Perceptron",
  adaline: "Adaline",
  backprop: "Backpropagation",
  quickprop: "QuickProp",
};
export const articles = {
  perceptron: {
    formula: "ŷ = sign(w · x + b)\nw ← w + η(t − ŷ)x\nb ← b + η(t − ŷ)",
    en: {
      tag: "01 / THE LINEAR CLASSIFIER",
      subtitle: "A simple rule. A moving line.",
      intuition:
        "A perceptron weighs the x and y coordinates and adds a bias. The sign of this score chooses one of two classes. Training moves the straight dividing line whenever a point is misclassified.",
      steps: [
        "Visit every training point in order.",
        "Compute the score and predict −1 or +1.",
        "If the prediction is wrong, adjust the weights and bias toward the target.",
      ],
      detail:
        "η is the learning rate, t is the target (−1 for A, +1 for B), and x is the input vector. One epoch visits all points. The chart shows the fraction of misclassified points after the epoch.",
      limitations:
        "Convergence requires linearly separable data. XOR cannot be solved by a single line; reaching the epoch limit does not mean the model succeeded.",
      try: "Train on Linear separation. Then switch to XOR and observe why the errors persist.",
    },
    es: {
      tag: "01 / EL CLASIFICADOR LINEAL",
      subtitle: "Una regla sencilla. Una recta que se mueve.",
      intuition:
        "Un perceptrón pondera las coordenadas x e y y añade un sesgo. El signo del resultado elige entre dos clases. El entrenamiento mueve la recta divisoria cuando un punto se clasifica mal.",
      steps: [
        "Recorre todos los puntos de entrenamiento en orden.",
        "Calcula la salida y predice −1 o +1.",
        "Si la predicción es incorrecta, ajusta los pesos y el sesgo hacia el objetivo.",
      ],
      detail:
        "η es la tasa de aprendizaje, t es el objetivo (−1 para A, +1 para B) y x es el vector de entrada. Una época recorre todos los puntos. La gráfica muestra la proporción de puntos mal clasificados al terminar la época.",
      limitations:
        "La convergencia requiere datos linealmente separables. Una sola recta no puede resolver XOR; alcanzar el límite de épocas no significa haber aprendido.",
      try: "Entrena con Separación lineal. Después cambia a XOR y observa por qué persisten los errores.",
    },
  },
  adaline: {
    formula:
      "z = w · x + b\nL = (1 / 2N) Σ(z − t)²\nw ← w − η · mean((z − t)x)",
    en: {
      tag: "02 / THE DELTA RULE",
      subtitle: "Learn from the size of the error.",
      intuition:
        "Adaline learns from a continuous linear score, not a thresholded prediction. A score far from the target produces a larger correction. The sign is used only when assigning the final class.",
      steps: [
        "Calculate the linear score of every point.",
        "Average the squared-error gradients across the dataset.",
        "Update all weights and the bias once using gradient descent.",
      ],
      detail:
        "N is the number of points, t is −1 or +1, and η is the learning rate. The bias gradient is mean(z − t). The chart reports half the mean squared error. Raw scores are not probabilities.",
      limitations:
        "Adaline still learns a straight boundary. A smaller loss does not always increase classification accuracy. Unlike the archived implementation, this model uses no sigmoid during training.",
      try: "Train on Linear separation and watch the loss keep improving even after most points are correctly classified.",
    },
    es: {
      tag: "02 / LA REGLA DELTA",
      subtitle: "Aprende de la magnitud del error.",
      intuition:
        "Adaline aprende de una salida lineal continua, no de una predicción discretizada. Una salida alejada del objetivo produce una corrección mayor. El signo se usa solo para asignar la clase final.",
      steps: [
        "Calcula la salida lineal de cada punto.",
        "Promedia los gradientes del error cuadrático de todos los datos.",
        "Actualiza los pesos y el sesgo una vez mediante descenso de gradiente.",
      ],
      detail:
        "N es el número de puntos, t vale −1 o +1 y η es la tasa de aprendizaje. El gradiente del sesgo es mean(z − t). La gráfica muestra la mitad del error cuadrático medio. Las salidas no son probabilidades.",
      limitations:
        "Adaline sigue aprendiendo una frontera recta. Reducir la pérdida no siempre mejora la exactitud. A diferencia de la versión archivada, este modelo no usa una sigmoide para entrenar.",
      try: "Entrena con Separación lineal y observa cómo baja la pérdida incluso después de clasificar correctamente casi todos los puntos.",
    },
  },
  backprop: {
    formula:
      "h = tanh(Wx + b)\np = softmax(z)     L = −mean(log p[target])\nW ← W − η · ∂L/∂W",
    en: {
      tag: "03 / THE MULTILAYER NETWORK",
      subtitle: "Beyond a straight line.",
      intuition:
        "Hidden neurons transform coordinates into nonlinear features. A softmax output compares two or three classes. Backpropagation uses the chain rule to calculate how much each weight contributes to the loss.",
      steps: [
        "Pass each point through tanh hidden layers and the softmax output.",
        "Compute cross-entropy and propagate gradients backward through every layer.",
        "Average the gradients over all points, then update every weight and bias.",
      ],
      detail:
        "For softmax with cross-entropy, the output gradient is p − oneHot(target). Hidden layers multiply the propagated gradient by 1 − h². The network takes only x and y; it is not given the radius or the XOR rule.",
      limitations:
        "Architecture, initialization, and learning rate affect convergence. Training accuracy is not a measure of generalization. This is a nonlinear multilayer perceptron, not a stack of linear Adaline units.",
      try: "Choose Concentric circles and train with the default 8, 8 hidden layers. Watch a curved boundary emerge from the coordinates alone.",
    },
    es: {
      tag: "03 / LA RED MULTICAPA",
      subtitle: "Más allá de una recta.",
      intuition:
        "Las neuronas ocultas transforman las coordenadas en características no lineales. Una salida softmax compara dos o tres clases. La retropropagación usa la regla de la cadena para calcular cuánto contribuye cada peso a la pérdida.",
      steps: [
        "Propaga cada punto por las capas tanh y la salida softmax.",
        "Calcula la entropía cruzada y propaga los gradientes hacia atrás por cada capa.",
        "Promedia los gradientes de todos los puntos y actualiza cada peso y sesgo.",
      ],
      detail:
        "Con softmax y entropía cruzada, el gradiente de salida es p − oneHot(objetivo). Las capas ocultas multiplican el gradiente propagado por 1 − h². La red solo recibe x e y: no recibe el radio ni la regla de XOR.",
      limitations:
        "La arquitectura, la inicialización y la tasa afectan la convergencia. La exactitud de entrenamiento no mide la generalización. Es un perceptrón multicapa no lineal, no una pila de unidades Adaline lineales.",
      try: "Elige Círculos concéntricos y entrena con las capas ocultas 8, 8. Observa cómo surge una frontera curva a partir de las coordenadas.",
    },
  },
  quickprop: {
    formula: "gₜ = ∂L/∂wₜ\nΔwₜ = Δwₜ₋₁ · gₜ / (gₜ₋₁ − gₜ)\nwₜ₊₁ = wₜ + Δwₜ",
    en: {
      tag: "04 / A FASTER WEIGHT UPDATE",
      subtitle: "Use the previous slope to look ahead.",
      intuition:
        "QuickProp uses the current gradient, the previous gradient, and the last weight change to estimate local curvature. It fits a quadratic approximation independently for each weight. Backpropagation still supplies the gradients.",
      steps: [
        "Calculate the same batch gradients as the backpropagation model.",
        "Estimate a secant step from the current and previous gradients.",
        "Accept a downhill step with bounded growth, or fall back to gradient descent.",
      ],
      detail:
        "This lab implements a safeguarded QuickProp variant, not an exact reproduction of Fahlman’s original implementation. Growth is capped at 1.75× the previous step (or the gradient step if larger), with an absolute secant-step cap of 0.5. A near-zero denominator or non-descent direction triggers a gradient-descent fallback.",
      limitations:
        "A downhill direction does not guarantee a lower loss after a finite step. QuickProp is not always faster or more stable. Compare runs using the same dataset, seed, architecture, and epoch limit.",
      try: "Train on Concentric circles. Switch to Backpropagation with the same settings and compare the loss at the same epoch.",
    },
    es: {
      tag: "04 / UNA ACTUALIZACIÓN MÁS RÁPIDA",
      subtitle: "Usa la pendiente anterior para anticipar.",
      intuition:
        "QuickProp usa el gradiente actual, el anterior y el último cambio de peso para estimar la curvatura local. Ajusta una aproximación cuadrática por separado para cada peso. La retropropagación sigue calculando los gradientes.",
      steps: [
        "Calcula los mismos gradientes por lote que el modelo de retropropagación.",
        "Estima un paso secante con los gradientes actual y anterior.",
        "Acepta un paso en dirección de descenso con crecimiento acotado o usa descenso de gradiente.",
      ],
      detail:
        "Este laboratorio implementa una variante de QuickProp con salvaguardas, no una reproducción exacta del original de Fahlman. El crecimiento se limita a 1.75× el paso anterior (o al paso de gradiente si es mayor), con un máximo absoluto de 0.5 para el paso secante. Un denominador casi nulo o una dirección que no es de descenso activa el descenso de gradiente.",
      limitations:
        "Una dirección de descenso no garantiza menor pérdida tras un paso finito. QuickProp no siempre es más rápido ni más estable. Compara con los mismos datos, semilla, arquitectura y límite de épocas.",
      try: "Entrena con Círculos concéntricos. Cambia a Backpropagation con la misma configuración y compara la pérdida en la misma época.",
    },
  },
};
