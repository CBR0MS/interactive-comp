// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// PoseNet with a pre-recorded video, modified from:
// https://github.com/ml5js/ml5-examples/blob/master/p5js/PoseNet/sketch.js

let poseNet;
let poses = [];
let skeleton1_x = [];
let skeleton1_y = [];

let video;
var videoIsPlaying; 

function setup() {
  videoIsPlaying = false; 
  createCanvas(1280, 720);
 //createCanvas(1920, 1080);
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
  if (poses.length > 1) {
    let x = poses[0].pose.keypoints[0].position.x
    let y = poses[0].pose.keypoints[0].position.y
    let prev_x = skeleton1_x.pop()
    let prev_y = skeleton1_y.pop()
    if (Math.abs(prev_x) + 75 < Math.abs(x)) {
      skeleton1_x.push(prev_x);
      skeleton1_y.push(prev_y);
      skeleton1_x.push(poses[1].pose.keypoints[0].position.x)
      skeleton1_y.push(poses[1].pose.keypoints[0].position.y)
    } else {
      skeleton1_x.push(prev_x);
      skeleton1_y.push(prev_y);
       skeleton1_x.push(x);
       skeleton1_y.push(y);
    }
  }
  
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
        stroke(255, 0, 0);
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
         let x2 = (earX + pose.keypoints[0].position.x) / 2
         let y2 = (earY + pose.keypoints[0].position.y) / 2
         let length = Math.sqrt(Math.pow(x1 - x2, 2) + pow(y1 - y2 , 2));
         let newX = x2 + (x2 - x1) / length * 400;
         let newY = y2 + (y2 - y1) / length * 400;
        line(keypoint.position.x, keypoint.position.y, newX, newY);
      }
      if (keypoint.score > 0.2) {
        noStroke();
        //if (i == 0) { fill(255, 0, 0);}
       // else {fill(0, 255, 0)}
        fill(255, 0, 0);
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// // A function to draw the skeletons
// function drawSkeleton() {
//   for (let i = 0; i < poses.length; i++) {
//     let skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j++) {
//       // this draws the connection 
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
//     }
//   }
// }


// This function is called when the video loads
function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}

function drawGraph(){
  var trace = {
    x: skeleton1_x,
    y: skeleton1_y,
  mode: 'lines',
  name: 'Lines'
};
var data = [ trace ];

var layout = {
  title:'X, Y'
};

Plotly.newPlot('plot', data, layout);

console.log(skeleton1_y)
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