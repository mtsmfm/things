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
  polygon,
} = primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const cherryMxlowProfileHole = union(
  cuboid({ size: [15.1, 15.1, 2], center: [0, 0, 1] }),
  cuboid({ size: [14, 14, 2], center: [0, 0, -1] }),
  cuboid({ size: [5, 1.5, 1], center: [0, 7, -(4 - 1) / 2] }),
  cuboid({ size: [5, 1.5, 1], center: [0, -7, -(4 - 1) / 2] })
);

const basePlate = cuboid({ size: [18, 18, 4] });

export const main = () => {
  return union(subtract(basePlate, cherryMxlowProfileHole));
};
