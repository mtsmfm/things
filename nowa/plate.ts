import { align, cuboid, cylinder, subtract } from "../utils";

const height = 4;

const m2NutHole = cylinder({
  radius: (4.6 + 0.2) / 2,
  height: 1.6 + 0.2,
  segments: 6,
});
const m2InsertNutHole = cylinder({ radius: 3 / 2, height: 2 + 0.4 });
const m2ScrewHole = cylinder({ radius: 2.5 / 2, height });

export const main = () => {
  return [
    subtract(
      align(
        { modes: ["none", "none", "min"] },
        subtract(
          align(
            { modes: ["none", "none", "max"] },
            cuboid({ size: [15, 15, height] }),
            m2NutHole
          )
        ),
        m2InsertNutHole,
        m2ScrewHole
      )
    ),
  ];
};
