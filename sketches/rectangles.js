let rectPosX = 0;
let rectPosY = 0;
let rectSizeX = 0;
let rectSizeY = 0;
let noiseValueX = 0;
let noiseValueY = 0;
let noiseValueXSize = 0;
let noiseValueYSize = 0;

function setup() {
  createCanvas(600, 800);
  background(255);
}
function draw() {
  fill(0, 0, 0, 0);

  rect(rectPosX, rectPosY, rectSizeX, rectSizeY);
  rectPosX = random(0, 600);
  rectPosY = random(0, 800);
  rectSizeX = random(10, 40);
  rectSizeY = random(10, 40);

  if (frameCount == 500 - 1) {
    save("sketch.svg");
    print("saved svg");
    noLoop();
  }
}
