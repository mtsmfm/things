import {
  cuboid,
  degToRad,
  subtract,
  translate,
  Geom3,
  rotateX,
  joinX,
  cylinder,
  union,
  align,
  replace,
  m2NutRadius,
  m2NutHeight,
  m2ScrewHoleRadius,
  m2ScrewHeadRadius,
  rotate,
  rotateY,
  translateZ,
  onlyPositiveZ,
  placeSideBySideZ,
  intersect,
  rotateZ,
  colorize,
  cuboidElliptic,
} from "../utils";
import { cherryMxKeySwitchHole } from "./cherry-mx-key-switch-hole";

const keySwitchHolderWidth = 18;
const keySwitchHolderHeight = 4;
const contouredKeySwitchHolderBaseSize = keySwitchHolderWidth + 4;
const contouredDeg = 18;
const poleRadius = 4;

const contoured = (
  {
    n,
    baseSize,
    deg,
  }: {
    n: number;
    baseSize: number;
    deg: number;
  },
  geom: Geom3
) => {
  const k = n > 0 ? 1 : -1;

  return Array.from({ length: Math.abs(n) }).reduce<Geom3>(
    (acc, _) =>
      translate(
        [
          0,
          (baseSize / 2 + Math.cos(degToRad(deg)) * (baseSize / 2)) * k,
          (baseSize / 2) * Math.sin(degToRad(deg)),
        ],
        rotateX(degToRad(deg) * k, acc)
      ),
    geom
  );
};

const contouredBetween = (
  {
    n,
    baseSize,
    spaceSize,
    deg,
  }: {
    n: number;
    baseSize: number;
    spaceSize: number;
    deg: number;
  },
  geom: Geom3
) => {
  const y = Math.cos(degToRad(deg / 2)) ** 2 * 2;
  const z = Math.sin(degToRad(deg / 2)) * 2;

  return contoured(
    { n: n - 1, baseSize, deg },
    translate(
      [0, (baseSize - spaceSize) / 2 + y, z],
      rotateX(degToRad(deg / 2), geom)
    )
  );
};

const base = align(
  { modes: ["none", "none", "min"] },
  subtract(
    cuboid({
      size: [keySwitchHolderWidth, keySwitchHolderWidth, keySwitchHolderHeight],
    }),
    cherryMxKeySwitchHole
  )
);

const createMatrix = (fn: (n: number) => Geom3 | Geom3[]) => {
  return translateZ(
    8,
    translate([3.5, 0, 20], rotate([0, degToRad(35), degToRad(-5)], fn(4))),
    translate(
      [contouredKeySwitchHolderBaseSize + 0.5, 0, 10],
      rotate([0, degToRad(30), degToRad(-5)], fn(4))
    ),
    translate(
      [contouredKeySwitchHolderBaseSize * 2, 0, 4.5],
      rotate([0, degToRad(24), degToRad(-4)], fn(4))
    ),
    translate(
      [contouredKeySwitchHolderBaseSize * 3, 0, 0.5],
      rotate([0, degToRad(18), degToRad(-2)], fn(5))
    ),
    translate(
      [contouredKeySwitchHolderBaseSize * 4 + 1.5, 0, 0],
      rotate([0, degToRad(9), degToRad(-2)], fn(5))
    ),
    translate(
      [contouredKeySwitchHolderBaseSize * 5 + 1, 0, 0],
      rotate([0, degToRad(5), degToRad(-1)], fn(4))
    )
  );
};

export const createColumn = (count: number) => {
  return subtract(
    union(
      joinX(
        ...Array.from({ length: count }).map((_, i) =>
          contoured(
            {
              n: i - 2,
              deg: contouredDeg,
              baseSize: contouredKeySwitchHolderBaseSize,
            },
            base
          )
        )
      )
    ),
    [-1, 1].map((n) =>
      contouredBetween(
        {
          n,
          deg: contouredDeg,
          baseSize: contouredKeySwitchHolderBaseSize,
          spaceSize: contouredKeySwitchHolderBaseSize - keySwitchHolderWidth,
        },
        union(
          align(
            {
              modes: ["none", "none", "max"],
              relativeTo: [0, 0, keySwitchHolderHeight] as any,
            },
            cylinder({
              radius: m2NutRadius / 2,
              height: m2NutHeight,
              segments: 6,
            }),
            cylinder({
              radius: m2ScrewHoleRadius / 2,
              height: keySwitchHolderHeight,
            })
          )
        )
      )
    )
  );
};

const columnPole = subtract(
  placeSideBySideZ(
    intersect(
      cylinder({
        height: 3,
        radius: poleRadius,
      }),
      cuboid({ size: [poleRadius * 2, 3.3, 3] })
    ),
    subtract(
      align(
        { modes: ["none", "none", "max"] },
        cylinder({
          height: 50,
          radius: poleRadius,
        })
      ),
      align(
        {
          modes: ["none", "none", "max"],
          relativeTo: [0, 0, -(9 - 3 - keySwitchHolderHeight)] as any,
        },
        cylinder({
          height: 50,
          radius: m2ScrewHeadRadius,
        })
      )
    )
  ),
  cylinder({
    height: 53,
    radius: m2ScrewHoleRadius,
  })
);

const thumbPole = subtract(
  placeSideBySideZ(
    intersect(
      cylinder({
        height: 1.5,
        radius: poleRadius,
      }),
      union(
        cuboid({ size: [poleRadius * 2, 1, 1.5] }),
        cuboid({ size: [1, poleRadius * 2, 1.5] })
      )
    ),
    subtract(
      align(
        { modes: ["none", "none", "max"] },
        cylinder({
          height: 50,
          radius: poleRadius,
        })
      ),
      align(
        {
          modes: ["none", "none", "max"],
          relativeTo: [0, 0, -(9 - 1.5 - keySwitchHolderHeight)] as any,
        },
        cylinder({
          height: 50,
          radius: m2ScrewHeadRadius,
        })
      )
    )
  ),
  cylinder({
    height: 53,
    radius: m2ScrewHoleRadius,
  })
);

const joystickPole = subtract(
  subtract(
    align(
      { modes: ["none", "none", "max"] },
      cylinder({
        height: 50,
        radius: poleRadius,
      })
    ),
    align(
      {
        modes: ["none", "none", "max"],
        relativeTo: [0, 0, -(9 - keySwitchHolderHeight)] as any,
      },
      cylinder({
        height: 50,
        radius: m2ScrewHeadRadius,
      })
    )
  ),
  cylinder({
    height: 53,
    radius: m2ScrewHoleRadius,
  })
);

const keyCap = placeSideBySideZ(
  cuboidElliptic({
    startSize: [18, 18],
    endSize: [13, 13],
    height: 8,
    center: [0, 0, 0],
  }),
  cuboid({ size: [18, 18, 6] })
);

export const base1 = onlyPositiveZ(
  replace(
    align(
      { modes: ["min", "min", "min"], relativeTo: [-28, -60, 0] as any },
      rotateZ(degToRad(6), cuboid({ size: [145, 20, 3] }))
    ),
    createMatrix(() =>
      contouredBetween(
        {
          n: -1,
          deg: contouredDeg,
          baseSize: contouredKeySwitchHolderBaseSize,
          spaceSize: contouredKeySwitchHolderBaseSize - keySwitchHolderWidth,
        },
        union(
          align(
            {
              modes: ["none", "none", "max"],
            },
            columnPole
          )
        )
      )
    )
  )
);

export const base2 = onlyPositiveZ(
  replace(
    align(
      { modes: ["min", "min", "min"], relativeTo: [-23, 4, 0] as any },
      rotateZ(degToRad(-1), cuboid({ size: [140, 20, 3] }))
    ),
    createMatrix(() =>
      contouredBetween(
        {
          n: 1,
          deg: contouredDeg,
          baseSize: contouredKeySwitchHolderBaseSize,
          spaceSize: contouredKeySwitchHolderBaseSize - keySwitchHolderWidth,
        },
        union(
          align(
            {
              modes: ["none", "none", "max"],
            },
            columnPole
          )
        )
      )
    )
  )
);

export const main = () => {
  return [
    colorize(
      [1, 0, 0],
      createMatrix((count) => {
        return Array.from({ length: count }).map((_, i) =>
          contoured(
            {
              n: i - 2,
              deg: contouredDeg,
              baseSize: contouredKeySwitchHolderBaseSize,
            },
            align(
              {
                modes: ["none", "none", "min"],
                relativeTo: [0, 0, keySwitchHolderHeight] as any,
              },
              keyCap
            )
          )
        );
      })
    ),
    createMatrix(createColumn),
    base1,
    base2,
  ];
};
