import { SWApi } from './api';

const possibleRequests = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];

export const Request = async (query: string) => {
  const category = query.trim().toLowerCase();
  if (category === '') {
    return { count: possibleRequests.length, results: possibleRequests.map((n) => ({ name: n })) };
  }
  if (!possibleRequests.includes(category)) {
    return { status: 'Wrong request' };
  }
  const obj = await new SWApi().get(category);
  return obj;
};
