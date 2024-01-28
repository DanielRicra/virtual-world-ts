import type { Utils } from "../math";
import { Point, Segment } from "../primitives";
import { Marking } from "./marking";

export class Crossing extends Marking {
  borders: Segment[];
  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    height: number,
    utils: Utils
  ) {
    super(center, directionVector, width, height, utils);

    this.borders = [this.polygon.segments[0], this.polygon.segments[2]];
  }

  draw(context: CanvasRenderingContext2D) {
    const perp = this.utils.perpendicular(this.directionVector);
    const line = new Segment(
      this.utils.add(this.center, this.utils.scale(perp, this.width / 2)),
      this.utils.add(this.center, this.utils.scale(perp, -this.width / 2)),
      this.utils
    );
    line.draw(context, { width: this.height, color: "white", dash: [11, 11] });
  }
}
