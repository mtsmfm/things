import { align, cylinder, cylinderElliptic, subtract, union } from "../utils";

const startRadius = 14 / 2;
const endRadius = 13.3 / 2;
const offset = 1;
const baseRadius = Math.max(startRadius, endRadius) + offset;
const height = 11;
const thickness = 0.6;

const stampHead = cylinderElliptic({
  startRadius: [startRadius + offset / 2, startRadius + offset / 2],
  endRadius: [endRadius + offset / 2, endRadius + offset / 2],
  height,
});

const suctionDiskHolder = subtract(
  align(
    { modes: ["center", "center", "max"] },
    cylinder({
      radius: baseRadius + thickness / 2,
      height: 4,
    }),
    union(
      align(
        { modes: ["center", "center", "min"] },
        cylinder({
          radius: 9 / 2,
          height: 2.5,
        }),
        cylinder({
          radius: 7 / 2,
          height: 2.5 + 1.5,
        })
      )
    )
  )
);

export const main = () => {
  return [
    align(
      { modes: ["center", "center", "max"] },
      subtract(
        align(
          { modes: ["center", "center", "min"] },
          cylinder({
            radius: baseRadius + thickness / 2,
            height: height + thickness,
          }),
          stampHead
        )
      )
    ),
    align({ modes: ["center", "center", "min"] }, suctionDiskHolder),
  ];
};
