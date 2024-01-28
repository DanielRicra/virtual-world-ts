import { Graph } from "./math/graph";
import config from "./config/constants";
import "./style.css";
import { Utils } from "./math/utils";
import { Viewport } from "./viewport";
import { World } from "./world";
import {
  StopEditor,
  GraphEditor,
  CrossingEditor,
  StartEditor,
  ParkingEditor,
  LightEditor,
  TargetEditor,
  YieldEditor,
} from "./editors";
import { SetModeKinds } from "./types";

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;

const deleteBtn = document.querySelector("#deleteBtn") as HTMLButtonElement;
const saveBtn = document.querySelector("#saveBtn") as HTMLButtonElement;
const setModeBtn = document.querySelector("#setModeBtn") as HTMLButtonElement;
const stopBtn = document.querySelector("#stopBtn") as HTMLButtonElement;
const crossingBtn = document.querySelector("#crossingBtn") as HTMLButtonElement;
const startBtn = document.querySelector("#startBtn") as HTMLButtonElement;
const yieldBtn = document.querySelector("#yieldBtn") as HTMLButtonElement;
const parkingBtn = document.querySelector("#parkingBtn") as HTMLButtonElement;
const lightBtn = document.querySelector("#lightBtn") as HTMLButtonElement;
const targetBtn = document.querySelector("#targetBtn") as HTMLButtonElement;

deleteBtn.addEventListener("click", dispose);
saveBtn.addEventListener("click", save);
setModeBtn.addEventListener("click", () => setMode("graph"));
stopBtn.addEventListener("click", () => setMode("stop"));
crossingBtn.addEventListener("click", () => setMode("crossing"));
startBtn.addEventListener("click", () => setMode("start"));
yieldBtn.addEventListener("click", () => setMode("yield"));
parkingBtn.addEventListener("click", () => setMode("parking"));
lightBtn.addEventListener("click", () => setMode("light"));
targetBtn.addEventListener("click", () => setMode("target"));

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
const world = new World(graph, utils, 76, 10);

const viewport = new Viewport(canvas, utils);

const tools = {
  graph: {
    button: setModeBtn,
    editor: new GraphEditor(viewport, graph, utils),
  },
  stop: { button: stopBtn, editor: new StopEditor(viewport, world, utils) },
  crossing: {
    button: crossingBtn,
    editor: new CrossingEditor(viewport, world, utils),
  },
  start: {
    button: startBtn,
    editor: new StartEditor(viewport, world, utils),
  },
  parking: {
    button: parkingBtn,
    editor: new ParkingEditor(viewport, world, utils),
  },
  light: {
    button: lightBtn,
    editor: new LightEditor(viewport, world, utils),
  },
  target: {
    button: targetBtn,
    editor: new TargetEditor(viewport, world, utils),
  },
  yield: {
    button: yieldBtn,
    editor: new YieldEditor(viewport, world, utils),
  },
};

let oldGraphHad = graph.hash();
setMode("graph");
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

  for (const tool of Object.values(tools)) {
    tool.editor.display();
  }

  requestAnimationFrame(animate);
}

function dispose() {
  tools.graph.editor.dispose();
  world.markings.length = 0;
}

function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}

function setMode(mode: SetModeKinds) {
  disableEditors();
  tools[mode].button.style.backgroundColor = "#8e03aa";
  tools[mode].editor.enable();
}

function disableEditors() {
  for (const tool of Object.values(tools)) {
    tool.button.style.backgroundColor = "transparent";
    tool.editor.disable();
  }
}
