import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";

import { main as cherryMxLowProfileTestFunc } from "./cherryMxLowProfileTest";

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

const base = cuboid({ size: [18, 18, 3] });

const clearance = 0.2;

const cherryMxlowProfileBase = union(
  cylinder({ radius: (6 + clearance) / 2, height: 3 }),
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
    cuboid({
      size: [1.8 + clearance, 1.2 + clearance, 2],
      center: [0, 0, 0.25],
    }),
    cuboid({
      size: [1.8 + clearance, 2.3 + clearance, 1.5],
      center: [0, 1.8 / 2 + 2.2, 0],
    }),
    cuboid({
      size: [0.6, 2.2, 2],
      center: [0.7, 1.4, 0],
    }),
    cuboid({
      size: [0.6, 2.2, 2],
      center: [-0.7, 1.4, 0],
    }),
    cylinder({ radius: 2, height: 1.5, center: [-0.5, 4, 0] })
  )
);

const pin = cuboid({ size: [1.2 + clearance, 0.8 + clearance, 3] });

const pcbTest = union(
  rotate(
    [degToRad(180), 0, degToRad(90)],
    translate([0, 0, (4 + 3) / 2], cherryMxLowProfileTestFunc())
  ),
  subtract(
    base,
    translate([0, 6.1, (3 - 1.5) / 2], socket),
    translate([0, 6.1, 0], pin),
    translate([3.8, 3.1, 0], pin),
    translate([3.8, 3.1, (3 - 1.5) / 2], rotate([0, 0, degToRad(180)], socket)),
    cherryMxlowProfileBase,
    rotate(
      [0, degToRad(90), 0],
      cylinder({ radius: 0.6, height: 100, center: [-0.7, 8, 0] })
    ),
    rotate(
      [0, degToRad(90), degToRad(90)],
      cylinder({ radius: 0.6, height: 100, center: [-0.7, -7.5, 0] })
    )
  )
);

const proMicroHole = union(
  subtract(
    cuboid({ size: [26, 54, 9] }),
    cylinder({
      radius: 1,
      height: 7,
      center: [7, -8.5, -2],
      segments: 6,
    }),
    cylinder({
      radius: 1,
      height: 7,
      center: [-7, -8.5, -2],
      segments: 6,
    }),
    cylinder({
      radius: 1,
      height: 7,
      center: [7, -24.5, -2],
      segments: 6,
    }),
    cylinder({
      radius: 1,
      height: 7,
      center: [-7, -24.5, -2],
      segments: 6,
    })
  )
);

export const main = () => {
  // return rotate([0, 0, degToRad(180)], proMicroHole);
  return union(
    pcbTest
    // translate(
    //   [0, (26 + 54) / 2, 10 / 2 - 5.5],
    //   subtract(
    //     cuboid({ size: [26, 54, 10] }),
    //     translate([0, 0, (10 - 9) / 2], proMicroHole)
    //   )
    // )
    // translate([-26, 0, 0], pcbTest),
    // translate([26, 0, 0], pcbTest)
  );
};
