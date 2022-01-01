import { cuboid, degToRad, rotate, translate } from "../utils";

const side = [
  translate(
    [-10, 0, 0],
    rotate([0, degToRad(5)], cuboid({ size: [2, 2, 25] }))
  ),
  translate(
    [10, 0, 0],
    rotate([0, degToRad(-5)], cuboid({ size: [2, 2, 25] }))
  ),
  translate([0, 0, 12], cuboid({ size: [20, 2, 2] })),
  translate([20, 0, -12], cuboid({ size: [20, 2, 2] })),
];

export const main = () => {
  return [
    translate([-29, 74], side),
    translate([0, 0, -10], cuboid({ size: [2, 150, 6] })),
    translate([-29, -74], side),
    translate([-40, 0, -12], cuboid({ size: [2, 150, 2] })),
  ];
};
