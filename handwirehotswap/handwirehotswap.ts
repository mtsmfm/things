import { primitives, transforms, booleans } from "@jscad/modeling";

const { cuboid, cylinder } = primitives;
const { translate } = transforms;
const { subtract, union } = booleans;

const grid = 1.27;

const pin_dia = 1.5 * 0.95;
const pin1 = { x: 3 * grid, y: 2 * grid };
const pin2 = { x: -2 * grid, y: 4 * grid };

const stem = 4.0 * 0.96;

const diode = [1.75 * 1.25, 3.4 * 1.25];
const diode_dia = 0.56 * 1.5;
const wire_dia = 0.5 * 1.5;

const diode_angle = -6;

type Vec3 = [number, number, number];

const base: Vec3 = [11 * grid, 11 * grid, 3.5];

const makeBody = () => {
  const thickness = base[2];

  return subtract(
    cuboid({ size: base }),
    cylinder({ height: thickness, radius: stem / 2 }),
    cuboid({ size: [3, base[1] / 2, thickness], center: [0, -base[1] / 4, 0] }),
    cylinder({
      height: thickness,
      radius: pin_dia / 2,
      center: [pin1.x, pin1.y, 0],
    }),
    cylinder({
      height: thickness,
      radius: pin_dia / 2,
      center: [pin2.x, pin2.y, 0],
    })
  );
};

const makeWireSlots = () => {
  return union(
    cuboid({
      size: [wire_dia, grid * 4, wire_dia * 2],
      center: [pin1.x, grid * 4, wire_dia * 2],
    }),
    cuboid({
      size: [1, 2, 3],
      center: [4, 5, 6],
    })
  );
};

export const main = () => {
  const body = makeBody();
  const wireSlots = makeWireSlots();

  return subtract(body, wireSlots);
};
