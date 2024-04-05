import type { TWinner, TWinners, TSort, TOrder } from './types';
import { API_URL } from './constants';

type TWinnersProps = {
  page?: number;
  limit?: number;
  sort?: TSort;
  order?: TOrder;
};

export default async function getWinners({
  page,
  limit,
  sort,
  order,
}: TWinnersProps): Promise<TWinners | string> {
  const url = `${API_URL}?_page=${page || 1}&_limit=${limit || 10}${sort ? `&_sort=${sort}` : '&_sort=id'}${order ? `&_order=${order}` : ''}`;
  let total = 0;
  let status = 500;
  return fetch(url)
    .then(response => {
      status = response.status;
      total = Number(response.headers.get('X-Total-Count'));
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError(`(${response.status}) Haven't got a JSON (${response.statusText})!`);
      }
      if (response.status === 200) return response.json();
      throw new Error(`(${response.status}) ${response.statusText}`);
    })
    .then(data => ({ winners: data as TWinner[], total }))
    .catch((error: Error) => `(${status}) ${error.message}`);
}
