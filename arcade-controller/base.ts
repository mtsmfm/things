import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";

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

const keySwitchHole = union(
  cuboid({ size: [14, 14, 4] }),
  cuboid({ size: [5, 1.5, 2.5], center: [0, 7, -(4 - 2.5) / 2] }),
  cuboid({ size: [5, 1.5, 2.5], center: [0, -7, -(4 - 2.5) / 2] })
);

const buttonHole = cylinder({ height: 4, radius: 13 });

const buttonPositions = [
  [80, -20],
  [50, -20],
  [20, -10],
  [0, 40],
  [-15, 0],
  [-45, -10],
  [-75, -10],
  [-105, 0],
  [-20, -30],
  [-50, -40],
  [-80, -40],
  [-110, -30],
];

const basePlate = cuboid({ size: [250, 140, 4] });

const tri = translate(
  [0, 0, -10],
  extrudeLinear(
    { height: 20 },
    polygon({
      points: [
        [0, 0],
        [14, 0],
        [14, 20],
      ],
    })
  )
);

const truss = union(
  tri,
  rotate([0, 0, degToRad(180)], translate([-7, -20, 0], tri))
);

const trusses = (
  x: number,
  y: number,
  skipIf: (x: number, y: number) => boolean
) => {
  return Array.from({ length: x })
    .flatMap((_, i) => Array.from({ length: y }).map((_, j) => [i, j]))
    .filter(([i, j]) => !skipIf(i, j))
    .map(([i, j]) => translate([i * 24.5, j * 25, 0], truss));
};

export const main = () => {
  // subtract(
  //   basePlate,
  //   ...buttonPositions.map(([x, y]) => translate([x, y, 0], buttonHole))
  // ),
  return subtract(
    basePlate,
    ...buttonPositions.map(([x, y]) => translate([x, y, 0], keySwitchHole)),
    translate(
      [-113, -62, 0],
      ...trusses(10, 5, (x, y) =>
        [
          [0, 1],
          [0, 2],
          [1, 0],
          [1, 1],
          [1, 2],
          [2, 0],
          [2, 1],
          [2, 2],
          [3, 0],
          [3, 1],
          [3, 2],
          [4, 1],
          [4, 2],
          [4, 3],
          [4, 4],
          [5, 1],
          [5, 2],
          [5, 3],
          [5, 4],
          [6, 1],
          [6, 2],
          [7, 1],
          [7, 2],
          [8, 1],
          [8, 2],
        ].some(([i, j]) => i === x && j === y)
      )
    )
  );
};
