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
  roundedCylinder,
  polygon,
  torus,
} = primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export const circleButtonPositions = [
  [-80, 20],
  [-50, 20],
  [-20, 10],
  [0, -40],
  [15, 0],
  [45, 10],
  [75, 10],
  [105, 5],
  [20, 30],
  [50, 40],
  [80, 40],
  [110, 35],
];

export const basePlateSize: Vec3 = [250, 140, 4];

export const squareButtonHoleSize = 19;
const squareButtonKeyPitch = squareButtonHoleSize + 2;

export const squareButtonPositions = Array.from({ length: 4 }).map((_, i) => [
  -90 + squareButtonKeyPitch * i,
  55,
]);

export const screwHolePositions = [
  ...[
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ].map(([i, j]) => [
    (basePlateSize[0] / 2 - 5) * i,
    (basePlateSize[1] / 2 - 5) * j,
  ]),
  [0, 15],
];

export const screwHoleRadius = 3.5 / 2;

export const flatBaseRoundedCylinder = ({
  height,
  radius,
  roundRadius,
  segments,
}: {
  radius: number;
  roundRadius: number;
  height: number;
  segments: number;
}) => {
  const innerRadius = roundRadius;
  const outerRadius = radius - innerRadius;

  return union(
    translate(
      [0, 0, -height / 2 + innerRadius],
      union(
        torus({
          innerRadius,
          innerSegments: segments,
          outerRadius,
          outerSegments: segments,
        }),
        cylinder({ radius: outerRadius, height: innerRadius * 2, segments })
      )
    ),
    translate(
      [0, 0, height / 2 - innerRadius],
      union(cylinder({ radius: radius, height: innerRadius * 2, segments }))
    ),
    cylinder({ radius, height: height - innerRadius * 2, segments })
  );
};
