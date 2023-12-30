import { Graph } from "./math/graph";
import { Point } from "./primitives/point";
import { Segment } from "./primitives/segment";
import config from "./config/constants";
import "./style.css";

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;

const addPointBtn = document.querySelector("#addPoint") as HTMLButtonElement;
const addSegmentBtn = document.querySelector(
  "#addSegment"
) as HTMLButtonElement;

canvas.width = config.WIDTH;
canvas.height = config.HEIGHT;

const context = canvas.getContext("2d");

if (context === null) {
  throw new Error("Oops! The context is null.");
}

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
graph.draw(context);

addPointBtn.addEventListener("click", () => addRandomPoint(context));
addSegmentBtn.addEventListener("click", () => addRandomSegment(context));

function addRandomPoint(context: CanvasRenderingContext2D) {
  const success = graph.tryAddPoint(
    new Point(Math.random() * config.WIDTH, Math.random() * config.HEIGHT)
  );
  context.clearRect(0, 0, config.WIDTH, config.HEIGHT);
  graph.draw(context);
  console.log(success);
}

function addRandomSegment(context: CanvasRenderingContext2D) {
  const indexOne = Math.floor(Math.random() * graph.points.length);
  const indexTwo = Math.floor(Math.random() * graph.points.length);

  const success = graph.tryAddSegment(
    new Segment(graph.points[indexOne], graph.points[indexTwo])
  );
  context.clearRect(0, 0, config.WIDTH, config.HEIGHT);
  graph.draw(context);
  console.log(success);
}
