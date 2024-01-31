import type { Utils } from "../math";
import { Point } from "../primitives";
import { Marking } from "./marking";

export class Start extends Marking {
  image: HTMLImageElement;
  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    height: number,
    utils: Utils
  ) {
    super(center, directionVector, width, height, utils);

    this.image = new Image();
    this.image.src = "./src/assets/car.png";
    this.type = "start";
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.utils.angle(this.directionVector) - Math.PI / 2);

    context.drawImage(
      this.image,
      -this.image.width / 2,
      -this.image.height / 2
    );
    context.restore();
  }
}
