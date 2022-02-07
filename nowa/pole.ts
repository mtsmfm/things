import {
  align,
  cylinder,
  subtract,
  rotate,
  degToRad,
  cuboid,
  translate,
  onlyPositiveZ,
  replace,
} from "../utils";

const poleRadius = 8 / 2;
const poleHeight = 20;
const screwHeadRadius = 5 / 2;
const screwBodyRadius = 2.5 / 2;
const thickness = 2;

export const main = () => {
  const pole = subtract(
    align(
      { modes: ["none", "none", "min"] },
      cylinder({ radius: poleRadius, height: poleHeight }),
      cylinder({ radius: screwHeadRadius, height: poleHeight - thickness }),
      cylinder({ radius: screwBodyRadius, height: poleHeight })
    )
  );

  return replace(
    align(
      { modes: ["none", "none", "min"] },
      cuboid({ size: [poleRadius * 2.5, poleRadius * 2.5, thickness] })
    ),
    align(
      { modes: ["none", "none", "min"] },
      onlyPositiveZ(translate([0, 0, -2], rotate([degToRad(35)], pole)))
    )
  );
};
