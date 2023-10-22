import { EventBus } from './eventBus.js'

// JSON.parse(localStorage.getItem('BPLStore'))

export class Store extends EventBus {
  static EVENT_UPDATE = 'Update'
  static STORE_NAME = 'BPLStore'
  static _instance

  _state = {}

  constructor() {
    if (Store._instance) return Store._instance
    super()
    const savedState = localStorage.getItem(Store.STORE_NAME)
    this._state = savedState ? JSON.parse(savedState) ?? {} : {}
    Store._instance = this

    this.on(Store.EVENT_UPDATE, () => {
      console.log('App store update')
      localStorage.setItem(Store.STORE_NAME, JSON.stringify(this._state))
    })
  }

  get(path) {
    return getValue(this._state, path)
  }

  clear() {
    this._state = {}
    this.emit(Store.EVENT_UPDATE)
  }

  set(path, value) {
    setValue(this._state, path, value)
    this.emit(Store.EVENT_UPDATE)
  }
}

/**
 * Set named value in given object
 * @param {object} object Object to set value
 * @param {string} path Property name ('category.prop')
 * @param {string} value
 * @returns Link to a new object
 */
function setValue(object, path, value) {
  if (object !== Object(object)) return object
  if (typeof path != 'string' || path == '') throw new Error('Path must be string')
  let obj = object
  const arr = path.split('.')
  const last = arr.pop()
  arr.forEach(key => {
    if (!obj[key]) obj[key] = {}
    obj = obj[key]
  })
  obj[last] = value
  return object
}

/**
 * @param {object} object
 * @param {string} path
 * @returns Value of object with given property
 */
function getValue(object, path) {
  if (object !== Object(object) || typeof path != 'string' || path == '') return object
  return path.split('.').reduce((obj, key) => obj[key] || obj, object)
}
