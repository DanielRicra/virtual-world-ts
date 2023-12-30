import type { Graph } from "./math/graph";
import { Point } from "./primitives/point";

export class GraphEditor {
  canvas: HTMLCanvasElement;
  graph: Graph;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.addEventListeners();
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      const pointFromMouse = new Point(event.offsetX, event.offsetY);
      this.graph.addPoint(pointFromMouse);
    });
  }

  display() {
    this.graph.draw(this.context);
  }
}
