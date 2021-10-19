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

const pillar = cylinder({ height: 20, radius: 5 });
const bottom = cuboid({ size: [20, 50, 3] });
const hole = cylinder({
  height: 3 * 1.5,
  radius: 4.5 / 2,
});
const chamfer = cylinderElliptic({
  height: 0.5,
  startRadius: [4.5 / 2, 4.5 / 2],
  endRadius: [5.5 / 2, 5.5 / 2],
});

export const main = () => {
  return subtract(
    union(pillar, translate([0, 15, -20 / 2 + 3 / 2], bottom)),
    translate(
      [0, 0, 20 / 2 - (3 * 1.5) / 2],
      union(hole, translate([0, 0, (3 * 1.5 - 0.5) / 2], chamfer))
    )
  );
};
