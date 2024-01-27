import { Stop } from "../markings";
import { Utils } from "../math";
import { Point } from "../primitives";
import { Viewport } from "../viewport";
import { World } from "../world";

export class StopEditor {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  intent: Stop | null;
  mousePoint: Point | null;
  markings: any;

  constructor(
    private viewport: Viewport,
    private world: World,
    private utils: Utils
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
      this.world.laneGuides,
      10 * this.viewport.zoom
    );
    if (segment) {
      const project = segment.projectPoint(this.mousePoint);
      if (project.offset >= 0 && project.offset <= 1) {
        this.intent = new Stop(
          project.point,
          segment.directionVector(),
          this.world.roadWidth / 2,
          this.world.roadWidth / 2,
          this.utils
        );
      } else {
        this.intent = null;
      }
    } else {
      this.intent = null;
    }
  };

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      // left click
      if (this.intent) {
        this.markings.push(this.intent);
        this.intent = null;
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
