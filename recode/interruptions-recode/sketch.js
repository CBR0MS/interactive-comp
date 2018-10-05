// Christian Broms
// Recode- Vera Molnár's "Interruptions"
// 9.1.18

let refresh = true, padding = 25, 
    step_x = 13, step_y = 16, line_length = 24,
    hole_frequency = 0.34, hole_size = 165;

function setup() { createCanvas(720, 720);  strokeWeight(1.2); }

function draw() {

  if (refresh) {
    refresh = false;
    background(255);
    noiseSeed(random(0, 100));
    let yoff = 0;
    for (let y = padding; y <= height - padding; y += step_y) {
      let xoff = 0;
      for (let x = padding; x <= width - padding; x += step_x ) {
        if (255 * noise(xoff, yoff) < hole_size) {
          let vec = p5.Vector.fromAngle(radians(randomGaussian(90, 36))), l = {};
          l.x2 = x + ((line_length / 2) * vec.x);
          l.y2 = y + ((line_length / 2)* vec.y);
          l.x1 = (2 * x) - l.x2;
          l.y1 = (2 * y) - l.y2;
          line(l.x1, l.y1, l.x2, l.y2);
        }
        xoff += hole_frequency;
      } 
      yoff += hole_frequency;
    }
  }
}

function mousePressed() { refresh = true }