import type { TEngine } from './types';
import { API_URL } from './constants';

export default function switchEngine(
  id: number,
  mode: 'started' | 'stopped',
): Promise<TEngine | string> {
  const url = `${API_URL}/?id=${id}&status=${mode}`;
  let status = 500;
  return fetch(url, { method: 'PATCH' })
    .then(response => {
      status = response.status;
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError(`(${response.status}) Haven't got a JSON (${response.statusText})!`);
      }
      if (response.status === 200) return response.json();
      throw new Error(`(${response.status}) ${response.statusText}`);
    })
    .then(data => data as TEngine)
    .catch((error: Error) => `(${status}) ${error.message}`);
}
