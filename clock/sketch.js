// real time (not based on game)
let realS, realM, realH; 
// game time (based on game performance)
let gameS, gameM, gameH; 
let p_realS, p_realM, p_realH; 
// assorted global vars 
let bufferTime = 6, frequency = 1;
let deflector, deflectorSpeed = 15, timeSpeed = -10;
let dispTimeY = 80;
let times = [];

let font;

function preload() {
  font = loadFont('digital-7.ttf');
}

function setup() {
  createCanvas(600, 800, P2D);
  textFont(font);
  textSize(65);
  deflector = new Deflector(10, 100, width/2, height/4);
  t1 = new Time(3, width/4, height);
  updateRealTime();
  // to start, game time is the same as real time
  gameS = realS;
  gameM = realM;
  gameH = realH;
}

function draw(){
  fill(205, 0, 0);
  background(20, 0, 0);
  updateRealTime();
  drawGameTime();

  if (p_realS != realS){
    p_realS = realS;
    times.push(new Time(realS, random(30, width - 30), height));
  }
  for (let i in times) {
    if (times[i].offscreen()){
      // remove offscreen times
      times.splice(i, 1);
    }
    if (times[i].intersects(deflector)){
      // remove intersecting times
      times[i].bounceMove(random(-10,10), random(6, 12));
    } 
    if (times[i].goingUp) {
      times[i].move(timeSpeed);
    }
    times[i].update();
    times[i].draw();
  }

  deflector.update();
  deflector.draw();
}

function keyReleased() { 
  if (keyIsDown(RIGHT_ARROW)) { deflector.move(deflectorSpeed) }
  else if (keyIsDown(LEFT_ARROW)) { deflector.move(-deflectorSpeed) }
  else { deflector.move(0) }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW){ deflector.move(-deflectorSpeed)} 
  if (keyCode == RIGHT_ARROW){ deflector.move(deflectorSpeed)} 
}

function updateRealTime() {
  realS = second();
  realM = minute();
  realH = hour();
}

function drawGameTime() {
  textAlign(CENTER);
  text(gameH, width/4, dispTimeY);
  text(":", width/8 * 3, dispTimeY)
  text(gameM, width/4 * 2, dispTimeY);
  text(":", width/8 * 5, dispTimeY)
  text(gameS, width/4 * 3, dispTimeY);
}

class Deflector {
  constructor(h_, w_, x_, y_){
    this.height = h_;
    this.width = w_;
    this.x = x_;
    this.y = y_;
    this.deltaX = 0;
  }
  update() {
    this.x += this.deltaX;
    this.x = constrain(this.x, this.width/2, width - this.width/2);
  }
  move(steps) { this.deltaX = steps }

  draw() {
    //rectMode(CENTER);
    textAlign(CENTER);
    //rect(this.x, this.y, this.width, this.height);
    textSize(70);
    text("___", this.x, this.y);
    textSize(65); 
  }
}

class Time {
  constructor(t_, x_, y_) {
    this.t = t_;
    this.x = x_;
    this.y = y_;
    this.deltaY = 0;
    this.deltaX = 0;
    this.goingUp = true;
  }
  update() {
    this.y += this.deltaY;
    this.x += this.deltaX;
  }
  move(steps) { 
     this.deltaY = steps;
     //if (this.y > height/4)
    //else this.deltaY = map(this.y, height/4, dispTimeY, );
  }
  bounceMove(stepX, stepY){
    this.deltaX = stepX;
    this.deltaY = stepY;
  }

  intersects(deflector) { 
    // from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (deflector.x < this.x + 50 &&
        deflector.x + deflector.width > this.x + 40 &&
        deflector.y < this.y + 10 &&
        deflector.y + deflector.height > this.y - 40) {
      this.goingUp = false;
      this.t = '#'
      return true;
    }
    return false;
  }

  offscreen() {
    if (this.y < -40 || this.y > height + 40) return true;
    else return false;
  }

  draw() {
    textAlign(CENTER);
    text(this.t, this.x, this.y);
  }
}