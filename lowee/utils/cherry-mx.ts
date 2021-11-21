import { primitives, transforms, booleans, utils } from "@jscad/modeling";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";

const { cuboid, cylinder, cylinderElliptic } = primitives;
const { rotate, translate, rotateX, rotateY, rotateZ, mirrorX, mirrorY } =
  transforms;
const { subtract, union, intersect } = booleans;
const { degToRad } = utils;

const height = 5;

export const keySwitchHole = union(
  cuboid({ size: [14, 14, height] }),
  union(
    cuboid({ size: [5, 1.5, 3.5], center: [0, 7, -(height - 3.5) / 2] }),
    cuboid({ size: [5, 1.5, 3.5], center: [0, -7, -(height - 3.5) / 2] })
  )
);

const pcbClick = translate(
  [-3, (18 + 2) / 2, 0],
  translate(
    [0, 0, -(9 - height) / 2],
    subtract(
      cuboid({ size: [4, 2, 9] }),
      cuboid({ size: [4, 0.3, 2], center: [0, -(2 - 0.3) / 2, -(5 - 2) / 2] })
    ),
    translate(
      [0, -(3.5 - 2) / 2, -(9 - 2) / 2],
      subtract(
        cuboid({ size: [4, 3.5, 2] }),
        rotate(
          [degToRad(30), 0, 0],
          cuboid({ size: [4, 4, 1], center: [0, 0, 1.5] })
        )
      )
    )
  )
);

export const pcbClicks = union(pcbClick, mirrorX(mirrorY(pcbClick)));

export const main = () => {
  return union(
    subtract(cuboid({ size: [18, 18, height] }), keySwitchHole),
    pcbClicks
  );
};
