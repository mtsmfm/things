import {
  hull,
  rotateY,
  rotateZ,
  intersect,
  Vec2,
  Vec3,
  cylinderElliptic,
  degToRad,
  union,
  cuboid,
  Geom3,
  translate,
  rotate,
  rotateX,
  cylinder,
  subtract,
  mirror,
  colorize,
} from "../utils";
import { main as joystickBaseFn } from "./joystick-base";
import { main as joystickCapFn } from "./joystick-cap";

const cuboidElliptic = ({
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

const height = 4;
const deg = 18;
const space = 8;
const switchSize = 14;
const width = 18;
const poleRadius = 4;

const baseSize = space + switchSize;
const thumbBaseSize = baseSize - 3;

const base = cuboidElliptic({
  startSize: [width, baseSize + height / Math.tan(degToRad(90 - deg / 2))],
  endSize: [width, baseSize],
  height,
  center: [0, 0, 0],
});

const keySwitchHole = union(
  cuboid({ size: [switchSize, switchSize, height] }),
  union(
    cuboid({ size: [5, 1.5, 2.5], center: [0, 7, -(4 - 2.5) / 2] }),
    cuboid({ size: [5, 1.5, 2.5], center: [0, -7, -(4 - 2.5) / 2] })
  )
);

const placeKey = (n: number, model: Geom3) => {
  if (n === 2) return model;

  const k = n < 2 ? 1 : -1;

  return Array.from({ length: Math.abs(2 - n) }).reduce<Geom3>(
    (acc, _) =>
      translate(
        [
          0,
          (baseSize / 2 + Math.cos(degToRad(deg)) * (baseSize / 2)) * k,
          (baseSize / 2) * Math.sin(degToRad(deg)),
        ],
        rotate([degToRad(deg) * k, 0, 0], acc)
      ),
    model
  );
};

const screwHoleRadius = 2.5 / 2;
const placeBetweenRow = (n: number, model: Geom3) => {
  const models = [
    rotateX(degToRad(deg * 2 - deg / 2), translate([0, 31.5, -8], model)),
    rotateX(degToRad(deg - deg / 2), translate([0, 11, -1], model)),
    rotateX(-degToRad(deg - deg / 2), translate([0, -11, -1], model)),
  ];

  if (n > 4)
    models.push(
      rotateX(-degToRad(deg * 2 - deg / 2), translate([0, -31.5, 0], model))
    );

  return models;
};

export const createColumn = (n: number) => {
  const screwHoles = placeBetweenRow(
    n,
    cylinder({ radius: screwHoleRadius, height: 50 })
  );

  return subtract(
    union(
      ...Array.from({ length: n }).map((_, i) =>
        placeKey(i, subtract(base, keySwitchHole))
      )
    ),
    ...screwHoles
  );
};

const createKeyCap = (n: number) => {
  const keyCap = cuboid({
    size: [18, 18, 15],
    center: [0, 0, (15 + height) / 2],
  });

  return Array.from({ length: n }).map((_, i) => placeKey(i, keyCap));
};

const place = (fn: (n: number) => Geom3 | Geom3[]) => {
  return [
    translate([3.5, 0, 20], rotate([0, degToRad(35), degToRad(2)], fn(4))),
    translate(
      [baseSize + 0.5, 0, 10],
      rotate([0, degToRad(30), degToRad(2)], fn(4))
    ),
    translate(
      [baseSize * 2, 0, 4.5],
      rotate([0, degToRad(24), degToRad(2)], fn(4))
    ),
    translate([baseSize * 3 + 0.5, 0, 0.5], rotateY(degToRad(15), fn(5))),
    translate([baseSize * 4 + 1, 0, 0], rotateY(degToRad(9), fn(5))),
    translate([baseSize * 5, 0, 0], rotateY(degToRad(5), fn(4))),
  ];
};

const joystickPcb = cuboid({ size: [25.5, 31.5, 1.5] });
const joystickBox = cuboid({ size: [21, 25, 15] });

const joystick = union(
  joystickPcb,
  translate([0, 0, (15 + 1.5) / 2], joystickBox),
  translate([0, 0, 18], rotateX(degToRad(180), joystickBaseFn())),
  translate([0, 0, 22.5], joystickCapFn())
);

const corners = (obj: Geom3) => {
  return union(
    obj,
    mirror({ normal: [1, 0, 0] }, obj),
    mirror({ normal: [0, 1, 0] }, obj),
    mirror({ normal: [1, 0, 0] }, mirror({ normal: [0, 1, 0] }, obj))
  );
};

const holderHeight = 3;
const holderBase = translate(
  [0, 0, -(4 + holderHeight) / 2],
  intersect(
    subtract(
      cuboid({ size: [poleRadius * 2, 3.3, holderHeight] }),
      cylinder({ radius: screwHoleRadius, height: holderHeight })
    ),
    cylinder({ radius: poleRadius, height: holderHeight })
  )
);

const holder1 = union(...place(() => placeBetweenRow(4, holderBase)[0]));
const holder2 = intersect(
  union(...place(() => placeBetweenRow(4, holderBase)[2]))
);

const poleBase = translate(
  [0, 0, -(height + 50) / 2 - holderHeight],
  subtract(
    cylinder({
      height: 50,
      radius: poleRadius,
    }),
    cylinder({
      height: 50,
      radius: screwHoleRadius,
    }),
    translate(
      [0, 0, 24],
      union(
        rotateZ(
          degToRad(90),
          cylinder({
            radius: (4.4 + 0.6) / 2,
            height: 2,
            segments: 6,
            center: [0.4, 0, 0],
          })
        ),
        cuboid({
          size: [
            ((4.4 + 0.6) * Math.sqrt(3)) / 2,
            ((4.4 + 0.6) * Math.sqrt(3)) / 2,
            2,
          ],
          center: [0, -2, 0],
        })
      )
    )
  )
);

const poles1 = place(
  () => placeBetweenRow(4, rotateZ(degToRad(180), poleBase))[0]
);
const poles2 = place(() => placeBetweenRow(4, poleBase)[2]);
const basePlate = cuboid({ size: [140, 20, 3] });
const basePlate1 = rotate(
  [0, 0, degToRad(-6)],
  translate([40, 48, -8], basePlate)
);
const basePlate2 = translate([45, -15, -8], basePlate);

export const base1 = subtract(
  union(
    holder1,
    ...poles1,
    subtract(basePlate1, ...poles1.map((p) => hull(p, p)))
  ),
  translate([45, 46, -8 - (50 + 3) / 2], cuboid({ size: [200, 30, 50] }))
);

export const base2 = subtract(
  union(
    holder2,
    ...poles2,
    subtract(basePlate2, ...poles2.map((p) => hull(p, p)))
  ),
  translate([45, -15, -8 - (50 + 3) / 2], cuboid({ size: [200, 30, 50] }))
);

export const thumbKeys = subtract(
  hull(
    ...Array.from({ length: 2 }).flatMap((_, i) =>
      Array.from({ length: 3 }).flatMap((_, j) =>
        translate(
          [(width + 2) * i, -thumbBaseSize * j, 0],
          cuboid({ size: [width, thumbBaseSize, height] })
        )
      )
    )
  ),
  ...Array.from({ length: 2 }).flatMap((_, i) =>
    Array.from({ length: 3 }).flatMap((_, j) =>
      translate([(width + 2) * i, -thumbBaseSize * j, 0], keySwitchHole)
    )
  ),
  ...Array.from({ length: 2 }).flatMap((_, j) =>
    translate(
      [(width + 2) / 2, -thumbBaseSize * j - thumbBaseSize / 2, 0],
      cylinder({ height: height, radius: screwHoleRadius }),
      cylinder({
        height: 1,
        radius: 4.5 / 2,
        center: [0, 0, (height - 1) / 2],
      })
    )
  )
);

export const joystickPlate = union(
  subtract(
    cuboid({ size: [25.5, 31.5, 3] }),
    cuboid({ size: [24, 22, 3] }),
    cuboid({ size: [10, 3, 3], center: [0, (31.5 - 3) / 2, 0] }),
    cuboid({ size: [13, 3, 3], center: [0, -(31.5 - 3) / 2, 0] }),
    corners(
      cylinder({
        radius: 4 / 2,
        height: 3,
        center: [25.5 / 2 - 2.5, 31.5 / 2 - 2.5, 0],
      })
    )
  ),
  translate(
    [0, 0, -(3 + 1) / 2],
    subtract(
      cuboid({ size: [25.5, 22, 1] }),
      cylinder({
        radius: screwHoleRadius,
        height: 1,
        center: [0, -7, 0],
      }),
      cylinder({
        radius: screwHoleRadius,
        height: 1,
        center: [0, 7, 0],
      })
    )
  )
);

function compact<I>(xs: Array<I | undefined>) {
  return xs.filter((x) => x !== undefined) as Array<I>;
}

export const buildThumbSet = ({
  renderJoyStick,
  renderJoyStickPlate,
  renderThumbKeys,
}: {
  renderJoyStick: boolean;
  renderJoyStickPlate: boolean;
  renderThumbKeys: boolean;
}) => {
  const thumbObjects = rotate(
    [degToRad(35), 0, degToRad(15)],
    ...compact([renderJoyStick ? joystick : undefined]),
    translate(
      [0, 0, -(3 + 1.5) / 2],
      ...compact([renderJoyStickPlate ? joystickPlate : undefined]),
      translate(
        [0, 0, -(3 + 1) / 2 + (height - 1) / 2],
        rotateZ(
          degToRad(180),
          translate([0, -7, 0], union(poleBase, holderBase)),
          translate([0, 7, 0], union(poleBase, holderBase))
        )
      )
    ),
    translate(
      [23, 17, 10],
      ...compact([renderThumbKeys ? thumbKeys : undefined]),
      ...Array.from({ length: 2 }).flatMap((_, j) =>
        translate(
          [(width + 2) / 2, -thumbBaseSize * j - thumbBaseSize / 2, 0],
          rotateZ(degToRad(180), union(poleBase, holderBase))
        )
      )
    )
  );

  return translate(
    [-20, -58, 5],
    subtract(
      union(
        thumbObjects,
        subtract(
          translate([15, 14.5, -13], cuboid({ size: [50, 38, 3] })),
          thumbObjects.map((o) => hull(o, o))
        )
      ),
      translate(
        [25, 13, -13 - (100 + 3) / 2],
        cuboid({ size: [200, 100, 100] })
      )
    )
  );
};

export const main = () => {
  // return joystickPlate;
  // return union(thumbKeys);
  // return thumbKeys;
  // return thumbSet;
  // return union(base1, base2);
  return [
    colorize([1, 0, 0], ...place(createKeyCap)),
    ...place(createColumn),
    base1,
    base2,
    buildThumbSet({
      renderJoyStick: true,
      renderJoyStickPlate: true,
      renderThumbKeys: true,
    }),
  ];
};
