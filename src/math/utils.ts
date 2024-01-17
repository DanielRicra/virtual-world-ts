import { Point } from "../primitives/point";

export class Utils {
  distance(p1: Point, p2: Point) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
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
}
