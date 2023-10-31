type Indexed = { [key in string | symbol]: unknown };

export default class Store {
  static STORE_NAME = 'ReactW1Store';
  protected static _instance: Store;
  protected _state: Indexed = {};

  constructor() {
    if (Store._instance) return Store._instance;
    const savedState = localStorage.getItem(Store.STORE_NAME);
    if (savedState) {
      this._state = JSON.parse(savedState) as Indexed;
    }
    Store._instance = this;
  }

  public getState() {
    return this._state;
  }

  public removeState() {
    this._state = {};
    this.emit();
  }

  public get(id: string) {
    return getValue(this._state, id);
  }

  public set(id: string, value: unknown) {
    setValue(this._state, id, value);
    this.emit();
  }

  private emit() {
    localStorage.setItem(Store.STORE_NAME, JSON.stringify(this._state));
  }
}

function setValue(object: Indexed, path: string, value: unknown) {
  if (object !== Object(object)) return object;
  if (typeof path !== 'string' || path === '') throw new Error('App store. Path must be type of string.');
  let obj = object;
  const arr = path.split('.');
  const last = arr.pop();
  arr.forEach((key) => {
    if (!obj[key]) obj[key] = {};
    obj = obj[key] as Indexed;
  });
  if (last) obj[last] = value;
  return object;
}

function getValue(object: Indexed, path: string): unknown {
  if (object !== Object(object) || typeof path !== 'string' || path === '') {
    console.warn('App store. Wrong:', path);
    return '';
  }
  return path.split('.').reduce((obj, key) => (obj[key] !== undefined ? (obj[key] as Indexed) : obj), object);
}
