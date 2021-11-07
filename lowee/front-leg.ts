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

const height = 4;
const pillar = cylinder({ height, radius: 14 / 2 });
const hole = cylinder({
  height,
  radius: (3 + 0.3) / 2,
});
const chamfer = cylinderElliptic({
  height: 2,
  startRadius: [(3 + 0.3) / 2, (3 + 0.3) / 2],
  endRadius: [(6 + 0.3) / 2, (6 + 0.3) / 2],
});

export const main = () => {
  return subtract(pillar, hole, translate([0, 0, (height - 2) / 2], chamfer));
};
