var button;
const Y_AXIS = 1;
const X_AXIS = 2;
let pp = 0;
let fp = 0;
let pn = 0;
let fn = 0;
let App = 0;
let Afp = 0;
let Apn = 0;
let Afn = 0;
let b1, b2, c1, c2;
let points = [];
let brain;
let trainingIndex = 0;
let noWrongGuesses = false;
let trainingInterval;
let trainingIntervalAdaline;
let learningRate = 0.01;
let iterations;
let iterationsAdaline;
let epoca = 0;
let epochs = 100;
let modulo = 0;
let board;
let isTraining = false;
let tablaConfusion;


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


canvas.style.left = "100px";
canvas.style.top = "240px";
canvas.style.position = "absolute";


var canvas = document.getElementById('myChart').getContext('2d');
var data = {
  labels: ['0'],
  datasets: [
      {
          label: "Error Acumulado",
          fill: true,
          lineTension: 0.001,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 2,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 2,
          pointHitRadius: 10,
          data: [],
      }
  ]
};

var option = {
	showLines: true,
  responsive: false,
  scales: {
  y: {
    max: data[0],
    min: 0,
    ticks: {
      stepSize: 0.05
  }
  }
}
};

var myLineChart = new Chart(canvas,{
  type: 'line',
	data:data,
  options:option,
});


function changeRate() {
  learningRate = input.value();
  console.log('valor de aprendizaje: ', learningRate);
}

function changeEpochs() {
  epochs = input.value();
  console.log('numero de epocas: ', epochs);
}

function setup() {


  brain = new Perceptron(3, 0.1);


  b1 = color(2, 79, 204);
  b2 = color(0, 21, 99);

  let strtPercBtn = (button = createButton("Inicializar modelos"))
  button.position(700, 600);
  button.size(150);
  button.mousePressed(createPerceptron);


  let trainBtn = (button = createButton("Entrenar modelos"));
  button.position(700, 350);
  button.mousePressed(startTraining);

  let stopBtn = (button = createButton("Pausar"));
  button.position(700, 550);
  button.mousePressed(pauseTraining);

  iterations = createDiv();
  iterations.style("font-size", "12");
  iterations.position(700, 10);

  tablaConfusion = createDiv();
  tablaConfusion.style("font-size", "12");
  tablaConfusion.position(1200, 50);

  tablaConfusionAdaline = createDiv();
  tablaConfusionAdaline.style("font-size", "12");
  tablaConfusionAdaline.position(1200, 180);

  iterationsAdaline = createDiv();
  iterationsAdaline.style("font-size", "12");
  iterationsAdaline.position(900, 10);

  ctx.createLinearGradient(0, 0, 200, 0);

  let submitButton = (button = createButton('Nuevo Learning Rate'));
  button.position(1000, 450);
  button.mousePressed(changeRate);



  let submitEpochs = (button = createButton('Numero de epocas'));
  button.position(860, 450);
  button.mousePressed(changeEpochs);

  let inputError = (input = createInput(''));
  input.position(700, 450);
  input.size(150);

  var cnv = createCanvas(499, 499);
  pixelDensity(1);
  cnv.position(100, 240);


  iterations.html(
    `<p>Época: ${brain.iterations}
    </p><p>Learning Rate: ${brain.learningRate}</p>`
  );

}


function cartesianPlane(){
  // Columnas y filas del plano
  for(i=1; (i<height-1); i=i+50){
    stroke(0,0,0);
  strokeWeight(1);
  line(i, height-1, i, 1);
  }

  stroke(0,0,0);
  line((width/2)+1, height-1, (width/2)+1, 1);
  line(1, (height/2)+1, width-1, (height/2)+1);

  for(i=1; (i<width-1); i=i+50){
    stroke(0,0,0);
    strokeWeight(1);
    line(width-1, i, 1, i);
  }

  stroke(0,0,0);
  line(width-1, width-1, width-1, 1);
  line(1, height-1, width-1, width-1)

}

function draw() {
  cartesianPlane();
  for (let point of points) {
      point.show();
  }
}

function mouseClicked(){
  
  if( mouseX < width &&  mouseY < height){
  if (mouseButton === LEFT) {
      let pX = map(mouseX,  0, width, -1, 1);
      let pY = map(mouseY, 0, height, 1, -1);
      
      points.push(new Point(pX, pY, true));
  }
  if (mouseButton === CENTER){
      let pX = map(mouseX,  0, width, -1, 1);
      let pY = map(mouseY, 0, height, 1, -1);
      points.push(new Point(pX, pY, false));
  }
}
}


function createPerceptron(){

  clear();

  let b1 = color(255);
  let b2 = color(0);

  noWrongGuesses = false;
  brain = new Perceptron(3, learningRate);

  stroke(255, 0, 0);
  p1 = new Point(-1, brain.getY(-1));
  p2 = new Point(1, brain.getY(1));
  line(p2.pixelX(), p2.pixelY(), p1.pixelX(), p1.pixelY());


  iterations.html(
    `<p>Época: ${epoca}
    </p><p>Learning Rate: ${brain.learningRate}</p>
    </p><p>w0: ${brain.weights[0]}</p>
    </p><p>w1: ${brain.weights[1]}</p>
    </p><p>w2: ${brain.weights[2]}</p>`
  );

}

function checkGuesses(){
  counter = 0;
  for (let point of points){
    if (point.predicted) counter++;
  }
  if(counter==points.length) noWrongGuesses=true;
}


function lastStand(){
  for (let point of points){
    if (point.label == point.prediction && point.prediction == 1) pp++;

    if (point.label == point.prediction && point.prediction == -1) pn++;

    if(point.prediction == 1) fp++;

    if(point.prediction == -1) fn++;
  }
}


function startTraining() {
  if (!isTraining) {
    isTraining = true;
    trainingInterval = setInterval(nextIteration, 6.5);
  }
}

function nextIteration() {

  clear();
  training = points[trainingIndex];
  let inputs = [training.x, training.y, training.bias];
  let target = training.label;

  brain.train(inputs, target, training);

  // training.show();
  trainingIndex++;

  if (trainingIndex == points.length) {
    trainingIndex = 0;
  }


  iterations.html(
    `<p>Epoca: ${epoca}
    </p><p>Learning Rate: ${brain.learningRate}</p>
    </p><p>w0: ${brain.weights[0]}</p>
    </p><p>w1: ${brain.weights[1]}</p>
    </p><p>w2: ${brain.weights[2]}</p>`

  );




  stroke(255, 0, 0);

  p1 = new Point(-1, brain.getY(-1));
  p2 = new Point(1, brain.getY(1));

  line(p2.pixelX(), p2.pixelY(), p1.pixelX(), p1.pixelY());




  checkGuesses();

  if(noWrongGuesses){
    clearInterval(trainingInterval);
    isTraining = false;
    console.log("El perceptrón fue entrenado. ");
    alert("El perceptrón fue entrenado.");
    lastStand();
    tablaConfusion.html(`<table style="width:100%">
    <tr>
      <th></th>
      <th>Predecido 0</th>
      <th>Predecido 1</th>
    </tr>
    <tr>
      <th>Real 0</th>
      <td>${pn}</td>
      <td>${fn - pn}</td>

    </tr>
    <tr>
      <th>Real 1</th>
      <td>${fp-pp}</td>
      <td>${pp}</td>

    </tr>
    <tr>
      <td></td>


    </tr>
  </table>`
    );


  }


  modulo++;

  if (modulo % points.length == 0) {
    myLineChart.data.datasets[0].data[epoca] = brain.errorAcumulado;
    myLineChart.data.labels[epoca] = epoca;
    myLineChart.update();
    brain.errorAcumulado = 0;
    epoca++
  }

  if(epoca > epochs ){
    clearInterval(trainingInterval);
    isTraining = false;
    console.log("El perceptrón no pudo ser entrenado. ");
    alert("El perceptrón no pudo ser entrenado.");
    lastStand();

    tablaConfusion.html(`<table style="width:100%">
    <tr>
      <th></th>
      <th>Predecido 0</th>
      <th>Predecido 1</th>
    </tr>
    <tr>
      <th>Real 0</th>
      <td>${pn}</td>
      <td>${fn - pn}</td>

    </tr>
    <tr>
      <th>Real 1</th>
      <td>${fp-pp}</td>
      <td>${pp}</td>

    </tr>
    <tr>
      <td></td>


    </tr>
  </table>`
    );
  }

}



function pauseTraining() {
  clearInterval(trainingInterval);
  isTraining = false;

  console.log("Entrenamiento pausado.");
  alert("Entrenamiento pausado.");
  lastStand();
  tablaConfusion.html(`<table style="width:100%">
    <tr>
      <th></th>
      <th>Predecido 0</th>
      <th>Predecido 1</th>
    </tr>
    <tr>
      <th>Real 0</th>
      <td>${pn}</td>
      <td>${fn - pn}</td>

    </tr>
    <tr>
      <th>Real 1</th>
      <td>${fp-pp}</td>
      <td>${pp}</td>

    </tr>
    <tr>
      <td></td>


    </tr>
  </table>`
    );

  
}
