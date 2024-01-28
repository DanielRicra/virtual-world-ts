import { Light } from "../markings";
import { Marking } from "../markings/marking";
import type { Utils } from "../math";
import { Point } from "../primitives";
import { Viewport } from "../viewport";
import { World } from "../world";
import { MarkingEditor } from "./marking-editor";

export class LightEditor extends MarkingEditor {
  constructor(viewport: Viewport, world: World, utils: Utils) {
    super(viewport, world, world.laneGuides, utils);
  }

  createMarking(center: Point, directionVector: Point): Marking {
    return new Light(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.utils
    );
  }
}
