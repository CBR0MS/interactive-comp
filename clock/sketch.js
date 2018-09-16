class Path {
  constructor(radius, speed) {
    this.radius = radius;
    this.speed = speed;
    this.x = 0;
    this.y = 0;
  }
  set xpos(pos) {
    this.x = pos;
  }
  set ypos(pos) {
    this.y = pos;
  }
  get px() {
    let currStep = frameCount % nFramesInLoop;
    let t = map(currStep, 0, nFramesInLoop, 0, PI * 2); 
    return this.x + this.radius * cos(t); 
  }
  get py() {
    let currStep = frameCount % nFramesInLoop;
    let t = map(currStep, 0, nFramesInLoop, 0, PI * 2); 
    return this.y + this.radius * sin(t); 
  }
}


class Blob {
  constructor(centerX, centerY, radius, nodes) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.nodes = nodes;
    // instance vars 
    this.nodeStartX = []; this.nodeStartY = [];
    this.nodeX = []; this.nodeY = [];
    this.angle = []; this.frequency = [];
    this.rotAngle = -90; this.organicConstant = 1;
    this.accelX = 0.0; this.accelY = 0.0;
    this.deltaX = 0.0; this.deltaY = 0.0;
    this.springing = 0.0009; this.damping = 0.98;
    this.col = 0; this.spd = 0.02;
    // initialize all arrays with 0
    for (let i = 0; i < this.nodes; i++){
      this.nodeStartX[i] = 0;
      this.nodeStartY[i] = 0;
      this.nodeY[i] = 0;
      this.nodeY[i] = 0;
      this.angle[i] = 0;
    } 
    // generate random frequency
    for (let i = 0; i < this.nodes; i++){
      this.frequency[i] = random(5, 12);
    }
  }

  drawShape() {
    //  calculate node starting locations
    for (let i = 0; i < this.nodes; i++){
      this.nodeStartX[i] = this.centerX+cos(radians(this.rotAngle)) * this.radius;
      this.nodeStartY[i] = this.centerY+sin(radians(this.rotAngle)) * this.radius;
      this.rotAngle += 360.0/this.nodes;
    }
    // draw polygon
    curveTightness(this.organicConstant);
    fill(this.col);
    beginShape();
    for (let i = 0; i < this.nodes; i++){
      curveVertex(this.nodeX[i], this.nodeY[i]);
    }
    for (let i = 0; i < this.nodes-1; i++){
      curveVertex(this.nodeX[i], this.nodeY[i]);
    }
    endShape(CLOSE);
  }

  moveShape() {
    //move center point
    this.deltaX = mouseX-this.centerX;
    this.deltaY = mouseY-this.centerY;
    // create springing effect
    this.deltaX *= this.springing;
    this.deltaY *= this.springing;
    this.accelX += this.deltaX;
    this.accelY += this.deltaY;
    // move predator's center
    this.centerX += this.accelX * this.spd;
    this.centerY += this.accelY * this.spd;
    // slow down springing
    this.accelX *= this.damping;
    this.accelY *= this.damping;
    // change curve tightness
    this.organicConstant = 1-((abs(this.accelX)+abs(this.accelY))*0.1);
    //move nodes
    for (let i = 0; i < this.nodes; i++){
      this.nodeX[i] = this.nodeStartX[i]+sin(radians(this.angle[i]))*(this.accelX);
      this.nodeY[i] =this. nodeStartY[i]+sin(radians(this.angle[i]))*(this.accelY);
      this.angle[i] += this.frequency[i];
    }
  }
  set color(col) {
    this.col = col;
  }
  set speed(spd) {
    this.spd = spd;
  }
  set spring(spring){
    this.springing = spring;
  }
  set dampen(dampen) {
    this.dampening = dampen;
  }
}

var b;

function setup() {
  createCanvas(800, 800);
  noStroke();
  frameRate(30);
  b = new Blob(width/2, height/2, 45, 30);
  b.color = color(255, 255, 255);
  b.speed = 20;
  b.spring = 0.00002;
}

function draw() {
  //fade background

  fill(0, 100);
  rect(0,0,width, height);
  b.drawShape();
  b.moveShape();
}
