import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";
import { Vec2 } from "@jscad/modeling/src/maths/types";

const {
  cuboid,
  cylinder,
  cylinderElliptic,
  roundedCuboid,
  roundedCylinder,
  polygon,
  sphere,
} = primitives;
const { rotate, translate, rotateX } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const height = 0.5;
const radius: Vec2 = [40 / 2, 53 / 2];

export const main = () => {
  return subtract(
    cylinderElliptic({ height, startRadius: radius, endRadius: radius }),
    cuboid({ size: [8, 10, height] })
  );
};
