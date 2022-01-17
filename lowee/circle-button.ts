import {
  subtract,
  translate,
  union,
  cuboid,
  cylinder,
  rotate,
  degToRad,
  align,
} from "../utils";
import { flatBaseRoundedCylinder } from "./utils/utils";

const capHeight = 3;
const shaftHeight = 4;
const segments = 32 * 2;
const capRadius = 23 / 2;

const cap = subtract(
  align(
    { modes: ["none", "none", "max"] },
    flatBaseRoundedCylinder({
      roundRadius: 2,
      radius: capRadius,
      height: capHeight + shaftHeight,
      segments,
    }),
    union(
      cuboid({
        size: [15.5, 15.5, shaftHeight],
      }),
      cuboid({
        size: [2, 17, shaftHeight],
      })
    )
  )
);

const shaft = subtract(
  cylinder({ radius: 6 / 2, height: shaftHeight, segments })
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

const shaftWithHole = subtract(
  align({ modes: ["none", "none", "min"] }, shaft, shaftHole)
);

export const main = () => {
  return rotate(
    [0, degToRad(180), 0],
    align({ modes: ["none", "none", "max"] }, cap, shaftWithHole)
  );
};
