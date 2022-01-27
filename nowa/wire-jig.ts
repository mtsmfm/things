import { cuboid, subtract, union, translate, align, center } from "../utils";

const wireRadius = (1 + 0.8) / 2;
const wallThickness = 1;

const wire = cuboid({ size: [wireRadius * 2, 23, wireRadius * 2] });

const wireHolder = cuboid({
  size: [wireRadius * 2 + wallThickness, 23, wireRadius * 2 + wallThickness],
});

const wall = cuboid({
  size: [wireRadius * 2 + wallThickness, wallThickness, wireRadius * 2],
});

const jig = subtract(
  align(
    { modes: ["center", "center", "max"] },
    union(
      subtract(
        align(
          { modes: ["center", "min", "max"] },
          subtract(wireHolder, wire),
          wall
        )
      )
    ),
    subtract(
      wire,
      cuboid({ size: [wireRadius * 2, wallThickness, wireRadius * 2] })
    )
  )
);

export const main = () => {
  return center(
    {},
    union(jig, translate([0, 23, 0], jig), translate([0, 46, 0], jig))
  );
};
