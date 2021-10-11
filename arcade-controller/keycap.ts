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
} = primitives;
const { rotate, translate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

type Vec2 = [number, number];
type Vec3 = [number, number, number];

const cuboidElliptic = ({
  center,
  startSize,
  endSize,
  height,
}: {
  startSize: Vec2;
  endSize: Vec2;
  height: number;
  center: Vec3;
}) => {
  return cylinderElliptic({
    height,
    startRadius: startSize.map((n) => n / Math.sqrt(2)) as Vec2,
    endRadius: endSize.map((n) => n / Math.sqrt(2)) as Vec2,
    segments: 4,
    startAngle: Math.PI / 4,
    endAngle: Math.PI / 4,
    center: center,
  });
};

const capHeight = 3;
const shaftHeight = 4;

const cap = cylinderElliptic({
  startRadius: [(24 / 2) * 0.9, (24 / 2) * 0.9],
  height: capHeight,
  endRadius: [24 / 2, 24 / 2],
});

const shaft = subtract(cylinder({ radius: 5.5 / 2, height: shaftHeight }));

const makeEdge = ({ size, edgeSize }: { size: Vec3; edgeSize: number }) => {
  const edge = extrudeLinear(
    { height: size[2] },
    polygon({
      points: [
        [-edgeSize, -edgeSize],
        [size[0] + edgeSize, -edgeSize],
        [size[0], edgeSize],
        [0, edgeSize],
      ],
    })
  );

  return union(
    translate([-size[0] / 2, -size[1] / 2 + edgeSize, -size[2] / 2], edge),
    translate(
      [size[0] / 2, size[1] / 2 - edgeSize, -size[2] / 2],
      rotate([0, 0, degToRad(180)], edge)
    )
  );
};

const shaftHole = union(
  cuboid({ size: [1.35, 4.3, shaftHeight] }),
  cuboid({ size: [4.3, 1.4, shaftHeight] })
  // cuboidElliptic({
  //   center: [0, 0, 0],
  //   startSize: [1.3, 4.3],
  //   endSize: [1.2, 4.1],
  //   height: shaftHeight,
  // }),
  // makeEdge({ size: [1.2, 4.1, shaftHeight], edgeSize: 0.2 }),
  // cuboidElliptic({
  //   center: [0, 0, 0],
  //   startSize: [4.3, 1.4],
  //   endSize: [4.1, 1.4],
  //   height: shaftHeight,
  // }),
  // rotate(
  //   [0, 0, degToRad(90)],
  //   makeEdge({ size: [1.4, 4.1, shaftHeight], edgeSize: 0.2 })
  // )
);

export const main = () => {
  return subtract(
    union(cap, translate([0, 0, (capHeight + shaftHeight) / 2], shaft)),
    translate([0, 0, (capHeight + shaftHeight) / 2], shaftHole)
  );
};
