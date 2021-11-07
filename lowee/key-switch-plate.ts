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
import * as promicroCase from "./utils/promicro-case";
import {
  cherryMxlowProfileHole,
  cherryMxlowProfileHoleHotswapSocket,
} from "./utils/cherry-mx-low-profile";

const { cuboid, cylinder, cylinderElliptic, roundedCuboid, polygon } =
  primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const basePlate = cuboid({
  size: basePlateSize,
});

export const main = () => {
  return subtract(
    union(
      subtract(
        basePlate,
        ...circleButtonPositions.map(([x, y]) =>
          translate(
            [x, y, 0],
            union(
              cylinder({
                radius: 26 / 2,
                height: 2,
                center: [0, 0, (4 - 2) / 2],
              }),
              cherryMxlowProfileHole
            )
          )
        ),
        ...squareButtonPositions.map(([x, y]) =>
          translate(
            [x, y, 0],
            union(
              cuboid({ size: [20, 20, 2], center: [0, 0, (4 - 2) / 2] }),
              cherryMxlowProfileHole
            )
          )
        ),
        cuboid({
          size: [57, 22, 1],
          center: [-(basePlateSize[0] - 57) / 2, -30, -(4 - 1) / 2],
        })
      ),
      ...circleButtonPositions.map(([x, y]) =>
        translate([x, y, -(3.5 + 4) / 2], cherryMxlowProfileHoleHotswapSocket)
      ),
      ...squareButtonPositions.map(([x, y]) =>
        translate([x, y, -(3.5 + 4) / 2], cherryMxlowProfileHoleHotswapSocket)
      ),
      translate(
        [-(basePlateSize[0] - 57) / 2, -30, -(4 - 2) / 2 + 1],
        rotate([0, 0, degToRad(90)], promicroCase.main())
      ),
      ...screwHolePositions.map(([x, y]) =>
        translate([x, y, -(4 + 1) / 2], cuboid({ size: [10, 10, 1] }))
      )
    ),
    ...screwHolePositions.map(([x, y]) =>
      translate(
        [x, y, -(4 + 1 * 2 - 3) / 2],
        cylinder({
          height: 3,
          radius: (4.5 / 2 / Math.sqrt(3)) * 2,
          segments: 6,
        })
      )
    )
  );
};
