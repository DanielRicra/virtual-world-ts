import { Point } from "../primitives/point";

export class Utils {
  distance(p1: Point, p2: Point) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  average(p1: Point, p2: Point): Point {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  }

  getNearestPoint(
    location: Point,
    points: Point[],
    threshold: number = Number.MAX_SAFE_INTEGER
  ) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearestPoint = null;

    for (const point of points) {
      const distance = this.distance(point, location);
      if (distance < minDistance && distance < threshold) {
        minDistance = distance;
        nearestPoint = point;
      }
    }

    return nearestPoint;
  }

  add(p1: Point, p2: Point) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
  }

  subtract(p1: Point, p2: Point) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
  }

  scale(p: Point, scaler: number) {
    return new Point(p.x * scaler, p.y * scaler);
  }

  translate(location: Point, angle: number, offset: number) {
    return new Point(
      location.x + Math.cos(angle) * offset,
      location.y + Math.sin(angle) * offset
    );
  }

  angle(p: Point) {
    return Math.atan2(p.y, p.x);
  }

  getIntersection(A: Point, B: Point, C: Point, D: Point) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
      const t = tTop / bottom;
      const u = uTop / bottom;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
          x: this.lerp(A.x, B.x, t),
          y: this.lerp(A.y, B.y, t),
          offset: t,
        };
      }
    }

    return null;
  }

  lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }
}
