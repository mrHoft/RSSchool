import type { TCar } from './types';
import { API_URL } from './constants';
import { deleteWinner } from '../winners';

export default function deleteCar(id: number): Promise<TCar | string> {
  const url = `${API_URL}/${id}`;
  let status = 500;
  return fetch(url, { method: 'DELETE' })
    .then(response => {
      status = response.status;
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError(`(${response.status}) Haven't got a JSON (${response.statusText})!`);
      }
      if (response.status === 200) return response.json();
      throw new Error(`(${response.status}) ${response.statusText}`);
    })
    .then(data => {
      deleteWinner(id);
      return data as TCar;
    })
    .catch((error: Error) => `(${status}) ${error.message}`);
}
