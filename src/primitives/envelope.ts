import { Polygon, Segment } from ".";
import { Utils } from "../math/utils";

export class Envelope {
  polygon: Polygon;

  constructor(
    private skeleton: Segment,
    width: number,
    roundness: number = 1,
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
    options: { stroke?: string; lineWidth?: number; fill?: string }
  ) {
    this.polygon.draw(context, options);
  }
}
