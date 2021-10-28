

class Point {
  constructor(x_, y_, value_) {
    this.x = x_ || random(-1, 1);
    this.y = y_ || random(-1, 1);
	this.bias = 1;
    this.predicted = false;
    this.prediction = 0;
    this.adalinePrediction = 0;
    this.label = value_;
	if(value_ == 0){
	this.nn_target =[1,0,0];
	}else if(value_ == 1){
	this.nn_target =[0,1,0];	
	}else if(value_ == 2){
	this.nn_target =[0,0,1];	
	}
	
    this.valueAdaline = 0;
  }

  set isPredicted(predicted){
    this.predicted = predicted;
  }

  set isvalueAdaline(valueAdaline){
    this.valueAdaline = valueAdaline;
  }

  pixelX() {
    return map(this.x, -1, 1, 0, width);
  }

  pixelY() {
    return map(this.y, -1, 1, height, 0);
  }

  show() {
    stroke(0);
    fill(0);

    if (this.label == 0) {
      fill(0, 0, 255);
    } 
    else if(this.label == 1){
      fill(255, 0, 0);
    } else if (this.label == 2){
      fill(0, 255, 0);
    }

    let px = this.pixelX();
    let py = this.pixelY();
    ellipse(px, py, 5, 5);
  }

  showAdaline(){
    stroke(0);
    fill(0);

    let c = map(this.valueAdaline, 2, 0, 100, 255);
    let d = map(-this.valueAdaline, 2, 0, 100, 255);

    if (this.valueAdaline >= 0) {
      stroke(0);
      fill(0, c, 255);
    } else {
      stroke(0);
      fill(255, d, 0);
    }

    let px = this.pixelX();
    let py = this.pixelY();

    ellipse(px, py, 8, 8);
  }
}
