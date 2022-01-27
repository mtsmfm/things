import { cylinder, align } from "../utils";

const height = 12;
const pillar = cylinder({ height, radius: 4 / 2, segments: 6 });

export const main = () => {
  return [
    align(
      { modes: ["center", "center", "min"] },
      pillar,
      cylinder({ radius: 3, height: 0.5 })
    ),
  ];
};
