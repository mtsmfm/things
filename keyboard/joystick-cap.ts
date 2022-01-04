import { subtract, cylinder, align, torus, union, cuboid } from "../utils";

const buttonRadius = 13 / 2;
const thickness = 1.5;
const offset = 0.4;
const torusInnerRadius = 1.5;
export const innerRadius = buttonRadius - thickness / 2 - torusInnerRadius;

export const main = () => {
  return subtract(
    align(
      { modes: ["center", "center", "min"] },
      subtract(
        align(
          { modes: ["center", "center", "max"] },
          union(
            align(
              { modes: ["center", "center", "max"] },
              torus({
                outerRadius: buttonRadius - torusInnerRadius,
                innerRadius: torusInnerRadius,
              }),
              cylinder({ radius: innerRadius + thickness / 2, height: 6 })
            )
          ),
          cylinder({ radius: innerRadius, height: 0.8 })
        )
      ),
      cylinder({
        radius: innerRadius + offset / 2,
        height: 4.5,
      })
    )
  );
};
