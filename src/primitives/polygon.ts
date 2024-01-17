import { Point } from ".";

export class Polygon {
  constructor(public points: Point[]) {}

  draw(
    context: CanvasRenderingContext2D,
    {
      stroke = "blue",
      lineWidth = 2,
      fill = "rgba(0, 0, 255, 0.3)",
    }: { stroke?: string; lineWidth?: number; fill?: string } = {}
  ) {
    context.beginPath();
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 0; i < this.points.length; i++) {
      context.lineTo(this.points[i].x, this.points[i].y);
    }
    context.closePath();
    context.fill();
    context.stroke();
  }
}
