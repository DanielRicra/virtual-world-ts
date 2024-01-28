import type { Utils } from "../math";
import { Point, Segment } from "../primitives";
import { Marking } from "./marking";

export class Light extends Marking {
  border: Segment;
  state: string;

  constructor(
    center: Point,
    directionVector: Point,
    width: number,
    utils: Utils
  ) {
    super(center, directionVector, width, 18, utils);

    this.state = "off";
    this.border = this.polygon.segments[0];
  }

  draw(context: CanvasRenderingContext2D) {
    const perp = this.utils.perpendicular(this.directionVector);
    const line = new Segment(
      this.utils.add(this.center, this.utils.scale(perp, this.width / 2)),
      this.utils.add(this.center, this.utils.scale(perp, -this.width / 2)),
      this.utils
    );

    const green = this.utils.lerp2D(line.p1, line.p2, 0.2);
    const yellow = this.utils.lerp2D(line.p1, line.p2, 0.5);
    const red = this.utils.lerp2D(line.p1, line.p2, 0.8);

    new Segment(red, green, this.utils).draw(context, {
      width: this.height,
      cap: "round",
    });

    green.draw(context, { size: this.height * 0.6, color: "#060" });
    yellow.draw(context, { size: this.height * 0.6, color: "#660" });
    red.draw(context, { size: this.height * 0.6, color: "#600" });

    switch (this.state) {
      case "green":
        green.draw(context, { size: this.height * 0.6, color: "#0F0" });
        break;
      case "yellow":
        yellow.draw(context, { size: this.height * 0.6, color: "#FF0" });
        break;
      case "red":
        red.draw(context, { size: this.height * 0.6, color: "#F00" });
        break;
    }
  }
}
