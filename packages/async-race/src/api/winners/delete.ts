import type { TWinner } from './types';
import { API_URL } from './constants';

export default async function deleteWinner(id: number): Promise<TWinner | string> {
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
    .then(data => data as TWinner)
    .catch((error: Error) => `(${status}) ${error.message}`);
}
