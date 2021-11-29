import { primitives, transforms, booleans, utils } from "@jscad/modeling";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Vec2, Vec3 } from "@jscad/modeling/src/maths/types";

const { cuboid, cylinder, cylinderElliptic } = primitives;
const { rotate, translate, rotateX, rotateY, rotateZ } = transforms;
const { subtract, union, intersect } = booleans;
const { degToRad } = utils;

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
const deg = 15;
const space = 7;
const switchSize = 14;
const width = 18;

const baseSize = space + switchSize;

const base = cuboidElliptic({
  startSize: [width, baseSize + height / Math.tan(degToRad(90 - deg / 2))],
  endSize: [width, baseSize],
  height,
  center: [0, 0, 0],
});

const keySwitchHole = union(
  cuboid({ size: [switchSize, switchSize, height] }),
  rotateZ(
    degToRad(90),
    union(
      cuboid({ size: [5, 1.5, 2.5], center: [0, 7, -(4 - 2.5) / 2] }),
      cuboid({ size: [5, 1.5, 2.5], center: [0, -7, -(4 - 2.5) / 2] })
    )
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
    rotateX(degToRad(deg * 2 - deg / 2), translate([0, 30.5, -6.7], model)),
    rotateX(degToRad(deg - deg / 2), translate([0, 10.25, -1], model)),
    rotateX(-degToRad(deg - deg / 2), translate([0, -10.25, -1], model)),
  ];

  if (n > 4)
    models.push(
      rotateX(-degToRad(deg * 2 - deg / 2), translate([0, -30.5, 0], model))
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
  return union(
    translate([3.5, 0, 20], rotateY(degToRad(30), fn(4))),
    translate([baseSize + 1, 0, 10], rotateY(degToRad(25), fn(4))),
    translate([baseSize * 2, 0, 3], rotateY(degToRad(20), fn(4))),
    translate([baseSize * 3, 0, 0.5], rotateY(degToRad(15), fn(5))),
    translate([baseSize * 4, 0, 0], rotateY(degToRad(10), fn(5))),
    translate([baseSize * 5, 0, 0], rotateY(degToRad(5), fn(4)))
  );
};

export const main = () => {
  const holderHeight = 5;
  const holderBase = translate(
    [0, 0, -(4 + holderHeight) / 2],
    subtract(
      cuboid({ size: [23, 3.3, holderHeight] }),
      cylinder({ radius: screwHoleRadius, height: holderHeight })
    )
  );

  const holder1 = place(() => placeBetweenRow(4, holderBase)[0]);
  const holder2 = intersect(place(() => placeBetweenRow(4, holderBase)[2]));

  // return holder2;
  // return union(place(createColumn), holder1, holder2);
  return createColumn(5);
};
