import type { Utils } from "../math";
import { Point } from "../primitives";
import { Marking } from "./marking";

export class Target extends Marking {
  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    height: number,
    utils: Utils
  ) {
    super(center, directionVector, width, height, utils);
    this.type = "target";
  }

  draw(context: CanvasRenderingContext2D) {
    this.center.draw(context, { color: "red", size: 30 });
    this.center.draw(context, { color: "white", size: 20 });
    this.center.draw(context, { color: "red", size: 10 });
  }
}
