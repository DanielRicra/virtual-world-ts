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
const inputFile = document.querySelector("#fileInput") as HTMLInputElement;

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
inputFile.addEventListener("change", load);

canvas.width = config.WIDTH;
canvas.height = config.HEIGHT;

const context = canvas.getContext("2d");

if (context === null) {
  throw new Error("Oops! The context is null.");
}

const utils = new Utils();
const worldString = localStorage.getItem("world");
const worldInfo = worldString ? JSON.parse(worldString) : null;
let world = worldInfo
  ? World.load(worldInfo, utils)
  : new World(new Graph(), utils);
const graph = world.graph;

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

function load(event: Event) {
  const target = event.target as HTMLInputElement;
  let file = (target.files as FileList)[0];

  if (!file) {
    alert("No file selected");
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = (event) => {
    const fileContent = event.target?.result;
    if (typeof fileContent !== "string") {
      alert("Fail to load file");
      return;
    }
    const jsonData = JSON.parse(fileContent);
    world = World.load(jsonData, utils);
    localStorage.setItem("world", JSON.stringify(world));
    location.reload();
  };
}

function save() {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(world))
  );

  const filename = "name.world";
  element.setAttribute("download", filename);

  element.click();

  localStorage.setItem("world", JSON.stringify(world));
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
