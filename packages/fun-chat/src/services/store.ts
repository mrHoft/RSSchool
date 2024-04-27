import { getValue, setValue } from '~/utils/utils';

class Store {
  static STORE_NAME = 'FunChatStore';
  protected _state: Indexed = {};

  constructor() {
    const savedState = localStorage.getItem(Store.STORE_NAME);
    if (savedState) {
      this._state = JSON.parse(savedState) as Indexed;
    }
  }

  public getState() {
    return this._state;
  }

  public clear() {
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

const store = new Store();
export default store;
