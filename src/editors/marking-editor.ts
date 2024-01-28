import { Stop } from "../markings";
import { Crossing } from "../markings/crossing";
import { Marking } from "../markings/marking";
import { Utils } from "../math";
import { Point, Segment } from "../primitives";
import { Viewport } from "../viewport";
import { World } from "../world";

enum ClickNumbers {
  LEFT = 0,
  RIGHT = 2,
}

export class MarkingEditor {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  intent: any | null;
  mousePoint: Point | null;
  markings: (Stop | Crossing)[];

  constructor(
    public viewport: Viewport,
    public world: World,
    public targetSegments: Segment[],
    protected readonly utils: Utils
  ) {
    this.canvas = viewport.canvas;

    const aux = this.canvas.getContext("2d");
    if (!aux) {
      throw new Error("Your navigator does not support this app");
    }
    this.context = aux;

    this.intent = null;
    this.mousePoint = null;

    this.markings = world.markings;
  }

  createMarking(center: Point, _directionVector: Point): Marking | Point {
    return center;
  }

  enable() {
    this.addEventListeners();
  }

  disable() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("contextmenu", this.handleContextMenu);
  }

  private removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.mousePoint = this.viewport.getMouse(event, true);
    const segment = this.utils.getNearestSegment(
      this.mousePoint,
      this.targetSegments,
      10 * this.viewport.zoom
    );
    if (segment) {
      const project = segment.projectPoint(this.mousePoint);
      if (project.offset >= 0 && project.offset <= 1) {
        this.intent = this.createMarking(
          project.point,
          segment.directionVector()
        );
      } else {
        this.intent = null;
      }
    } else {
      this.intent = null;
    }
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === ClickNumbers.LEFT) {
      if (this.intent) {
        this.markings.push(this.intent);
        this.intent = null;
      }
    }
    if (event.button === ClickNumbers.RIGHT) {
      for (let i = 0; i < this.markings.length; i++) {
        const polygon = this.markings[i].polygon;
        if (polygon.containsPoint(this.mousePoint)) {
          this.markings.splice(i, 1);
          return;
        }
      }
    }
  };

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  display() {
    if (this.intent) {
      this.intent.draw(this.context);
    }
  }
}
