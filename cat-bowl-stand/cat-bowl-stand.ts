import {
  extrudeFromSlices,
  mat4,
  geom2,
  slice,
  rectangle,
  cuboid,
  subtract,
  align,
  expand,
  center,
} from "../utils";

const thickness = 4;
const bowlSize = 100;
const height = 81;

const slices = align({ modes: ["center", "min", "center"] }, [
  rectangle({ size: [bowlSize, 20] }),
  rectangle({ size: [bowlSize, bowlSize] }),
  rectangle({ size: [bowlSize, bowlSize] }),
]);

const inner = extrudeFromSlices(
  {
    numberOfSlices: 3,
    callback: (_progress, index, _base) => {
      const transformMatrix = mat4.fromTranslation(mat4.create(), [
        0,
        0,
        { 0: 0, 1: height / 4, 2: height }[index]!,
      ]);

      return slice.transform(
        transformMatrix,
        slice.fromSides(geom2.toSides(slices[index]))
      );
    },
  },
  slices[0]
);

export const main = () => {
  return subtract(
    center(
      {},
      subtract(
        align(
          { modes: ["center", "center", "max"] },
          subtract(
            expand({ delta: thickness, corners: "round", segments: 32 }, inner),
            inner
          ),
          inner
        )
      )
    ),
    cuboid({ size: [bowlSize, 20, height * 2], center: [0, -40, 0] }),
    cuboid({ size: [bowlSize, 50, height * 2], center: [0, 12, 0] })
  );
};
