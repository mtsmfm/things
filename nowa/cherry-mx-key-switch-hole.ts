import { cuboid, align, placeSideBySideY } from "../utils";

const switchSize = 14;
const height = 4;

export const cherryMxKeySwitchHole = placeSideBySideY(
  ...align(
    { modes: ["none", "none", "min"] },
    cuboid({ size: [5, 1, 2.5] }),
    cuboid({ size: [switchSize, switchSize, height] }),
    cuboid({ size: [5, 1, 2.5] })
  )
);

export const main = () => {
  return cherryMxKeySwitchHole;
};
