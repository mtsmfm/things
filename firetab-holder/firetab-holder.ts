import {
  align,
  colorize,
  cuboid,
  mirror,
  translate,
  union,
  colorNameToRgb,
} from "../utils";

const thickness = 4;

const width = 130 / 2;

export const main = () => {
  const front = union(
    align(
      { modes: ["max", "max", "min"] },
      union(
        align(
          { modes: ["min", "min", "min"] },
          cuboid({ size: [thickness, thickness, 25] }),
          cuboid({ size: [19, thickness, thickness] })
        )
      ),
      cuboid({ size: [thickness, width, 12] })
    )
  );

  const back = union(
    align(
      { modes: ["min", "max", "min"] },
      union(
        align(
          { modes: ["min", "min", "max"] },
          cuboid({ size: [thickness, thickness, 40] }),
          cuboid({ size: [30, thickness, thickness] })
        )
      ),
      cuboid({ size: [thickness, width, thickness] })
    )
  );

  const right = align(
    { modes: ["none", "min", "none"] },
    union(translate([47, 0, 15], front), back)
  );

  const penTablet = colorize(
    colorNameToRgb("red"),
    translate([16, 0, -20], cuboid({ size: [24, 300, 100] }))
  );

  const fireTablet = colorize(
    colorNameToRgb("green"),
    translate([37.5, -40, 69], cuboid({ size: [11, 300, 100] }))
  );

  const holder = [right, mirror({ normal: [0, 1, 0] }, right)];

  return holder;

  return [holder, penTablet, fireTablet];
};
