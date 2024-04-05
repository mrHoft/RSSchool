import type { TCar } from './types';
import { API_URL } from './constants';

export default function createCar(): Promise<TCar | string> {
  let status = 500;
  return fetch(API_URL, { method: 'POST' })
    .then(response => {
      status = response.status;
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError(`(${response.status}) Haven't got a JSON (${response.statusText})!`);
      }
      if (response.status === 201) return response.json();
      throw new Error(`(${response.status}) ${response.statusText}`);
    })
    .then(data => data as TCar)
    .catch((error: Error) => `(${status}) ${error.message}`);
}
