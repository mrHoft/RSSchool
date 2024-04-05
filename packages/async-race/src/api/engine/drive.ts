import { API_URL } from './constants';

export default function startDrive(id: number): Promise<string> {
  const url = `${API_URL}?id=${id}&status=drive`;
  let status = 500;
  return fetch(url, { method: 'PATCH' })
    .then(response => {
      status = response.status;
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError(`(${response.status}) Haven't got a JSON!`);
      }
      if (response.status === 200) return response.json();
      if (response.status === 500) return 'broken';
      throw new Error(`(${response.status}) ${response.statusText}`);
    })
    .then(data => {
      if (Object.prototype.hasOwnProperty.call(data, 'success')) return 'success';
      return 'fail';
    })
    .catch((error: Error) => `(${status}) ${error.message}`);
}
