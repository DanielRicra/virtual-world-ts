import type { Graph } from "./math/graph";
import type { Utils } from "./math/utils";
import { Point } from "./primitives/point";

export class GraphEditor {
  canvas: HTMLCanvasElement;
  graph: Graph;
  context: CanvasRenderingContext2D;
  selectedPoint: Point | null;
  hoveredPoint: Point | null;
  isDragging: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    graph: Graph,
    private readonly utils: Utils
  ) {
    this.canvas = canvas;
    this.graph = graph;
    this.selectedPoint = null;
    this.hoveredPoint = null;
    this.utils = utils;
    this.isDragging = false;

    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.addEventListeners();
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      if (event.button === 2) {
        if (this.hoveredPoint) {
          this.removePoint(this.hoveredPoint);
        }
      }

      if (event.button === 0) {
        const pointFromMouse = new Point(event.offsetX, event.offsetY);

        if (this.hoveredPoint) {
          this.selectedPoint = this.hoveredPoint;
          this.isDragging = true;
          return;
        }

        this.graph.addPoint(pointFromMouse);
        this.selectedPoint = pointFromMouse;
        this.hoveredPoint = pointFromMouse;
      }
    });

    this.canvas.addEventListener("mousemove", (event) => {
      const pointFromMouse = new Point(event.offsetX, event.offsetY);
      this.hoveredPoint = this.utils.getNearestPoint(
        pointFromMouse,
        this.graph.points,
        10
      );
      if (this.isDragging && this.selectedPoint) {
        this.selectedPoint.x = pointFromMouse.x;
        this.selectedPoint.y = pointFromMouse.y;
      }
    });

    this.canvas.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );

    this.canvas.addEventListener("mouseup", () => (this.isDragging = false));
  }

  private removePoint(point: Point) {
    this.graph.removePoint(point);
    this.hoveredPoint = null;
    if (this.selectedPoint == point) {
      this.selectedPoint = null;
    }
  }

  display() {
    this.graph.draw(this.context);
    if (this.hoveredPoint) {
      this.hoveredPoint.draw(this.context, { fill: true });
    }

    if (this.selectedPoint) {
      this.selectedPoint.draw(this.context, { outline: true });
    }
  }
}
