import { addValue, getValue, setValue } from '~/utils/utils';
import EventBus from './eventbus';

class State extends EventBus {
  public EVENT_UPDATE = 'Update';
  private _state: Indexed = {};

  public getState() {
    return this._state;
  }

  public removeState() {
    this._state = {};
    this.emit(this.EVENT_UPDATE);
  }

  public set(id: string, value: unknown) {
    setValue(this._state, id, value);
    this.emit(this.EVENT_UPDATE, id, value);
  }

  public add(id: string, ...values: unknown[]) {
    addValue(this._state, id, ...values);
    this.emit(this.EVENT_UPDATE, id, values);
  }

  public get(id: string) {
    return getValue(this._state, id);
  }
}

const state = new State();
export default state;
