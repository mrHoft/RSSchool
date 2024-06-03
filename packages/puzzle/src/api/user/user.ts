import store from '~/utils/Store';

export type TUser = Record<'name' | 'surname', string>;

export function getUser(): TUser | null {
  const user = store.get('user');
  if (
    user
    && Object.prototype.hasOwnProperty.call(user, 'name')
    && Object.prototype.hasOwnProperty.call(user, 'surname')
  ) {
    return user as TUser;
  }
  return null;
}

export function setUser(data?: TUser) {
  if (
    !data
    || !Object.prototype.hasOwnProperty.call(data, 'name')
    || !Object.prototype.hasOwnProperty.call(data, 'surname')
  ) {
    throw new Error('User data is incorrect.');
  }
  store.set('user', data);
}

export function clearUser() {
  store.set('user', undefined);
}
