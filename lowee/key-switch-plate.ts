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
} from "./utils/utils";
import { keySwitchHole, pcbClicks } from "./utils/cherry-mx";

const { cuboid, cylinder, cylinderElliptic, roundedCuboid, polygon } =
  primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const basePlate = cuboid({
  size: basePlateSize,
});

const ufbShaft = subtract(
  cuboid({ size: [8, 8, 4] }),
  cylinder({
    radius: 3.3 / 2,
    height: 4,
  })
);

const ufbHole = union(
  subtract(
    cuboid({ size: [96, 45, 4] }),
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
          radius: (4.5 / 2 / Math.sqrt(3)) * 2,
          segments: 6,
        })
      )
    ),
    ...screwHolePositions.map(([x, y]) =>
      translate(
        [x == 0 ? x : x > 0 ? x - 10 : x + 10, x == 0 ? y - 30 : y],
        cylinder({
          height: basePlateSize[2],
          radius: 3.3 / 2,
        })
      )
    )
  );
};
