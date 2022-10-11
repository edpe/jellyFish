let x1 = 20;
let x2 = 600;
let xSunStart = 200;
let xSunEnd = 400;
let ySea = 400;
let ySunHeight = 400;
let ySunLineHeight = 0;
let yReflectionLineHeight = 0;
let a = 0.0;
let gapSize = 5;
let sunGapSize = 20;
let distanceFromSunCenter = 0;
let circleRadius = 150;
let circleLineLength = 0;
let circleCenter = 300;
let circleLineLengthSquared = 0;
let reductionAmount = 10;

function setup() {
  createCanvas(600, 800);
  background(255);
  fill(255);
  stroke(0, 0, 255);

  // draw the sea
  for (let i = 0; i < 580; i++) {
    line(x1, ySea, x2, ySea);
    ySea = ySea + gapSize;
  }

  // draw the sun
  stroke(255, 0, 0);
  for (let i = 0; i < 40; i++) {
    // work out half the length of lines to draw the sun
    circleLineLengthSquared = sq(circleRadius) - sq(ySunLineHeight);
    circleLineLength = sqrt(circleLineLengthSquared);
    line(
      // start at half the line length before the center
      circleCenter - circleLineLength,
      // start at the height of the top of the water plus the line height
      ySunHeight + ySunLineHeight,
      // end at half the lin length after the center
      circleCenter + circleLineLength,
      // same line height as the previous point to create a straight horizontal line
      ySunHeight + ySunLineHeight
    );
    // move the vertical starting point up by the line gap size
    ySunLineHeight = ySunLineHeight - gapSize;
  }

  // draw the sun's reflection in the water
  stroke(255, 130, 0);
  for (let i = 0; i < 17; i++) {
    // work out half the length of lines to draw the sun
    circleLineLengthSquared = sq(circleRadius) - sq(yReflectionLineHeight);
    circleLineLength = sqrt(circleLineLengthSquared);
    line(
      // start at half the line length before the center
      circleCenter - circleLineLength,
      // start at the height of the top of the water plus the line height
      int(ySunHeight + yReflectionLineHeight),
      // end at half the lin length after the center
      circleCenter + circleLineLength,
      // same line height as the previous point to create a straight horizontal line
      int(ySunHeight + yReflectionLineHeight)
    );
    // move the vertical starting point up by the line gap size
    yReflectionLineHeight = yReflectionLineHeight + sunGapSize;
    if (sunGapSize > 0) {
      sunGapSize = sunGapSize - 1.5;
    }
  }
}

function draw() {}
