class Dot {
  constructor(x, y, col, size) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.size = size;
  }

  display() {
    fill(this.col);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}