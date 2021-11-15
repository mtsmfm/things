import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
  measurements,
} from "@jscad/modeling";
import {
  circleButtonPositions,
  basePlateSize,
  squareButtonPositions,
  screwHolePositions,
  flatBaseRoundedCuboid,
} from "./utils/utils";
import * as promicroCase from "./utils/promicro-case";
import {
  cherryMxlowProfileHole,
  cherryMxlowProfileHoleHotswapSocket,
} from "./utils/cherry-mx-low-profile";

const { cuboid, cylinder, cylinderElliptic, roundedCuboid, polygon, torus } =
  primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const chamferX = rotate(
  [degToRad(45), 0, 0],
  cuboid({
    size: [basePlateSize[0], 3, 3],
  })
);

const chamferY = rotate(
  [0, degToRad(45), 0],
  cuboid({
    size: [3, basePlateSize[1], 3],
  })
);

const basePlate = subtract(
  cuboid({
    size: basePlateSize,
  }),
  translate([0, basePlateSize[1] / 2, 3 / Math.sqrt(2)], chamferX),
  translate([0, -basePlateSize[1] / 2, 3 / Math.sqrt(2)], chamferX),
  translate([basePlateSize[0] / 2, 0, 3 / Math.sqrt(2)], chamferY),
  translate([-basePlateSize[0] / 2, 0, 3 / Math.sqrt(2)], chamferY)
);

export const main = () => {
  return subtract(
    basePlate,
    ...circleButtonPositions.map(([x, y]) =>
      cylinder({
        radius: 26 / 2,
        height: basePlateSize[2],
        center: [x, y, 0],
      })
    ),
    ...squareButtonPositions.map(([x, y]) =>
      cuboid({ size: [20, 20, basePlateSize[2]], center: [x, y, 0] })
    ),
    translate(
      [
        -basePlateSize[0] / 2 + 6,
        -basePlateSize[1] / 2 + 15,
        -(basePlateSize[2] - 1) / 2,
      ],
      cuboid({ size: [10, 10, 1] })
    ),
    translate(
      [
        -basePlateSize[0] / 2 + 6,
        -basePlateSize[1] / 2 + 52,
        -(basePlateSize[2] - 1) / 2,
      ],
      cuboid({ size: [10, 10, 1] })
    ),
    translate(
      [
        -basePlateSize[0] / 2 + 92,
        -basePlateSize[1] / 2 + 15,
        -(basePlateSize[2] - 1) / 2,
      ],
      cuboid({ size: [10, 10, 1] })
    ),
    translate(
      [
        -basePlateSize[0] / 2 + 92,
        -basePlateSize[1] / 2 + 52,
        -(basePlateSize[2] - 1) / 2,
      ],
      cuboid({ size: [10, 10, 1] })
    ),
    ...screwHolePositions.map(([x, y]) =>
      translate(
        [
          x == 0 ? x : x > 0 ? x - 10 : x + 10,
          x == 0 ? y - 30 : y,
          -(4 - 3) / 2,
        ],
        cylinder({
          height: 3,
          radius: (4.5 / 2 / Math.sqrt(3)) * 2,
          segments: 6,
        })
      )
    )
  );
};
