import type { Graph } from "../math/graph";
import type { Utils } from "../math/utils";
import { Point, Segment } from "../primitives";
import { Viewport } from "../viewport";

enum ClickNumbers {
  LEFT = 0,
  RIGHT = 2,
}

export class GraphEditor {
  canvas: HTMLCanvasElement;
  graph: Graph;
  context: CanvasRenderingContext2D;
  selectedPoint: Point | null;
  hoveredPoint: Point | null;
  isDragging: boolean;
  mousePoint: Point | null;
  viewport: Viewport;

  constructor(viewport: Viewport, graph: Graph, private readonly utils: Utils) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;
    this.selectedPoint = null;
    this.hoveredPoint = null;
    this.utils = utils;
    this.isDragging = false;
    this.mousePoint = null;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  enable() {
    this.addEventListeners();
  }

  disable() {
    this.removeEventListeners();
    this.selectedPoint = null;
    this.hoveredPoint = null;
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("contextmenu", this.handleContextMenu);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
  }

  private removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseDown = (event: MouseEvent) => {
    if (event.button === ClickNumbers.RIGHT) {
      if (this.selectedPoint) {
        this.selectedPoint = null;
      } else if (this.hoveredPoint) {
        this.removePoint(this.hoveredPoint);
      }
    }

    if (event.button === ClickNumbers.LEFT) {
      if (this.hoveredPoint) {
        this.select(this.hoveredPoint);
        this.isDragging = true;
        return;
      }

      if (this.mousePoint) {
        this.graph.addPoint(this.mousePoint);
        this.select(this.mousePoint);
      }

      this.hoveredPoint = this.mousePoint;
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.mousePoint = this.viewport.getMouse(event, true);
    this.hoveredPoint = this.utils.getNearestPoint(
      this.mousePoint,
      this.graph.points,
      10 * this.viewport.zoom
    );
    if (this.isDragging && this.selectedPoint) {
      this.selectedPoint.x = this.mousePoint.x;
      this.selectedPoint.y = this.mousePoint.y;
    }
  };

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  private handleMouseUp = () => {
    this.isDragging = false;
  };

  private select(point: Point) {
    if (this.selectedPoint) {
      this.graph.tryAddSegment(
        new Segment(this.selectedPoint, point, this.utils)
      );
    }
    this.selectedPoint = point;
  }

  private removePoint(point: Point) {
    this.graph.removePoint(point);
    this.hoveredPoint = null;
    if (this.selectedPoint == point) {
      this.selectedPoint = null;
    }
  }

  dispose() {
    this.graph.dispose();
    this.selectedPoint = null;
    this.hoveredPoint = null;
  }

  display() {
    this.graph.draw(this.context);
    if (this.hoveredPoint) {
      this.hoveredPoint.draw(this.context, { fill: true });
    }

    if (this.selectedPoint) {
      if (this.mousePoint) {
        const intent = this.hoveredPoint ? this.hoveredPoint : this.mousePoint;
        new Segment(this.selectedPoint, intent, this.utils).draw(this.context, {
          dash: [3, 3],
        });
      }
      this.selectedPoint.draw(this.context, { outline: true });
    }
  }
}
