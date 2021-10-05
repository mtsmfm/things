import { primitives, transforms, booleans, utils } from "@jscad/modeling";

// Cherry MX
// https://cdn.sparkfun.com/datasheets/Components/Switches/MX%20Series.pdf

// Diode (1N4148)
// https://www.vishay.com/docs/81857/1n4148.pdf
type Vec2 = [number, number];
type Vec3 = [number, number, number];

const { cuboid, cylinder, cylinderElliptic } = primitives;
const { rotate } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;

const grid = 1.27;

const pin_dia = 1.5;
const pin1 = { x: 3 * grid, y: 2 * grid };
const pin2 = { x: -2 * grid, y: 4 * grid };

const stem = 4.0;

const diode = { x: 1.75, y: 3.4, z: 1.75 };
const diode_dia = 0.56;
const wire_dia = 0.5;

const base = { x: 11 * grid, y: 11 * grid, z: 3.5 };

const stem_cuboid_width = 3;

const makeBody = () => {
  const thickness = base.z;

  return subtract(
    cuboid({ size: [base.x, base.y, base.z] }),
    cylinder({ height: thickness, radius: stem / 2 }),
    cuboid({
      size: [stem_cuboid_width, base.y / 2, thickness],
      center: [0, -base.y / 4, 0],
    }),
    cylinderElliptic({
      height: thickness,
      startRadius: [(pin_dia / 2) * 1.3, (pin_dia / 2) * 1.3],
      endRadius: [pin_dia / 2, pin_dia / 2],
      center: [pin1.x, pin1.y, 0],
    }),
    cylinder({
      height: thickness,
      radius: pin_dia / 2,
      center: [pin2.x, pin2.y, 0],
    })
  );
};

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

const makeWireSlots = () => {
  return union(
    // Top back wire line
    cuboidElliptic({
      startSize: [wire_dia * 2.5, base.y / 2 - pin1.y],
      endSize: [wire_dia, base.y / 2 - pin1.y],
      height: wire_dia * 1.8,
      center: [
        pin1.x,
        (base.y / 2 - pin1.y) / 2 + pin1.y,
        -(base.z - wire_dia * 1.8) / 2,
      ],
    }),
    // Top side wire line
    cuboid({
      size: [wire_dia, wire_dia, base.z],
      center: [pin1.x, (base.y - wire_dia) / 2, 0],
    })
  );
};

const pcbMountPegs = () => {
  return union(
    cylinder({
      height: base.z,
      radius: 2.1 / 2,
      center: [-grid * 4, 0, 0],
    }),
    cylinder({
      height: base.z,
      radius: 2.1 / 2,
      center: [grid * 4, 0, 0],
    })
  );
};

const makeDiodeSlots = () => {
  return union(
    // Top vertical diode wire line
    // cuboid({
    //   size: [diode_dia, base.y / 2 - pin2.y, base.z],
    //   center: [pin2.x, pin2.y + (base.y / 2 - pin2.y) / 2, 0],
    // }),
    cuboidElliptic({
      height: base.z,
      startSize: [diode_dia * 1.3, base.y / 2 - pin2.y],
      endSize: [diode_dia, base.y / 2 - pin2.y],
      center: [pin2.x, pin2.y + (base.y / 2 - pin2.y) / 2, 0],
    }),
    // Top back horizontal diode wire line
    cuboidElliptic({
      height: diode_dia,
      startSize: [base.x / 2 + pin2.x, diode_dia * 1.3],
      endSize: [base.x / 2 + pin2.x, diode_dia],
      center: [
        pin2.x - (base.x / 2 + pin2.x) / 2,
        pin2.y,
        -((base.z - diode_dia) / 2),
      ],
    }),
    // Top side diode wire line
    cuboid({
      size: [diode_dia, diode_dia, base.z],
      center: [-(base.x / 2 - diode_dia / 2), pin2.y, 0],
    }),
    // Diode body
    rotate(
      [0, 0, degToRad(-6)],
      cuboidElliptic({
        height: diode.z * 1.2,
        startSize: [diode.x * 1.5, diode.y * 1.6],
        endSize: [diode.x * 0.75, diode.y],
        center: [-3.5, -3, -(base.z - diode.z * 1.2) / 2],
      })
    ),
    // Bottom diode wire hole
    cylinder({
      radius: diode_dia * 1.2,
      height: diode.z * 0.8,
      center: [-4, -grid * 3.9, -(base.z - diode.z * 0.8) / 2],
    }),
    // Bottom back vertical diode wire line
    rotate(
      [0, 0, degToRad(-10)],
      cuboidElliptic({
        height: diode.z * 0.8,
        startSize: [diode_dia * 1.5, grid * 5.5],
        endSize: [diode_dia * 0.8, grid * 5.5],
        center: [-3.4, 1, -(base.z - diode.z * 0.8) / 2],
      })
    )
  );
};

const makeQiHole = () => {
  return union(
    cylinder({
      radius: pin_dia / 2,
      height: base.z,
      center: [-4, -grid * 4.1, 0],
    }),
    cylinder({
      radius: pin_dia / 2,
      height: base.z,
      center: [pin1.x - 1.2, pin1.y + 2.5, 0],
    })
  );
};

const makeQiSocket = () => {
  const bottomLeft = subtract(
    cylinder({
      radius: pin_dia / 2 + 0.6,
      height: 5,
      center: [-4, -grid * 4.1, base.z / 2 + 5 / 2],
    }),
    cylinder({
      radius: pin_dia / 2,
      height: 5,
      center: [-4, -grid * 4.1, base.z / 2 + 5 / 2],
    })
  );

  const topRight = subtract(
    cylinder({
      radius: pin_dia / 2 + 0.6,
      height: 5,
      center: [pin1.x - 1.2, pin1.y + 2.5, base.z / 2 + 5 / 2],
    }),
    cylinder({
      radius: pin_dia / 2,
      height: 5,
      center: [pin1.x - 1.2, pin1.y + 2.5, base.z / 2 + 5 / 2],
    })
  );

  return union(bottomLeft, topRight);
};

export const main = () => {
  return union(
    subtract(
      makeBody(),
      makeWireSlots(),
      makeDiodeSlots(),
      pcbMountPegs(),
      makeQiHole()
    ),
    makeQiSocket()
  );
};
