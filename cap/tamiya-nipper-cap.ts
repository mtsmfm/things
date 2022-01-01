import {
  extrudeFromSlices,
  subtract,
  align,
  expand,
  mat4,
  slice,
  geom2,
  rectangle,
} from "../utils";

const thickness = 1.5;
const offset = 0.2;

const nipper = extrudeFromSlices(
  {
    numberOfSlices: 3,
    callback: (_progress, index, base) => {
      const scaleMatrix = mat4.fromScaling(
        mat4.create(),
        index < 2 ? [1, 1, 1] : [0.1, 0.1, 1]
      );

      const transformMatrix = mat4.fromTranslation(mat4.create(), [
        0,
        { 0: 0, 1: 0, 2: 10 }[index]!,
        { 0: 0, 1: 20, 2: 30 }[index]!,
      ]);

      return slice.transform(
        mat4.multiply(mat4.create(), scaleMatrix, transformMatrix),
        slice.fromSides(geom2.toSides(base))
      );
    },
  },
  rectangle({ size: [11, 6.9] })
);

export const main = () => {
  return subtract(
    align(
      { modes: ["center", "center", "min"] },
      expand(
        { delta: offset + thickness, corners: "round", segments: 32 },
        nipper
      ),
      expand({ delta: offset }, nipper)
    )
  );
};
