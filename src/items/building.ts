import { Utils } from "../math";
import { Point, Polygon } from "../primitives";

export class Building {
  constructor(
    public base: Polygon,
    private utils: Utils,
    public heightCoefficient = 0.4
  ) {}

  draw(context: CanvasRenderingContext2D, viewPoint: Point) {
    const { scale, subtract, add } = this.utils;
    const topPoints = this.base.points.map((p) =>
      add(p, scale(subtract(p, viewPoint), this.heightCoefficient))
    );
    const ceiling = new Polygon(topPoints, this.utils);

    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length;
      const polygon = new Polygon(
        [
          this.base.points[i],
          this.base.points[nextI],
          topPoints[nextI],
          topPoints[i],
        ],
        this.utils
      );
      sides.push(polygon);
    }
    sides.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );

    this.base.draw(context, { fill: "white", stroke: "#AAA" });
    for (const side of sides) {
      side.draw(context, { fill: "white", stroke: "#AAA" });
    }
    ceiling.draw(context, { fill: "white", stroke: "#AAA" });
  }
}
