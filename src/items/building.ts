import { Utils } from "../math";
import { Point, Polygon } from "../primitives";

export class Building {
  static load(buildingInfo: Building, utils: Utils): Building {
    return new Building(
      Polygon.load(buildingInfo.base, utils),
      buildingInfo.height,
      utils
    );
  }

  constructor(
    public base: Polygon,
    public height: number = 200,
    private utils: Utils,
    public heightCoefficient = 0.4
  ) {}

  draw(context: CanvasRenderingContext2D, viewPoint: Point) {
    const topPoints = this.base.points.map((p) =>
      this.utils.getFake3dPoint(p, viewPoint, this.height * 0.6)
    );
    const ceiling = new Polygon(topPoints, this.utils);

    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length;
      const poly = new Polygon(
        [
          this.base.points[i],
          this.base.points[nextI],
          topPoints[nextI],
          topPoints[i],
        ],
        this.utils
      );
      sides.push(poly);
    }
    sides.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );

    const baseMidpoints = [
      this.utils.average(this.base.points[0], this.base.points[1]),
      this.utils.average(this.base.points[2], this.base.points[3]),
    ];

    const topMidpoints = baseMidpoints.map((p) =>
      this.utils.getFake3dPoint(p, viewPoint, this.height)
    );

    const roofPolys = [
      new Polygon(
        [
          ceiling.points[0],
          ceiling.points[3],
          topMidpoints[1],
          topMidpoints[0],
        ],
        this.utils
      ),
      new Polygon(
        [
          ceiling.points[2],
          ceiling.points[1],
          topMidpoints[0],
          topMidpoints[1],
        ],
        this.utils
      ),
    ];
    roofPolys.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );

    this.base.draw(context, {
      fill: "white",
      stroke: "rgba(0,0,0,0.2)",
      lineWidth: 20,
    });
    for (const side of sides) {
      side.draw(context, { fill: "white", stroke: "#AAA" });
    }
    ceiling.draw(context, { fill: "white", stroke: "white", lineWidth: 6 });
    for (const poly of roofPolys) {
      poly.draw(context, {
        fill: "#D44",
        stroke: "#C44",
        lineWidth: 8,
        join: "round",
      });
    }
  }
}
