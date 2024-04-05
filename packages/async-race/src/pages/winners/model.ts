import type { TSort, TOrder } from '~/api/winners/types';

export default class WinnersModel {
  protected static TOTAL = 10;
  protected _page = 1;
  protected _limit = 10;
  protected _total = 0;
  protected _sort: TSort = 'time';
  protected _order: TOrder = 'ASC';
}
