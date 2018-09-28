// real time (not based on game)
let realMS, realS, realM, realH; 
// game time (based on game performance)
let gameS, gameM, gameH; 
// previous logged times 
let p_realS, p_realM, p_realH; 
// how often the times appear [0-999]
const timeFreqInit = 999;
let timeFreq = timeFreqInit, timeFreqInc = 20;
// assorted global vars 
const deflectorSpeed = 15, timeSpeed = -10;
const dispTimeY = 80;

let deflector, time = 0;
let times = [], score = 1, dispScore = 0, highScore = 0;
let font, fSize = 60, fillCol, backCol;
let millisRolloverTime = 0; 

function preload() {
  font = loadFont('digital-7.ttf');
}

function setup() {
  score = 1;
  createCanvas(600, 750, P2D);
  textFont(font);
  textSize(fSize);
  updateRealTime();
  // to start, game time is the same as real time
  gameS = realS;
  gameM = realM;
  gameH = realH;
  // if it's AM, color green, otherwise red 
  setAmPmCol();
  // paddle 
  deflector = new Deflector(10, 100, width/2, height/4);
}

function draw(){
  wakeup();
  setAmPmCol();
  fill(fillCol);
  textSize(fSize);
  background(backCol);
  updateRealTime();
  drawGameTime();
  // every time theres a new second...
  if (p_realS != realS){
    millisRolloverTime = millis();
    p_realS = realS;
  }
  realMS = floor(millis() - millisRolloverTime);
  // add a new time based off freq
  if (realMS % timeFreq == 0) {
    time++;
    let expanded = secondsToMin(time);
    let temp = {s: expanded.s, m: expanded.m, h: realH, disp: expanded.s};
    times.push(new Time(temp, random(30, width - 30), height));
  }
  
  for (let i in times) {
    if (times[i].offscreen()){
      // remove offscreen times
      times.splice(i, 1);
    }
    if (times[i].intersects(deflector)){
      // remove times after hitting paddle
      times[i].bounceMove(random(-10,10), random(6, 12));
      if (score > highScore) { highScore = score }
    } 
    if (times[i].escaped() && !times[i].t.used){

      // if the time made it past the paddle
      times[i].t.used = true;

      if (-score <= 0){
        let res = addToTime(gameS, gameM, gameH, times[i].t.s, times[i].t.m);
        gameS = res.s;
        gameM = res.m;
        gameH = res.h;
      }
      // measure the diff between real and game time to get score
      let d1 = new Date(2018, 9, 20, gameH, gameM, gameS);
      let d2 = new Date(2018, 9, 20, realH, realM, realS);
      let d = d2.getTime() - d1.getTime()
      // if (realS - gameS > 0) {
      //   console.log(realS - gameS);
      //   score = d /1000;
      // }
      // else {score = realS - gameS}
      score = 0;
      time = 0;
      timeFreq = timeFreqInit;
    }
    if (times[i].goingUp) {
      // move the times up by speed
      times[i].move(timeSpeed);
    }
    times[i].update();
    times[i].draw();
  }
  deflector.update();
  deflector.draw();
  drawScore();
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
  realH = hour() % 12;
}

function wakeup(){
  // when leaving the page, animation stops but times goes on
  // this fixes that!
  if (score <= -7){
    setup();
    // gameS = realS;
    // gameM = realM;
    // gameH = realH;
    // score = 1;
    for(let i in times){
       times.pop();
     }
  }
 
}

function drawGameTime() {
  textAlign(CENTER);
  text(gameH, width/4, dispTimeY);
  text(":", width/8 * 3, dispTimeY)
  text(gameM, width/4 * 2, dispTimeY);
  text(":", width/8 * 5, dispTimeY)
  text(gameS, width/4 * 3, dispTimeY);
}

function drawScore() {
  textSize(25);
  textAlign(CENTER);
  let res = secondsToMin(score);
  let disp, pos = "";
  if (score < 0) {pos = "+"}
  // check if we need to display minutes
  if (res.m > 0) {disp = pos + (-1 * res.m) + ":" + res.s}
  else {disp = pos + (-1 * res.s)}
  text(disp, width - 80, 80);
  textSize(12);
  //text("s", width - 150, height- 20);
  textSize(25);
  text("Max:  " + highScore, width - 75, height - 20);
  textSize(12);
  text("s", width - 30, height- 20);
}

function secondsToMin(sec) {
  let secRl = sec % 60;
  let minRl = Math.floor(sec / 60);
  return {s: secRl, m: minRl};
}

function addToTime(pS, pM, pH, s, m) {
  // add seconds and minutes new seconds and minutes
  let fixedS = pS + s, fixedM = pM + m, fixedH = pH;
  // case check for if any go over 60 
  if (fixedS >= 60) { 
    let res = secondsToMin(fixedS);
    fixedS = res.s;
    fixedM += res.m;
  }
  if (fixedM >= 60){
    // we can use the same function for mins + hrs
    let res = secondsToMin(fixedM);
    fixedM = res.s;
    fixedH += res.m;
  }
  if (fixedH > 12){
    // kinda hacky but really unlikely to happen
    fixedH = hour() % 12;
  }
  return {h: fixedH, m: fixedM, s: fixedS}
}

function setAmPmCol() {
  if (hour() > 12) {fillCol = color(205, 0, 0); backCol = color(20, 0, 0)}
  else { fillCol = color(0, 205, 0); backCol = color(0, 20, 0) }
}

// the 'paddle' that used to hit the numbers
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
    textAlign(CENTER);
    textSize(70);
    text("___", this.x, this.y);
    textSize(fSize); 
  }
}

// the numbers that appear
class Time {
  constructor(t_, x_, y_) {
    this.t = t_;
    this.x = x_;
    this.y = y_;
    this.deltaY = 0;
    this.deltaX = 0;
    this.goingUp = true;
    this.col = color(fillCol.levels[0], fillCol.levels[1], fillCol.levels[2]);
    this.used = false;
  }
  update() {
    this.y += this.deltaY;
    this.x += this.deltaX;
  }
  move(steps) { 
     this.deltaY = steps;
  }
  bounceMove(stepX, stepY){
    this.deltaX = stepX;
    this.deltaY = stepY;
  }
  escaped(){
    if (this.y < height/4) { return true }
    else {rern false}
  }

  intersects(deflector) { 
    // from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (deflector.x < this.x + 50 &&
        deflector.x + deflector.width > this.x + 40 &&
        deflector.y < this.y + 10 &&
        deflector.y + deflector.height > this.y - 40) {
      if (this.goingUp) {
        // if the time hits the deflector...
        score++; 
        if (score > 0 && timeFreq >= 750){
          timeFreq -= timeFreqInc;
        }
        
      }
      this.goingUp = false;
      this.t.disp = '#'
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
    if (this.escaped()){
      let a = this.col.levels[3];
      this.col.setAlpha(a - 15);
      fill(this.col);
      text(this.t.disp, this.x, this.y);
    } else {
      fill(fillCol);
      text(this.t.disp, this.x, this.y);
    
    }
    
  }
}