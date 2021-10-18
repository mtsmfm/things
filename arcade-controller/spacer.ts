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

const pillar = cylinder({ height: 6, radius: 5 });
const hole = cylinder({
  height: 6,
  radius: 3.5 / 2,
});

export const main = () => {
  return subtract(pillar, hole);
};
