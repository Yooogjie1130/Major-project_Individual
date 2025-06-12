let imgOriginal;    // The original image will not be modified
let dots = [];      // Stores all Dot instances
let xStep = 10;     // Lateral pixel spacing
let yStep = 10;     // Vertical pixel spacing
let snake = [];     // Snake
let snakeSize = 20; // Size of the snake
let imgScale = 1;   // Image zoom ratio
let imgXOffset = 0; // Image center offset
let imgYOffset = 0; // Reserve the vertical offset

let currentRow = 0; // Keeps track of the current row the snake is on
let rowDirection = 'RIGHT'; // Direction of snake in the row (right or left)

let snakeSpeedSlider;  // Slider for controlling snake speed
let snakeSpeed = 2;    // Default snake speed
let speedLabel; 

let restartButton; // Add a button


function preload() {
  // Load the original image only once
  imgOriginal = loadImage('assets/Piet_Mondrian Broadway_Boogie_Woogie.jpeg');
}

let canvas;

function setup() {
  canvas = createCanvas(800, 800);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);  // Default centered
  noStroke();

  // UI elements
  snakeSpeedSlider = createSlider(1, 20, 2);

  // adjust the position based on visual representation to keep it at the bottom right corner
  snakeSpeedSlider.position(windowWidth - 240, windowHeight - 100);
  snakeSpeedSlider.style('width', '200px');

// Create a <div> element to label the snake speed slider (p5.js DOM function)
  speedLabel = createDiv("Snake Speed");
  speedLabel.position(windowWidth - 240, windowHeight - 130);

  // Create the restart button
  restartButton = createButton('Restart (Top-Left)');
  restartButton.position(windowWidth - 240, windowHeight - 180); // keep it at the bottom right corner
  restartButton.mousePressed(restart);
  restartButton.style('font-family', 'inherit');
  restartButton.style('font-size', '16px');

  calculateImageAndDots();
  snake.push(createVector(dots[0].x, dots[0].y));
}
  

function restart() {
  // Resize canvas to same size, but make sure it's aligned top-left
  createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);  // Put canvas at top-left

  // Reset all state
  calculateImageAndDots();
  snake = [];
  currentRow = 0;
  rowDirection = 'RIGHT';

  if (dots.length > 0) {
    snake.push(createVector(dots[0].x, dots[0].y)); // top-left start
  }

  // Reposition slider and label and button too
  snakeSpeedSlider.position(windowWidth - 240, windowHeight - 100);
  speedLabel.position(windowWidth - 240, windowHeight - 130);
  restartButton.position(windowWidth - 240, windowHeight - 180);
}


function draw() {
  background(255);

  // Update snake speed based on the slider's value
  snakeSpeed = snakeSpeedSlider.value(); 
  
  // Draw the dots
  for (let dot of dots) {
    dot.display();
  }

  // Move the snake automatically
  moveSnake();
  drawSnake();

  // Check if the snake eats any dots
  checkDotCollision();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Recalculate everything
  calculateImageAndDots();

  // Restart the snake from top-left
  snake = [];
  currentRow = 0;
  rowDirection = 'RIGHT';

  if (dots.length > 0) {
    snake.push(createVector(dots[0].x, dots[0].y));
  }

  // Reposition canvas to center by default
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  // Reposition UI elements
  snakeSpeedSlider.position(windowWidth - 240, windowHeight - 100);
  speedLabel.position(windowWidth - 240, windowHeight - 130);
  restartButton.position(windowWidth - 240, windowHeight - 180);
}




function calculateImageAndDots() {
  dots = [];

  // Each time a new image object is copied from the original image, it is used for scaling
  img = imgOriginal.get();
  img.resize(0, height);  // Resize image to fit the height
  imgScale = height / img.height;
  imgXOffset = (width - img.width) / 2;
  imgYOffset = 0;

  for (let i = 0; i < img.width; i += xStep) {
    for (let j = 0; j < img.height; j += yStep) {
      let pixelColor = img.get(i, j);  // Get the pixel color at (i, j)
      let bri = brightness(pixelColor);
      let size = map(bri, 0, 255, 20, 0);  // Size based on brightness
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
    this.wasEaten = false; // New flag
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }

  checkIfEaten(snakeHead) {
    if (this.wasEaten) return null; // Already eaten
  
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
  
      // Eatable color detected
      if (redLike || blueLike) {
        this.color = color(234, 211, 45); // Turn yellow
        this.wasEaten = true;
  
        if (redLike) return 'grow';
        if (blueLike) return 'shrink';
      }
    }
    return null;
  }
  
}


// Move the snake automatically in a zigzag pattern
function moveSnake() {
  let head = snake[snake.length - 1].copy();  // Copy the last snake position

  // Move the snake in the specified direction
  if (rowDirection === 'RIGHT') head.x += snakeSpeed;  // Use snakeSpeed from the slider
  if (rowDirection === 'LEFT') head.x -= snakeSpeed;
  if (head.x >= imgXOffset + img.width || head.x < imgXOffset) {
    currentRow++;
    rowDirection = (rowDirection === 'RIGHT') ? 'LEFT' : 'RIGHT';
    head.y = dots[0].y + currentRow * yStep; // Recalculate y based on currentRow and top row's y
  }

  snake.push(head);  // Add the new head to the snake
  snake.shift();  // Remove the tail to simulate movement
}

// Draw the snake on the canvas
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    fill(0);
    ellipse(snake[i].x, snake[i].y, snakeSize, snakeSize);  // Draw each part of the snake
  }
}

// Check if the snake eats any dots
function checkDotCollision() {
  let head = snake[snake.length - 1];

  for (let i = dots.length - 1; i >= 0; i--) {
    let effect = dots[i].checkIfEaten(head);

    if (effect === 'grow') {
      // Duplicate head to grow
      let newSegment = head.copy();
      snake.push(newSegment);
      break;
    } else if (effect === 'shrink' && snake.length > 1) {
      // Remove one from the head to shrink (but don't disappear entirely)
      snake.pop();
      break;
    }
  }
}