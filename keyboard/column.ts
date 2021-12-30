import {
  primitives,
  transforms,
  booleans,
  utils,
  hulls,
  expansions,
} from "@jscad/modeling";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";
import { main as joystickBaseFn } from "./joystick-base";
import { main as joystickCapFn } from "./joystick-cap";

const { cuboid, cylinder, cylinderElliptic } = primitives;
const { rotate, translate, rotateX, rotateY, rotateZ, mirror } = transforms;
const { subtract, union, intersect } = booleans;
const { degToRad } = utils;
const { hull, hullChain } = hulls;
const { expand } = expansions;

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
const poleRadius = 3.5;

const baseSize = space + switchSize;

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
    rotateX(degToRad(deg * 2 - deg / 2), translate([0, 31.5, -6.7], model)),
    rotateX(degToRad(deg - deg / 2), translate([0, 11, -1], model)),
    rotateX(-degToRad(deg - deg / 2), translate([0, -11, -1], model)),
  ];

  if (n > 4)
    models.push(
      rotateX(-degToRad(deg * 2 - deg / 2), translate([0, -31.5, 0], model))
    );

  return models;
};

const createColumn = (n: number) => {
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

const place = (fn: (n: number) => Geom3) => {
  return [
    translate([3.5, 0, 20], rotateY(degToRad(35), fn(4))),
    translate([baseSize + 1, 0, 10], rotateY(degToRad(30), fn(4))),
    translate([baseSize * 2, 0, 3], rotateY(degToRad(25), fn(4))),
    translate([baseSize * 3, 0, 0.5], rotateY(degToRad(15), fn(5))),
    translate([baseSize * 4, 0, 0], rotateY(degToRad(8), fn(5))),
    translate([baseSize * 5, 0, 0], rotateY(degToRad(5), fn(4))),
  ];
};

const joystickPcb = cuboid({ size: [25.5, 31.5, 1.5] });
const joystickBox = cuboid({ size: [21, 25, 15] });

const joystick = union(
  joystickPcb,
  translate([0, 0, (15 + 1.5) / 2], joystickBox),
  translate([0, 0, 20], rotateX(degToRad(180), joystickBaseFn())),
  translate([0, 0, 24.5], joystickCapFn())
);

const corners = (obj: Geom3) => {
  return union(
    obj,
    mirror({ normal: [1, 0, 0] }, obj),
    mirror({ normal: [0, 1, 0] }, obj),
    mirror({ normal: [1, 0, 0] }, mirror({ normal: [0, 1, 0] }, obj))
  );
};

export const main = () => {
  const holderHeight = 5;
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

  const poles1 = place(() => placeBetweenRow(4, poleBase)[0]);
  const poles2 = place(() => placeBetweenRow(4, poleBase)[2]);
  const basePlate = cuboid({ size: [140, 20, 4] });
  const basePlate1 = rotate(
    [0, 0, degToRad(-6)],
    translate([40, 48, -10], basePlate)
  );
  const basePlate2 = translate([45, -15, -10], basePlate);

  const base1 = subtract(
    union(
      holder1,
      ...poles1,
      subtract(basePlate1, ...poles1.map((p) => hull(p, p)))
    ),
    translate([45, 46, -10 - (50 + 4) / 2], cuboid({ size: [200, 30, 50] }))
  );

  const base2 = subtract(
    union(
      holder2,
      ...poles2,
      subtract(basePlate2, ...poles2.map((p) => hull(p, p)))
    ),
    translate([45, -15, -10 - (50 + 4) / 2], cuboid({ size: [200, 30, 50] }))
  );

  const thumbKeys = subtract(
    union(
      ...Array.from({ length: 2 }).flatMap((_, i) =>
        Array.from({ length: 3 }).flatMap((_, j) =>
          translate(
            [width * i, -baseSize * j, 0],
            subtract(cuboid({ size: [width, baseSize, height] }), keySwitchHole)
          )
        )
      )
    ),
    ...Array.from({ length: 2 }).flatMap((_, i) =>
      Array.from({ length: 2 }).flatMap((_, j) =>
        translate(
          [width * i, -baseSize * j - baseSize / 2, 0],
          cylinder({ height: height, radius: screwHoleRadius })
        )
      )
    )
  );

  const joystickPlate = union(
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

  const thumbObjects = rotate(
    [degToRad(25), 0, degToRad(15)],
    // joystick,
    translate(
      [0, 0, -(3 + 1.5) / 2],
      // joystickPlate,
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
      [25, 20, 15],
      // thumbKeys,
      ...Array.from({ length: 2 }).flatMap((_, i) =>
        Array.from({ length: 2 }).flatMap((_, j) =>
          translate(
            [width * i, -baseSize * j - baseSize / 2, 0],
            rotateZ(degToRad(180), union(poleBase, holderBase))
          )
        )
      )
    )
  );

  const thumbSet = subtract(
    union(
      thumbObjects,
      subtract(
        translate([20, 13, -15], cuboid({ size: [60, 40, height] })),
        thumbObjects.map((o) => hull(o, o))
      )
    ),
    translate([20, 13, -15 - (100 + 4) / 2], cuboid({ size: [200, 100, 100] }))
  );

  // return joystickPlate;
  // return union(thumbKeys);
  return base2;
  return thumbSet;

  return union(...place(createColumn), base1, base2, thumbSet);
};
