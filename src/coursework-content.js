import { articles } from "./content.js";
// Explanation selection follows the selected math, never just the algorithm tab.
export const courseworkArticles = {
  perceptron: articles.perceptron,
  adaline: {
    formula:
      "z = w · x + b     y = σ(z)\nL = mean((t − y)² / 2)\nw ← w + η(t − y)y(1 − y)x",
    en: {
      tag: "02 / MY SIGMOID ADALINE",
      subtitle: "Keep the continuous response.",
      intuition:
        "My coursework calls this neuron Adaline, but trains a sigmoid output. I keep that design and its per-point update. The background uses the raw linear score from getSigma, just as my original point colors did.",
      steps: [
        "Compute the weighted sum and apply my sigmoid f(x).",
        "Compare the sigmoid output with the 0/1 class target.",
        "Update each weight with error × f(z) × (1 − f(z)) × input; repeat for each point.",
      ],
      detail:
        "My multWX, getSigma, valueAdaline and errorAcumulado names remain. The necessary correction is converting targets from −1/+1 to 0/1: a sigmoid cannot reach −1. Classification uses z ≥ 0, equivalent to σ(z) ≥ 0.5. The gradient is calculated per point, while the chart evaluates all current points after each epoch.",
      limitations:
        "This is sigmoid squared-error learning, not classical linear Adaline. The revised alternative supplies classical Adaline. Color intensity encodes the raw score, not a calibrated probability or distance to examples; each side has its own color ramp.",
      try: "Train on linear data, then inspect points near and far from the boundary. Compare z, σ(z), and the changing color intensity.",
    },
    es: {
      tag: "02 / MI ADALINE SIGMOIDE",
      subtitle: "Conserva la respuesta continua.",
      intuition:
        "Mi práctica llama Adaline a esta neurona, pero entrena una salida sigmoide. Conservo ese diseño y la actualización por punto. El fondo usa la salida lineal de getSigma, igual que los colores originales de mis puntos.",
      steps: [
        "Calcula la suma ponderada y aplica mi sigmoide f(x).",
        "Compara la salida sigmoide con el objetivo de clase 0/1.",
        "Actualiza cada peso con error × f(z) × (1 − f(z)) × entrada; repite para cada punto.",
      ],
      detail:
        "Conservo multWX, getSigma, valueAdaline y errorAcumulado. La corrección necesaria es convertir los objetivos −1/+1 a 0/1: una sigmoide no puede alcanzar −1. Clasificar con z ≥ 0 equivale a σ(z) ≥ 0.5. Se actualiza por punto; la gráfica evalúa todos los puntos con los pesos actuales al terminar cada época.",
      limitations:
        "Es aprendizaje sigmoide con error cuadrático, no Adaline lineal clásico. La alternativa revisada ofrece ese modelo clásico. La intensidad representa la salida lineal, no una probabilidad calibrada ni distancia a los ejemplos; cada lado tiene su propia rampa de color.",
      try: "Entrena con datos lineales y consulta puntos cerca y lejos de la frontera. Compara z, σ(z) y la intensidad del color.",
    },
  },
  backprop: {
    formula:
      "a = σ(Σ wᵢxᵢ − 1)\nL = mean(Σⱼ(tⱼ − aⱼ)²)\nδout = −2a(1 − a)(t − a)\nw ← w − ηδx",
    en: {
      tag: "03 / MY SIGMOID NETWORK",
      subtitle: "My neurons, connected layer by layer.",
      intuition:
        "This restores my NN network of neuron objects, sigmoid activations, independent outputs (three in presets, two or three in custom experiments) and per-point backpropagation. My fixed −1 threshold remains in every neuron; the first layer also receives the constant bias input 1.",
      steps: [
        "feed_forward gives every neuron in a layer the same inputs, including the first-layer bias input.",
        "backward_propagate applies first_delta and get_delta from the outputs back to the hidden layers.",
        "update_weights changes weights after each point; the next point sees the new weights.",
      ],
      detail:
        "The original factor −2 and the derivative a(1 − a) are preserved. Later layers keep their fixed −1 threshold without new trainable biases. The corrected loss sums squared errors over all outputs before averaging points. RGB uses the raw activations, without normalizing them; A is blue, B red, C green.",
      limitations:
        "Independent sigmoids need not sum to one. Their colors show activations, not calibrated probabilities or geometric proximity. Fixed thresholds may constrain learning. Neuron boundaries show first-layer z = 0 lines, not the complete nonlinear decision boundary.",
      try: "Choose concentric circles and train. Turn on neuron boundaries, then inspect points and compare the three activations. Custom points supports two or three classes.",
    },
    es: {
      tag: "03 / MI RED SIGMOIDE",
      subtitle: "Mis neuronas, conectadas capa por capa.",
      intuition:
        "Esta versión recupera mi NN de objetos neurona, activaciones sigmoides, salidas independientes (tres en conjuntos predefinidos, dos o tres en experimentos propios) y retropropagación por punto. Se conserva el umbral fijo −1 en cada neurona; la primera capa también recibe la entrada constante de sesgo 1.",
      steps: [
        "feed_forward entrega las mismas entradas a cada neurona de una capa, incluido el sesgo de la primera.",
        "backward_propagate aplica first_delta y get_delta desde las salidas hacia las capas ocultas.",
        "update_weights cambia los pesos tras cada punto; el siguiente punto usa los nuevos pesos.",
      ],
      detail:
        "Conservo el factor −2 y la derivada a(1 − a). Las capas posteriores conservan su umbral fijo −1 sin añadir sesgos entrenables. La pérdida corregida suma los errores cuadrados de todas las salidas y luego promedia los puntos. RGB usa las activaciones sin normalizarlas: A azul, B rojo, C verde.",
      limitations:
        "Las sigmoides independientes no tienen que sumar uno. Sus colores representan activaciones, no probabilidades calibradas ni proximidad geométrica. Los umbrales fijos pueden limitar el aprendizaje. Las fronteras de neuronas muestran z = 0 de la primera capa, no toda la frontera no lineal.",
      try: "Elige círculos concéntricos y entrena. Activa las fronteras de neuronas y compara las tres activaciones al consultar puntos. Puntos propios permite elegir dos o tres clases.",
    },
  },
  quickprop: {
    formula:
      "s = ∂L/∂w     difference = prev_s − s\ntemp = (s / difference) × prev_g\ng = bounded(temp) + gradient fallback\nw ← w + g",
    en: {
      tag: "04 / MY QUICKPROP, CORRECTED",
      subtitle: "Keep the secant idea and its vocabulary.",
      intuition:
        "This keeps my sigmoid network, prev_s and prev_g histories, and temp-plus-gradient update structure. QuickProp estimates a per-weight quadratic from successive gradients. Unlike per-point backpropagation, its gradients here use the whole dataset so consecutive slopes describe the same loss.",
      steps: [
        "Compute squared-error gradients through my sigmoid neurons, averaged over the dataset.",
        "Estimate temp using the current slope, prev_s and prev_g.",
        "Bound the secant magnitude, reject an uphill secant, and add the gradient term when slopes keep their sign or the secant is unusable.",
      ],
      detail:
        "The original positive/negative step comparison could reverse a valid step; it is replaced by a magnitude cap of 1.75 × |prev_g| and 0.5. A tiny denominator falls back to gradient descent instead of an arbitrary 0.01 denominator. Histories start at zero until a real gradient and step exist. This is a corrected coursework variant, not an exact reproduction or the revised tanh/softmax alternative.",
      limitations:
        "Batch gradients are a deliberate correction to the original per-point QuickProp. Sigmoid saturation and fixed thresholds can slow learning. Loss need not decrease every epoch, and QuickProp need not beat backpropagation. Raw RGB outputs still are not normalized probabilities.",
      try: "Compare with my Backpropagation using the same points and seed. Both use the same network and loss, but their update schedules differ.",
    },
    es: {
      tag: "04 / MI QUICKPROP, CORREGIDO",
      subtitle: "Conserva la idea secante y su vocabulario.",
      intuition:
        "Se conservan mi red sigmoide, los historiales prev_s y prev_g y la estructura temp más gradiente. QuickProp estima una cuadrática por peso a partir de gradientes sucesivos. Aquí los gradientes usan todo el conjunto para que las pendientes correspondan a la misma pérdida.",
      steps: [
        "Calcula los gradientes del error cuadrático de mis neuronas sigmoides y promedia los puntos.",
        "Estima temp con la pendiente actual, prev_s y prev_g.",
        "Acota la magnitud secante, rechaza pasos secantes ascendentes y añade el gradiente si las pendientes conservan el signo o el paso secante no sirve.",
      ],
      detail:
        "La comparación original de pasos positivos y negativos podía invertir un paso válido; se sustituye por un límite de magnitud de 1.75 × |prev_g| y 0.5. Un denominador casi nulo activa descenso de gradiente en vez de sustituirse por 0.01. Los historiales empiezan en cero hasta contar con un gradiente y un paso reales. Es una variante corregida de mi código, no una reproducción exacta ni la alternativa tanh/softmax.",
      limitations:
        "Los gradientes por lote son una corrección deliberada al QuickProp original por punto. La saturación sigmoide y los umbrales fijos pueden ralentizar el aprendizaje. La pérdida no tiene que bajar cada época, ni QuickProp superar a backpropagation. Las salidas RGB no son probabilidades normalizadas.",
      try: "Compara con mi Backpropagation usando los mismos puntos y semilla. Comparten red y pérdida, pero difieren en cuándo actualizan los pesos.",
    },
  },
};
