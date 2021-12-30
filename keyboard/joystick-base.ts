import { primitives, transforms, booleans, utils } from "@jscad/modeling";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";

const { cuboid, cylinder, cylinderElliptic } = primitives;
const { rotate, translate, rotateX, rotateY, rotateZ, mirror } = transforms;
const { subtract, union, intersect } = booleans;
const { degToRad } = utils;

const corners = (obj: Geom3) => {
  return union(
    obj,
    mirror({ normal: [1, 0, 0] }, obj),
    mirror({ normal: [0, 1, 0] }, obj),
    mirror({ normal: [1, 0, 0] }, mirror({ normal: [0, 1, 0] }, obj))
  );
};

export const main = () => {
  return subtract(
    union(
      translate(
        [0, 0, -(9 + 4) / 2],
        subtract(
          cylinder({ height: 4, radius: 10 }),
          cuboid({
            size: [6, 1.5, 10],
            center: [0, 6, (3 - 1.5) / 2],
          }),
          translate(
            [0, 0, -(4 - 3) / 2],
            subtract(
              cuboid({ size: [11.5, 15, 3] }),
              cuboid({
                size: [5, 1.5, 1.5],
                center: [0, 0, (3 - 1.5) / 2],
              }),
              corners(
                cuboid({
                  size: [1.5, 1.5, 1.5],
                  center: [11.5 / 2, 15 / 2, (3 - 1.5) / 2],
                })
              )
            )
          )
        )
      ),
      cylinder({ height: 9, radius: 6 / 2 })
    ),
    cuboid({ size: [4.1, 3.1, 6], center: [0, 0, (9 - 6) / 2] })
  );
};
