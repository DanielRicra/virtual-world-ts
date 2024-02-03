import { Crossing, Light, Parking, Start, Stop, Target, Yield } from ".";
import { Utils } from "../math";
import { Point } from "../primitives";
import { Marking } from "./marking";

export class MarkingLoader {
  static load(info: Marking, utils: Utils): Marking {
    const point = new Point(info.center.x, info.center.y);
    const dir = new Point(info.directionVector.x, info.directionVector.y);
    switch (info.type) {
      case "crossing":
        return new Crossing(point, dir, info.width, info.height, utils);
      case "light":
        return new Light(point, dir, info.width, utils);
      case "marking":
        return new Marking(point, dir, info.width, info.height, utils);
      case "parking":
        return new Parking(point, dir, info.width, info.height, utils);
      case "start":
        return new Start(point, dir, info.width, info.height, utils);
      case "stop":
        return new Stop(point, dir, info.width, info.height, utils);
      case "target":
        return new Target(point, dir, info.width, info.height, utils);
      case "yield":
        return new Yield(point, dir, info.width, info.height, utils);
    }
  }
}
