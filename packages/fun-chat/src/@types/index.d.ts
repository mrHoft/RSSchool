declare module '*.tmpl' {
  const content: string;
  export default content;
}

declare type Indexed = { [key in string | symbol]: unknown };

declare type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyDeep<U>[]
    : T[P] extends object
      ? ReadonlyDeep<T[P]>
      : T[P];
};

declare type TEqual<T1, T2> =
  (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2 ? true : false;
