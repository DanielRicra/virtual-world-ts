import type { Utils } from "../math";
import { Point, Segment } from "../primitives";
import { Marking } from "./marking";

export class Parking extends Marking {
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
    for (const border of this.borders) {
      border.draw(context, { width: 5, color: "white" });
    }
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.utils.angle(this.directionVector));
    context.scale(1, 3);

    context.beginPath();
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.font = "bold" + this.height * 0.9 + "px Arial";
    context.fillText("P", 0, 1);

    context.restore();
  }
}
