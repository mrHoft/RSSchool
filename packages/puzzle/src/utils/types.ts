export type TEqual<T1, T2> =
  (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2 ? true : false;

export const objectKeys = <T extends Record<PropertyKey, unknown>, K extends keyof T>(obj: T) =>
  Object.keys(obj) as K[];
