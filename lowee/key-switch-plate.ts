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
  roundCornerCuboidWithChamfer,
} from "./utils/utils";
import { keySwitchHole, pcbClicks } from "./utils/cherry-mx";

const { cuboid, cylinder, cylinderElliptic, roundedCuboid, polygon } =
  primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const basePlate = translate(
  [0, 0, -basePlateSize[2] / 2],
  roundCornerCuboidWithChamfer({
    size: basePlateSize,
    roundRadius: 3,
    chamferSize: 0,
  })
);

const ufbShaft = subtract(
  cuboid({ size: [8, 8, 4] }),
  cylinder({
    radius: 3.4 / 2,
    height: 4,
  })
);

const ufbHole = union(
  subtract(
    union(
      cuboid({ size: [96, 45, 4] }),
      cuboid({
        size: [4, 45 - 8 * 2, 3],
        center: [(96 + 4) / 2, 0, -(4 - 3) / 2],
      }),
      cuboid({ size: [80, 6, 4], center: [0, (45 + 6) / 2, 0] }),
      cuboid({ size: [80, 4, 4], center: [0, -(45 + 4) / 2, 0] })
    ),
    translate([(96 - 8) / 2, (45 - 8) / 2, 0], ufbShaft),
    translate([-(96 - 8) / 2, (45 - 8) / 2, 0], ufbShaft),
    translate([(96 - 8) / 2, -(45 - 8) / 2, 0], ufbShaft),
    translate([-(96 - 8) / 2, -(45 - 8) / 2, 0], ufbShaft)
  )
);

const allButtonPositions = [...circleButtonPositions, ...squareButtonPositions];

export const main = () => {
  return subtract(
    union(
      subtract(
        union(
          basePlate,
          ...allButtonPositions.map(([x, y]) =>
            translate(
              [x, y, -(5 - basePlateSize[2]) / 2],
              union(cuboid({ size: [18, 18, 5] }), pcbClicks)
            )
          )
        ),
        ...allButtonPositions.map(([x, y]) =>
          translate([x, y, -(5 - basePlateSize[2]) / 2], keySwitchHole)
        ),
        translate([-(basePlateSize[0] - 96) / 2, -30, 0], ufbHole)
      )
    ),
    ...screwHolePositions.map(([x, y]) =>
      translate(
        [x, y, 0],
        cylinder({
          height: basePlateSize[2],
          radius: 3.4 / 2,
        })
      )
    )
  );
};
