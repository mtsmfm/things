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
} from "@jscad/modeling";
export { generalize } from "@jscad/modeling/src/operations/modifiers";
export { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";
export { Geom2, Geom3 } from "@jscad/modeling/src/geometries/types";

export const {
  cylinder,
  cuboid,
  rectangle,
  circle,
  sphere,
  cylinderElliptic,
  torus,
} = primitives;
export const {
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  align,
  translate,
  center,
  mirror,
} = transforms;
export const { subtract, union, intersect } = booleans;
export const { extrudeFromSlices, slice } = extrusions;
export const { expand } = expansions;
export const { degToRad } = utils;
export const { geom2 } = geometries;
export const { mat4 } = maths;
export const { colorize, colorNameToRgb } = colors;
export const { hull } = hulls;
