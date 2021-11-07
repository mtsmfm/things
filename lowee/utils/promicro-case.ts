import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";
import { Vec3 } from "./utils";

const {
  cuboid,
  cylinder,
  cylinderElliptic,
  roundedCuboid,
  roundedCylinder,
  polygon,
  torus,
} = primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const pin = subtract(cuboid({ size: [4, 4, 1.5] }));

const pinHole = cylinder({
  radius: 1.5,
  height: 2,
  segments: 6,
});

const holder = subtract(
  union(
    cuboid({ size: [20, 2, 6] }),
    cuboid({
      size: [4, 2, 1],
      center: [(7.6 + 4) / 2, -(2 + 2) / 2, -(6 - 1) / 2],
    }),
    cuboid({
      size: [4, 2, 1],
      center: [-(7.6 + 4) / 2, -(2 + 2) / 2, -(6 - 1) / 2],
    })
  ),
  cuboid({ size: [8, 2, 3], center: [0, 0, -(6 - 3) / 2] })
);

const proMicroCase = union(
  subtract(
    union(
      cuboid({ size: [22, 57, 2] }),
      translate([7.7, -57 / 2 + 18.9, -(2 + 1.5) / 2], pin),
      translate([-7.7, -57 / 2 + 18.9, -(2 + 1.5) / 2], pin),
      translate([7.7, -57 / 2 + 2.5, -(2 + 1.5) / 2], pin),
      translate([-7.7, -57 / 2 + 2.5, -(2 + 1.5) / 2], pin)
    ),
    translate([7.7, -57 / 2 + 18.9, -1.5], pinHole),
    translate([-7.7, -57 / 2 + 18.9, -1.5], pinHole),
    translate([7.7, -57 / 2 + 2.5, -1.5], pinHole),
    translate([-7.7, -57 / 2 + 2.5, -1.5], pinHole)
  ),
  translate([0, (57 - 2) / 2, -(6 - 2) / 2], holder)
);

export const main = () => {
  return proMicroCase;
};
