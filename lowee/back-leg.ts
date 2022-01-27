import {
  cylinder,
  subtract,
  union,
  translate,
  rotate,
  degToRad,
  cylinderElliptic,
  align,
  center,
  hull,
  cuboid,
} from "../utils";

const height = 7.2;
const suctionHole = cylinder({
  height,
  radius: (8 / 2 / Math.sqrt(3)) * 2,
  segments: 6,
});
const chamferHeight = 2.2;
const shaftHeight = 4 - chamferHeight;

const size = 11;

const suctionHolder = center(
  {},
  subtract(
    align(
      { modes: ["min", "center", "center"] },
      subtract(
        cuboid({
          size: [size, size, height],
        }),
        suctionHole
      ),
      rotate(
        [degToRad(90), 0, degToRad(90)],
        cylinder({ height: 12, radius: 4 / 2 })
      )
    )
  )
);

const screwHole = union(
  cylinder({
    height,
    radius: (3 + 0.3) / 2,
  }),
  translate(
    [0, 0, (height - (height - (shaftHeight + chamferHeight))) / 2],
    cylinder({
      height: height - (shaftHeight + chamferHeight),
      radius: (6 + 0.3) / 2,
    })
  ),
  translate(
    [0, 0, -(height - chamferHeight) / 2 + shaftHeight],
    cylinderElliptic({
      height: chamferHeight,
      startRadius: [(3 + 0.3) / 2, (3 + 0.3) / 2],
      endRadius: [(6 + 0.3) / 2, (6 + 0.3) / 2],
    })
  )
);

export const main = () => {
  return [
    subtract(
      union(
        suctionHolder,
        subtract(
          translate(
            [7, 0, 0],
            cylinder({ height, radius: size / Math.sqrt(3), segments: 6 })
          ),
          hull(suctionHolder, suctionHolder)
        )
      ),
      translate([9, 0, 0], screwHole)
    ),
  ];
};
