import { Building, Tree } from "./items";
import { Stop } from "./markings";
import { Crossing } from "./markings/crossing";
import { Graph, Utils } from "./math";
import { Envelope, Point, Polygon, Segment } from "./primitives";

export class World {
  envelopes: Envelope[];
  roadBorders: Segment[];
  buildings: Building[];
  trees: Tree[];
  laneGuides: Segment[];
  markings: (Stop | Crossing)[];

  constructor(
    public graph: Graph,
    private readonly utils: Utils,
    public roadWidth = 100,
    public roadRoundness = 3,
    private buildingWidth = 150,
    private buildingMinLength = 150,
    private spacing = 50,
    private treeSize = 160
  ) {
    this.envelopes = [];
    this.roadBorders = [];
    this.buildings = [];
    this.trees = [];
    this.laneGuides = [];

    this.markings = [];

    this.generate();
  }

  generate() {
    this.envelopes.length = 0;
    for (const segment of this.graph.segments) {
      this.envelopes.push(
        new Envelope(segment, this.roadWidth, this.roadRoundness, this.utils)
      );
    }

    this.roadBorders = Polygon.union(
      this.envelopes.map((e) => e.polygon),
      this.utils
    );
    this.buildings = this.generateBuildings();
    this.trees = this.generateTrees();

    this.laneGuides.length = 0;
    this.laneGuides.push(...this.generateLaneGuides());
  }

  private generateLaneGuides() {
    const tempEnvelopes = [];
    for (const seg of this.graph.segments) {
      tempEnvelopes.push(
        new Envelope(seg, this.roadWidth / 2, this.roadRoundness, this.utils)
      );
    }
    const segments = Polygon.union(
      tempEnvelopes.map((e) => e.polygon),
      this.utils
    );
    return segments;
  }

  generateTrees(): Tree[] {
    const points = [
      ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
      ...this.buildings.map((b) => b.base.points).flat(),
    ];
    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    const illegalPolygons = [
      ...this.buildings.map((b) => b.base),
      ...this.envelopes.map((e) => e.polygon),
    ];

    const trees = [];
    const lerp = this.utils.lerp;
    let tryCount = 0;
    while (tryCount < 100) {
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(bottom, top, Math.random())
      );
      // check if tree inside or nearby building / road
      let keep = true;
      for (const polygon of illegalPolygons) {
        if (
          polygon.containsPoint(p) ||
          polygon.distanceToPoint(p) < this.treeSize / 2
        ) {
          keep = false;
          break;
        }
      }
      // check if tree is to close to other trees
      if (keep) {
        for (const tree of trees) {
          if (this.utils.distance(tree.getCenter, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }
      // avoiding trees in middle of nowhere
      if (keep) {
        let closeToSomething = false;
        for (const polygon of illegalPolygons) {
          if (polygon.distanceToPoint(p) < this.treeSize * 2) {
            closeToSomething = true;
            break;
          }
        }
        keep = closeToSomething;
      }

      if (keep) {
        trees.push(new Tree(p, this.treeSize, 0.5, this.utils));
        tryCount = 0;
      }
      tryCount++;
    }

    return trees;
  }

  generateBuildings(): Building[] {
    const tempEnvelopes = [];
    for (const seg of this.graph.segments) {
      tempEnvelopes.push(
        new Envelope(
          seg,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness,
          this.utils
        )
      );
    }

    const guides = Polygon.union(
      tempEnvelopes.map((e) => e.polygon),
      this.utils
    );

    for (let i = 0; i < guides.length; i++) {
      const seg = guides[i];
      if (seg.length() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    const supports = [];
    for (let seg of guides) {
      const len = seg.length() + this.spacing;
      const buildingCount = Math.floor(
        len / (this.buildingMinLength + this.spacing)
      );
      const buildingLength = len / buildingCount - this.spacing;
      const dir = seg.directionVector();

      let q1 = seg.p1;
      let q2 = this.utils.add(q1, this.utils.scale(dir, buildingLength));
      supports.push(new Segment(q1, q2, this.utils));

      for (let i = 2; i <= buildingCount; i++) {
        q1 = this.utils.add(q2, this.utils.scale(dir, this.spacing));
        q2 = this.utils.add(q1, this.utils.scale(dir, buildingLength));
        supports.push(new Segment(q1, q2, this.utils));
      }
    }

    const bases = [];
    for (const seg of supports) {
      bases.push(
        new Envelope(seg, this.buildingWidth, undefined, this.utils).polygon
      );
    }

    const epsilon = 0.001;
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (
          bases[i].intersectsPolygon(bases[j]) ||
          bases[i].distanceToPolygon(bases[j]) < this.spacing - epsilon
        ) {
          bases.splice(j, 1);
          j--;
        }
      }
    }

    return bases.map((b) => new Building(b, 200, this.utils));
  }

  draw(context: CanvasRenderingContext2D, viewPoint: Point) {
    for (const envelopes of this.envelopes) {
      envelopes.draw(context, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
    }

    for (const marking of this.markings) {
      marking.draw(context);
    }

    for (const seg of this.graph.segments) {
      seg.draw(context, { color: "white", width: 4, dash: [10, 10] });
    }

    for (const seg of this.roadBorders) {
      seg.draw(context, { color: "white", width: 3 });
    }

    const items = [...this.buildings, ...this.trees];
    items.sort(
      (a, b) =>
        b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint)
    );
    for (const item of items) {
      item.draw(context, viewPoint);
    }
  }
}
