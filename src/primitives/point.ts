export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  draw(
    context: CanvasRenderingContext2D,
    size: number = 18,
    color: string = "black"
  ) {
    const radius = size / 2;
    context.beginPath();
    context.fillStyle = color;
    context.arc(this.x, this.y, radius, 0, Math.PI * 2);
    context.fill();
  }
}
