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

type Vec2 = [number, number];
type Vec3 = [number, number, number];

const capHeight = 3;
const shaftHeight = 4;
const segments = 32 * 4;
const capRadius = 23 / 2;

const flatBaseRoundedCylinder = ({
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

const cap = subtract(
  flatBaseRoundedCylinder({
    roundRadius: 2,
    radius: capRadius,
    height: capHeight + shaftHeight,
    segments,
  }),
  translate(
    [0, 0, capHeight / 2],
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
  cylinder({ radius: 5.5 / 2, height: shaftHeight, segments })
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

export const main = () => {
  return rotate(
    [0, degToRad(180), 0],
    subtract(
      union(cap, translate([0, 0, capHeight / 2], shaft)),
      translate([0, 0, capHeight / 2], shaftHole)
    )
  );
};
