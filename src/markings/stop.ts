import { Utils } from "../math";
import { Envelope, Point, Polygon, Segment } from "../primitives";

export class Stop {
  support: Segment;
  polygon: Polygon;
  border: Segment;
  constructor(
    public center: Point,
    public directionVector: Point,
    public width: number,
    public height: number,
    private readonly utils: Utils
  ) {
    this.support = new Segment(
      utils.translate(center, utils.angle(directionVector), height / 2),
      utils.translate(center, utils.angle(directionVector), -height / 2),
      utils
    );
    this.polygon = new Envelope(this.support, width, 0, this.utils).polygon;

    this.border = this.polygon.segments[2];
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
    context.font = "bold" + this.height * 0.3 + "px Arial";
    context.fillText("STOP", 0, 1);

    context.restore();
  }
}
