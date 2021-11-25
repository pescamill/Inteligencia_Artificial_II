 function f(x){
    return (1 / (1+Math.exp(-x)));
 }
 
 function transfer_derivative(output){
	return output * (1.0 - output);
}
 
class NN {
	constructor(n_hidden, n_outputs, n_inputs, n_neurons, learningRate){
	this.network = [];
	this.n_hidden = n_hidden;
	this.n_neurons = n_neurons;
	this.learningRate = learningRate;
	
	let hidden_layer = [];

	for (let i = 0; i < n_hidden; i++) {
		for(let j=0; j < n_neurons[i]; j++){	
			if(i > 0)
				hidden_layer.push(new Adaline(n_neurons[i-1], learningRate))
			else
				hidden_layer.push(new Adaline(n_inputs, learningRate))
		}
		this.network.push(hidden_layer);
		hidden_layer = [];
	}

	let output_layer = [];
	for(let j=0; j < n_outputs; j++){
		output_layer.push(new Adaline(n_neurons[n_neurons.length - 1], learningRate))
	}

	this.network.push(output_layer)
	}
	


feed_forward(outputs){
	
	let next_outputs = outputs;

	for (let i=0; i < this.network.length; i++){
	
	
	if(i ==	0){
		for (let j=0; j < this.network[i].length; j++){
			this.network[i][j].activate_neuron(next_outputs);
			next_outputs.push(this.network[i][j].output);
		}
	} else{
		next_outputs = [];
		for (let j=0; j < this.network[i].length; j++){
			next_outputs.push(this.network[i][j].output);
		}
	}
	
	   
	if(i+1 < this.network.length)
	for (let j=0; j < this.network[i+1].length; j++){
		this.network[i+1][j].activate_neuron(next_outputs);
	}
		
	}
	
	return this.network[this.network.length-1];
	
}

get_error(){
	errorAcumulado = 0;
	
	for(let i = 0; i < 2; i++){
	errorAcumulado += nn.network[nn.network.length-1][i].error
	
	}
	return errorAcumulado;
}


backward_propagate(expected){
	
	let deltas = [];
	let weights = [];
		
	for(let i = this.n_hidden; i >= 0; i--){
		
		deltas = [];
		
		if(i == this.n_hidden){
			for(let j = 0; j < this.network[i].length; j++){
				this.network[i][j].first_delta(expected[j]);
				deltas.push(this.network[i][j].delta);
			}
		} else{
			for(let j = 0; j < this.network[i].length; j++){
				deltas.push(this.network[i][j].delta);
			}
		}
		
		if(i - 1 >= 0)	
			for(let j = 0; j < this.network[i-1].length; j++){
				weights = [];
				for(let k = 0; k < this.network[i].length; k++){
					weights.push(this.network[i][k].weights[j]);
				}
			
				this.network[i-1][j].get_delta(deltas, weights);
			}
		}
}

update_weights(inputs){
	
	let new_inputs = inputs;
	
	for (let i = 0; i < this.network.length; i++) {
	for(let j=0; j < this.network[i].length; j++){	
			this.network[i][j].update(new_inputs);
		}		
	new_inputs = [];
	for(let j=0; j < this.n_neurons[i]; j++){
		new_inputs.push(this.network[i][j].output);
	}
	}
	
	
}
		
	
			



}
