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
    {
      outline = false,
      color = "black",
      size = 18,
      fill = false,
    }: { size?: number; color?: string; outline?: boolean; fill?: boolean } = {}
  ) {
    const radius = size / 2;
    context.beginPath();
    context.fillStyle = color;
    context.arc(this.x, this.y, radius, 0, Math.PI * 2);
    context.fill();

    if (outline) {
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "yellow";
      context.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
      context.stroke();
    }

    if (fill) {
      context.beginPath();
      context.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2)
      context.fillStyle = "yellow";
      context.fill();
    }
  }
}
