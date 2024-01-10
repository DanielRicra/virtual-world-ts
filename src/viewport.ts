import { type Utils } from "./math/utils";
import { Point } from "./primitives";

export class Viewport {
  zoom: number;
  context: CanvasRenderingContext2D | null;
  offset: Point;
  drag: { start: Point; end: Point; offset: Point; isActive: boolean };
  center: Point;

  constructor(public canvas: HTMLCanvasElement, private readonly utils: Utils) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.zoom = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = this.utils.scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      isActive: false,
    };

    this.addEventListeners();
  }

  reset() {
    this.context?.restore();
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context?.save();
    this.context?.translate(this.center.x, this.center.y);
    this.context?.scale(1 / this.zoom, 1 / this.zoom);

    const offset = this.getOffset();
    this.context?.translate(offset.x, offset.y);
  }

  getMouse(event: MouseEvent, subtractDragOffset: boolean = false) {
    const p = new Point(
      (event.offsetX - this.center.x) * this.zoom - this.offset.x,
      (event.offsetY - this.center.y) * this.zoom - this.offset.y
    );

    return subtractDragOffset ? this.utils.subtract(p, this.drag.offset) : p;
  }

  getOffset() {
    return this.utils.add(this.offset, this.drag.offset);
  }

  private addEventListeners() {
    this.canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private handleMouseWheel(event: WheelEvent) {
    const dir = Math.sign(event.deltaY);
    const step = 0.1;
    this.zoom += dir * step;
    this.zoom = Math.max(1, Math.min(5, this.zoom));
  }

  private handleMouseDown(event: MouseEvent) {
    if (event.button == 1) {
      // middle button
      this.drag.start = this.getMouse(event);
      this.drag.isActive = true;
    }
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.drag.isActive) {
      this.drag.end = this.getMouse(event);
      this.drag.offset = this.utils.subtract(this.drag.end, this.drag.start);
    }
  }

  private handleMouseUp(_event: MouseEvent) {
    if (this.drag.isActive) {
      this.offset = this.utils.add(this.offset, this.drag.offset);
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        isActive: false,
      };
    }
  }
}
