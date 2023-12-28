import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Graph {
  points: Point[];
  segments: Segment[];

  constructor(points: Point[] = [], segments: Segment[] = []) {
    this.points = points;
    this.segments = segments;
  }

  draw(context: CanvasRenderingContext2D) {
    for (const seg of this.segments) {
      seg.draw(context);
    }

    for (const point of this.points) {
      point.draw(context);
    }
  }
}
