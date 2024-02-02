const to =
  (method: (x: number) => number) => (value: number, precision: number) =>
    method(value * 10 ** precision) / 10 ** precision;

export const toPrecision = {
  floor: to(Math.floor),
  round: to(Math.round),
  ceil: to(Math.ceil),
};
