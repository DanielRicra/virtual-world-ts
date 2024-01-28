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

  distanceToPoint(point: Point) {
    const distance = this.utils.distance;
    const proj = this.projectPoint(point);
    if (proj.offset > 0 && proj.offset < 1) {
      return distance(point, proj.point);
    }
    const distToP1 = distance(point, this.p1);
    const distToP2 = distance(point, this.p2);
    return Math.min(distToP1, distToP2);
  }

  projectPoint(point: Point) {
    const a = this.utils.subtract(point, this.p1);
    const b = this.utils.subtract(this.p2, this.p1);
    const normB = this.utils.normalize(b);
    const scaler = this.utils.dot(a, normB);
    const proj = {
      point: this.utils.add(this.p1, this.utils.scale(normB, scaler)),
      offset: scaler / this.utils.magnitude(b),
    };
    return proj;
  }

  draw(
    context: CanvasRenderingContext2D,
    {
      width = 2,
      color = "black",
      dash = [],
      cap = "butt",
    }: {
      width?: number;
      color?: string;
      dash?: number[];
      cap?: CanvasLineCap;
    } = {}
  ) {
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.lineCap = cap;
    context.setLineDash(dash);
    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
    context.stroke();
    context.setLineDash([]);
  }
}
