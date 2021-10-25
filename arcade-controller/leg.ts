import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";

const {
  cuboid,
  cylinder,
  cylinderElliptic,
  roundedCuboid,
  roundedCylinder,
  polygon,
  sphere,
} = primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const height = 6;
const pillar = cylinder({ height, radius: 14 / 2 });
const hole = cylinder({
  height: 3 * 1.5,
  radius: 4.5 / 2,
});
const chamfer = cylinderElliptic({
  height: 0.7,
  startRadius: [4.5 / 2, 4.5 / 2],
  endRadius: [5.5 / 2, 5.5 / 2],
});

export const main = () => {
  return subtract(
    union(
      pillar,
      translate([0, 60 / 2, -3 / 2], cuboid({ size: [7, 60, 3] })),
      translate([0, 60, 0], pillar)
    ),
    translate(
      [0, 0, height / 2 - (3 * 1.5) / 2],
      union(hole, translate([0, 0, (3 * 1.5 - 0.5) / 2], chamfer))
    )
  );
};
