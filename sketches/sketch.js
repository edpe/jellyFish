var jellyFishes = [];
var food = [];
var poison = [];

var debug;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    jellyFishes[i] = new Jellyfish(x, y);
  }

  for (var i = 0; i < jellyFishes.length; i++) {
    jellyFishes[i].build();
  }

  for (var i = 0; i < 20; i++) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  for (var i = 0; i < 20; i++) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }
}

function draw() {
  background(0, 0, 52);

  if (random(1) < 0.025) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  if (random(1) < 0.01) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }

  for (var i = 0; i < food.length; i++) {
    fill(180, 200, 150);
    noStroke();
    ellipse(food[i].x, food[i].y, 10, 10);
  }

  for (var i = 0; i < poison.length; i++) {
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 10, 1);
    ellipse(poison[i].x, poison[i].y, 1, 10);
  }

  for (var i = jellyFishes.length - 1; i >= 0; i--) {
    jellyFishes[i].boundaries();
    jellyFishes[i].behaviors(food, poison);
    jellyFishes[i].update();
    jellyFishes[i].animate();

    jellyFishes[i].display();

    var newJellyfish = jellyFishes[i].clone();
    if (newJellyfish != null) {
      jellyFishes.push(newJellyfish);
    }

    if (jellyFishes[i].dead()) {
      var x = jellyFishes[i].position.x;
      var y = jellyFishes[i].position.y;
      food.push(createVector(x, y));
      jellyFishes.splice(i, 1);
    }
  }
}
