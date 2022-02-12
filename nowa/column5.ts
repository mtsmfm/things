import { contouredDeg, createColumn } from ".";
import { align, degToRad, rotate } from "../utils";

export const main = () => {
  return align(
    { modes: ["center", "center", "min"] },
    rotate([degToRad(contouredDeg / 2)], createColumn(5))
  );
};
