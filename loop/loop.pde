// This is a template for creating a looping animation in Processing/Java. 
// When you press the 'F' key, this program will export a series of images
// into a "frames" directory located in its sketch folder. 
// These can then be combined into an animated gif. 
// Known to work with Processing 3.3.6
// Prof. Golan Levin, January 2018

//===================================================
// Global variables. 
String  myNickname = "nickname"; 
int     nFramesInLoop = 260;
int     nElapsedFrames;
boolean bRecording; 



//===================================================
void setup() {
  size (640, 640, P3D); 
  bRecording = false;
  nElapsedFrames = 0;
  frameRate(40);
}
//===================================================
void keyPressed() {
  if ((key == 'f') || (key == 'F')) {
    bRecording = true;
    nElapsedFrames = 0;
  }
}

//===================================================
void draw() {
  
 
  // Compute a percentage (0...1) representing where we are in the loop.
  float percentCompleteFraction = 0; 
  if (bRecording) {
    percentCompleteFraction = (float) nElapsedFrames / (float)nFramesInLoop;
  } else {
    percentCompleteFraction = (float) (frameCount % nFramesInLoop) / (float)nFramesInLoop;
  }

  // Render the design, based on that percentage. 
  renderMyDesign (percentCompleteFraction);

  // If we're recording the output, save the frame to a file. 
  if (bRecording) {
    saveFrame("frames/" + myNickname + "_frame_" + nf(nElapsedFrames, 4) + ".png");
    nElapsedFrames++; 
    if (nElapsedFrames >= nFramesInLoop) {
      bRecording = false;
    }
  }
}

//===================================================
void renderMyDesign (float percent) {

  smooth(); 
  int roundedPercent = round(percent * 100);
  pushMatrix();
  if (roundedPercent >= 0 && roundedPercent <= 33){
      background(201, 197, 209);
      noStroke();
      float eased = function_DoubleExponentialSigmoid(map(percent, 0, 0.34, 0, 1), 0.8);
      
      fill(112, 88, 124);
      triangle(0, height, width, height, width/2, map(eased, 0, 1, height, height/2 ));
      fill( 57, 43, 88);
      triangle(0, 0, 0, height, width/2 * map(eased, 0, 1, 0, 1), height/2);
      fill(45, 3, 32);
      triangle(0, 0, width, 0, width/2, height/2 * map(eased, 0, 1, 0, 1));
      fill(108, 150, 157);
      triangle(width, 0, width, height, map(eased, 0, 1, width, width/2), height/2); 
      
      float rectWidth = map(eased, 0, 1, width, 0);
      float rectHeight = map(eased, 0,1, height, 0);
      fill(219, 216, 224);
      rect((width- rectWidth)/2, (height - rectHeight)/2, rectWidth, rectHeight);

  } else if (roundedPercent > 33 && roundedPercent <= 66){
  pushMatrix();
  translate(width/2, height/2, 0);
  ortho(-width/2, width/2, -height/2, height/2);

  float eased = function_DoubleExponentialSigmoid(map(percent, 0.33, 0.67, 0, 1), 0.9); 
  rotateX(PI/map(eased, 0, 1, 1200, 2)); 
  rotateZ(PI/map(eased, 0, 1, 1200, 2));
  background(201, 197, 209);
  
  fill(45, 3, 32);
  beginShape();
  scale(map(percent, 0.33, 0.66, 3.6, 1.8), map(percent, 0.33, 0.66, 3.6, 1.8), map(percent, 0.33, 0.66, 3.6, 1.8));
  vertex(-100, -100, -100);
  vertex( 100, -100, -100);
  vertex(   0,    0,  100);
  endShape();
  fill(108, 150, 157);
  beginShape();
  vertex( 100, -100, -100);
  vertex( 100,  100, -100);
  vertex(   0,    0,  100);
  endShape();
  fill(112, 88, 124);
  beginShape();
  vertex( 100, 100, -100);
  vertex(-100, 100, -100);
  vertex(   0,   0,  100);
  endShape();
  fill( 57, 43, 88);
  beginShape();
  vertex(-100,  100, -100);
  vertex(-100, -100, -100);
  vertex(   0,    0,  100);
  endShape();
  popMatrix();
  
} else if (roundedPercent > 66) {
  
 // translate(width/2, height/2, 0);
 // ortho(-width/2, width/2, -height/2, height/2);
  
  float eased = function_DoubleExponentialSigmoid(map(percent, 0.66, 1, 0, 1), 0.9);
  color start = color(108, 150, 157);
  color end = color(102, 71, 92);
  color lerpedCol = lerpColor(start, end, eased);
  
  if (roundedPercent < 83){
    background(201, 197, 209);
    //rotateX(PI/2); 
   // rotateZ(PI/2);
   fill(lerpedCol);
   translate(0,0);
   triangle(map(eased, 0, 1, 140, -140), map(eased, 0, 1, 500, 700), 
            map(eased, 0, 1, 500, 700), map(eased, 0, 1, 500, 700), 
            map(eased, 0, 1, 320, 320), map(eased, 0, 1, 140, -140));
   

  }
  else {
    float eased2 = function_DoubleExponentialSigmoid(map(percent, 0.82, 1, 0, 1), 0.5);
    background(lerpedCol);
    float rectWidth = map(eased2, 0, 1, 0, width);
    float rectHeight = map(eased2, 0, 1, 0, height);
    fill(219, 216, 224);
    rect((width- rectWidth)/2, (height - rectHeight)/2, rectWidth, rectHeight);
  }
}
  popMatrix();
  pushMatrix();
  renderBall(percent, roundedPercent);
  popMatrix();

}

void renderBall(float percent, int roundedPercent) {

    if (roundedPercent <= 25){
    // ball moves towards bottom, larger
    float x = lerp(width/2, width/2 + 100, map(percent, 0, 0.25, 0, 1));
    float y = lerp(height/2, height - 200, map(percent, 0, 0.25, 0, 1));
    float scale = lerp(5, 75, map(percent, 0, 0.25, 0, 1));
    translate(x, y, 400);
    fill(map(scale, 75, 5, 255,50));
    sphere(scale);
    
  } else if (roundedPercent > 20 && roundedPercent <= 55) {
    // ball moves towards center, smaller
    float x = lerp(width/2 + 100, width/2, map(percent, 0.2, 0.55, 0, 1));
    float y = lerp(height - 200, height/2, map(percent, 0.2, 0.55, 0, 1));
    float scale = lerp(75, 2, map(percent, 0.2, 0.55, 0, 1));
    translate(x, y, 400);
    fill(map(scale, 75, 5, 255, 50));
    sphere(scale);
    
  } else if (roundedPercent > 55 && roundedPercent <= 60) {
    // ball moves to side 
    float x = lerp(width/2, 15, map(percent, 0.55, 0.6, 0, 1));
    float y = lerp(height/2, height/2, map(percent, 0.55, 0.6, 0, 1));
    float scale = lerp(5, 25, map(percent, 0.55, 0.6, 0, 1));
    translate(x, y, 400);
    fill(map(scale, 75, 5, 255, 50));
    sphere(scale);
  } else if (roundedPercent > 60 && roundedPercent <= 66) {
    // ball goes right 
    float x = lerp(15, width/4, map(percent, 0.6, 0.66, 0, 1));
    float y = lerp(height/2, height/3 * 2, map(percent, 0.6, 0.66, 0, 1));
    //float scale = lerp(5, 25, map(percent, 0.6, 0.6, 0.66, 1));
    translate(x, y, 400);
    fill(map(25, 75, 5, 255, 50));
    sphere(25);
    
  } else if (roundedPercent > 66 && roundedPercent <= 85) {
    
    float x = lerp(width/4, width/2, map(percent, 0.6, 0.85, 0, 1));
    float y = lerp(height/3 * 2, height/2,  map(percent, 0.6, 0.85, 0, 1));
    float easedx = function_DoubleExponentialSigmoid(map(x, width/4, width/2, 0, 1), 0.7);
    float easedy = function_DoubleExponentialSigmoid(map(y, height/3 * 2, height/2, 0, 1), 0.7);
    float scale = lerp(25, 15, map(percent, 0.66, 0.85, 0, 1));
    translate(map(easedx, 0, 1, width/4, width/2), map(easedy, 0, 1, height/3 * 2, height/2), 400);
    fill(map(scale, 75, 5, 255, 50));
    sphere(scale);
    
  } else if (roundedPercent > 85 && roundedPercent <= 100) {
    // ball gets larger 
    float scale = lerp(15, 5, map(percent, 0.85, 1, 0, 1));
    translate(width/2, height/2, 400);
    fill(map(scale, 75, 5, 255, 50));
    sphere(scale);
  }
}



//===================================================
// Taken from https://github.com/golanlevin/Pattern_Master
float function_DoubleExponentialSigmoid (float x, float a) {
  // functionName = "Double-Exponential Sigmoid";

  float min_param_a = 0.0 + EPSILON;
  float max_param_a = 1.0 - EPSILON;
  a = constrain(a, min_param_a, max_param_a); 
  a = 1-a;

  float y = 0;
  if (x<=0.5) {
    y = (pow(2.0*x, 1.0/a))/2.0;
  } else {
    y = 1.0 - (pow(2.0*(1.0-x), 1.0/a))/2.0;
  }
  return y;
}