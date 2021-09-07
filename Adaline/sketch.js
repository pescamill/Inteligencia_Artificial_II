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
let errorDeseado = 0.1;
let points = [];
let showAdaline = false;
let brain;
let adaline;
let trainingIndex = 0;
let trainingAdalineIndex = 0;
let noWrongGuesses = false;
let trainingInterval;
let trainingIntervalAdaline;
let learningRate = 0.1;
let iterations;
let iterationsAdaline;
let epoca = 0;
let epochs = 300;
let epocaAdaline = 0;
let modulo = 0;
let moduloAdaline = 0;
let board;
let isTraining = false;
let tablaConfusion;
let isDrawingNew;
let newClicks = false;
let tablaConfusionAdaline;

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



function changeError() {
  errorDeseado = input.value();
  console.log('error deseado: ', errorDeseado);
}

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
  adaline = new Adaline(3, 0.1);


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

  iterationsAdaline = createDiv();
  iterationsAdaline.style("font-size", "12");
  iterationsAdaline.position(900, 10);

  ctx.createLinearGradient(0, 0, 200, 0);

  let submitButton = (button = createButton('Nuevo Learning Rate'));
  button.position(1100, 450);
  button.mousePressed(changeRate);



  let submitEpochs = (button = createButton('Numero de epocas'));
  button.position(860, 450);
  button.mousePressed(changeEpochs);

  let inputError = (input = createInput(''));
  input.position(700, 450);
  input.size(150);

  let submitError = (button = createButton('Error deseado'));
  button.position(995, 450);
  button.mousePressed(changeError);

  var cnv = createCanvas(499, 499);
  pixelDensity(1);
  cnv.position(100, 240);


  iterations.html(
    `<p>Epoca: ${brain.iterations}
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

  if(showAdaline){
    for (let point of points) {
      point.showAdaline();
    }
  }else {
      for (let point of points) {
        point.show();
      }
  }

}

function mouseClicked(){

  if (newClicks){
    let pX = map(mouseX,  0, width, -1, 1);
    let pY = map(mouseY, 0, height, 1, -1);

    let inputs = [pX, pY, 1];

    

    let c = map(adaline.getSigma(inputs), 2, 0, 100, 255);
    let d = map(-adaline.getSigma(inputs), 2, 0, 100, 255);

    if (adaline.getSigma(inputs) >= 0) {
      fill(0, c, 255);
    } else {
      fill(255, d, 0);
    }


    ellipse(mouseX, mouseY, 8, 8);
  } else {

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
}

function createPerceptron(){

  clear();

  let b1 = color(255);
  let b2 = color(0);

  noWrongGuesses = false;
  brain = new Perceptron(3, learningRate);
  adaline = new Adaline (3, learningRate);

  stroke(255, 0, 0);
  p1 = new Point(-1, brain.getY(-1));
  p2 = new Point(1, brain.getY(1));
  line(p2.pixelX(), p2.pixelY(), p1.pixelX(), p1.pixelY());

  stroke('#fae');
  strokeWeight(2);
  p3 = new Point(-1, adaline.getY(-1));
  p4 = new Point(1, adaline.getY(1));
  line(p4.pixelX(), p4.pixelY(), p3.pixelX(), p3.pixelY());


  iterationsAdaline.html(
    `<p>Epoca: ${epocaAdaline}
    </p><p>Learning Rate: ${adaline.learningRate}</p>
    </p><p>w0: ${adaline.weights[0]}</p>
    </p><p>w1: ${adaline.weights[1]}</p>
    </p><p>w2: ${adaline.weights[2]}</p>`
  );

  iterations.html(
    `<p>Epoca: ${epoca}
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



function lastStandAdaline(){

  for (let point of points){
    if (point.label == point.adalinePrediction && point.adalinePrediction == 1) App++;

    if (point.label == point.adalinePrediction && point.adalinePrediction == -1) Apn++;

    if(point.adalinePrediction == 1)Afp++;

    if(point.adalinePrediction == -1)Afn++;
  }

}


function startTraining() {
  if (!isTraining) {
    isTraining = true;
    isTrainingAdaline = true;
    showAdaline = true;
    trainingInterval = setInterval(nextIteration, 0.1);
    trainingIntervalAdaline = setInterval(nextAdalineIteration, 1);
  }
}

function startDrawingNew() {
  if (!isDrawingNew) {
    isDrawingNew = true;
    drawingNewInterval = setInterval(nextDrawing, 0.1);
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

  stroke('#fae');
  strokeWeight(2);
  p3 = new Point(-1, adaline.getY(-1));
  p4 = new Point(1, adaline.getY(1));
  line(p4.pixelX(), p4.pixelY(), p3.pixelX(), p3.pixelY());

  checkGuesses();

  if(noWrongGuesses){
    clearInterval(trainingInterval);
    isTraining = false;
    console.log("El perceptrón fue entrenado. ");
    alert("El perceptrón fue entrenado.");
    lastStand();

  }



  modulo++;
  if (modulo % points.length == 0) epoca++

  if(epoca > epochs ){
    clearInterval(trainingInterval);
    isTraining = false;
    console.log("El perceptrón no pudo ser entrenado. ");
    alert("El perceptrón no pudo ser entrenado.");

  }

}

function nextAdalineIteration() {
  clear();
  cartesianPlane();
  training = points[trainingAdalineIndex];
  let inputs = [training.x, training.y, training.bias];
  let target = training.label;
  let error;

  adaline.train(inputs, target, training);

  // training.show();
  trainingAdalineIndex++;

  if (trainingAdalineIndex == points.length) {
    trainingAdalineIndex = 0;
  }

  iterationsAdaline.html(
    `<p>Epoca: ${epocaAdaline}
    </p><p>Learning Rate: ${adaline.learningRate}</p>
    </p><p>Error deseado: ${errorDeseado}</p>
    </p><p>w0: ${adaline.weights[0]}</p>
    </p><p>w1: ${adaline.weights[1]}</p>
    </p><p>w2: ${adaline.weights[2]}</p>`
  );


  moduloAdaline++;

  if ((moduloAdaline % points.length) == 0) {
    epocaAdaline++
    error = (adaline.errorAcumulado / (adaline.iterations * 3));
    adaline.errorAcumulado = 0;
    adaline.iterations = 0;
    myLineChart.data.datasets[0].data[epocaAdaline] = error;
    myLineChart.data.labels[epocaAdaline] = epocaAdaline;
    console.log("Adaline iteration:", epocaAdaline, ", error:", error);
    myLineChart.update();

  }

  stroke('#fae');
  strokeWeight(2);
  p3 = new Point(-1, adaline.getY(-1));
  p4 = new Point(1, adaline.getY(1));
  line(p4.pixelX(), p4.pixelY(), p3.pixelX(), p3.pixelY());

  stroke(255, 0, 0);
  line(p2.pixelX(), p2.pixelY(), p1.pixelX(), p1.pixelY());


  for (let point of points) {
    point.showAdaline();
  }

  if(error < errorDeseado){
    clearInterval(trainingIntervalAdaline);
    console.log("Adaline fue entrenado ");
    alert("Adaline fue entrenado.");


    newClicks = true;

    iterationsAdaline.html(
      `<p>Epoca: ${epocaAdaline}
      </p><p>Learning Rate: ${adaline.learningRate}</p>
      </p><p>Error deseado: ${errorDeseado}</p>
      </p><p>w0: ${adaline.weights[0]}</p>
      </p><p>w1: ${adaline.weights[1]}</p>
      </p><p>w2: ${adaline.weights[2]}</p>`
    );

  }


  if(epocaAdaline >= epochs ){
    clearInterval(trainingIntervalAdaline);
    isTrainingAdaline = false;
    console.log("Adaline no pudo ser entrenado. ");
    alert("Adaline no pudo ser entrenado.");
    newClicks = true;


  iterationsAdaline.html(
    `<p>Epoca: ${epocaAdaline}
    </p><p>Learning Rate: ${adaline.learningRate}</p>
    </p><p>Error deseado: ${errorDeseado}</p>
    </p><p>w0: ${adaline.weights[0]}</p>
    </p><p>w1: ${adaline.weights[1]}</p>
    </p><p>w2: ${adaline.weights[2]}</p>`
  );



}
}


function pauseTraining() {
  clearInterval(trainingInterval);
  clearInterval(trainingIntervalAdaline)
  isTraining = false;
  isTrainingAdaline = false;
  console.log("Entrenamiento pausado.");
  alert("Entrenamiento pausado.");
}


// set the dimensions and margins of the graph
var margin = {top: 230, right: 30, bottom: 30, left: 30},
  width = 450,
  height = 450;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([1,100])

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {

  svg.selectAll()
      .data(data, function(d) {return d.group+':'+d.variable;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )

})
