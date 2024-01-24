import { Utils } from "../math";
import { Point, Polygon } from "../primitives";

export class Tree {
  base: Polygon;
  constructor(
    private center: Point,
    private size: number,
    private heightCoefficient: number,
    private readonly utils: Utils
  ) {
    this.base = this.generateLevel(center, size);
  }

  private generateLevel(point: Point, size: number): Polygon {
    const points = [];
    const rad = size / 2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      const noisyRadius = rad * this.utils.lerp(0.5, 1, kindOfRandom);
      points.push(this.utils.translate(point, a, noisyRadius));
    }
    return new Polygon(points, this.utils);
  }

  draw(context: CanvasRenderingContext2D, viewPoint: Point) {
    const diff = this.utils.subtract(this.center, viewPoint);
    const top = this.utils.add(
      this.center,
      this.utils.scale(diff, this.heightCoefficient)
    );

    const levelCount = 7;
    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount - 1);
      const point = this.utils.lerp2D(this.center, top, t);
      const color = `rgb(30, ${this.utils.lerp(50, 200, t)}, 70)`;
      const size = this.utils.lerp(this.size, 40, t);

      const polygon = this.generateLevel(point, size);
      polygon.draw(context, { fill: color, stroke: "rgba(0, 0, 0, 0)" });
    }
  }

  get getCenter() {
    return this.center;
  }
}
