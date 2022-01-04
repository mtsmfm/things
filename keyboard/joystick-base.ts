import { cuboid, cylinder, subtract, align } from "../utils";
import { innerRadius } from "./joystick-cap";

const poleHeight = 6;
const buttonHeight = 3;

const pole = subtract(
  cylinder({ height: poleHeight, radius: 6.2 / 2 }),
  cuboid({ size: [4.1, 3.1, 6] })
);

const button = subtract(
  align(
    { modes: ["center", "max", "center"] },
    subtract(
      align(
        { modes: ["center", "center", "max"] },
        cylinder({ height: buttonHeight, radius: innerRadius, segments: 6 }),
        cylinder({ height: 0.8, radius: innerRadius - 0.5, segments: 6 })
      )
    ),
    cuboid({
      size: [1, 0.8, buttonHeight],
    })
  )
);

export const main = () => {
  return [
    align({ modes: ["center", "center", "min"] }, button),
    align({ modes: ["center", "center", "max"] }, pole),
  ];
};
