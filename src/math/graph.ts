import type { Point } from "../primitives/point";
import type { Segment } from "../primitives/segment";

export class Graph {
  points: Point[];
  segments: Segment[];

  constructor(points: Point[] = [], segments: Segment[] = []) {
    this.points = points;
    this.segments = segments;
  }

  addPoint(point: Point): void {
    this.points.push(point);
  }

  containsPoint(point: Point): boolean {
    return !!this.points.find((p) => p.equals(point));
  }

  tryAddPoint(point: Point) {
    if (this.containsPoint(point)) {
      return false;
    }

    this.addPoint(point);
    return true;
  }

  addSegment(segment: Segment) {
    this.segments.push(segment);
  }

  containsSegment(segment: Segment): boolean {
    return !!this.segments.find((s) => s.equals(segment));
  }

  tryAddSegment(segment: Segment): boolean {
    if (this.containsSegment(segment) || segment.p1.equals(segment.p2)) {
      return false;
    }

    this.addSegment(segment);
    return true;
  }

  removeSegment(segment: Segment): void {
    this.segments.splice(this.segments.indexOf(segment), 1);
  }

  removePoint(point: Point): void {
    const segments = this.getSegmentsWithPoint(point);
    for (const segment of segments) {
      this.removeSegment(segment);
    }
    this.points.splice(this.points.indexOf(point), 1);
  }

  getSegmentsWithPoint(point: Point): Segment[] {
    const segments: Segment[] = [];

    for (const segment of this.segments) {
      if (segment.includes(point)) {
        segments.push(segment);
      }
    }

    return segments;
  }

  draw(context: CanvasRenderingContext2D): void {
    for (const seg of this.segments) {
      seg.draw(context);
    }

    for (const point of this.points) {
      point.draw(context);
    }
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }
}
