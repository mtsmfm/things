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

const pillar = cylinder({ height: 30, radius: 5 });
const bottom = cuboid({ size: [20, 20, 3] });
const pin = cylinder({ height: 5, radius: 3, segments: 8 });
const pinHole = cylinder({ height: 11, radius: 1 });
const chamfer = sphere({ radius: 3, segments: 8 });

export const main = () => {
  return union(
    pillar,
    translate([0, 0, -30 / 2 + 3 / 2], bottom),
    translate(
      [0, 0, 30 / 2 + 5 / 2],
      subtract(union(pin, translate([0, 0, 2.5], chamfer)), pinHole)
    )
  );
};
