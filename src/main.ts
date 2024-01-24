import { Graph } from "./math/graph";
import config from "./config/constants";
import "./style.css";
import { GraphEditor } from "./graph-editor";
import { Utils } from "./math/utils";
import { Viewport } from "./viewport";
import { World } from "./world";

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;

const deleteBtn = document.querySelector("#deleteBtn") as HTMLButtonElement;
const saveBtn = document.querySelector("#saveBtn") as HTMLButtonElement;

deleteBtn.addEventListener("click", dispose);
saveBtn.addEventListener("click", save);

canvas.width = config.WIDTH;
canvas.height = config.HEIGHT;

const context = canvas.getContext("2d");

if (context === null) {
  throw new Error("Oops! The context is null.");
}

const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) : null;

const utils = new Utils();
const graph = graphInfo ? Graph.load(graphInfo, utils) : new Graph();
const world = new World(graph, utils, 50, 10);

const viewport = new Viewport(canvas, utils);
const graphEditor = new GraphEditor(viewport, graph, utils);

let oldGraphHad = graph.hash();
animate();

function animate() {
  viewport.reset();
  if (graph.hash() != oldGraphHad) {
    world.generate();
    oldGraphHad = graph.hash();
  }
  const viewPoint = utils.scale(viewport.getOffset(), -1);
  world.draw(context!, viewPoint);
  if (context) context.globalAlpha = 0.3;
  graphEditor.display();
  requestAnimationFrame(animate);
}

function dispose() {
  graphEditor.dispose();
}

function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}
