var t;

function setup() {
  createCanvas(755, 982, SVG);
  stroke(0, 18);
  noFill();
  t = 0;
}

function draw() {
  var x1 = 1 + 300 * t;
  var y1 = 10;

  var x2 = width * noise(0 + t);
  var y2 = height * noise(0 + t);

  var x3 = width * noise(0 + t);
  var y3 = height * noise(0 + t);

  var x4 = 1 + 300 * t;
  var y4 = height - 10;

  bezier(x1, y1, x2, y2, x3, y3, x4, y4);

  translate(1000, 0);
  t += 0.01;

  if (frameCount == 300 - 1) {
    noLoop();
  }
}

function keyTyped() {
  if (key === "s") {
    save(".svg"); // give file name
    print("saved svg");
  }
}
