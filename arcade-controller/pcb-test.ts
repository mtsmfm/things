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

const base = cuboid({ size: [15, 15, 3] });

const clearance = 0.2;

const cherryMxlowProfileBase = union(
  cylinder({ radius: (5 + clearance) / 2, height: 3 }),
  cylinder({ radius: (2 + clearance) / 2, height: 2, center: [0, 4.3, -0.5] }),
  rotate(
    [0, 0, degToRad(90)],
    cuboid({ size: [2 + clearance, 7 + clearance, 3] })
  ),
  cuboid({ size: [2 + clearance, 7 + clearance, 3] })
);

const socket = rotate(
  [0, degToRad(180), degToRad(90)],
  union(
    cuboid({ size: [1.8, 1, 2], center: [0, 0, 0.25] }),
    cuboid({ size: [1.8, 2, 1.5], center: [0, 1.8 / 2 + 1.8, 0] })
  )
);

const pin = cuboid({ size: [1, 0.5, 3] });

export const main = () => {
  return union(
    subtract(
      base,
      translate([0, 6.2, (3 - 1.5) / 2], socket),
      translate([0, 6.2, 0], pin),
      translate([3.8, 3, 0], pin),
      translate([3.8, 3, (3 - 1.5) / 2], rotate([0, 0, degToRad(180)], socket)),
      cherryMxlowProfileBase
    )
    // subtract(
    //   base,
    //   translate([0, 6, 0], pin),
    //   translate([3.8, 3, 0], pin)
    //   // translate([0, 6, -(3 - 1.5) / 2], socket),
    //   // translate([3.8, 3, -(3 - 1.5) / 2],rotate([0,0,degToRad(180)], socket)),
    //   // cherryMxlowProfileBase
    // )
  );
};
