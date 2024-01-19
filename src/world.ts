import { Graph } from "./math/graph";
import { Utils } from "./math/utils";
import { Envelope, Polygon, Segment } from "./primitives";

export class World {
  envelopes: Envelope[];
  roadBorders: Segment[];

  constructor(
    private readonly graph: Graph,
    private readonly utils: Utils,
    public roadWidth = 100,
    public roadRoundness = 3
  ) {
    this.envelopes = [];
    this.roadBorders = [];

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
  }

  draw(context: CanvasRenderingContext2D) {
    for (const envelopes of this.envelopes) {
      envelopes.draw(context, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
    }

    for (const seg of this.graph.segments) {
      seg.draw(context, { color: "white", width: 4, dash: [10, 10] });
    }

    for (const seg of this.roadBorders) {
      seg.draw(context, { color: "white", width: 4 });
    }
  }
}
