import { primitives, booleans, extrusions } from "@jscad/modeling";
import { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";

const { line, cuboid } = primitives;
const { union, intersect } = booleans;
const { extrudeRectangular } = extrusions;

const maxSize: Vec3 = [260, 200, 200];
const height = 0.2;
const width = 0.8;

const baseX = (maxSize[0] - 15) / 20;
const baseY = (maxSize[1] - 15) / 20;

const draw = (points: [Vec2, Vec2]) => {
  return extrudeRectangular({ height, size: width / 2 }, line(points));
};

export const main = () => {
  const lines: Array<[Vec2, Vec2]> = [];

  let current: Vec2 = [0, 0];
  let step = 1;
  while (
    (Math.abs(current[0]) < maxSize[0] / 2, Math.abs(current[1]) < maxSize[1])
  ) {
    const direction = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ][step % 4];

    const next: Vec2 = [
      current[0] + baseX * direction[0] * Math.ceil(step / 2),
      current[1] + baseY * direction[1] * Math.ceil(step / 2),
    ];

    lines.push([current, next]);
    current = [...next];
    step++;
  }

  return intersect(
    union(
      ...lines.map((l) => draw(l)),
      ...lines.map((l) =>
        cuboid({
          size: [width, width, height],
          center: [l[0][0], l[0][1], height / 2],
        })
      )
    ),
    primitives.cuboid({ size: maxSize.map((x) => x - 10) as Vec3 })
  );
};
