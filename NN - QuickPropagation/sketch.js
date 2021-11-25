var button;
const Y_AXIS = 1;
const X_AXIS = 2;
let dataType = 0;
let nn;
let type_counter = 0;
let color_counter = 0;
let n_hidden = 0;
let n_numbers = [];
let batch = 100;
let toggle = false;
let b1, b2, c1, c2;
let errorDeseado = 0.001;
let points = [];
let entry_layer = [];
let showAdaline = false;
let brain;
let adaline;
let trainingIndex = 0;
let trainingAdalineIndex = 0;
let noWrongGuesses = false;
let trainingInterval;
let trainingIntervalAdaline;
let learningRate = 1;
let iterations;
let errorAcumulado = 0;
let iterationsAdaline;
let epoca = 0;
let epochs = 4000;
let epocaAdaline = 0;
let modulo = 0;
let moduloAdaline = 0;
let board;
let isTraining = false;
let tablaConfusion;

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
          lineTension: 0.0005,
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
    min: 0.0005,
    ticks: {
      stepSize: 0.01
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
  n_numbers.push(parseInt(input.value()));
  console.log('neuronas por capa: ', n_numbers);
}

function changeRate() {
  learningRate = input.value();
  console.log('valor de aprendizaje: ', learningRate);
}

function changeEpochs() {
  n_hidden = input.value();
  console.log('numero de capas: ', n_hidden);
}

function setup() {
	
  n_hidden = 0;
  n_numbers = [];
  
  nn = new NN(3,3,3,n_numbers,learningRate);

  
  b1 = color(2, 79, 204);
  b2 = color(0, 21, 99);

  let strtPercBtn = (button = createButton("Inicializar modelo"))
  button.position(700, 600);
  button.size(150);
  button.mousePressed(createPerceptron);


  let trainBtn = (button = createButton("Entrenar modelo"));
  button.position(700, 350);
  button.mousePressed(startTraining);

  let stopBtn = (button = createButton("Pausar"));
  button.position(700, 550);
  button.mousePressed(pauseTraining);


  
  network = createDiv();
  network.style("font-size", "12");
  network.position(700, 10);

  iterationsAdaline = createDiv();
  iterationsAdaline.style("font-size", "12");
  iterationsAdaline.position(900, 10);

  ctx.createLinearGradient(0, 0, 200, 0);

  let submitButton = (button = createButton('Learning Rate'));
  button.position(1100, 450);
  button.mousePressed(changeRate);


  let submitHidden = (button = createButton('Numero de capas'));
  button.position(860, 450);
  button.mousePressed(changeEpochs);

  let inputError = (input = createInput(''));
  input.position(700, 450);
  input.size(150);

  let submitError = (button = createButton('Neuronas'));
  button.position(995, 450);
  button.mousePressed(changeError);

  var cnv = createCanvas(499, 499);
  pixelDensity(1);
  cnv.position(100, 240);
  
    network.html(
    `<p>Numero de Capas ocultas: ${n_hidden}
    </p><p>Neuronas en cada capa: ${n_numbers}</p>
	</p><p>Salida: ${3}</p>`
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

function keyPressed() {

  let keyIndex = -1;
  if (keyIndex === -1) {

    dataType++;

    if (dataType > 2){
      dataType = 0;
    }
  }

}

function mouseClicked(){

  if (newClicks){
    let pX = map(mouseX,  0, width, -1, 1);
    let pY = map(mouseY, 0, height, 1, -1);

    let inputs = [pX, pY, 1];

    value = nn.feed_forward(inputs);
		
	console.log(value[0].output, value[1].output, value[2].output);
	
	a = map(value[0].output, -1, 1, 0, 255);
	b = map(value[1].output, -1, 1, 0, 255);
    c = map(value[2].output, -1, 1, 0, 255);

    fill(a,b,c);


    ellipse(mouseX, mouseY, 4, 4);
  } else {
  if( mouseX < width &&  mouseY < height){
  if (mouseButton === LEFT) {
      let pX = map(mouseX,  0, width, -1, 1);
      let pY = map(mouseY, 0, height, 1, -1);
      console.log(pX);
	 
	  points.push(new Point(pX, pY, dataType));
	 
  }
  }
  }
}

function createPerceptron(){

  clear();

  let b1 = color(255);
  let b2 = color(0);

  noWrongGuesses = false;



  nn = new NN(n_hidden,3,3,n_numbers,learningRate);

  stroke('#fae');
  strokeWeight(2);

  for(let i = 0; i < n_numbers[0]; i++){

    let px = new Point(-1, nn.network[0][i].getY(-1));
    let py = new Point(1, nn.network[0][i].getY(1));

    line(py.pixelX(), py.pixelY(), px.pixelX(), px.pixelY());

  }



  iterationsAdaline.html(
    `<p>Epoca: ${epocaAdaline}
    </p><p>Learning Rate: ${learningRate}</p>
	</p><p>Learning Rate: ${errorDeseado}</p>`
  );
  
  
  network.html(
    `<p>Numero de Capas ocultas: ${n_hidden}
    </p><p>Neuronas en cada capa: ${n_numbers}</p>
	</p><p>Salida: ${3}</p>`
  );
  

}


function startTraining() {
  if (!isTraining) {
  
    trainingInterval = setInterval(nextIteration, 0);
  }
}


function nextIteration() {

  clear();
  cartesianPlane();
  
  training = points[trainingAdalineIndex];
  let inputs = [training.x, training.y, training.bias];

	
  let target = training.label;
  let nn_target = training.nn_target;
  let error;
  
	value = nn.feed_forward(inputs);
	nn.backward_propagate(nn_target);
	nn.update_weights(inputs);

	errorAcumulado += pow(nn.get_error(), 2);

	
	
  trainingAdalineIndex++;

  if (trainingAdalineIndex == points.length) {
    trainingAdalineIndex = 0;
  }


  moduloAdaline++;

  if ((moduloAdaline % points.length) == 0) {
    epocaAdaline++  
	
	errorAcumulado = errorAcumulado/points.length;
    console.log("error en epoca " + epocaAdaline + " es: " + errorAcumulado);

	/* myLineChart.data.datasets[0].data[epocaAdaline] = errorAcumulado;
    myLineChart.data.labels[epocaAdaline] = epocaAdaline;
    myLineChart.update(); */

	
	if(epocaAdaline > epochs || errorAcumulado <= errorDeseado){
	clearInterval(trainingInterval);
    console.log("MLP fue entrenado ");
    alert("MLP fue entrenado.");
	 newClicks = true;
	
	for(let i = 0; i < width; i++){
      for(let j = 0; j < height; j++){
		  
        noStroke();
        rect(i, j, i+1, j+1);
        let x = map(i,  0, width, -1, 1);
        let y = map(j, 0, height, 1, -1);
		
        inputs = [x,y,1];
		
		value = nn.feed_forward(inputs);
		
		a = map(value[0].output, -1, 1, 0, 255);
		b = map(value[1].output, -1, 1, 0, 255);
        c = map(value[2].output, -1, 1, 0, 255);
	
		fill(a,b,c);
		
	  }       
	}	
	}
	
	
	  iterationsAdaline.html(
    `<p>Epoca: ${epocaAdaline}
    </p><p>Learning Rate: ${learningRate}</p>
	</p><p>Error: ${errorAcumulado}</p>
	</p><p>Error: ${errorDeseado}</p>`
  );
	errorAcumulado = 0;
	 
	
  }
  

  for(let i = 0; i < n_numbers[0]; i++){
    let px = new Point(-1, nn.network[0][i].getY(-1));
    let py = new Point(1, nn.network[0][i].getY(1));
		stroke('red');
		strokeWeight(0.3);
		color_counter++;
    line(py.pixelX(), py.pixelY(), px.pixelX(), px.pixelY());

  }
	 for (let point of points) {
        point.show();
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


