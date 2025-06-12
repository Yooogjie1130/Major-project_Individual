let imgOriginal;
let dots = [];
let xStep = 10;
let yStep = 10;
let snakeSize = 20;
let imgScale = 1;
let imgXOffset = 0;
let imgYOffset = 0;

let snake1 = []; // Perlin noise snake
let snake2 = []; // Random walk snake
let noiseOffset = 0;

let snakeSpeedSlider;
let snakeSpeed = 2;
let speedLabel;
let restartButton;

let gameOver = false;
let winnerText = "";

function preload() {
  imgOriginal = loadImage('assets/Piet_Mondrian Broadway_Boogie_Woogie.jpeg');
}

let canvas;

function setup() {
  canvas = createCanvas(800, 800);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  noStroke();

  snakeSpeedSlider = createSlider(1, 20, 2);
  snakeSpeedSlider.position(windowWidth - 240, windowHeight - 100);
  snakeSpeedSlider.style('width', '200px');

  speedLabel = createDiv("Snake Speed");
  speedLabel.position(windowWidth - 240, windowHeight - 130);

  restartButton = createButton('Restart (Top-Left)');
  restartButton.position(windowWidth - 240, windowHeight - 180);
  restartButton.mousePressed(restartTopLeft);
  restartButton.style('font-family', 'inherit');
  restartButton.style('font-size', '16px');

  calculateImageAndDots();

  let start1 = createVector(dots[0].x, dots[0].y);
  let start2 = createVector(width - 20, height - 20);
  for (let i = 0; i < 10; i++) {
    snake1.push(start1.copy());
    snake2.push(start2.copy());
  }
}

function restartTopLeft() {
  createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);

  calculateImageAndDots();
  snake1 = [];
  snake2 = [];
  gameOver = false;
  winnerText = "";

  let start1 = createVector(dots[0].x, dots[0].y);
  let start2 = createVector(width - 20, height - 20);
  for (let i = 0; i < 10; i++) {
    snake1.push(start1.copy());
    snake2.push(start2.copy());
  }

  snakeSpeedSlider.position(windowWidth - 240, windowHeight - 100);
  speedLabel.position(windowWidth - 240, windowHeight - 130);
  restartButton.position(windowWidth - 240, windowHeight - 180);
}

function draw() {
  background(255);
  snakeSpeed = snakeSpeedSlider.value();

  for (let dot of dots) {
    dot.display();
  }

  if (!gameOver) {
    moveSnake1();
    drawSnake(snake1);
    checkDotCollision(snake1);

    moveSnake2();
    drawSnake(snake2);
    checkDotCollision(snake2);

    checkSnakeCollision();
  } else {
    drawSnake(snake1);
    drawSnake(snake2);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(winnerText, width / 2, height / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageAndDots();

  snake1 = [];
  snake2 = [];
  gameOver = false;
  winnerText = "";

  let start1 = createVector(dots[0].x, dots[0].y);
  let start2 = createVector(width - 20, height - 20);
  for (let i = 0; i < 10; i++) {
    snake1.push(start1.copy());
    snake2.push(start2.copy());
  }

  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  snakeSpeedSlider.position(windowWidth - 240, windowHeight - 100);
  speedLabel.position(windowWidth - 240, windowHeight - 130);
  restartButton.position(windowWidth - 240, windowHeight - 180);
}

function calculateImageAndDots() {
  dots = [];
  img = imgOriginal.get();
  img.resize(0, height);
  imgScale = height / img.height;
  imgXOffset = (width - img.width) / 2;
  imgYOffset = 0;

  for (let i = 0; i < img.width; i += xStep) {
    for (let j = 0; j < img.height; j += yStep) {
      let pixelColor = img.get(i, j);
      let bri = brightness(pixelColor);
      let size = map(bri, 0, 255, 20, 0);
      dots.push(new Dot(i + imgXOffset, j + imgYOffset, pixelColor, size));
    }
  }
}

class Dot {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.originalColor = color;
    this.color = color;
    this.size = size;
    this.wasEaten = false;
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }

  checkIfEaten(snakeHead) {
    if (this.wasEaten) return null;

    let d = dist(this.x, this.y, snakeHead.x, snakeHead.y);
    let detectionRange = this.size + snakeSpeed;

    if (d < detectionRange / 2) {
      let c = this.originalColor;

      const redLike =
        dist(red(c), green(c), blue(c), 170, 57, 43) < 50 ||
        dist(red(c), green(c), blue(c), 180, 105, 87) < 50;

      const blueLike =
        dist(red(c), green(c), blue(c), 71, 107, 191) < 50 ||
        dist(red(c), green(c), blue(c), 54, 60, 136) < 50 ||
        dist(red(c), green(c), blue(c), 93, 91, 142) < 50;

      if (redLike || blueLike) {
        this.color = color(234, 211, 45);
        this.wasEaten = true;
        if (redLike) return 'grow';
        if (blueLike) return 'shrink';
      }
    }
    return null;
  }
}

function moveSnake1() {
  let head = snake1[snake1.length - 1].copy();
  let angle = noise(noiseOffset) * TWO_PI * 2;
  noiseOffset += 0.01;

  head.x += cos(angle) * snakeSpeed;
  head.y += sin(angle) * snakeSpeed;

  head.x = constrain(head.x, 0, width);
  head.y = constrain(head.y, 0, height);

  snake1.push(head);
  snake1.shift();
}

function moveSnake2() {
  let head = snake2[snake2.length - 1].copy();
  let angle = random(TWO_PI);
  head.x += cos(angle) * snakeSpeed;
  head.y += sin(angle) * snakeSpeed;

  head.x = constrain(head.x, 0, width);
  head.y = constrain(head.y, 0, height);

  snake2.push(head);
  snake2.shift();
}

function drawSnake(snake) {
  for (let i = 0; i < snake.length; i++) {
    fill(0);
    ellipse(snake[i].x, snake[i].y, snakeSize, snakeSize);
  }
}

function checkDotCollision(snake) {
  let head = snake[snake.length - 1];
  for (let i = dots.length - 1; i >= 0; i--) {
    let effect = dots[i].checkIfEaten(head);
    if (effect === 'grow') {
      let newSegment = head.copy();
      snake.push(newSegment);
      break;
    } else if (effect === 'shrink' && snake.length > 1) {
      snake.pop();
      break;
    }
  }
}

function checkSnakeCollision() {
  let head1 = snake1[snake1.length - 1];
  let head2 = snake2[snake2.length - 1];

  let d = dist(head1.x, head1.y, head2.x, head2.y);
  let collisionThreshold = snakeSize;

  if (d < collisionThreshold) {
    gameOver = true;

    if (snake1.length > snake2.length) {
      winnerText = "Perlin Noise! 🐍";
    } else if (snake2.length > snake1.length) {
      winnerText = "Random Snake Win! 🐍";
    } else {
      winnerText = "It's a Tie!";
    }
  }
}