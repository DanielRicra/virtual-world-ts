import { Stop } from "../markings";
import { Utils } from "../math";
import { Point } from "../primitives";
import { Viewport } from "../viewport";
import { World } from "../world";
import { MarkingEditor } from "./marking-editor";

export class StopEditor extends MarkingEditor {
  constructor(viewport: Viewport, world: World, utils: Utils) {
    super(viewport, world, world.laneGuides, utils);
  }

  createMarking(center: Point, directionVector: Point): Stop {
    return new Stop(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
      this.utils
    );
  }
}
