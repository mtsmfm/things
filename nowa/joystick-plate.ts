import {
  corners,
  cuboid,
  cylinder,
  subtract,
  translate,
  align,
  alignSubtract,
  replace,
  m2ScrewHoleRadius,
  m2NutRadius,
  m3InsertNutHoleRadius,
  m2NutHeight,
} from "../utils";

const height = 4;
const thickness = 1;

const m2NutHolder = alignSubtract(
  cylinder({
    radius: (m2NutRadius + 2) / 2,
    height: m2NutHeight + thickness,
    segments: 6,
  }),
  [
    { modes: ["none", "none", "max"] },
    cylinder({
      radius: m2NutRadius / 2,
      height: m2NutHeight,
      segments: 6,
    }),
  ],
  [
    { modes: ["none", "none", "min"] },
    cylinder({
      radius: m2ScrewHoleRadius,
      height: 4,
    }),
  ]
);

const cornerHoles = corners(
  translate(
    [25.5 / 2 - 2.5, 31.5 / 2 - 2.5, 0],
    subtract(
      cylinder({ radius: m3InsertNutHoleRadius + 0.5, height }),
      cylinder({ radius: m3InsertNutHoleRadius, height })
    )
  )
);

export const joystickPlate = replace(
  align(
    { modes: ["none", "none", "min"] },
    replace(
      alignSubtract(
        cuboid({ size: [25.5, 31.5, height] }),
        [
          [
            { modes: ["none", "max", "none"] },
            { modes: ["none", "min", "none"] },
          ],
          cuboid({ size: [13, 3, height] }),
        ],
        [
          { modes: ["center", "center", "max"] },
          cuboid({ size: [24, 22, height - thickness] }),
        ]
      ),
      cornerHoles
    )
  ),
  [
    align(
      { modes: ["none", "center", "min"], relativeTo: [0, 7, 0] as any },
      m2NutHolder
    ),
    align(
      { modes: ["none", "center", "min"], relativeTo: [0, -7, 0] as any },
      m2NutHolder
    ),
  ]
);

export const main = () => {
  return joystickPlate;
};
