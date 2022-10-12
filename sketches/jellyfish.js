var mr = 0.01;
let heights = [80, 100, 140, 180];
let speeds = [0.18, 0.16, 0.12, 0.1];

function Jellyfish(x, y, dna) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 40;
  this.maxspeed = 1;
  this.maxforce = 0.5;
  this.t = 0.01;

  this.health = 7;

  this.size = random([0, 1, 2, 3]);
  this.height = heights[this.size];
  this.maxWidth = 0;
  this.bones = [];
  this.LFO = new Tone.LFO(speeds[this.size], 0, 10);
  this.meter = new Tone.Meter();
  this.level;

  this.dna = [];
  if (dna === undefined) {
    // Food weight
    this.dna[0] = random(-2, 2);
    // Poison weight
    this.dna[1] = random(-2, 2);
    // Food perception
    this.dna[2] = random(0, 100);
    // Poision Percepton
    this.dna[3] = random(0, 100);
  } else {
    // Mutation
    this.dna[0] = dna[0];
    if (random(1) < mr) {
      this.dna[0] += random(-0.1, 0.1);
    }
    this.dna[1] = dna[1];
    if (random(1) < mr) {
      this.dna[1] += random(-0.1, 0.1);
    }
    this.dna[2] = dna[2];
    if (random(1) < mr) {
      this.dna[2] += random(-10, 10);
    }
    this.dna[3] = dna[3];
    if (random(1) < mr) {
      this.dna[3] += random(-10, 10);
    }
  }

  this.build = function () {
    for (var i = 0; i < 10; i++) {
      this.bones.push({
        right: {
          x1: 5,
          y1: -this.height / 2,
          x2: 5 + this.t * noise(random(4)),
          x2Original: 0 + this.t * noise(random(4)),
          y2: -this.height / 2 + (this.height / 3) * 1.8,
          x3: 5 + this.t * noise(random(52)),
          x3Original: 0 + this.t * noise(random(52)),
          y3: -this.height / 2 + (this.height / 3) * 2.5,
          x4: 0,
          y4: -this.height / 2 + this.height,
        },
        left: {
          x1: -5,
          y1: -this.height / 2,
          x2: -5 - this.t * noise(random(34)),
          x2Original: 0 - this.t * noise(random(34)),
          y2: -this.height / 2 + (this.height / 3) * 1.8,
          x3: -5 - this.t * noise(random(84)),
          x3Original: 0 - this.t * noise(random(84)),
          y3: -this.height / 2 + (this.height / 3) * 2.5,
          x4: 0,
          y4: -this.height / 2 + this.height,
        },
      });
      this.t += random(8);
    }
    this.widthLeft = this.xpos - this.t * noise(random(34));
    this.widthRight = this.xpos + this.t * noise(random(4));

    this.LFO.start();
    this.LFO.connect(this.meter);
  };

  // Method to update location
  this.update = function () {
    this.health -= 0.001;

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  };

  this.applyForce = function (force) {
    this.acceleration.add(force);
  };

  this.behaviors = function (good, bad) {
    var steerG = this.eat(good, 0.2, this.dna[2]);
    var steerB = this.eat(bad, -1, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  };

  this.clone = function () {
    if (random(1) < 0.001) {
      return new Jellyfish(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  };

  this.animate = function () {
    this.level = this.meter.getLevel();
    let mappedLevel = map(this.level, -52, 30, 0, 5);

    for (var i = 0; i < this.bones.length; i++) {
      this.bones[i].left.x2 = this.bones[i].left.x2Original - mappedLevel * i;
      this.bones[i].left.x3 = this.bones[i].left.x3Original - mappedLevel * i;
      this.bones[i].right.x2 = this.bones[i].right.x2Original + mappedLevel * i;
      this.bones[i].right.x3 = this.bones[i].right.x3Original + mappedLevel * i;
    }
  };

  this.eat = function (list, nutrition, perception) {
    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.position.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  };

  this.seek = function (target) {
    var desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);

    return steer;
  };

  this.dead = function () {
    return this.health < 0;
  };

  this.display = function () {
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    var gr = color(255, 255, 255, 60);
    var rd = color(0, 0, 100, 60);
    var col = lerpColor(rd, gr, this.health);

    fill(255, 255, 200, this.level / 4);
    stroke(col);
    strokeWeight(1);
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
    pop();
  };

  this.boundaries = function () {
    var d = 25;

    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };
}
