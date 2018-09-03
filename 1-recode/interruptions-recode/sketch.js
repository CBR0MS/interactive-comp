// Christian Broms
// Recode- "Interruptions"
// 9.1.18

let refresh = true, lines = [], padding = 15, 
    step_x = 9, step_y = 18, line_length = 25;

function setup() {
    createCanvas(720, 720);
}

function draw() {

  if (refresh) {
    refresh = false;
    lines = [], clear();

    for (let x = padding; x <= width - padding; x += step_x) {
        for (let y = padding; y <= height - padding; y += step_y) {

            stroke(0);

            let vec = p5.Vector.fromAngle(radians(randomGaussian(80, 30)));
     
            line(x, y, x + (line_length * vec.x), y + (line_length * vec.y));
            
           // let angle = Math.random() * Math.PI;
          //  let xr = Math.cos(angle) * 25;
           // let yr = Math.sin(angle) * 25;

           
           // line(x, y, xr + x, yr + y);
        } 
    }


  }
}

function mousePressed() { refresh = true; }
