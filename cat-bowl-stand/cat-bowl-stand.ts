import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
} from "@jscad/modeling";
import { roundCornerCuboidWithChamfer } from "../lowee/utils/utils";

const {
  cuboid,
  cylinder,
  cylinderElliptic,
  roundedCuboid,
  roundedCylinder,
  polygon,
  sphere,
} = primitives;
const { rotate, translate, rotateX } = transforms;
const { subtract, union } = booleans;
const { degToRad } = utils;
const { extrudeLinear } = extrusions;

const thickness = 5;
const bowlSize = 100;
const height = 50;

export const main = () => {
  return union(
    subtract(
      translate(
        [0, 0, -height / 2],
        roundCornerCuboidWithChamfer({
          chamferSize: 1,
          roundRadius: 1,
          size: [bowlSize + thickness, bowlSize + thickness, height],
        })
      ),
      cuboid({ size: [bowlSize, bowlSize, height] }),
      translate(
        [0, 0, -70],
        rotateX(
          degToRad(10),
          cuboid({ size: [bowlSize + thickness * 2, bowlSize * 2, bowlSize] })
        )
      )
    )
  );
};
