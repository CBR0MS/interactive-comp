let poseNet;
let poses = [];

let video;
var videoIsPlaying; 
let left = [];
let right = [];
let points = [];
let initialAlpha = 25;
let FOVheight = 100;
let time;
let show = true;

class FOVedge {

  constructor(_x1, _y1, _x2, _y2) {
    this.x1 = _x1;
    this.x2 = _x2;
    this.y1 = _y1;
    this.y2 = _y2;
  }

  draw(r, g, b, a){
    stroke(r, g, b, a);
    //fill(204, 101, 192, 0);
    //line(this.x1, this.y1, this.x2, this.y2);
    //triangle(this.x1, this.y1, this.x2, this.y2 + 100, this.x2, this.y2 - 100);
  }

  intersects(l2) {
    let denom = ((l2.y2 - l2.y1) * (this.x2 - this.x1) - (l2.x2 - l2.x1) * (this.y2 - this.y1));
    let ua = ((l2.x2 - l2.x1) * (this.y1 - l2.y1) - (l2.y2 - l2.y1) * (this.x1 - l2.x1)) / denom;
    let ub = ((this.x2 - this.x1) * (this.y1 - l2.y1) - (this.y2 - this.y1) * (this.x1 - l2.x1)) / denom;
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;
    let x = this.x1 + ua * (this.x2 - this.x1);
    let y = this.y1 + ua * (this.y2 - this.y1);
    return {x, y};
  }
}

class FOV {
  constructor(x1, y1, x2, y2) {
    this.s1 = new FOVedge(x1, y1, x2, y2 - FOVheight);
    this.s2 = new FOVedge(x1, y1, x2, y2 + FOVheight);
    this.s3 = new FOVedge(x2, y2 + FOVheight, x2, y2 - FOVheight);
    this.col = color(191, 191, 191, initialAlpha); 
    this.show = true;
    // right = 1, left = -1
    if (x2 > x1) {
      this.direction = 1;
    } else {
      this.direction = -1
    }
  }

  checkForIntersections(fov) {
    let intersections = [];
    for (let j = 1; j < 3; j++){
      let sattr = 's' + j.toString();
      for (let i = 1; i < 3; i++) {
        let attr = 's' + i.toString();
        let ints = this[sattr].intersects(fov[attr]);
        if (ints != false) {
          intersections.push(ints);
        }
      }
    }
    if (intersections.length == 2){
      intersections.push({x: this.s1.x1, y: this.s1.y1});
    }
    return intersections;
  }

  fade(){
    this.col.levels[3] = this.col.levels[3] - 3;
    if (this.col.levels[3] < 0) {
      this.show = false;
    }
  } 

  draw() {
    this.s1.draw(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.col.levels[3]);
    this.s2.draw(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.col.levels[3]);
    this.s3.draw(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.col.levels[3]);
  }
}

function setup() {
  videoIsPlaying = false; 
  createCanvas(1280, 720, P2D);
  //createCanvas(1920, 1080);
  video = createVideo('fugazi.mp4', vidLoad);
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
  if (show) {
    image(video, 0, 0, width, height);
  } else {
    background(214, 214, 214);
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
    
      if ((j == 3 || j == 4) && keypoint.score > 0.5) { // left or right ear
        //stroke(255, 0, 0);
        // calclulate average x between nose and eye
        let earX = 0, earY = 0;
        if (pose.keypoints[2].score > 0.5){
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
         //let x2 = (earX + pose.keypoints[0].position.x) / 2;
         //let y2 = (earY + pose.keypoints[0].position.y) / 2;
         let length = Math.sqrt(Math.pow(x1 - x2, 2) + pow(y1 - y2 , 2));
         let newX = x2 + (x2 - x1) / length * 1200;
         let newY = y2 + (y2 - y1) / length * 1200;

         let look = new FOV(x2, y2, newX, newY);

         if (look.direction == -1) {
          let lastR = right.pop();

          if (lastR != undefined){
            let ints = look.checkForIntersections(lastR)
            if (ints.length >= 3) {
              points.push(ints);
            }
            right.push(lastR);
          }
          left.push(look)
         } else {
          let lastL = left.pop();
          if (lastL != undefined) {
            let ints = look.checkForIntersections(lastL)
            if (ints.length >= 3) {
              points.push(ints);
            }
            left.push(lastL);
          }
          look.col =  color(56, 56, 56, initialAlpha); 
          right.push(look)
         }
      }
      fill(0, 0, 100, 2);
      noStroke();
      for (let i = 0; i < points.length; i++) {
        beginShape();
        for (let j = 0; j < points[i].length; j++) {
          vertex(points[i][j].x, points[i][j].y);
        }
        endShape(CLOSE)
      }
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
  time = video.duration();
  video.stop();
  video.loop();
  videoIsPlaying = true;

  setTimeout(function(){ 
    show = false;
    video.stop();
    video.hide();
   }, time * 1000);
}
function keyPressed(){
  if (videoIsPlaying) {

    video.pause();

    videoIsPlaying = false;
  } else {
    video.loop();
    videoIsPlaying = true;
  }
}

