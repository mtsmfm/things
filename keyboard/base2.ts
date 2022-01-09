import { base2, buildThumbSet } from "./column";

export const main = () => {
  return [
    base2,
    buildThumbSet({
      renderJoyStick: false,
      renderJoyStickPlate: false,
      renderThumbKeys: false,
    }),
  ];
};
