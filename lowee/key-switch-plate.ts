import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";
import {
  circleButtonPositions,
  basePlateSize,
  squareButtonPositions,
  screwHolePositions,
  screwHoleRadius,
} from "./utils";

const {
  cuboid,
  cylinder,
  cylinderElliptic,
  roundedCuboid,
  polygon,
} = primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const circleButtonHole = cylinder({ height: 4, radius: 13.5 });

const basePlate = cuboid({
  size: basePlateSize,
});

const screwHole = cylinder({
  radius: screwHoleRadius,
  height: basePlateSize[2],
});

const cherryMxlowProfileHole = union(
  cuboid({ size: [15.1, 15.1, 2], center: [0, 0, 1] }),
  cuboid({ size: [14, 14, 2], center: [0, 0, -1] }),
  cuboid({ size: [5, 1.5, 1], center: [0, 7, -(4 - 1) / 2] }),
  cuboid({ size: [5, 1.5, 1], center: [0, -7, -(4 - 1) / 2] })
);

const cherryMxHole = union(
  cuboid({ size: [14, 14, 4] }),
  cuboid({ size: [5, 1.5, 2.5], center: [0, 7, -(4 - 2.5) / 2] }),
  cuboid({ size: [5, 1.5, 2.5], center: [0, -7, -(4 - 2.5) / 2] })
);

export const main = () => {
  return subtract(
    basePlate,
    ...circleButtonPositions.map(([x, y]) =>
      translate([x, y, 0], cherryMxHole)
    ),
    ...squareButtonPositions.map(([x, y]) =>
      translate([x, y, 0], cherryMxlowProfileHole)
    ),
    ...screwHolePositions.map(([x, y]) => translate([x, y, 0], screwHole))
  );
};
