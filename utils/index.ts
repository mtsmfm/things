import {
  primitives,
  transforms,
  booleans,
  extrusions,
  expansions,
  geometries,
  maths,
  utils,
  colors,
  hulls,
  measurements,
} from "@jscad/modeling";
export { generalize } from "@jscad/modeling/src/operations/modifiers";
export { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";
import { Geom2, Geom3 } from "@jscad/modeling/src/geometries/types";

export const {
  cylinder,
  cuboid,
  rectangle,
  circle,
  sphere,
  cylinderElliptic,
  torus,
  polygon,
  polyhedron,
} = primitives;
export const {
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  align,
  translate,
  translateX,
  translateY,
  translateZ,
  center,
  mirror,
  mirrorX,
  mirrorY,
  mirrorZ,
} = transforms;
export const { subtract, union, intersect } = booleans;
export const { extrudeFromSlices, extrudeLinear } = extrusions;
export const { expand } = expansions;
export const { degToRad } = utils;
export const { geom2 } = geometries;
export const { mat4 } = maths;
export const { colorize, colorNameToRgb } = colors;
export const { hull, hullChain } = hulls;
export const { measureBoundingBox, measureAggregateBoundingBox } = measurements;

export { Geom2, Geom3 };

export const corners = (obj: Geom3) => {
  return [
    obj,
    mirror({ normal: [1, 0, 0] }, obj),
    mirror({ normal: [0, 1, 0] }, obj),
    mirror({ normal: [1, 0, 0] }, mirror({ normal: [0, 1, 0] }, obj)),
  ];
};

export const replace = (a: Geom3, b: Geom3 | Geom3[]) => {
  return union(
    subtract(
      a,
      [b].flat().map((x) => hull(x, x))
    ),
    b
  );
};

type AlignOption = Parameters<typeof align>["0"];

export const alignSubtract = (
  obj: Geom3,
  ...args: [AlignOption | AlignOption[], Geom3][]
) => {
  return args.reduce((acc, [alignOptionOrOptions, obj]) => {
    return [alignOptionOrOptions].flat().reduce((innerAcc, opt) => {
      return center({}, subtract(align(opt, innerAcc, obj)));
    }, acc);
  }, obj);
};

export const onlyPositiveZ = (obj: Geom3) => {
  const [min, max] = measureBoundingBox(obj);

  const bottom = rectangle({
    size: [
      Math.max(Math.abs(max[0]), Math.abs(min[0])) * 2,
      Math.max(Math.abs(max[1]), Math.abs(min[1])) * 2,
    ],
  });

  return intersect(obj, extrudeLinear({ height: max[2] }, bottom));
};

export const m3InsertNutHoleRadius = 4.5 / 2;
export const m2ScrewHoleRadius = 2.5 / 2;
export const m2NutRadius = (4.6 + 0.4) / 2;
export const m2NutHeight = 1.6 + 0.2;
