import { base1, base2, buildThumbSet } from "./column";

export const main = () => {
  return [
    base1,
    base2,
    buildThumbSet({
      renderJoyStick: false,
      renderJoyStickPlate: false,
      renderThumbKeys: false,
    }),
  ];
};
