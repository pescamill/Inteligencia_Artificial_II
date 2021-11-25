function activationFn(input) {
  return input >= 0 ? 1 : -1;
}

  function f(x){
    return (1 / (1+Math.exp(-x)));
 }
 
function transfer_derivative(output){
	return output * (1 - output);
}

  class Adaline {
    constructor(n, learningRate) {
      this.weights = [];
	  this.prev_g = [];
	  this.prev_s = [];
      this.learningRate = learningRate;
      this.error = 0.0;
      this.errorAcumulado = 0;
      this.iterations = 0;
      this.correctGuesses = 0;
	  this.output = 0.0;
	  this.net_input = 0.0;
	  this.guess = 0.0;
	  this.delta = 0.0;
      for (let i = 0; i < n; i++) {
        this.weights.push(random(-1, 1));
		this.prev_s.push(0.001);
		this.prev_g.push(1);

      }
    }

    set islearningRate(learningRate){
      this.learningRate = learningRate;
    }

    multWX(inputs) {
      let weightedSum = 0;
      for (let i in this.weights) {
        weightedSum += inputs[i] * this.weights[i];
      }
      return weightedSum;
    }

	
	
	activate_neuron(new_outputs){
	
		let outputSum = -1;
	
		for(let i = 0; i < this.weights.length; i++){
			outputSum += (new_outputs[i] * this.weights[i]);
		}
		
		this.net_input = outputSum;
		this.output = f(outputSum);

		return this.output;
	}
	
	
	
	first_delta(target){	
		this.error = (target - this.output);
		this.delta = (-2*(f(this.net_input) * (1-f(this.net_input))) * (target - this.output));
	
		return this.delta;
	}
	
	get_delta(p_delta, d_weights){
	
		let weightedSum = 0;
		
		for(let i = 0; i < p_delta.length; i++){
			weightedSum += (f(this.net_input) * (1-f(this.net_input)) * (d_weights[i]) * p_delta[i]);
		}
	
		this.delta = weightedSum;
		
	}
	
	update(m_inputs){

	let g = 0;
		
	   for(let i = 0; i < this.weights.length; i++){
		    
		let s = this.delta * m_inputs[i];	// Error cuadrático
		
		let difference = this.prev_s[i] - s; // Diferencia entre error anterior y actual
		if (difference == 0)
			difference = 0.01;

		let temp = (s/difference) * this.prev_g[i];	// Cálculo del aproximado de la segunda derivada del error cuadrático
		
		if(temp > (this.learningRate * this.prev_g[i]) ){	
			temp = -(this.learningRate * this.prev_g[i]);	// Guardar en Temp si el anterior cambio de peso es mejor
		}
		
		if((this.prev_s[i] * s) < 0){
			g = temp;								// Cambio de peso es igual a segunda derivada si el producto entre las sensibilidades es menor a 9
		} else {
			g = temp + -(this.learningRate * s);		// Cambio de peso es igual a segunda derivada por la sensibilidad actual si el producto entre las sensibilidades es mayor a 0
		}
		
		this.prev_s[i] = s;		// Guardamos la sensibilidad actual para anterior
		this.prev_g[i] = g;		// Guardamos el cambio de peso actual para anterior
	
		this.weights[i] += g;	// Actualizamos el peso
	
	   } 
  
	}

    getSigma(inputs){
      let guess = this.multWX(inputs);
      return guess;
    }
	

    getY(x) {
      let w0 = this.weights[0];
      let w1 = this.weights[1];
      let w2 = this.weights[2];

      return -w2 / w1 - (w0 / w1) * x;
    }


  }
