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
  roundCornerCuboidWithChamfer,
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

const height = basePlateSize[2] + 7;

const basePlate = translate(
  [0, 0, -height / 2],
  roundCornerCuboidWithChamfer({
    size: [basePlateSize[0], basePlateSize[1], height],
    roundRadius: 3,
    chamferSize: 2,
  })
);

const ufbHole = union(
  cuboid({ size: [96, 45, 7] }),
  cuboid({ size: [80, 6, 7], center: [0, (45 + 6) / 2, 0] }),
  cuboid({ size: [80, 4, 7], center: [0, -(45 + 4) / 2, 0] })
);

export const main = () => {
  return subtract(
    basePlate,
    ...circleButtonPositions.map(([x, y]) =>
      cylinder({
        radius: 27 / 2,
        height: height,
        center: [x, y, 0],
      })
    ),
    ...squareButtonPositions.map(([x, y]) =>
      cuboid({ size: [21, 21, height], center: [x, y, 0] })
    ),
    ...screwHolePositions.map(([x, y]) =>
      translate(
        [x, y, -(height - 7) / 2],
        cylinder({
          height: 7,
          radius: (4.5 / 2 / Math.sqrt(3)) * 2,
          segments: 6,
        })
      )
    ),
    translate(
      [-(basePlateSize[0] - 96) / 2, -30 - 1, -(height - 7) / 2],
      ufbHole
    )
  );
};
