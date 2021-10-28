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

const height = 14;
const pillar = cylinder({ height, radius: 1.2, segments: 6 });
const hole = cylinder({
  height,
  radius: 0.3,
});

export const main = () => {
  return union(
    subtract(pillar, hole),
    translate([0, 0, -height / 2], cylinder({ radius: 1.5, height: 0.5 }))
  );
};
