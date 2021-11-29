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

const thickness = 3;
const bowlSize = 100;

export const main = () => {
  return union(
    subtract(
      translate(
        [0, 0, -thickness / 2],
        roundCornerCuboidWithChamfer({
          chamferSize: 1,
          roundRadius: 1,
          size: [bowlSize + thickness, bowlSize + thickness, thickness],
        })
      ),
      cuboid({ size: [bowlSize, bowlSize, thickness] })
    ),
    subtract(
      union(
        translate(
          [(bowlSize + thickness) / 2, 0, -(50 + thickness) / 2],
          cuboid({ size: [thickness, bowlSize, 50] })
        ),
        translate(
          [-(bowlSize + thickness) / 2, 0, -(50 + thickness) / 2],
          cuboid({ size: [thickness, bowlSize, 50] })
        )
      ),
      translate(
        [0, 0, -90],
        rotateX(
          degToRad(10),
          cuboid({ size: [bowlSize + thickness * 2, bowlSize * 2, bowlSize] })
        )
      )
    )
  );
};
