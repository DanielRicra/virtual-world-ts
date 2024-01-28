import type { Utils } from "../math";
import { Envelope, Point, Polygon, Segment } from "../primitives";

export class Marking {
  support: Segment;
  polygon: Polygon;
  constructor(
    public center: Point,
    public directionVector: Point,
    public width: number,
    public height: number,
    protected readonly utils: Utils
  ) {
    this.support = new Segment(
      utils.translate(center, utils.angle(directionVector), height / 2),
      utils.translate(center, utils.angle(directionVector), -height / 2),
      utils
    );
    this.polygon = new Envelope(this.support, width, 0, this.utils).polygon;
  }

  draw(context: CanvasRenderingContext2D) {
    this.polygon.draw(context);
  }
}
