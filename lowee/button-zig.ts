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

const height = 1;

const base = subtract(
  cuboid({ size: [14.8, 14.8, height] }),
  cuboid({ size: [7.2 + 1.5, 5.7 + 1.5, height] })
);

export const main = () => {
  return union(
    translate(
      [-14.8 / 2, 14.8 / 2, -height / 2],
      union(
        cuboid({ size: [2, 4, height * 2], center: [-(4 - 2) / 2, 0, 0] }),
        cuboid({ size: [4, 2, height * 2], center: [0, (4 - 2) / 2, 0] })
      )
    ),
    subtract(
      union(base, translate([0, -14.8], base)),
      cuboid({ size: [12, 0.4, 3], center: [0, -14.8 / 2, 0] })
    )
  );

  return subtract(
    union(
      subtract(
        cylinder({ radius: 13, height: 1 }),
        cuboid({ size: [16, 16, 1] })
      ),
      cuboid({ size: [16, 2, 1] }),
      cuboid({ size: [2, 16, 1] })
    ),
    cylinder({ radius: 0.5, height: 1 })
  );
};
