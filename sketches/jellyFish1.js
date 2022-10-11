let jellyFishes = [];
let heights = [100, 150, 200, 250];
let speeds = [0.18, 0.16, 0.12, 0.1];

class JellyFish {
  constructor() {
    this.t = 0.9;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.alpha = 60;
    this.size = random([0, 1, 2, 3]);
    this.xpos = random(width);
    this.ypos = random(height);
    this.height = heights[this.size];
    this.bones = [];
    this.widthLeft;
    this.widthRight;
    this.maxWidth = 0;
    this.LFO = new Tone.LFO(speeds[this.size], 0, 10);
    this.meter = new Tone.Meter();
    this.level;
    this.pos = createVector(posX, posY);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
  }

  build() {
    for (var i = 0; i < 15; i++) {
      this.bones.push({
        right: {
          x1: this.xpos,
          y1: this.ypos,
          x2: this.xpos + this.t * noise(random(4)),
          x2Original: this.xpos + this.t * noise(random(4)),
          y2: this.ypos + (this.height / 3) * 1.8,
          x3: this.xpos + this.t * noise(random(52)),
          x3Original: this.xpos + this.t * noise(random(52)),
          y3: this.ypos + (this.height / 3) * 2.5,
          x4: this.xpos,
          y4: this.ypos + this.height,
        },
        left: {
          x1: this.xpos,
          y1: this.ypos,
          x2: this.xpos - this.t * noise(random(34)),
          x2Original: this.xpos - this.t * noise(random(34)),
          y2: this.ypos + (this.height / 3) * 1.8,
          x3: this.xpos - this.t * noise(random(84)),
          x3Original: this.xpos - this.t * noise(random(84)),
          y3: this.ypos + (this.height / 3) * 2.5,
          x4: this.xpos,
          y4: this.ypos + this.height,
        },
      });
      this.t += random(8);
    }
    this.widthLeft = this.xpos - this.t * noise(random(34));
    this.widthRight = this.xpos + this.t * noise(random(4));

    this.LFO.start();
    this.LFO.connect(this.meter);
  }

  updatePosition() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
  }

  animate() {
    this.level = this.meter.getLevel();
    let mappedLevel = map(this.level, -52, 30, 0, 5);
    console.log(mappedLevel);

    for (var i = 0; i < this.bones.length; i++) {
      this.bones[i].left.x2 = this.bones[i].left.x2Original - mappedLevel * i;
      this.bones[i].left.x3 = this.bones[i].left.x3Original - mappedLevel * i;
      this.bones[i].right.x2 = this.bones[i].right.x2Original + mappedLevel * i;
      this.bones[i].right.x3 = this.bones[i].right.x3Original + mappedLevel * i;
    }
  }

  display() {
    stroke(this.r, this.g, this.b, this.alpha);
    noFill();

    for (var i = 0; i < this.bones.length; i++) {
      bezier(
        this.bones[i].left.x1,
        this.bones[i].left.y1,
        this.bones[i].left.x2,
        this.bones[i].left.y2,
        this.bones[i].left.x3,
        this.bones[i].left.y3,
        this.bones[i].left.x4,
        this.bones[i].left.y4
      );
      bezier(
        this.bones[i].right.x1,
        this.bones[i].right.y1,
        this.bones[i].right.x2,
        this.bones[i].right.y2,
        this.bones[i].right.x3,
        this.bones[i].right.y3,
        this.bones[i].right.x4,
        this.bones[i].right.y4
      );
    }
  }
}

function start() {
  Tone.context.resume();
  // make the jellyFish
  for (var i = 0; i < 7; i++) {
    jellyFishes.push(new JellyFish());
  }
  // generate jellyFish skeleton
  for (var i = 0; i < jellyFishes.length; i++) {
    jellyFishes[i].build();
  }
  // button.position(-100, -100);
}

function setup() {
  // createCanvas(755, 982, SVG);
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 54);
  button = createButton("Start");
  button.position(width / 2, height / 2);
  button.mousePressed(start);
}

function draw() {
  background(0, 0, 54);
  for (var i = 0; i < jellyFishes.length; i++) {
    jellyFishes[i].display();
    jellyFishes[i].animate();
  }
}

function keyTyped() {
  if (key === "s") {
    save(".svg"); // give file name
    print("saved svg");
  }
}
