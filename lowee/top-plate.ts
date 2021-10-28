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
  squareButtonHoleSize,
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

const squareButtonHole = cuboid({
  size: [squareButtonHoleSize, squareButtonHoleSize, 4],
});

const basePlate = cuboid({
  size: basePlateSize,
});

const screwHole = cylinder({
  radius: screwHoleRadius,
  height: basePlateSize[2],
});

export const main = () => {
  return subtract(
    basePlate,
    ...circleButtonPositions.map(([x, y]) =>
      translate([x, y, 0], circleButtonHole)
    ),
    ...squareButtonPositions.map(([x, y]) =>
      translate([x, y, 0], squareButtonHole)
    ),
    ...screwHolePositions.map(([x, y]) => translate([x, y, 0], screwHole))
  );
};
