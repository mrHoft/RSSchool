import type { TCar, TGarage } from './types';
import { API_URL } from './constants';

export default function getGarage(page: number, limit: number = 7): Promise<TGarage | string> {
  const url = `${API_URL}${page ? `?_page=${page}` : ''}${limit ? `&_limit=${limit}` : ''}`;
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
    .then(data => ({ cars: data as TCar[], total }) as TGarage)
    .catch((error: Error) => `(${status}) ${error.message}`);
}
