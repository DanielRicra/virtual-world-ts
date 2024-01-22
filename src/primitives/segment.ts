import { Utils } from "../math/utils";
import type { Point } from "./point";

export class Segment {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point, private readonly utils: Utils) {
    this.p1 = p1;
    this.p2 = p2;
  }

  length() {
    return this.utils.distance(this.p1, this.p2);
  }

  directionVector() {
    return this.utils.normalize(this.utils.subtract(this.p2, this.p1));
  }

  equals(segment: Segment): boolean {
    return this.includes(segment.p1) && this.includes(segment.p2);
  }

  includes(point: Point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  draw(
    context: CanvasRenderingContext2D,
    {
      width = 2,
      color = "black",
      dash = [],
    }: { width?: number; color?: string; dash?: number[] } = {}
  ) {
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.setLineDash(dash);
    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
    context.stroke();
    context.setLineDash([]);
  }
}
