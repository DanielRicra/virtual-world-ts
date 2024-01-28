import { Crossing } from "../markings";
import type { Utils } from "../math";
import type { Point } from "../primitives";
import type { Viewport } from "../viewport";
import type { World } from "../world";
import { MarkingEditor } from "./marking-editor";

export class CrossingEditor extends MarkingEditor {
  constructor(viewport: Viewport, world: World, utils: Utils) {
    super(viewport, world, world.graph.segments, utils);
  }

  createMarking(center: Point, directionVector: Point): Crossing {
    return new Crossing(
      center,
      directionVector,
      this.world.roadWidth,
      this.world.roadWidth / 2,
      this.utils
    );
  }
}
