import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";
import { flatBaseRoundedCuboid, flatBaseRoundedCylinder } from "./utils/utils";

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

const capHeight = 3;
const shaftHeight = 4;
const segments = 32;
const capRadius = 23 / 2;

const cap = subtract(
  translate(
    [0, 0, -0.5],
    flatBaseRoundedCuboid({
      roundRadius: 2,
      size: [17.5, 17.5, capHeight + shaftHeight - 1],
      segments,
    })
  ),
  translate(
    [0, 0, capHeight / 2],
    union(
      cuboid({
        size: [15.5, 15.5, shaftHeight],
      }),
      cuboid({
        size: [2, 16.5, shaftHeight],
      })
    )
  )
);

const shaft = subtract(
  cylinder({ radius: 5.5 / 2, height: shaftHeight, segments })
);

const chamferSize = 0.7;
const chamfer = rotate(
  [0, degToRad(45), 0],
  cuboid({ size: [chamferSize, 4.3, chamferSize] })
);

const shaftHole = union(
  cuboid({ size: [1.35, 4.3, shaftHeight] }),
  cuboid({ size: [4.3, 1.4, shaftHeight] }),
  translate([chamferSize, 0, shaftHeight / 2], chamfer),
  translate([-chamferSize, 0, shaftHeight / 2], chamfer),
  translate(
    [0, chamferSize, shaftHeight / 2],
    rotate([0, 0, degToRad(90)], chamfer)
  ),
  translate(
    [0, -chamferSize, shaftHeight / 2],
    rotate([0, 0, degToRad(90)], chamfer)
  )
);

export const main = () => {
  return rotate(
    [0, degToRad(180), 0],
    subtract(
      union(cap, translate([0, 0, capHeight / 2], shaft)),
      translate([0, 0, capHeight / 2], shaftHole)
    )
  );
};
