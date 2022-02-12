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
  translateZ,
  onlyPositiveZ,
  placeSideBySideZ,
  intersect,
  colorize,
  cuboidElliptic,
  roundedRectangle,
  extrudeLinear,
  hull,
  projectAndCut,
  offset,
  circle,
} from "../utils";
import { cherryMxKeySwitchHole } from "./cherry-mx-key-switch-hole";
import { main as joystickBaseFn } from "./joystick-base";
import { main as joystickCapFn } from "./joystick-cap";
import { joystickPlate } from "./joystick-plate";

const keySwitchHolderWidth = 18;
const keySwitchHolderHeight = 4;
const contouredKeySwitchHolderBaseSize = keySwitchHolderWidth + 5;
const thumbKeySwitchHolderWidth = keySwitchHolderWidth + 1;
export const contouredDeg = 18;
const poleRadius = 4;
const plateHeight = 3;

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

const keySwitchHolder = subtract(
  align(
    { modes: ["none", "none", "min"] },
    extrudeLinear(
      { height: keySwitchHolderHeight },
      roundedRectangle({
        size: [keySwitchHolderWidth, keySwitchHolderWidth],
        roundRadius: 2,
      })
    ),
    cherryMxKeySwitchHole
  )
);

const createMatrix = (fn: (n: number) => Geom3 | Geom3[]) => {
  const step = contouredKeySwitchHolderBaseSize - 1;
  return translateZ(
    8,
    translate([3.5, 0, 20], rotate([0, degToRad(35), degToRad(-5)], fn(4))),
    translate(
      [step + 0.5, 0, 10],
      rotate([0, degToRad(30), degToRad(-5)], fn(4))
    ),
    translate(
      [step * 2, 0, 4.5],
      rotate([0, degToRad(24), degToRad(-4)], fn(4))
    ),
    translate(
      [step * 3 + 1.1, 0, 0.5],
      rotate([0, degToRad(14), degToRad(-2)], fn(5))
    ),
    translate(
      [step * 4 + 1.5, 0, 0],
      rotate([0, degToRad(9), degToRad(-2)], fn(5))
    ),
    translate(
      [step * 5 + 1, 0, 0],
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
            keySwitchHolder
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
        align(
          {
            modes: ["none", "none", "max"],
            relativeTo: [0, 0, keySwitchHolderHeight] as any,
          },
          union(
            align(
              {
                modes: ["none", "none", "center"],
              },
              cylinder({
                radius: m2NutRadius + 0.1,
                height: m2NutHeight + 1,
                segments: 6,
              }),
              cylinder({
                radius: m2ScrewHoleRadius,
                height: keySwitchHolderHeight,
              })
            )
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

const createThumbPole = ({
  startAngle,
  endAngle,
}: {
  startAngle: number;
  endAngle: number;
}) => {
  return subtract(
    placeSideBySideZ(
      extrudeLinear(
        { height: 3 },
        circle({
          startAngle,
          endAngle,
          radius: poleRadius,
        })
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
};

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

const poles1 = onlyPositiveZ(
  ...createMatrix(() =>
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
);

const poles2 = onlyPositiveZ(
  ...createMatrix(() =>
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
);

const joystickPcb = cuboid({ size: [25.5, 31.5, 1.5] });
const joystickBox = cuboid({ size: [21, 25, 15] });

const joystick = placeSideBySideZ(
  union(
    joystickPcb,
    translate([0, 0, (15 + 1.5) / 2], joystickBox),
    translate([0, 0, 18], rotateX(degToRad(180), joystickBaseFn())),
    translate([0, 0, 22.5], joystickCapFn())
  ),
  joystickPlate
);

export const thumbKeysHolder1 = (() => {
  const keyPositions = [
    [1, 0],
    [0, 0],
    [0, 1],
    [0, 2],
  ].map(([i, j]) => [
    thumbKeySwitchHolderWidth * i,
    thumbKeySwitchHolderWidth * j,
  ]);

  const polePositions = [
    [thumbKeySwitchHolderWidth / 2, thumbKeySwitchHolderWidth / 2],
    [thumbKeySwitchHolderWidth / 2, (thumbKeySwitchHolderWidth / 2) * 3],
  ];

  return align(
    { modes: ["none", "none", "min"] },
    subtract(
      align(
        { modes: ["none", "none", "max"] },
        union(
          align(
            { modes: ["none", "none", "max"] },
            joinX(
              ...keyPositions.map(([x, y]) =>
                translate([x, y], hull(keySwitchHolder, keySwitchHolder))
              )
            ),
            polePositions.map(([x, y]) =>
              translate(
                [x, y],
                cylinder({
                  radius: poleRadius,
                  height: keySwitchHolderHeight,
                })
              )
            )
          )
        ),
        keyPositions.map(([x, y]) => translate([x, y], cherryMxKeySwitchHole)),
        union(
          polePositions.map(([x, y]) =>
            translate(
              [x, y],
              cylinder({
                radius: m2ScrewHoleRadius,
                height: keySwitchHolderHeight,
              }),
              cylinder({
                radius: m2NutRadius + 0.2,
                height: m2NutHeight + 1,
                segments: 6,
              })
            )
          )
        )
      )
    )
  );
})();

export const thumbKeysHolder2 = (() => {
  const keyPositions = [
    [0, 0],
    [thumbKeySwitchHolderWidth, 0],
  ];

  const polePositions = [
    [-thumbKeySwitchHolderWidth / 2, 0],
    [(thumbKeySwitchHolderWidth / 2) * 3, 0],
  ];

  return align(
    { modes: ["none", "none", "min"] },
    subtract(
      align(
        { modes: ["none", "none", "max"] },
        union(
          align(
            { modes: ["none", "none", "max"] },
            joinX(
              ...keyPositions.map(([x, y]) =>
                translate([x, y], hull(keySwitchHolder, keySwitchHolder))
              )
            ),
            polePositions.map(([x, y]) =>
              cylinder({
                radius: poleRadius,
                center: [x, y, 0],
                height: keySwitchHolderHeight,
              })
            )
          )
        ),
        ...keyPositions.map(([x, y]) =>
          translate([x, y], cherryMxKeySwitchHole)
        ),
        union(
          polePositions.map(([x, y]) =>
            translate(
              [x, y],
              cylinder({
                radius: m2ScrewHoleRadius,
                height: keySwitchHolderHeight,
              }),
              cylinder({
                radius: m2NutRadius + 0.2,
                height: m2NutHeight + 1,
                segments: 6,
              })
            )
          )
        )
      )
    )
  );
})();

const transformThumbKeys1 = (geom: Geom3 | Geom3[]) => {
  return translate(
    [-10, 39, 8],
    rotate([degToRad(-1), degToRad(-45), degToRad(-20)], geom)
  );
};

const transformThumbKeys2 = (geom: Geom3 | Geom3[]) => {
  return translate(
    [27, 78, 17],
    rotate([degToRad(-1), degToRad(-45), degToRad(-20)], geom)
  );
};

const transformJoystick = (geom: Geom3 | Geom3[]) => {
  return translate(
    [28, 52, 15],
    rotate([degToRad(-1), degToRad(-45), degToRad(-20)], geom)
  );
};

const thumbPoles1 = transformThumbKeys1(
  align(
    { modes: ["none", "none", "max"] },
    translate(
      [thumbKeySwitchHolderWidth / 2, thumbKeySwitchHolderWidth / 2, 0],
      createThumbPole({ startAngle: degToRad(0), endAngle: degToRad(90) })
    ),
    translate(
      [thumbKeySwitchHolderWidth / 2, (thumbKeySwitchHolderWidth / 2) * 3, 0],
      createThumbPole({ startAngle: degToRad(270), endAngle: degToRad(90) })
    )
  )
);

const thumbPoles2 = transformThumbKeys2(
  align(
    { modes: ["none", "none", "max"] },
    translate(
      [-thumbKeySwitchHolderWidth / 2, 0, 0],
      createThumbPole({ startAngle: degToRad(90), endAngle: degToRad(270) })
    ),
    translate(
      [(thumbKeySwitchHolderWidth / 2) * 3, 0, 0],
      createThumbPole({ startAngle: degToRad(270), endAngle: degToRad(90) })
    )
  )
);

const joystickPoles = transformJoystick(
  align(
    { modes: ["none", "none", "max"] },
    translate([0, 7, 0], joystickPole),
    translate([0, -7, 0], joystickPole)
  )
);

const poles3 = onlyPositiveZ(...thumbPoles1, ...thumbPoles2, ...joystickPoles);

const poles = [...poles1, ...poles2, ...poles3];

export const plate = [
  replace(
    union(
      extrudeLinear(
        { height: plateHeight },
        projectAndCut(hull(poles1)),
        projectAndCut(hull(poles2)),
        projectAndCut(hull(poles3)),
        projectAndCut(hull(poles1[0], poles2[5])),
        projectAndCut(hull(poles1[5], poles2[0])),
        projectAndCut(hull(poles2[0], poles3[0])),
        projectAndCut(hull(poles2[2], poles3[2]))
      )
    ),
    ...poles
  ),
];

export const main = () => {
  return [
    transformThumbKeys1(
      align({ modes: ["none", "none", "min"] }, thumbKeysHolder1)
    ),
    transformThumbKeys2(
      align({ modes: ["none", "none", "min"] }, thumbKeysHolder2)
    ),
    transformJoystick(align({ modes: ["none", "none", "min"] }, joystick)),
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
    plate,
  ];
};
