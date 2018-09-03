// Christian Broms
// "Intersections"
// 9.1.18

let refresh = true, num_lines = 12, lines = [], line_length = 300;

function setup() { createCanvas(720, 480) }

function draw() {

  if (refresh) {
    refresh = false;
    lines = [], clear(); background(237, 243, 255); 
    
    // generate lines 
    for (let x = 0; x <= num_lines; x++) {

        let l = {};
        l.x1 = random(width); l.y1 = random(height); 
        // create random second point on a circle 
        let angle = random() * Math.PI * 2;
        l.x2 = (Math.cos(angle) * line_length) + l.x1
        l.y2 = (Math.sin(angle) * line_length) + l.y1;
        lines.push(l);
    }

    fill(140, 184, 255); noStroke();

    // check lines for intersection
    for (let x = 0; x <= num_lines; x++) {
        for (let y = 0; y < num_lines; y++) {

            if (y != x){
                let res = intersects(lines[x], lines[y]);
                if (res != false) ellipse(res.x, res.y, 20, 20);
            }
        }
    }

    stroke(0); strokeWeight(2);

    // draw lines 
    for (let x = 0; x <= num_lines; x++) {
        line(lines[x].x1, lines[x].y1, lines[x].x2, lines[x].y2);
    }
    
  }
}

function mousePressed() { refresh = true }

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

    return {x, y};
}