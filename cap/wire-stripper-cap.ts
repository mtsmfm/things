import {
  primitives,
  transforms,
  booleans,
  extrusions,
  expansions,
  geometries,
  maths,
} from "@jscad/modeling";
import { Vec3 } from "@jscad/modeling/src/maths/types";

const { rectangle } = primitives;
const { align } = transforms;
const { subtract } = booleans;
const { extrudeFromSlices, slice } = extrusions;
const { expand } = expansions;
const { geom2 } = geometries;
const { mat4 } = maths;

const thickness = 1.5;
const offset = 0.2;

const body = extrudeFromSlices(
  {
    numberOfSlices: 2,
    callback: (_progress, index, base) => {
      const scaleMatrix = mat4.fromScaling(
        mat4.create(),
        { 0: [1, 1, 1], 1: [15 / 25, 1, 1] }[index]! as Vec3
      );

      const transformMatrix = mat4.fromTranslation(mat4.create(), [
        0,
        0,
        { 0: 0, 1: 40 }[index]!,
      ]);

      return slice.transform(
        mat4.multiply(mat4.create(), scaleMatrix, transformMatrix),
        slice.fromSides(geom2.toSides(base))
      );
    },
  },
  rectangle({ size: [25, 6] })
);

export const main = () => {
  return subtract(
    align(
      { modes: ["center", "center", "min"] },
      expand(
        { delta: offset + thickness, corners: "round", segments: 32 },
        body
      ),
      expand({ delta: offset }, body)
    )
  );
};
