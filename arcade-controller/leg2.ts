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
  sphere,
} = primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const height = 8.3;
const pillar = cylinder({ height, radius: 14 / 2, segments: 6 });
const hole = cylinder({
  height,
  radius: (6 / 2 / Math.sqrt(3)) * 2,
  segments: 6,
});

export const main = () => {
  return rotate(
    [degToRad(90), 0, 0],
    union(
      subtract(
        union(pillar, translate([7, 0, 0], pillar)),
        hole,
        translate(
          [0, 0, 0.9],
          rotate([degToRad(90), 0, 0], cylinder({ height: 20, radius: 1.5 }))
        ),
        translate(
          [8, 0, 0],
          cylinder({
            height,
            radius: (4.5 / 2 / Math.sqrt(3)) * 2,
            segments: 6,
          })
        )
      )
    )
  );
};
