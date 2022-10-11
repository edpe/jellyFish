var mr = 0.01;

function Jellyfish(x, y, dna) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 40;
  this.maxspeed = 1;
  this.maxforce = 0.5;

  this.health = 5;

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
    // We could add mass here if we want A = F / M
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
    if (random(1) < 0.0001) {
      return new Jellyfish(this.position.x, this.position.y, this.dna);
    } else {
      return null;
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

    // This is the moment of eating!

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  };

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function (target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  };

  this.dead = function () {
    return this.health < 0;
  };

  this.display = function () {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    var gr = color(255, 255, 255);
    var rd = color(0, 0, 100);
    var col = lerpColor(rd, gr, this.health);

    for (var i = 0; i < 30; i++) {
      let t = 0.1;
      var x1 = 0;
      var y1 = 0;

      var x2 = 100 * noise(0 + t);
      var y2 = 200 * noise(0 + t);

      var x3 = 100 * noise(0 + t);
      var y3 = 200 * noise(0 + t);

      var x4 = 0;
      var y4 = 200;
      console.log(top);
      noFill();
      stroke(col);
      strokeWeight(1);
      bezier(x1, y1, x2, y2, x3, y3, x4, y4);
      t += 0.01;
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
