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

const height = 6.3;
const pillar = cylinder({ height, radius: 14 / 2, segments: 6 });
const suctionHole = cylinder({
  height,
  radius: (6 / 2 / Math.sqrt(3)) * 2,
  segments: 6,
});

export const main = () => {
  return subtract(
    union(pillar, translate([7, 0, 0], pillar)),
    suctionHole,
    translate(
      [0, 0, height / 2 - 3.25],
      rotate([degToRad(90), 0, 0], cylinder({ height: 20, radius: 1.5 }))
    ),
    translate(
      [8, 0, 0],
      union(
        cylinder({
          height,
          radius: 3.2 / 2,
        }),
        translate(
          [0, 0, (height - (height - 4)) / 2],
          cylinder({
            height: height - 4,
            radius: (6 + 0.3) / 2,
          })
        ),
        translate(
          [0, 0, (height - 4 - 2.2) / 2],
          cylinderElliptic({
            height: 2.2,
            startRadius: [(3 + 0.3) / 2, (3 + 0.3) / 2],
            endRadius: [(6 + 0.3) / 2, (6 + 0.3) / 2],
          })
        )
      )
    )
  );
};
