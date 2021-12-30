import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
  geometries,
  maths,
} from "@jscad/modeling";
import { Geom3, Geom2 } from "@jscad/modeling/src/geometries/types";
import { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";
import { flatBaseRoundedCylinder } from "../lowee/utils/utils";

const { cuboid, cylinder, cylinderElliptic, circle, roundedRectangle, sphere } =
  primitives;
const { rotate, translate, rotateX, rotateY, rotateZ, mirror } = transforms;
const { subtract, union, intersect } = booleans;
const { degToRad } = utils;
const { extrudeLinear, extrudeRectangular, extrudeFromSlices, slice } =
  extrusions;
const { geom2 } = geometries;
const { mat4 } = maths;

const corners = (obj: Geom3) => {
  return union(
    obj,
    mirror({ normal: [1, 0, 0] }, obj),
    mirror({ normal: [0, 1, 0] }, obj),
    mirror({ normal: [1, 0, 0] }, mirror({ normal: [0, 1, 0] }, obj))
  );
};

const roundTop = (
  base: Geom2,
  { height = 4, r1 = 0.2, r1Percent = 0, rx = 0.1, ry = 0, segments = 1 }
) => {
  if (r1Percent) r1 = r1Percent * height;
  ry = ry || rx;
  // radius is for one side, and scale factor is for both
  rx = rx * 2;
  ry = ry * 2;

  const numberOfSlices = 2 + segments;
  const step = 1 / (numberOfSlices - 1);
  const angleDelta = Math.PI / segments / 2;

  const startH = height - r1;

  const baseSlice = slice.fromSides(geom2.toSides(base));

  return extrudeFromSlices(
    {
      numberOfSlices,
      callback: (progress, counter, baseSlice) => {
        let h = progress * height;
        let scaleX = 1;
        let scaleY = 1;

        if (progress == 1) {
          // top slice (counter = numSlices-1)
          scaleX = 1 - rx;
          scaleY = 1 - ry;
        } else if (progress == step) {
          // first top slice (counter = 1)
          h = startH;
        } else if (progress > step) {
          // curve (counter = 2,3,4...)
          var angle = (counter - 1) * angleDelta;
          h = height - r1 + Math.sin(angle) * r1;
          scaleX = 1 - rx + Math.cos(angle) * rx;
          scaleY = 1 - rx + Math.cos(angle) * ry;
        } else {
          // bottom slice (counter = 0)
        }

        const scaleMatrix = mat4.fromScaling(mat4.create(), [
          scaleX,
          scaleY,
          1,
        ]);
        const transformMatrix = mat4.fromTranslation(mat4.create(), [0, 0, h]);
        return slice.transform(
          mat4.multiply(mat4.create(), scaleMatrix, transformMatrix),
          baseSlice
        );
      },
    },
    baseSlice
  );
};

export const main = () => {
  return union(
    subtract(
      roundTop(circle({ radius: 22 / 2 }), {
        height: 6,
        r1: 1,
        segments: 32,
      }),
      translate(
        [0, 0, 3 + 6 - 1],
        rotateX(
          degToRad(180),
          roundTop(circle({ radius: 20 / 2 }), {
            height: 3,
            r1: 2,
            segments: 32,
          })
        )
      ),
      cylinder({ height: 4.5, radius: 20.4 / 2, center: [0, 0, 4 / 2] })
    ),
    corners(sphere({ radius: 1 / 2, center: [5, 5, 5] }))
  );
};
