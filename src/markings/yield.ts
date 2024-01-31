import type { Utils } from "../math";
import { Point, Segment } from "../primitives";
import { Marking } from "./marking";

export class Yield extends Marking {
  border: Segment;
  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    height: number,
    utils: Utils
  ) {
    super(center, directionVector, width, height, utils);

    this.border = this.polygon.segments[2];
    this.type = "yield";
  }

  draw(context: CanvasRenderingContext2D) {
    this.border.draw(context, { width: 5, color: "white" });
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.utils.angle(this.directionVector) - Math.PI / 2);
    context.scale(1, 3);

    context.beginPath();
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.font = "bold" + this.height * 0.5 + "px Arial";
    context.fillText("YIELD", 0, 1);

    context.restore();
  }
}
