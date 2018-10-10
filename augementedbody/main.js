let poseNet;
let poses = [];

let video;
var videoIsPlaying; 
let left = [];
let right = [];

class Look {

  constructor(_x1, _y1, _x2, _y2) {
    this.x1 = _x1;
    this.x2 = _x2;
    this.y1 = _y1;
    this.y2 = _y2;
    this.col = color(255, 0, 0, 255); 
    // right = 1, left = -1
    if (this.x2 > this.x1) {
      this.direction = 1;
    } else {
      this.direction = -1
    }
    this.show = true;
  }

  fade(){
    this.col.levels[3] = this.col.levels[3] - 1;
    if (this.col.levels[3] < 0) {
      this.show = false;
    }
  } 
  draw(){
    stroke(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.col.levels[3] );
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

function setup() {
  videoIsPlaying = false; 
  //createCanvas(1280, 720);
 createCanvas(1920, 1080);
  video = createVideo('milkshake.mp4', vidLoad);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  vidLoad();
}

function draw() {
  image(video, 0, 0, width, height);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
 // drawSkeleton();
}
// poses[0].pose.keypoints['nose']
// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  //console.log()
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < 5; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
    
      if ((j == 3 || j == 4) && keypoint.score > 0.7) { // left or right ear
        //stroke(255, 0, 0);
        // calclulate average x between nose and eye
        let earX = 0, earY = 0;
        if (pose.keypoints[2].score > 0.4){
          earX = pose.keypoints[2].position.x;
          earY = pose.keypoints[2].position.y;
        } else {
          earX = pose.keypoints[1].position.x;
          earY = pose.keypoints[1].position.y;
        }
         //pose.keypoints[1].position.x
         let x1 = keypoint.position.x
         let y1 = keypoint.position.y
         let x2 = earX;
         let y2 = earY;
         let length = Math.sqrt(Math.pow(x1 - x2, 2) + pow(y1 - y2 , 2));
         let newX = x2 + (x2 - x1) / length * 400;
         let newY = y2 + (y2 - y1) / length * 400;

         let look = new Look(x2, y2, newX, newY);
         if (look.direction == -1) {
          left.push(look)
         } else {
          look.col =  color(0, 255, 0, 255); 
          right.push(look)
         }
         //line(keypoint.position.x, keypoint.position.y, newX, newY);
      }
      // if (keypoint.score > 0.2) {
      //   noStroke();
      //   //if (i == 0) { fill(255, 0, 0);}
      //  // else {fill(0, 255, 0)}
      //   fill(255, 0, 0);
      //   ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      // }
      for (let i = 0; i < left.length; i++) {
        left[i].draw();
        left[i].fade();
        if (!left[i].show) {
          left.splice(i, 1);
        }
        
      }
      for (let i = 0; i < right.length; i++) {
        right[i].draw();
        right[i].fade();
        if (!right[i].show) {
          right.splice(i, 1);
        }
        
      }
    }
  }
}


// This function is called when the video loads
function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}


function keyPressed(){
  if (videoIsPlaying) {
    video.pause();
    drawGraph();
    videoIsPlaying = false;
  } else {
    video.loop();
    videoIsPlaying = true;
  }
}

