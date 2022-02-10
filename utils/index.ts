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
import { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";
import { Geom2, Geom3 } from "@jscad/modeling/src/geometries/types";
import hulljs from "hull.js";

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
  roundedRectangle,
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
export const { extrudeFromSlices, extrudeLinear, project } = extrusions;
export const { expand, offset } = expansions;
export const { degToRad } = utils;
export const { geom2 } = geometries;
export const { mat4 } = maths;
export const { colorize, colorNameToRgb } = colors;
export const { hull, hullChain } = hulls;
export const { measureBoundingBox, measureAggregateBoundingBox } = measurements;

export { Geom2, Geom3 };
export { Vec2, Vec3 };

export const corners = (obj: Geom3) => {
  return [
    obj,
    mirror({ normal: [1, 0, 0] }, obj),
    mirror({ normal: [0, 1, 0] }, obj),
    mirror({ normal: [1, 0, 0] }, mirror({ normal: [0, 1, 0] }, obj)),
  ];
};

export const replace = (a: Geom3, ...bs: Geom3[]) => {
  try {
    return union(subtract(a, union(bs.map((b) => hull(b, b)))), bs);
  } catch {
    // XXX
    //   out[0] = a[0] - b[0]
    //             ^
    // TypeError: Cannot read properties of undefined (reading '0')
    return bs.reduce((acc, b) => union(subtract(acc, hull(b, b)), b), a);
  }
};

export const projectAndCut = (geom: Geom3) => {
  const [min, max] = measureBoundingBox(geom);

  const bottom = rectangle({
    size: [
      Math.max(Math.abs(max[0]), Math.abs(min[0])) * 2,
      Math.max(Math.abs(max[1]), Math.abs(min[1])) * 2,
    ],
  });

  return project({}, intersect(geom, extrudeLinear({ height: 0.01 }, bottom)));
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

export const onlyPositiveZ = (...geoms: Geom3[]) => {
  return geoms.map((geom) => {
    const [min, max] = measureBoundingBox(geom);

    const bottom = rectangle({
      size: [
        Math.max(Math.abs(max[0]), Math.abs(min[0])) * 2,
        Math.max(Math.abs(max[1]), Math.abs(min[1])) * 2,
      ],
    });

    return intersect(geom, extrudeLinear({ height: max[2] }, bottom));
  });
};

export const placeSideBySideY = (...geoms: Geom3[]) => {
  return center(
    {},
    geoms.reduce((acc, geom) => {
      return union(
        align({ modes: ["none", "max", "none"] }, acc),
        align({ modes: ["none", "min", "none"] }, geom)
      );
    })
  );
};

export const placeSideBySideZ = (...geoms: Geom3[]) => {
  return center(
    {},
    geoms.reduce((acc, geom) => {
      return union(
        align({ modes: ["none", "none", "min"] }, acc),
        align({ modes: ["none", "none", "max"] }, geom)
      );
    })
  );
};

export const concaveHullX = (...geoms: Geom3[]) => {
  const [min, max] = measureAggregateBoundingBox(...geoms);
  const height = Math.max(Math.abs(min[0]), Math.abs(max[0])) * 2;
  return intersect(
    rotateY(
      degToRad(90),
      align(
        { modes: ["none", "none", "center"] },
        extrudeLinear(
          { height },
          offset(
            { delta: -0.01 },
            polygon({
              points: hulljs(
                geom2.toPoints(project({ axis: [1, 0, 0] }, union(geoms)))
              ),
            })
          )
        )
      )
    ),
    union(hullChain(geoms))
  );
};

export const joinX = (...geoms: Geom3[]) => {
  return replace(concaveHullX(...geoms), ...geoms);
};

export const cuboidElliptic = ({
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

export const m3InsertNutHoleRadius = 4.5 / 2;
export const m2InsertNutHoleRadius = 3 / 2;
export const m2ScrewHoleRadius = 2.5 / 2;
export const m2NutRadius = (4.6 + 0.4) / 2;
export const m2NutHeight = 1.6 + 0.2;
export const m2ScrewHeadRadius = 5 / 2;
