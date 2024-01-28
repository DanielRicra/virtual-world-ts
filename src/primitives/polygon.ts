import { Point, Segment } from ".";
import type { Utils } from "../math/utils";

export class Polygon {
  segments: Segment[];

  static union(polygons: Polygon[], utils: Utils): Segment[] {
    Polygon.multiBreak(polygons, utils);
    const keptSegments = [];

    for (let i = 0; i < polygons.length; i++) {
      for (const seg of polygons[i].segments) {
        let keep = true;
        for (let j = 0; j < polygons.length; j++) {
          if (i != j) {
            if (polygons[j].containsSegment(seg)) {
              keep = false;
              break;
            }
          }
        }

        if (keep) {
          keptSegments.push(seg);
        }
      }
    }

    return keptSegments;
  }

  distanceToPoint(point: Point) {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }

  distanceToPolygon(polygon: Polygon) {
    return Math.min(...this.points.map((p) => polygon.distanceToPoint(p)));
  }

  intersectsPolygon(polygon: Polygon) {
    for (let s1 of this.segments) {
      for (let s2 of polygon.segments) {
        if (this.utils.getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  containsSegment(seg: Segment): boolean {
    const midPoint = this.utils.average(seg.p1, seg.p2);
    return this.containsPoint(midPoint);
  }

  containsPoint(point: Point | null): boolean {
    if (!point) return false;

    const outerPoint = new Point(-1000, -1000);
    let intersectionCount = 0;

    for (const seg of this.segments) {
      const int = this.utils.getIntersection(outerPoint, point, seg.p1, seg.p2);

      if (int) {
        intersectionCount++;
      }
    }

    return intersectionCount % 2 === 1;
  }

  static multiBreak(polygons: Polygon[], utils: Utils) {
    for (let i = 0; i < polygons.length - 1; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        Polygon.break(polygons[i], polygons[j], utils);
      }
    }
  }

  static break(polygon1: Polygon, polygon2: Polygon, utils: Utils): void {
    const segments1 = polygon1.segments;
    const segments2 = polygon2.segments;

    for (let i = 0; i < segments1.length; i++) {
      for (let j = 0; j < segments2.length; j++) {
        const int = utils.getIntersection(
          segments1[i].p1,
          segments1[i].p2,
          segments2[j].p1,
          segments2[j].p2
        );

        if (int && int.offset != 1 && int.offset != 0) {
          const point = new Point(int.x, int.y);
          let aux = segments1[i].p2;
          segments1[i].p2 = point;
          segments1.splice(i + 1, 0, new Segment(point, aux, utils));
          aux = segments2[j].p2;
          segments2[j].p2 = point;
          segments2.splice(j + 1, 0, new Segment(point, aux, utils));
        }
      }
    }
  }

  constructor(public points: Point[], private readonly utils: Utils) {
    this.segments = [];

    for (let i = 1; i <= points.length; i++) {
      this.segments.push(
        new Segment(points[i - 1], points[i % points.length], utils)
      );
    }
  }

  drawSegments(ctx: CanvasRenderingContext2D) {
    for (const seg of this.segments) {
      seg.draw(ctx, {
        color: `hsl(${290 + Math.random() * 260}, 100%, 60%)`,
        width: 5,
      });
    }
  }

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
