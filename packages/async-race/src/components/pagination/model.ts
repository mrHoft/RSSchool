export type TPaginationProps = {
  current: number;
  total: number;
  limit: number;
  callback: (n: number) => void;
};

export default class PaginationModel {
  protected _props: TPaginationProps = {
    current: 0,
    total: 0,
    limit: 7,
    callback: () => undefined,
  };
}
