// Christian Broms
// "Embedded Iteration + Randomness"
// 9.1.18

let refresh = true, box_width = 40, box_padding = 10;

function setup() {
    createCanvas(400, 400); background(255); noStroke(); 
}

function draw() {

  if (refresh) {
    refresh = false;
    clear();
    
    for (let x = 5; x <= width - box_width; x += (box_width + box_padding)) {
        for (let y = 5; y <= height - box_width; y += (box_width + box_padding)) {

            let rand = Math.ceil(random(15));
            // 1 in 15 chance there is a circle
            if (rand == 1) {
                fill(66, 134, 244);
                ellipse(x + box_width/2 , y + box_width/2, box_width, box_width);
            } else {
                fill(195, 198, 204);
                rect(x-2, y-2, box_width, box_width);
            }
        }
    }
  }
}

function mousePressed() { refresh = true; }
