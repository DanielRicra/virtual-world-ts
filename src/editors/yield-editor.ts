import { Yield } from "../markings";
import type { Utils } from "../math";
import { Point } from "../primitives";
import { Viewport } from "../viewport";
import { World } from "../world";
import { MarkingEditor } from "./marking-editor";

export class YieldEditor extends MarkingEditor {
  constructor(viewport: Viewport, world: World, utils: Utils) {
    super(viewport, world, world.laneGuides, utils);
  }

  createMarking(center: Point, directionVector: Point): Yield {
    return new Yield(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
      this.utils
    );
  }
}
