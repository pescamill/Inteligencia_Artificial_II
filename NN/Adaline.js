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
		
		this.error = (target - this.output)
		this.delta = (-2*(f(this.net_input) * (1-f(this.net_input))) * (target - this.output))
	
		return this.delta;
		
	}
	
	get_delta(p_delta, d_weights){
	
		let weightedSum = 0;
		
		for(let i = 0; i < p_delta.length; i++){
			weightedSum += (f(this.net_input) * (1-f(this.net_input)) * (d_weights[i]) * p_delta[i])
		}
	
		this.delta = weightedSum;
		
	}
	
	update(m_inputs){
	 
	   for(let i = 0; i < this.weights.length; i++){
		 this.weights[i] += -(this.learningRate * this.delta * (m_inputs[i]));
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
