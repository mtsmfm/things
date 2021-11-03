import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";

const { cuboid, cylinder, cylinderElliptic, roundedCuboid, polygon } =
  primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const cherryMxlowProfileHole = union(
  cylinder({ radius: 26 / 2, height: 2, center: [0, 0, 1] }),
  cuboid({ size: [14, 14, 2], center: [0, 0, -1] }),
  cuboid({ size: [5, 1.5, 1], center: [0, 7, -(4 - 1) / 2] }),
  cuboid({ size: [5, 1.5, 1], center: [0, -7, -(4 - 1) / 2] })
);

const basePlate = cuboid({ size: [26, 26, 4] });

export const main = () => {
  return union(subtract(basePlate, cherryMxlowProfileHole));
};
