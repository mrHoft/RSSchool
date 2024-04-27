/**
 * Example:
 * trim('-_-ab c -_-', '_-'); // ab c
 */
export function trim(text: string, chars: string = ''): string {
  if (!chars) {
    return text.replace(/^\s+|\s+$/gm, '');
  }
  const reg = new RegExp(`[${chars}]`, 'gi');
  return text.replace(reg, '');
}

const isPrimitive = (val: unknown): boolean => val !== Object(val);
const isObject = (obj: unknown): boolean => obj != null && Object(obj) === obj;

/**
 * Example:
 * merge({a: {b: {a: 2}}, d: 5}, {a: {b: {c: 1}}})
 */
export function merge(lhs: Indexed, rhs: Indexed): Indexed {
  Object.keys(rhs).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(rhs, key)) {
      try {
        // Property in destination object set; update its value.
        if (isPrimitive(rhs[key])) {
          lhs[key] = rhs[key];
        } else {
          (lhs[key] as Indexed) = merge(lhs[key] as Indexed, rhs[key] as Indexed);
        }
      } catch (e) {
        // Property in destination object not set; create it and set its value.
        lhs[key] = rhs[key];
      }
    }
  });
  return lhs;
}

/**
 * Example:
 * setValue({ foo: 5 }, 'bar.baz', 10), // { foo: 5, bar: { baz: 10 } }
 */
export function setValue(object: Indexed, path: string, value: unknown) {
  if (object !== Object(object)) return object;
  if (typeof path !== 'string' || path === '') {
    throw new Error('Path must be type of string.');
  }
  let obj = object;
  const arr = path.split('.');
  const last = arr.pop();
  arr.forEach(key => {
    if (!obj[key]) obj[key] = {};
    obj = obj[key] as Indexed;
  });
  if (last) obj[last] = value;
  return object;
}

export function addValue(object: Indexed, path: string, ...values: unknown[]) {
  if (isPrimitive(object)) return object;
  if (typeof path !== 'string' || path === '') throw new Error('Path must be type of string.');
  let obj = object;
  const arr = path.split('.');
  const last = arr.pop();
  arr.forEach(key => {
    if (!obj[key]) obj[key] = {};
    obj = obj[key] as Indexed;
  });
  if (last) {
    if (!obj[last] || !Array.isArray(obj[last])) obj[last] = [];
    (obj[last] as unknown[]).push(...values);
  }
  return object;
}

export function getValue(object: Indexed | undefined, path: string): unknown {
  if (object !== Object(object) || typeof path !== 'string' || path === '') {
    throw new Error(`App store. Wrong path: ${path}`);
  }
  return path
    .split('.')
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? (obj[key] as Indexed) : undefined),
      object,
    );
}

export function isEqual(a: Indexed, b: Indexed): boolean {
  const _a = Object.keys(a);
  const _b = Object.keys(b);
  if (_a.length !== _b.length) return false;
  for (let i = 0; i < _a.length; i += 1) {
    const val1 = a[_a[i]];
    const val2 = b[_a[i]];
    if (isObject(val1) && isObject(val2)) {
      if (!isEqual(val1 as Indexed, val2 as Indexed)) return false;
    } else if (val1 !== val2) return false;
  }
  return true;
}

type PlainObject<T = unknown> = { [k in string]: T };

function isPlainObject(value: unknown): value is PlainObject {
  return isObject(value);
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || Array.isArray(value);
}

export function cloneDeep<T extends Indexed>(obj: T) {
  function clone(item: T): T | Date | Set<unknown> | Map<unknown, unknown> | object | T[] {
    // Handle: null / undefined / boolean / number / string / symbol / function
    if (item === null || typeof item !== 'object') return item;

    // Handle: Date
    if (item instanceof Date) return new Date((item as Date).valueOf());

    // Handle: Array
    if (item instanceof Array) {
      const copy: ReturnType<typeof clone>[] = [];
      item.forEach((_, i) => {
        copy[i] = clone(<T>item[i]);
      });
      return copy;
    }

    // Handle: Set
    if (item instanceof Set) {
      const copy = new Set();
      item.forEach((v: T) => copy.add(clone(v)));
      return copy;
    }

    // Handle: Map
    if (item instanceof Map) {
      const copy = new Map();
      item.forEach((v: T, key: string) => copy.set(key, clone(v)));
      return copy;
    }

    // Handle: Object
    if (item instanceof Object) {
      const copy: Indexed = {};

      // Handle: Object.symbol
      Object.getOwnPropertySymbols(item).forEach(s => {
        copy[s] = clone(item[s] as T);
      });

      // Handle: Object.name (other)
      Object.keys(item).forEach(key => {
        copy[key] = clone(item[key] as T);
      });

      return copy;
    }

    throw new Error(`Unable to copy object: ${item}`);
  }
  return clone(obj);
}

const getKey = (key: string, parentKey?: string) => (parentKey ? `${parentKey}[${key}]` : key);

export function getParams(data: PlainObject | [], parentKey?: string) {
  const result: [string, string][] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (isArrayOrObject(value)) {
      result.push(...getParams(value, getKey(key, parentKey)));
    } else {
      result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
    }
  });
  return result;
}

export function queryString(data: PlainObject) {
  if (!isPlainObject(data)) throw new Error('Input must be an object');
  return getParams(data)
    .map(arr => arr.join('='))
    .join('&');
}
