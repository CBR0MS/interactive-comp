// Christian Broms
// Recode- "Interruptions"
// 9.1.18

let refresh = true, lines = [], padding = 20, 
    step_x = 14, step_y = 18, line_length = 27,
    hole_frequency = 0.3, hole_size = 160;

function setup() { createCanvas(720, 720) }

function draw() {

  if (refresh) {

    refresh = false;
    lines = [], clear(); stroke(0);
    noiseSeed(random(0, 100));

    let yoff = 0;
    // generate lines sparsely in the x direction 
    for (let y = padding; y <= height - padding; y += step_y) {

      let xoff = 0;

      for (let x = padding; x <= width - padding; x += (step_x )) {

        // generate line if not in hole 
        if (255 * noise(xoff, yoff) < hole_size) {

          l = generateLine(x, y, lines, 90, 40);
          line(l.x1, l.y1, l.x2, l.y2);
        }

        xoff += hole_frequency;
        } 
      yoff += hole_frequency;
    }

    // // generate remainder of lines and check to ensure they don't overlap in 
    // // the middle of another line
    // let i = 1; yoff = 0;
    // for (let y = padding; y <= height - padding; y += step_y) {

    //   let xoff = 0;

    //   for (let x = padding + step_x; x <= width - padding; x += (step_x * 2)) {

    //     let cont = true, l;

    //     do {
    //       // generate a new line
    //       l = generateLine(x, y, null, 90, 40);
    //       // if the line intersects another in the center, regenerate
    //       if ( i < lines.length-1 && (intersects(l, lines[i - 1]) || intersects(l, lines[i])) ) {
    //         cont = true;
    //       } else { cont = false }

    //     } while(cont)
          
    //     i++; stroke(0, 0, 255);
    //     // draw the new line if it is not in a hole
    //     if (255 * noise(xoff, yoff) < hole_size) line(l.x1, l.y1, l.x2, l.y2);
    //     xoff += hole_frequency;
    //   } 
    //   yoff += hole_frequency;
    // }
  }
}

function mousePressed() { refresh = true; }

// create a new random line 
function generateLine(x, y, lines, g1, g2) {

  // line's direction is based on vector from random gaussian
  // clamped to the std deviation (so lines aren't horizontal or upside down)
  let vec = p5.Vector.fromAngle(radians(randomGaussian(g1, g2).clamp(g1 - g2, g1 + g2)));
  l = {};
  l.x1 = x; l.y1 = y;
  l.x2 = x + (line_length * vec.x);
  l.y2 = y + (line_length * vec.y);

  if (lines != null) lines.push(l);
  return l;

}

// algorithm from Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// adapted from Leo Bottaro's implementation
// calculate intersection point of two lines
function intersects(l1, l2) {

    let denom = ((l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1));

    let ua = ((l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1)) / denom;
    let ub = ((l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1)) / denom;

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;

    let x = l1.x1 + ua * (l1.x2 - l1.x1);
    let y = l1.y1 + ua * (l1.y2 - l1.y1);
    let dist = Math.sqrt(Math.pow(x - l2.x1, 2) + Math.pow(y - l2.y1, 2)); 

    if (dist >= 8 || dist <= 20) return true;
    else return false;
    
}

// clamp function 
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};