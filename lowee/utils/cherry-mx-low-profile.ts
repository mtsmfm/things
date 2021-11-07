import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";

const { cuboid, cylinder, cylinderElliptic, roundedCuboid, polygon } =
  primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

export const cherryMxlowProfileHole = rotate(
  [0, 0, degToRad(90)],
  union(
    cuboid({ size: [14, 14, 2], center: [0, 0, -1] }),
    cuboid({ size: [5, 1.5, 1], center: [0, 7, -(4 - 1) / 2] }),
    cuboid({ size: [5, 1.5, 1], center: [0, -7, -(4 - 1) / 2] })
  )
);

const clearance = 0.2;
const socketHeight = 3.5;

const cherryMxlowProfilePin = union(
  cylinder({ radius: (6 + clearance) / 2, height: socketHeight }),
  cylinder({
    radius: (2 + clearance) / 2,
    height: 2,
    center: [0, 4.3, -(socketHeight - 2) / 2],
  }),
  rotate(
    [0, 0, degToRad(90)],
    cuboid({ size: [2 + clearance, 7 + clearance, socketHeight] })
  ),
  cuboid({ size: [2 + clearance, 7 + clearance, socketHeight] })
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
      size: [0.4, 2.2, 2],
      center: [0.8, 1.4, 0],
    }),
    cuboid({
      size: [0.4, 2.2, 2],
      center: [-0.8, 1.4, 0],
    }),
    cylinder({ radius: 2, height: 1.5, center: [-0.5, 4, 0] })
  )
);

const pin = cuboid({ size: [1.2 + clearance, 0.8 + clearance, socketHeight] });

export const cherryMxlowProfileHoleHotswapSocket = rotate(
  [0, degToRad(180), degToRad(180)],
  subtract(
    cuboid({ size: [18, 18, socketHeight] }),
    translate([0, 6.1, (socketHeight - 1.5) / 2], socket),
    translate([0, 6.1, 0], pin),
    translate([3.8, 3.1, 0], pin),
    translate(
      [3.8, 3.1, (socketHeight - 1.5) / 2],
      rotate([0, 0, degToRad(180)], socket)
    ),
    cherryMxlowProfilePin,
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

export const main = () => {
  return union(
    subtract(
      cuboid({ size: [26, 26, 4] }),
      cylinder({ radius: 26 / 2, height: 2, center: [0, 0, 1] }),
      cherryMxlowProfileHole
    ),
    translate(
      [0, 0, -(socketHeight + 4) / 2],
      cherryMxlowProfileHoleHotswapSocket
    )
  );
};
