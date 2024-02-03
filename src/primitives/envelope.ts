import { Polygon, Segment } from ".";
import { Utils } from "../math/utils";

export class Envelope {
  polygon: Polygon;

  static load(info: Envelope, utils: Utils) {
    const env = new Envelope(
      new Segment(info.skeleton.p1, info.skeleton.p2, utils),
      info.width,
      info.roundness,
      utils
    );
    env.polygon = Polygon.load(info.polygon!, utils);
    return env;
  }

  constructor(
    public skeleton: Segment,
    public width: number,
    public roundness: number = 1,
    private readonly utils: Utils
  ) {
    this.polygon = this.generatePolygon(width, roundness);
  }

  private generatePolygon(width: number, roundness: number) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2;
    const alpha = this.utils.angle(this.utils.subtract(p1, p2));
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;

    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    const epsilon = step / 2;
    for (let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
      points.push(this.utils.translate(p1, i, radius));
    }

    for (let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
      points.push(this.utils.translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points, this.utils);
  }

  draw(
    context: CanvasRenderingContext2D,
    options: { stroke?: string; lineWidth?: number; fill?: string } = {}
  ) {
    if (this.polygon) {
      this.polygon.draw(context, options);
    }
  }
}
