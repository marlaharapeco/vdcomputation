class Heart {
  constructor(pts) {
    this.position = [];
    for (let i=0; i<pts.length; i++) {
      this.position[i] = pts[i];
      this.c = random(colorPalette);
    } 
  }
  
  display() {
    stroke(0);
    strokeWeight(3);
    fill(this.c);
    beginShape();
    for (let i=0; i<this.position.length; i++) {
      vertex(this.position[i].x, this.position[i].y);
    }
    endShape(CLOSE);
  }
}