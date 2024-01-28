import { Parking } from "../markings";
import { Marking } from "../markings/marking";
import type { Utils } from "../math";
import { Point } from "../primitives";
import { Viewport } from "../viewport";
import { World } from "../world";
import { MarkingEditor } from "./marking-editor";

export class ParkingEditor extends MarkingEditor {
  constructor(viewport: Viewport, world: World, utils: Utils) {
    super(viewport, world, world.laneGuides, utils);
  }

  createMarking(center: Point, directionVector: Point): Marking {
    return new Parking(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
      this.utils
    );
  }
}
